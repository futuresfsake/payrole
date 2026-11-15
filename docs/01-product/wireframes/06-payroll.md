# Payroll

## W-50 Pay periods
```
Payroll                                [+ New run]
Group: Semi-monthly A       Year 2026
Period        Cut-off     Pay date   Attendance   Run status
1–15 Dec      12 Dec      16 Dec     Locked       Approved
16–31 Dec     27 Dec      30 Dec     Open         —
…
Off-cycle runs: 13th month (due 24 Dec) [Create]
```

## W-51 Run workspace (exceptions first)
**Stories** US-307, US-308, US-315. Layout follows the ledger: a header with the run's state strip, then reconciliation totals, then exceptions, then the register.
```
Run 2026-12-A · 1–15 Dec · Semi-monthly A · 212 employees
State:  Draft ─ Computed ─ Submitted ─ Approved ─ Finalized ─ Paid
                 ▲ you are here          Prepared by H. Reyes · Approver: F. Lim
──────────────────────────────────────────────────────────────────────
                          This run       Previous      Change
Gross pay             3,214,880.12   3,198,455.40     +0.5%
Statutory (employee)    312,400.00     311,900.00     +0.2%
Withholding tax         198,311.45     196,020.10     +1.2%
Net pay               2,704,168.67   2,690,535.30     +0.5%
Employer cost (SSS/PH/HDMF)  421,850.00
──────────────────────────────────────────────────────────────────────
Exceptions   Blocking 2    Warnings 9       [Recompute]
 {!} Tan, Marco       Negative net: loan deduction exceeds pay        [Review]
 {!} Lim, Paolo       Missing TIN                                      [Open profile]
 {i} Cruz, Ena        Net +22% vs previous (OT)       ( ) Acknowledged  [comment]
──────────────────────────────────────────────────────────────────────
Register    [Search…] [v Pay group] [v Cost centre]
 Employee        Gross      Contrib.     Tax        Loans     Net         Flags
 Cruz, Ena       15,431.03    1,225.00    912.40       0.00   13,293.63   ↑22%
 …
Totals row sticks to the bottom.
──────────────────────────────────────────────────────────────────────
[Submit for approval] (disabled while blocking exceptions exist)
```
Approver view replaces the action with [Approve payroll] (step-up auth) and (Return with comment). Finalize confirm text: "Finalizing locks this run. Corrections after this point are made in the next run." After finalize: [Publish payslips] [Download bank file] [Statutory reports].
**States** computing (progress bar with counts "Computed 140 of 212"), stale (banner "Inputs changed since this was computed. Recompute before submitting."), reversed (strikethrough banner linking the reversal run), read-only for non-payroll roles.
**Rules** preparer ≠ approver; comments on exception acknowledgments are mandatory; all actions audited.

## W-52 Employee payroll result (HR/payroll view) with Explain
```
Cruz, Ena · Run 2026-12-A                                   Net ₱13,293.63
Earnings / deductions table (same as payslip) with an "Explain" link per line.
──────────── Explain: Withholding tax ────────────────────────────────
Step 1  Taxable this period      15,431.03 − contributions 1,225.00 = 14,206.03
Step 2  Year to date taxable     312,000.00 (Jan–Nov) + current
Step 3  Projected annual taxable 14,206.03 × remaining 2 periods + YTD … = 354,412.06
Step 4  Annual tax (rule tax.2026.1, bracket 2)    … = 15,661.81
Step 5  Already withheld         14,749.41
Step 6  Withhold this period     912.40  (spread over remaining periods)
Source: BIR table v2026.1 · Engine 1.4.0 · Snapshot sha256:9fa2…
```
Worked figures are illustrative. The drawer is the product's trust feature: each step cites the rule version.

## W-53 Earning and deduction codes
Table with columns: code, name, kind, taxable, SSS/PH/HDMF base?, 13th-month base?, GL account, active. Editing a code used in a finalized run creates a new effective-dated version.

## W-54 Loans
```
Loans                                            [+ New loan]
Employee        Type          Principal   Installment  Balance   Next deduction  Authorisation
Tan, Marco      Company loan  20,000.00   1,000.00     14,000.00 16 Dec         ✓ on file
Lim, Paolo      SSS salary    …
```
New loan form requires amortisation schedule preview, priority order, and uploaded authorisation (BR-LOAN-3). Pausing a deduction needs reason.

## W-55 Statutory and exports
```
Reports & files                                  Period [v Dec 2026]
SSS contributions        Ready   Control total ₱ …   [Preview] [Generate file]
PhilHealth               Ready   …
Pag-IBIG                 Ready   …
BIR 1601-C data          Ready   …
Bank file (BDO)          Needs bank account for 3 employees {!}  [View]
GL journal               Ready   Balanced ✓
Template versions in use: SSS 2026.1 · PhilHealth 2026.1 · BIR 2026.2   <Details>
```
Generate requires purpose for files containing government IDs; result lists count, totals, and checksum, with a download link valid for 5 minutes. Calendar tab shows due dates and reminders.

## W-56 13th month run
Choose year and cut-off, preview per employee: basic earned, pro-rated months, amount, taxable excess over exempt cap. Same lifecycle as W-51.

## W-57 Rule sets
Table of rule sets (SSS, PhilHealth, Pag-IBIG, Tax, Premiums, Minimum wage) with versions, effectivity, source citation, status (Draft / Approved / Superseded). Editor shows a diff against the prior version and a golden-test result panel; Approve is available only to a second user. See W-72.

## W-58 Payroll reports
Register, variance, cost by cost centre, employer contributions, year-to-date, headcount movement; each with filters, export (purpose prompt for sensitive columns), and scheduled email delivery to a distribution list (links only).
