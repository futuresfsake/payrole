# Payroll Golden Test Cases (seed set)

Values marked **VERIFY** depend on rule tables to be confirmed (GAP-01). Cases that depend only on multipliers/arithmetic are stable. Convention: monthly ₱30,000, factor 261 ⇒ daily = 30,000×12/261 = ₱1,379.3103; hourly = ₱172.4138 (6 dp kept; round at line).

## Gross and premium cases
| ID | Scenario | Expected logic |
|---|---|---|
| PC-01 | Full month, no absences, semi-monthly | Each period basic = 15,000.00 |
| PC-02 | 2 hrs OT ordinary day | 2 × hourly × 1.25 |
| PC-03 | 8 hrs worked on regular holiday | 8 × hourly × 2.00 (daily-paid: full 200% of daily rate) |
| PC-04 | 3 hrs OT on regular holiday | 3 × hourly × 2.00 × 1.30 |
| PC-05 | Rest day 8 hrs | 8 × hourly × 1.30 |
| PC-06 | Special non-working day unworked, monthly-paid | No deduction per policy; daily-paid no pay |
| PC-07 | NSD 22:00–06:00, 6 hrs ordinary night | 6 × hourly × 0.10 added |
| PC-08 | NSD + OT ordinary day | OT rate then +10% on that OT hourly rate |
| PC-09 | Regular holiday on rest day, worked 8 | 8 × hourly × 2.60 |
| PC-10 | Late 17 min with grace 10 | Policy-driven; documented fixtures for each policy |
| PC-11 | Absent 1 day monthly-paid | Deduct daily rate |
| PC-12 | Unapproved OT | Zero pay + exception |

## Boundary and structural cases
| ID | Scenario |
|---|---|
| PC-20 | New hire starts mid-period (proration both calendar-day and working-day methods) |
| PC-21 | Rate increase effective mid-period (split) |
| PC-22 | Separation mid-period |
| PC-23 | Leap year Feb 29 |
| PC-24 | Period spanning DST-free but timezone offset check (business date at 23:59 vs 00:01 Manila) |
| PC-25 | Rounding: 100 employees with repeating decimals; sum of lines equals total |

## Statutory (VERIFY table values at build time)
| ID | Scenario | Expected |
|---|---|---|
| ST-01 | SSS at MSC floor boundary | Lowest bracket |
| ST-02 | SSS at MSC ceiling and above | Capped |
| ST-03 | SSS salary exactly at bracket edge ±0.01 | Correct bracket on each side |
| ST-04 | PhilHealth below floor | Computed on floor |
| ST-05 | PhilHealth above ceiling | Capped |
| ST-06 | Pag-IBIG above max fund salary | Capped contribution |
| ST-07 | Contribution rule change mid-year | New table from effectivity only |
| ST-08 | Deduction timing: split across two semi-monthly periods vs full on second | Policy-correct, annual sum identical |

## Tax (VERIFY)
| ID | Scenario |
|---|---|
| TX-01 | Annual taxable ≤ exempt threshold → zero tax |
| TX-02 | Each bracket boundary ±0.01 |
| TX-03 | Mid-year hire annualization |
| TX-04 | Salary increase mid-year re-projection |
| TX-05 | MWE exemption on and off |
| TX-06 | Bonus pushing into next bracket |
| TX-07 | 13th month under/over exempt cap |
| TX-08 | Year-end true-up refund |
| TX-09 | Previous employer income intake |

## 13th month and final pay
| ID | Scenario |
|---|---|
| TM-01 | Full year, no absences: basic annual / 12 |
| TM-02 | Hired June 1: pro-rated |
| TM-03 | Absences reduce basic earned |
| TM-04 | Resigned Aug 15: pro-rated in final pay |
| FP-01 | Final pay with unused SIL conversion and loan balance offset |
| FP-02 | Redundancy separation pay by years of service (rule matrix; VERIFY) |

## Run-level
| ID | Scenario |
|---|---|
| RN-01 | Determinism: recompute 100× yields identical hash |
| RN-02 | Preparer = approver rejected |
| RN-03 | Finalized run cannot be edited; correction creates adjustment |
| RN-04 | Negative net flagged, loan deduction limited per BR-LOAN-2 |
| RN-05 | Retro pay delta for rate change two periods back |

## Fixture format
```yaml
id: PC-02
description: 2h OT ordinary day
rules: { premiums: v2026.1 }
employee: { baseRate: 30000, rateType: monthly, factor: 261 }
attendance: { ot: { ordinary: 120 } }
expect:
  lines:
    - { code: OT_ORD, amount: "431.03" }   # computed by hand and by spreadsheet
```
Each fixture records its derivation source (hand calc, spreadsheet, agency example).
