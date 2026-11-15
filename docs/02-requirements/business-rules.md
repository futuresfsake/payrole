# Business Rules (Philippines)

> **Warning.** Values tagged **VERIFY** reflect the analyst's knowledge as of writing and must be confirmed against primary sources and stored in effectivity-dated rule sets (see ADR-005). Not legal advice. Every rule stores: source citation, effective-from, effective-to, version.

## BR-RND Rounding and arithmetic
- BR-RND-1 All money is decimal with 2 places at presentation; intermediate calculations keep ≥ 6 places.
- BR-RND-2 Round half-up at defined points only: hourly rate (keep 6dp), each earning line (2dp), each statutory contribution (2dp), tax (2dp).
- BR-RND-3 Net pay = sum of rounded lines. Never round net independently.
- BR-RND-4 No floating-point types for money anywhere (enforced by lint rule).

## BR-RATE Pay rates
- BR-RATE-1 Daily rate = Monthly rate × 12 ÷ Working-days-factor. Factor is per-employee configurable: 313, 261, 365, 314, etc. (depends on paid rest days/holidays). **VERIFY** DOLE guidance; no hardcoded default without customer confirmation.
- BR-RATE-2 Hourly rate = Daily rate ÷ 8 (or ÷ scheduled hours for non-standard schedules).
- BR-RATE-3 Monthly-paid employees: fixed monthly pay; deductions for absences/late use daily/hourly rates. Daily-paid: pay for days worked + paid regular holidays.
- BR-RATE-4 Minimum wage validation by region and effectivity (GAP-04); warn, not block, for exempt categories.

## BR-TIME Time and premiums (DOLE defaults, **VERIFY**)
| Scenario | Rate multiple of hourly rate |
|---|---|
| Ordinary day, first 8 hrs | 1.00 |
| Ordinary day overtime | 1.25 |
| Rest day / special non-working day, first 8 hrs | 1.30 |
| Rest day / special day overtime | 1.30 × 1.30 = 1.69 |
| Regular holiday, first 8 hrs | 2.00 |
| Regular holiday overtime | 2.00 × 1.30 = 2.60 |
| Regular holiday + rest day, first 8 | 2.60 |
| Regular holiday + rest day, OT | 2.60 × 1.30 = 3.38 |
| Special day + rest day, first 8 | 1.50 |
| Special day + rest day, OT | 1.50 × 1.30 = 1.95 |
| Night shift differential (22:00–06:00) | +10% of applicable hourly rate for hours in window |
- BR-TIME-1 Unworked regular holiday: paid 100% for covered employees (monthly-paid already includes it depending on factor). Unworked special non-working day: no work, no pay, unless company policy/CBA.
- BR-TIME-2 Day boundaries and NSD use Asia/Manila business dates.
- BR-TIME-3 Grace period and rounding of late/undertime per tenant policy (e.g., per minute vs 15-min blocks). Default: per minute.
- BR-TIME-4 OT counts only if approved (when pre-approval policy on) and beyond scheduled hours.
- BR-TIME-5 Exempt employees (managerial, field personnel, etc.) flagged; no OT/holiday premium computation by default. **VERIFY** exemption criteria wording.
- BR-TIME-6 Meal break: unpaid ≥ 60 min by default; configurable.
- BR-TIME-7 Holiday pay eligibility: employee must be present or on paid leave the day before a regular holiday (rule configurable). **VERIFY**.

## BR-LV Leave
| Leave | Rule (default, **VERIFY**) |
|---|---|
| Service Incentive Leave | 5 days/year after 1 year of service for covered employees; commutable to cash if unused |
| Maternity | 105 days live birth, +15 days for solo parents; 60 days miscarriage/emergency termination (RA 11210) |
| Paternity | 7 days for married male employees, first 4 deliveries (RA 8187) |
| Solo parent | 7 working days/year after 1 year of service (RA 8972 as amended) |
| VAWC | up to 10 days (RA 9262) |
| Special leave for women | up to 2 months after gynecological surgery (RA 9710) |
| VL/SL/others | Company policy; must meet or exceed SIL |
- BR-LV-1 Statutory leaves cannot be configured below statutory minimums (validation).
- BR-LV-2 Accrual: monthly, annual front-load, or anniversary-based. Proration for new hires.
- BR-LV-3 Carry-over caps and expiry per policy; conversion to cash computed at daily rate.
- BR-LV-4 Maternity/paternity benefit pay interplay with SSS maternity benefit (salary differential) handled via earning code. **GAP**: confirm advance/reimbursement flow.

