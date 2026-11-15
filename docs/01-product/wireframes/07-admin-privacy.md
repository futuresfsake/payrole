# Admin, Privacy, Audit

## W-70 Roles and users
```
Roles                                 [+ New role]
Role            Users  Sensitive access   Last changed
HR Admin        3      IDs, medical       2026-10-02
Payroll Officer 2      Salary, IDs        2026-10-02
Users                                    [v Role] [v Status]  [+ Invite]
Name         Email                Roles           MFA   Last sign-in   Status
```
Role editor: permission matrix grouped by module with scope dropdown (self/team/department/company). Highlighted rows for sensitive permissions with a one-line description of what the user will be able to see. Changes to payroll/DPO roles need a second admin to approve. Warning banner when a change would break SoD ("This user could prepare and approve payroll.").

## W-71 Workflow definitions
List by request type; editor shows steps as an ordered list (not a drag canvas): approver (resolver), condition, timeout, escalation. Preview pane: "A 5-day vacation by Ena routes to: Santos → HR". Test with a sample request. Version history with who/when and in-flight count.

## W-72 Rule-set editor and approval
```
Rule set · SSS contribution · Draft v2027.1                 Effective [2027-01-01]
Source citation  [SSS Circular No. … ]  [URL]  Retrieved [2026-12-01]
Table (MSC brackets)
 Range from  Range to   MSC     EE     ER     
 …
Golden tests: 14 passed, 0 failed  ✓    Diff vs v2026.1: 3 rows changed  <View>
[Save draft]   [Request approval]      (Approve) shown to a different user only
```

## W-73 Tenant settings
Company legal info and government employer numbers (validated), pay frequency and cut-off defaults, rounding and divisor policy (with plain-language explanations and "Confirm with your accountant" note), deduction timing, branding (logo only), notification defaults, integrations (devices, SSO, webhooks) with key rotation.

## W-74 Privacy console
```
Privacy                                               DPO: D. Navarro
Data subject requests   Open 3   Due ≤ 5 days 1 {!}   Overdue 0     >
Retention               Next run 1 Dec  Eligible records 14   [Review dry run]
Breach register         None open                                     >
Consents                Selfie punch 0 granted · Directory photo 118
Data inventory          86 fields mapped · 0 unmapped                 [Export]
Privacy notice          v3 · acknowledged by 209 of 212               >
```

## W-75 DSR detail
```
Request DSR-0017 · Access · Cruz, Ena         Received 14 Nov   Due 29 Nov (14 d left)
Timeline: Received → Verified → Collecting → Review → Delivered
Sources collected: Employee ✓  Payroll ✓  Time ✓  Leave ✓  Documents ✓  Audit ✓  Workflow ✓
Excluded (with reason): Internal investigation notes (privileged), other persons' data
[Generate package]  [Deliver to employee]   Notes (DPO only) […]
```
Erasure variant shows the retention evaluator table (data class → retain until → basis → action) and requires DPO decision text.

## W-76 Breach register detail
Countdown banner "72 h from detection: 41 h left" (red text when < 12 h). Sections: description, data classes, estimated subjects, risk assessment questions, notifications (customer, NPC, subjects) with generated drafts to review, containment/remediation tasks, post-incident review link.

## W-77 Audit log viewer
```
Audit log           [Date range] [v Actor] [v Entity] [v Action] [Search id…]  (Export…)
Time (Manila)       Actor        Action            Entity               Detail
2026-12-12 09:02    H. Reyes     compensation.update  Employee E-0042   field: rate (value hidden)  reason: "Promotion"
2026-12-12 09:10    F. Lim       payroll_run.approve  Run 2026-12-A     hash a3f9…
Chain status: verified today 02:00 ✓   Head: 8c41…
```
Values of sensitive fields are never shown; only field names and reasons. Export is itself audited and needs purpose. Auditor accounts see this screen read-only with a visible expiry ("Access ends 20 Dec").

## W-78 Integrations
Devices (keys, last seen), SSO configuration, API clients (scopes, secret rotated date), webhooks (endpoint, events, delivery success rate, replay). Secrets shown once at creation.

## W-79 Error and system pages
- 403: "You do not have access to this page. Ask your administrator for the <permission> permission."
- 404: plain "That page does not exist."
- 500: "Something went wrong on our side. Reference: <request id>."
- Maintenance banner and read-only mode during payroll windows for deployments (rare).
