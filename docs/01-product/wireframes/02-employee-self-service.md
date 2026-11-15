# Employee Self-Service (mobile-first)

## W-10 Payslip list and detail
**Stories** US-310, FR-504.
```
Payslips                              [v 2026]
────────────────────────────────────────────
15 Dec 2026   Semi-monthly      Net  ₱ 22,418.60  >
30 Nov 2026   Semi-monthly      Net  ₱ 22,418.60  >
15 Nov 2026   Semi-monthly      Net  ₱ 21,904.12  >
```
Detail:
```
Payslip · 1–15 Dec 2026 · Paid 16 Dec
────────────────────────────────────────────
EARNINGS                              Amount
 Basic pay                         15,000.00
 Overtime (2.0 h @125%)               431.03
 Holiday pay                          0.00
 Total earnings                    15,431.03
DEDUCTIONS
 SSS                                 750.00
 PhilHealth                          375.00
 Pag-IBIG                            100.00
 Withholding tax                     912.40
 Total deductions                  2,137.40
────────────────────────────────────────────
NET PAY                           ₱13,293.63
Year to date: gross …  tax withheld …
[Download PDF]   <What is this?> on each line
```
(Numbers are illustrative.) "What is this?" opens a plain-language explanation of the line and, for computed lines, the employee-safe part of the explain trace (rate × quantity). States: payslip not yet released, run reversed (banner "This payslip was corrected. See the new one dated …").
**Rules** PDF download audited; no payslip data in email or push text.

## W-11 Leave
```
Leave                                 [File leave]
Balances
  Vacation     8.5 days   (accrues 1.25 / month)
  Sick         5.0 days
  Service Incentive  3.0 days
Requests
  20–22 Dec   Vacation   3 days    Pending: M. Santos
  02 Oct      Sick       1 day     Approved
```
File leave form:
```
File leave
Type      [v Vacation ]
From      [2026-12-20]  ( ) Half day AM ( ) PM
To        [2026-12-22]
Days      3.0  (weekends and holidays excluded)
Reason    [_____________________]   (optional; visible to approvers only)
Attach    [Add file]  (required for sick leave beyond 2 days)
Balance after: 5.5 days
[Submit request]   <Cancel>
```
States: insufficient balance ("You have 1.0 day left. Submit as unpaid leave?" with explicit toggle), overlap, blackout date, statutory leave eligibility messages.

## W-12 Attendance
```
Attendance · December 2026            [Request correction]
Date        In     Out    Hours   Note
Mon 12      08:58  18:05  8.0
Tue 13      09:21  18:00  7.6     Late 21 min {!}
Wed 14      —      —      0       Missing punch  [Fix]
Late 2   Absent 0   Overtime 2.0 h
```
Correction sheet: date, actual in/out, reason, attachment; routes to manager. Mobile punch (M5, optional) separate screen with explicit consent notice if geolocation/selfie enabled.

## W-13 Profile
```
My profile                         [Request a change]
Personal      Name, birth date, civil status
Contact       Mobile, email, address
Emergency     Name, relationship, mobile
Government IDs   TIN ▒▒▒-▒▒▒-▒▒▒-123   SSS ▒▒-▒▒▒▒▒▒▒-4   <Show>
Bank account     BDO ▒▒▒▒▒▒6789
Dependents
```
Edits create change requests; sensitive fields (bank, IDs, name) show "Pending HR review" with before/after diff. Reveal shows the value for 30 s and logs the view.

## W-14 Documents
List by category (Contracts, Certificates, Policies to acknowledge). Policy acknowledgment: full text scroll area then [I have read and understood this policy]. Upload with type/size hints and scan status.

## W-15 Requests and certificates
Request CoE (purpose select) / payslip copy / 2316; shows SLA ("Usually ready within 3 working days") and status timeline.

## W-16 Privacy and my data
```
Your data
  What we keep about you  <View notice>
  [Request a copy of my data]   [Ask to correct]   [Ask to restrict or delete]
  Consents: Selfie punch  Off   Directory photo  On
  Requests: 1 open — "Copy of my data", due 30 Nov
```