## BR-STAT Statutory contributions (**VERIFY ALL**; table-driven)
| Agency | Structure used in design (as of analyst knowledge) |
|---|---|
| SSS | Total 15% of Monthly Salary Credit (employer 10%, employee 5%); MSC range ₱5,000–₱35,000 in 2-peso-hundred brackets; includes MPF/WISP portion above regular threshold. Table keyed by effectivity |
| PhilHealth | Premium rate 5% of monthly basic salary, shared equally; income floor ₱10,000, ceiling ₱100,000 |
| Pag-IBIG | Employee 2%, employer 2% of monthly compensation, max fund salary cap ₱10,000 (so ₱200 each at cap) |
- BR-STAT-1 Contributions are computed from the compensation base defined per agency (not necessarily gross); base definition is a rule-set attribute.
- BR-STAT-2 Deduction timing: per pay frequency policy (e.g., split across semi-monthly cut-offs, or all on 2nd period). Configurable; default documented per tenant.
- BR-STAT-3 Employer shares are recorded as employer cost and appear in remittance, not on employee net.
- BR-STAT-4 Contribution table changes mid-year apply from effectivity; no retroactive recompute of finalized runs without an explicit retro run.
- BR-STAT-5 Employee-level overrides (e.g., exempt, voluntary higher MSC) allowed with audit.

## BR-TAX Withholding tax (**VERIFY**)
- BR-TAX-1 Annual progressive schedule (TRAIN, from 2023): ₱0–250k: 0%; >250k–400k: 15% of excess; >400k–800k: 20%; >800k–2M: 25%; >2M–8M: 30%; >8M: 35% (with base amounts per official table).
- BR-TAX-2 Method: annualized projection per period using year-to-date taxable income, with year-end true-up; the alternative per-period table method is optional.
- BR-TAX-3 Taxable compensation = gross taxable earnings − mandatory employee contributions (SSS, PhilHealth, Pag-IBIG) − non-taxable items.
- BR-TAX-4 13th month and other benefits exempt up to ₱90,000 aggregate per year; excess is taxable. De minimis benefits exempt up to per-item ceilings (GAP-06).
- BR-TAX-5 Minimum wage earners (MWE): basic pay, holiday, OT, NSD, hazard pay exempt; flagged per employee with effectivity.
- BR-TAX-6 Multiple employers in a year (substituted filing) requires previous employer data (BIR 2316) intake.

## BR-13M 13th month pay (PD 851, **VERIFY**)
- BR-13M-1 Amount = total basic salary earned within the calendar year ÷ 12. Excludes OT, premiums, allowances unless integrated into basic.
- BR-13M-2 Paid on/before December 24. Partial-year employees pro-rated; separated employees receive pro-rated amount in final pay.
- BR-13M-3 Basic salary deductions for absences reduce basic earned.
- BR-13M-4 Tax: apply BR-TAX-4.

## BR-LOAN Deductions
- BR-LOAN-1 Deduction order (default): statutory → tax → government loans (SSS, Pag-IBIG) → company loans → voluntary deductions. Configurable priority.
- BR-LOAN-2 Net pay never below zero unless policy allows carry-forward of unpaid amortization (tracked as arrears).
- BR-LOAN-3 Deductions beyond statutory/consented amounts must have written employee authorization on file (Labor Code deduction limits). **VERIFY**.

## BR-OFF Final pay and separation (**VERIFY**, GAP-15)
- BR-OFF-1 Final pay components: unpaid salary, pro-rated 13th month, unused SIL conversion, other convertible leaves per policy, tax refund/adjustment, less accountabilities.
- BR-OFF-2 Separation pay applies only for authorized causes (e.g., redundancy, retrenchment, closure, disease) at rates by cause; not for resignation or just-cause dismissal unless policy/CBA. Rate matrix in rule set.
- BR-OFF-3 DOLE guidance: release of final pay within 30 days from separation unless a more favorable company policy applies. **VERIFY** current guidance.
- BR-OFF-4 Certificate of Employment issuance within 3 days of request (Labor Advisory). **VERIFY**.

## BR-RUN Payroll run integrity
- BR-RUN-1 A finalized run is immutable; its inputs are snapshotted (rates, rule-set versions, attendance).
- BR-RUN-2 Preparer and approver must be different users.
- BR-RUN-3 Recompute is deterministic: same snapshot → same output (property-tested).
- BR-RUN-4 Variance threshold (default 10% net change vs previous period) triggers exception.

## BR-PRIV Privacy-driven rules
- BR-PRIV-1 Salary and government IDs visible only to roles with explicit permission; masked by default (show last 4).
- BR-PRIV-2 Bulk exports of sensitive fields require reason and are audited.
- BR-PRIV-3 Applicant data deleted/anonymized after retention period unless consent extends.
