# TDD-final-pay: Offboarding and final pay

| | |
|---|---|
| Story/FR | US-603, US-604 / FR-601, FR-602 |
| Status | Draft |
| ADRs | 001, 005, 008 |

## 1. Problem and scope
Handle separation end-to-end: record cause and dates, run clearance, compute final pay, release, revoke access, start retention. The system records and computes; it does not judge legality of a dismissal (labor-compliance).

## 2. Design

### 2.1 Separation record
`separation(id, employee_id, cause, cause_category, notice_date, last_working_day, effective_date, initiated_by, due_process_refs, status)`.
`cause` enum: resignation, end_of_contract, project_completion, authorized_redundancy, retrenchment, closure, disease, just_cause_termination, retirement, death, other. Just-cause and authorised-cause paths require due-process document checklist (notices, hearing, decision) with attachments before `effective_date` can be set; HR can override with reason (audited).

### 2.2 Workflow
`initiated → clearance → computed → approved → released → closed`. Clearance tasks (assets, accountabilities, knowledge transfer, IT access) assigned via TDD-workflow templates; accountability amounts feed deductions (needs written authorisation, BR-LOAN-3).

### 2.3 Final pay computation (run_type = final_pay)
Pipeline reuses payroll engine steps with a `final_pay` profile:
1. Unpaid salary through effective date (proration policy).
2. Pro-rated 13th month: basic earned in year ÷ 12, minus any already paid.
3. Leave conversion: SIL (statutory) + convertible leave per policy at daily rate; writes `conversion` ledger entries.
4. Separation pay by cause using rule-set matrix (e.g., ½ month or 1 month per year of service by cause, with minimum; **VERIFY**, GAP-15). Years of service = fraction ≥ 6 months counts as 1 year per rule data.
5. Other earnings: unpaid allowances, incentives, retro.
6. Deductions: statutory for the final period, tax with annualisation closing out the year (refund or balance), loan balances (offset per authorisation), accountabilities.
7. Net with exceptions: negative net → record receivable, never silently drop.
8. Output includes an itemised final-pay statement and a quitclaim template reference (customer-owned legal doc).

Tax: separation pay tax exemption for authorised causes/involuntary separation (VERIFY BIR rules) as rule attribute `taxExemptCauses`.

### 2.4 Release and deadlines
Target release within the DOLE-guided period (BR-OFF-3; configurable default 30 days from separation); dashboard shows clock and overdue items. CoE generation on request (BR-OFF-4) and 2316 issuance upon separation.

### 2.5 Access and data lifecycle
At `effective_date` (Asia/Manila end of day): disable ESS/MSS, revoke sessions and API tokens linked to the user, remove from manager scopes and approval resolvers (tasks re-assigned), mark payroll profile inactive after final pay finalised. Retention clock starts on `closed` status (TDD-dsr). Rehire reuses the same person record with a new employment row.

## 3. Security and privacy
Separation reasons and disciplinary documents are sensitive: restricted to HR with `separation:read`. Final pay results visible only to HR/payroll/finance and the employee's own statement. Exit interview data (M6) optional and confidentiality-scoped.

## 4. Failure modes
Effective date changed after computation → stale result requires recompute. Separation reversed (e.g. resignation withdrawn) → cancel flow restores access if before effective date; after finalisation requires rehire flow. Deactivation job idempotent with retries; alert if a separated user still has active sessions after 1 h.

## 5. Test plan
Golden FP-01, FP-02 plus: each cause × tax treatment; year-of-service rounding boundaries; mid-year separation with 13th month already paid; negative net with receivable; leave conversion ledger effects; overlapping loans. E2E: resignation to final pay released and access revoked. Security: ex-employee cannot log in; scopes cleaned.

## 6. Rollout
Final pay launches after M3 stability; rule matrix validated by counsel/DOLE guidance before enabling separation pay computation for a tenant (feature flag `offboarding.separation_pay`).

## 7. Open questions
GAP-15 rule matrix and exemptions, retirement pay (RA 7641) computation scope, handling employees with pending disciplinary cases at separation.
