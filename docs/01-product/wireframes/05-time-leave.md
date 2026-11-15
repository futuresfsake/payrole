# Time and Leave

## W-40 Schedule editor
**Stories** US-201.
```
Schedules                          [+ New schedule]
Office 9–6 (fixed)  · 142 employees
Edit schedule: Office 9–6
 Type   (•) Fixed ( ) Flexible ( ) Shift ( ) Compressed
 Days   [x]Mon [x]Tue [x]Wed [x]Thu [x]Fri [ ]Sat [ ]Sun   (unchecked = rest day)
 Start [09:00]  End [18:00]  Unpaid break [60] min
 Grace late [10] min   Rounding [v Per minute]
 Night differential window 22:00–06:00 (from rule set v2026.1)
 Agreement reference (required for compressed/flexible) [____]
Assign: [Add employees…]   Effective from [2027-01-01]
```
Shift patterns: grid of days × shift templates with rotation length. Preview week below the form.

## W-41 Holiday calendar
```
Holidays 2026   [v Year]   [Import from template]  [+ Add]
Date        Holiday                    Type                     Scope     Source
2026-12-25  Christmas Day              Regular                  National  Proclamation No. …
2026-12-30  Rizal Day                  Regular                  National  …
2026-12-31  Last Day of the Year       Special non-working      National  …
2026-08-15  Founding Day (Davao)       Special (local)          Davao     LGU ordinance
```
Citation required on save. Changes after a period lock show impacted employees count and require payroll acknowledgment.

## W-42 Time import
Upload CSV or view device status table (device, last push, offset, status). Result summary: inserted, duplicates, quarantined (unknown badge) with [Map badge] action. Download rejects report.

## W-43 Attendance grid (payroll/HR)
**Stories** US-204, US-211.
```
Attendance · 1–15 Dec 2026 · Group: Semi-monthly A      [Lock period]
[v Exceptions only]  [Search …]
Employee        1   2   3   4   5   6   7   8 … 15   Late  Abs  OT   Flags
Cruz, Ena       ✓   ✓   ✓   ✓   ✓   R   R   ✓      0     0    2.0
Tan, Marco      ✓   L   ✓   M   ✓   R   R   ✓      14m   0    0    {!} Missing punch (4)
Legend ✓ ok  L late  M missing  A absent  R rest day  H holiday  V leave
```
Click a cell → day drawer with punches, schedule, computed minutes, and the "why" trace; actions: add correction, approve OT. Exceptions-first default filter. Lock dialog lists unresolved exceptions and requires acknowledgment; unlocking later needs reason.

## W-44 Day detail drawer
```
Tan, Marco · Tue 13 Dec 2026 · Office 9–6
Punches   09:14 IN   18:02 OUT
Computed  Worked 7h 48m · Late 14m (grace 10) · OT 0
Why       First IN 09:14 − (09:00 + 10 grace) = 4 min ... [full trace]
[Add correction]  [Approve OT]
```

## W-45 Leave settings
Leave types table (name, statutory, accrual, cap, convertible), editor with statutory floors shown ("Law requires at least 105 days") and validation error if below. Policy simulator: pick employee + date → projected balances.

## W-46 Leave year-end preview
Table of carry-over, expiry, cash conversion per employee with totals and [Approve and apply]. Shows ledger effect summary.

## W-47 Overtime and corrections queue (HR/payroll)
Cross-team list with filters by status, approver, cost centre; export; highlights repeated patterns (same approver, same employee) as information, not accusation.
