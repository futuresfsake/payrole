# TDD-payroll-run-lifecycle: Run states, approval, finalization

| | |
|---|---|
| Story/FR | US-307, US-308, US-312, US-315 / FR-307…FR-309, FR-313, FR-316 |
| Status | Draft |
| ADRs | 001, 005, 008 |

## 1. Problem and scope
Orchestrate payroll from draft to finalized with controls: exceptions, separation of duties, immutability, reversal. Uses the engine from [TDD-payroll-engine](TDD-payroll-engine.md).

## 2. Design

### 2.1 State machine (see app-flow §5)
`draft → computed → submitted → approved → finalized → paid`; `submitted → computed` (returned); `finalized → reversed` (via reversal run). Transition table is code-enforced and DB-checked (`CHECK` on allowed transitions via function/trigger).

| Transition | Actor/permission | Preconditions |
|---|---|---|
| create draft | `payroll_run:create` | Period open; attendance locked (or override flagged); no other non-reversed regular run for same group+period |
| compute | `payroll_run:compute` | Status draft/computed |
| submit | preparer | No blocking exceptions; all employees computed |
| return | approver | Reason required |
| approve | approver ≠ preparer, step-up auth | Status submitted; input version unchanged |
| finalize | approver or finance | Status approved; snapshot hash matches |
| mark paid | payroll/finance | Bank file generated or manual confirmation |
| reverse | finance + reason | Finalized; creates reversal run linking original |

### 2.2 Run versioning
`payroll_run.input_version` increments when any input changes (attendance unlock, comp change effective in period, rule-set change, loan edit). Results carry the version they were computed from. Submit/approve require `result_version = input_version`; otherwise "stale" and must recompute.

### 2.3 Exceptions
`payroll_exception(run_id, employee_id, code, severity, message, resolved_by, resolution)`. Blocking: `NEGATIVE_NET`, `MISSING_RATE`, `MISSING_GOV_ID`, `UNLOCKED_ATTENDANCE`, `ENGINE_ERROR`. Warning: `VARIANCE_GT_THRESHOLD`, `NEW_EMPLOYEE`, `BANK_ACCOUNT_CHANGED_RECENTLY`, `UNUSUAL_OT`, `CONTRIBUTION_ANOMALY`. Warnings require acknowledgment (with comment) before submit; blocking must be fixed.

### 2.4 Finalization
In one transaction: verify state/version, compute `snapshot_hash` over inputs + results, copy rule-set version ids, mark results immutable (trigger denies UPDATE/DELETE on `payroll_result/line` where run finalized), post YTD updates (`ytd_balance` upsert keyed by employee+year), reduce loan balances, write ledger entries for leave conversion, emit `PayrollRunFinalized` (outbox → payslip generation, exports, notifications, webhooks). Idempotent by `(run_id, 'finalize')`.

### 2.5 Reversal and corrections
Reversal run negates a finalized run (mirror lines, flagged), restoring YTD and loan balances; then a new run recomputes. Prefer adjustment lines in the next run for small corrections (policy). Reversal after `paid` requires finance approval and customer comms template.

### 2.6 Off-cycle runs
`run_type`: regular, bonus, 13th_month, final_pay, adjustment, reversal. Each type selects pipeline steps and tax method; same lifecycle.

### 2.7 Concurrency
Optimistic locking (`ETag` of run row). Compute holds an advisory lock per run. Only one active compute at a time. UI shows progress via job status polling.

### 2.8 Authorization and SoD
`approved_by ≠ prepared_by` enforced in domain and DB CHECK. Role admins cannot approve runs they granted themselves rights for (SoD-1). All transitions audited with run version and hash.

## 3. Security and privacy
Results contain salary: encrypted fields, restricted API. Payslip publication separate permission and optional delayed release time. Export of run data requires purpose.

## 4. Failure modes
Compute partial failure → per-employee `ENGINE_ERROR` exception, others kept. Finalization crash → transaction atomic. Event publish failure → outbox retry; payslip generation idempotent by `(run_id, employee_id)`.

## 5. Test plan
State-transition table test (every illegal transition rejected). SoD tests. Stale-version approval rejected. Finalize idempotency. Immutability trigger test. Reversal restores YTD/loans exactly (property test). E2E run lifecycle RN-01…RN-05.

## 6. Rollout
Feature flag per tenant; parallel mode where finalize is blocked ("shadow run") until M3 exit.

## 7. Open questions
Multiple regular runs per period for different pay groups (supported); partial-payroll holds for specific employees (hold flag, decide M3).
