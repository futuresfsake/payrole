# TDD-leave-ledger: Leave accrual, balances, requests

| | |
|---|---|
| Story/FR | US-207, US-208, US-209 / FR-207…FR-209 |
| Status | Draft |
| ADRs | 001, 008 |

## 1. Problem and scope
Maintain correct leave balances with full history, enforce statutory minimums, and feed payroll (unpaid leave, cash conversion). Out of scope: approval routing (TDD-workflow).

## 2. Requirements recap
BR-LV-1…4; statutory leave table in business-rules; NFR-19 integrity.

## 3. Design

### 3.1 Ledger model (append-only)
`leave_ledger(id, tenant_id, employee_id, leave_type_id, entry_type, quantity numeric(7,3), effective_date, source_type, source_id, period_key, created_at, created_by)`
Entry types: `accrual`, `usage`, `reversal`, `adjustment`, `expiry`, `carry_over_in`, `carry_over_out`, `conversion`.
Balance(asOf) = Σ quantity where effective_date ≤ asOf. No UPDATE/DELETE (trigger). Corrections are reversal + new entry.

### 3.2 Policy
`leave_policy` (effective-dated): type, accrual method (`monthly`, `annual_frontload`, `anniversary`, `none`), rate, proration rule, cap, carry-over cap, expiry months, convertible (bool), min service months, gender/marital/parental eligibility, unit (day, half-day, hour), documentation required (e.g., medical cert after N days), statutory flag + floor.

Validation: if `statutory_flag`, rate/entitlement ≥ statutory floor from rule set.

### 3.3 Accrual job
Idempotent via unique `(employee_id, leave_type_id, period_key, entry_type='accrual')`. Monthly job at business-date month start (Asia/Manila); anniversary job daily. New hire proration per policy. Catch-up on backdated hire or policy change (recompute missing periods).

### 3.4 Request lifecycle
`draft → pending → approved | rejected | cancelled`; on approval the service writes a `usage` entry in the same transaction as the status change. Cancel after approval writes `reversal`. Checks at submit and at approve (balance may have changed): overlap with existing leave, blackout dates, notice period, balance ≥ requested unless policy allows negative/unpaid conversion (then split: paid portion + unpaid portion flagged for payroll).

### 3.5 Day counting
Count only scheduled working days from employee schedule and holiday calendar (as of date); half-day = 0.5; maternity/solo parent statutory types count calendar days where law says so (`day_basis` on type).

### 3.6 Payroll interface
`leaveImpact(employee, period) → { paidDays, unpaidDays, convertedDays }` consumed by attendance and payroll. Cash conversion creates a `conversion` ledger entry and a payroll adjustment referencing it.

### 3.7 Year-end
Job: apply carry-over cap, expire per policy, produce preview report for HR approval before commit; SIL conversion list for payroll.

## 4. Security and privacy
Leave reason and medical documents are SPI: reason text visible only to approver chain and HR; calendar shows "On leave" without type to peers. Documents in vault with restricted category.

## 5. Failure modes
Double-approve click: unique `(source_id, entry_type)` constraint. Policy change mid-year: new effective-dated version applies forward only; admin may run explicit recompute with diff preview.

## 6. Test plan
Unit: accrual per method, proration, caps, expiry. Property: replaying ledger reproduces balance; balance never below floor when negative disallowed; approve+cancel nets zero. Integration: concurrency on two simultaneous approvals; statutory minimum validation. E2E: request → approve → balance + calendar + payroll impact.

## 7. Rollout
Opening balances imported as `adjustment` entries with source `migration`. Report comparing computed balances with customer's spreadsheet before go-live.

## 8. Open questions
BR-LV-4 (maternity benefit flow), carry-over policy defaults, hour-based leave for shift workers.
