# Labor Standards Compliance

What the system enforces or supports, and where the employer must decide. **VERIFY** all items.

## Coverage and exemptions
Rules apply to rank-and-file employees; managerial employees, field personnel, family members dependent on employer, domestic workers (Kasambahay; out of scope), and others are exempt from some premium rules. System: per-employee `coverage` flags with documented basis (BR-TIME-5).

## Hours of work
- Normal 8 hrs/day; meal period ≥ 60 min. Compressed workweek and flexible schedules need documented agreement: schedule type stores agreement reference.
- Health personnel and special cases: configurable.

## Premium pay
Rates per [business-rules BR-TIME](../02-requirements/business-rules.md). Rate multiples are rule-set data so a change in regulation or a more generous CBA can be applied without code changes.

## Holidays
Calendar maintained per year from presidential proclamations (GAP-05). Local holidays by location. Holiday pay eligibility rule configurable.

## Leaves
Statutory minimums enforced (BR-LV-1). Company leave beyond statute is the employer's policy.

## Wages and deductions
- Wage payment: at least every 16 days (semi-monthly) for monthly/daily; system warns if pay frequency exceeds. **VERIFY**.
- Deductions only as authorised by law or with written authorisation (BR-LOAN-3); authorisation document linked to each voluntary deduction.
- No wage deduction that brings pay below minimum except as lawfully permitted.
- Payslip provided each pay period (itemised).

## 13th month and other mandatory benefits
BR-13M; employer-specific benefits (CBA) via earning codes.

## Termination
Just causes vs authorised causes; due process (two-notice rule) tracked in offboarding workflow with required documents; separation pay matrix; final pay timeline. The system records the process and computes amounts; it does not decide legality of dismissal.

## Records
Employment, payroll, time, and leave records retained and producible for DOLE inspection (FR-704 auditor export). Retention in [data-requirements](../02-requirements/data-requirements.md).

## Reports
DOLE-required reports (e.g., 13th month compliance, establishment reports) produced as exports where formats exist (US-407, GAP-08).

## Occupational safety and health
Training and certification tracking; incident records restricted-access. Scope M7.

## Employer responsibilities the system cannot discharge
Filing, remitting, posting notices, safety program, union relations, actual legal interpretation. Documented in customer onboarding guide.
