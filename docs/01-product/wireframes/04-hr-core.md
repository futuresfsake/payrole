# HR Core

## W-30 Employee list
**Stories** US-109. Desktop.
```
People (212)    [+ Add employee]  (Import)  (Export…)
[Search name or number …]  [v Status: Active] [v Department] [v Branch] [v Type]
─────────────────────────────────────────────────────────────────────────────
 No.     Name               Position            Department  Manager      Status     Hired
 E-0042  Cruz, Ena M.       Accountant II       Finance     Santos, M.   Regular    2022-03-01
 E-0107  Tan, Marco         Sales Associate     Sales       Reyes, H.    Probation  2026-09-01
─────────────────────────────────────────────────────────────────────────────
 1–50 of 212        < 1 2 3 4 5 >       Columns ▾   Saved views ▾
```
Sortable headers; no salary column unless `compensation:read`. Export asks for purpose if columns include sensitive fields. Empty state: "No employees yet. Add one or import a spreadsheet."

## W-31 Employee profile (HR view)
```
Cruz, Ena M.   E-0042   Regular · Finance · Accountant II        [Edit ▾] [Actions ▾]
────────────────────────────────────────────────────────────────────────
Personal | Employment | Pay | IDs | Documents | History | Leave | Attendance | Loans
────────────────────────────────────────────────────────────────────────
Employment (as of [2026-11-15 ▾])
  Status        Regular (regularised 2022-09-01)
  Position      Accountant II  · Grade G5
  Department    Finance · Cost centre CC-210
  Manager       Santos, Miguel
  Schedule      Office 9–6, Mon–Fri
  Pay group     Semi-monthly A
  Upcoming change:  Salary increase effective 2027-01-01  {i}
```
Tabs behave by permission; "Pay" tab shows rate masked behind [Show] (reason prompt). "As of" selector exposes effective-dated history.

## W-32 Change employment (effective-dated)
```
Change employment · Cruz, Ena
Type   (•) Promotion ( ) Transfer ( ) Salary change ( ) Status change
Effective  [2027-01-01]     (not earlier than period lock)
New position [v Senior Accountant]   New rate [________] per [v month]
Reason [________________]   Attach approval [Add file]
Preview: Rate ₱35,000 → ₱40,000 (+14.3%)   Within band G6 {i}
[Submit for approval]
```
Back-dated changes show a warning with the retro pay estimate and require payroll notification.

## W-33 IDs tab
Masked values, format validation message inline ("SSS numbers have 10 digits"), [Reveal] opens reason prompt (select + free text) and step-up if configured; shows "Last revealed by … on …".

## W-34 Documents (201 vault)
Left: categories (Contracts, IDs, Clearances, Memos, Medical (restricted), Training). Right: table (name, uploaded, expiry, visibility, scan ✓). Upload dialog: category, expiry (optional), visibility (HR only / Employee can see). Medical and disciplinary categories require special permission and show a lock icon.

## W-35 Import wizard
**Stories** US-103.
```
Import employees       Step 2 of 4: Check
Steps: 1 Upload ─ 2 Check ─ 3 Review ─ 4 Confirm
────────────────────────────────────────────────
File: employees_nov.xlsx   Template v3
Rows 212    Ready 198    Warnings 9    Errors 5
Errors
 Row 14  TIN        "123-45" is too short. Expected 9 or 12 digits.
 Row 31  Manager    "R. Santos" not found. Use employee number.
 …                                      [Download error report]
Warnings
 Row 7   Rate below regional minimum for NCR.
[Back]   [Fix and re-upload]   [Continue] (disabled while errors exist)
```
Confirm step summarises counts, requires step-up, and states "You can undo this import for 7 days."

## W-36 Org structure
Tree (company → branch → department → team) left; detail right with headcount, head, cost centre, effective dates; drag-and-drop disabled in favour of explicit "Move" dialog (accessibility, audit). Org chart view read-only graphic, printable.

## W-37 Onboarding
```
Onboarding · Tan, Marco · Start 2026-12-01            Progress 6 of 11
Before day 1
 [x] Contract signed         [x] Government IDs   [ ] Bank details
Day 1
 [ ] Laptop issued (IT)      [ ] ID card (Admin)
Week 1
 [ ] Policy acknowledgments   [ ] Benefits briefing (HR)
```
Tasks have owner, due date, status; overdue in red text with icon. New hire sees their own subset in ESS.

## W-38 Offboarding / final pay
```
Offboarding · Cruz, Ena         Effective 2026-12-31     Cause: Resignation
Steps: Initiate ─ Clearance ─ Final pay ─ Release ─ Close
Clearance 4 of 6      Final pay: Not computed   [Compute final pay]
Due-process documents (not required for resignation)
Final pay due by 2027-01-30 (30 days)  {i}
```
Final pay preview is a ruled statement: unpaid salary, 13th month pro-rated, leave conversion, separation pay (if applicable), deductions, net, with the explain link on each line.

## W-39 Add employee (single)
Sectioned single page (not a wizard): Personal, Contact, Employment, Pay, Government IDs, Schedule. Save draft anytime; "Activate" requires required fields and displays a checklist of what is missing.
