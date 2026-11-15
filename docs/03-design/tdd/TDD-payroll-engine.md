# TDD-payroll-engine: Payroll computation engine

| | |
|---|---|
| Story/FR | US-303, US-304, US-305, US-309, US-314 / FR-303…FR-305, FR-310, FR-315 |
| Status | Draft |
| ADRs | 001, 005, 008 |

## 1. Problem and scope
Compute gross-to-net for one employee for one pay period deterministically and explainably. Out of scope: persistence, workflow, file export.

## 2. Design

### 2.1 Purity
`computePayroll(input: PayrollInput): PayrollOutput` is a pure function in `packages/domain`. All data is supplied via `input` (snapshot), including resolved rule-set versions. No clock, no I/O, no randomness.

### 2.2 Input snapshot
```
PayrollInput {
  employee: { id, status, isMWE, taxStatus, workingDaysFactor, exemptions }
  compensation: { baseRate, rateType, allowances[] }   // as of period
  period: { start, end, payDate, frequency, sequenceInMonth, isLastOfMonth, isYearEnd }
  attendance: { totals by bucket (minutes): regular, late, undertime, absent,
                ot[tier], nsd[tier], restDay, regHoliday, specHoliday, paidLeaveDays }
  recurring: earnings[], deductions[]
  adjustments: retro[], oneTime[]
  loans: [{ id, installment, priority, balance }]
  ytd: { taxableIncome, taxWithheld, sss, philhealth, pagibig, thirteenthBasis }
  rules: { sss, philhealth, pagibig, tax, premiums, thirteenthMonth }  // versioned, resolved
  policy: { deductionTiming, rounding, graceRules, nsdWindow }
}
```

### 2.3 Pipeline (ordered, each step returns lines + trace entries)
1. **BasicPay**: period basic from base rate (monthly: rate / periods per month; daily: days × rate).
2. **AbsenceLate**: deductions using BR-RATE hourly/daily rates.
3. **Premiums**: OT, NSD, rest-day, holiday per BR-TIME multiplier table (rule data, not code).
4. **OtherEarnings**: allowances, adjustments, retro deltas, tagged taxable/non-taxable.
5. **Gross**: sum.
6. **StatutoryBase**: per-agency compensation base (rule attribute).
7. **Contributions**: SSS (MSC bracket lookup), PhilHealth (rate × clamp(base)), Pag-IBIG (rate × min(base, cap)); apply deduction timing policy; employer share recorded separately.
8. **TaxableIncome**: gross taxable − mandatory employee contributions − exempt portions.
9. **WithholdingTax**: annualised method: project annual taxable = YTD + current + projected remaining periods; tax(annual) − tax already withheld, spread over remaining periods; year-end true-up on last period.
10. **Loans**: apply by priority until net floor (BR-LOAN-2); record arrears.
11. **OtherDeductions**.
12. **Net**: Σ earnings − Σ deductions; exception if < 0.
13. **Outputs**: payslip lines, employer cost lines, YTD deltas, GL tags.

### 2.4 Trace
Every step appends `{step, inputs(ref), rule(version,id), formula, result}`. Trace is stored compressed per employee and rendered in the "Explain" drawer. Trace completeness test: sum of trace results equals output lines.

### 2.5 Rounding
Per BR-RND: Decimal.js with precision 20; half-up; rounding applied at line level only.

### 2.6 Determinism
`snapshotHash = SHA256(canonicalJSON(input))`; result stores `snapshotHash` and `engineVersion`. Same hash + engine version ⇒ identical output (property test with random inputs via fast-check).

### 2.7 Orchestration (outside the pure function)
Worker loads data (as-of), builds inputs, chunks employees (e.g. 50), calls engine, writes `payroll_result` + `payroll_line` in one transaction per chunk, tracks progress. Re-compute replaces draft results; finalized results are immutable (DB trigger).

## 3. Edge cases
- New hire mid-period (proration by calendar vs working days, policy).
- Separation mid-period (final pay path TDD-final-pay).
- Rate change mid-period (split by effective date).
- Contribution table change effective mid-month.
- Negative net, zero net, MWE tax exemption.
- Employee with multiple holidays/OT same day; leave overlapping holiday.
- Year with 53 Fridays (weekly payroll).
- Retro across year boundary (tax year).
- Leap year Feb 29 daily-rate factors.

## 4. Security and privacy
Engine runs inside worker with tenant context; trace contains salary data, so it is encrypted-at-rest field and visible only to payroll/finance roles; payslip trace for employee limited to own lines.

## 5. Failure modes
Chunk failure → mark employee-level error, continue, run cannot be submitted until resolved. Worker crash → idempotent restart by (runId, version, chunk). Concurrent edits to inputs during compute → run version bump invalidates results.

## 6. Test plan
- **Golden**: YAML fixtures `input → expected lines`, authored from hand computation and agency worked examples; one per contribution bracket boundary, tax bracket boundary, holiday scenario.
- **Property**: determinism; net = gross − deductions; contributions monotonic in base; no negative rounding drift (sum of split periods = monthly amount).
- **Mutation testing** on rule modules (Stryker) target ≥ 80%.
- **Parallel run** with real anonymized payroll (M3 exit gate).

## 7. Rollout
Engine versioned (`engineVersion`); behind per-tenant flag until parallel run passes. Rule-set changes ship as data releases.

## 8. Open questions
GAP-01 (tables), GAP-06 (de minimis), GAP-11 (commission/piece-rate), deduction timing defaults per customer.
