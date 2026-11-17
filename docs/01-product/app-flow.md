# Application Flows

Mermaid diagrams (render in GitHub/VS Code). Screens are named for later wireframing.

## 1. Global navigation (information architecture, by workspace)
The top level is the **workspace**, not the module. A user sees only the workspaces backed by an active role assignment ([ADR-013](../03-design/adr/ADR-013-multi-role-access-model.md)). A user with only the employee role sees no workspace strip at all.
```mermaid
flowchart TD
  Login --> MFA --> Resolve[Resolve effective access]
  Resolve --> Me[Me]
  Resolve --> Team[Team]
  Resolve --> HR[HR]
  Resolve --> Payroll[Payroll]
  Resolve --> Dash[Dashboards]
  Resolve --> Privacy[Privacy]
  Resolve --> Admin[Admin]
  Resolve --> Audit[Audit]
  Me --> E1[Payslips] & E2[Leave] & E3[Attendance] & E4[Profile] & E5[Documents] & E6[Requests] & E7[My roles]
  Team --> M1[Approvals] & M2[Team calendar] & M3[Reviews]
  HR --> H1[People] & H2[Org] & H3[Onboarding] & H4[Offboarding] & H5[Leave policy] & H6[Time and schedules]
  Payroll --> P1[Pay periods] & P2[Runs] & P3[Loans] & P4[Statutory] & P5[Bank files] & P6[Rule sets]
  Dash --> D1[Headcount] & D2[Payroll cost]
  Privacy --> V1[Requests] & V2[Breach log] & V3[Retention]
  Admin --> A1[Users] & A2[Role assignments] & A3[Workflow] & A4[Integrations] & A5[Access review]
  Audit --> U1[Audit log and export]
```
Entry permission per workspace is in [HLD §6](../03-design/hld/high-level-design.md). Recruitment moves to a `Recruit` workspace when the ATS ships (post-GA).

## 2. Hire to active employee
```mermaid
sequenceDiagram
  participant R as Recruiter
  participant HR as HR Admin
  participant S as System
  participant E as New Hire
  R->>S: Mark candidate "Offer accepted"
  S->>HR: Task: create employee draft (prefilled)
  HR->>S: Complete record, gov IDs, salary, schedule
  S->>E: Invite (secure link, MFA setup)
  E->>S: Complete profile, upload docs, sign contract
  S->>HR: Onboarding checklist progress
  HR->>S: Activate employee (effective date)
  S->>S: Create payroll profile, leave balances, audit entries
```

## 3. Leave request
```mermaid
flowchart LR
  A[Employee submits] --> B{Balance + rules OK?}
  B -- no --> A2[Show reason, block or allow unpaid]
  B -- yes --> C[Route to manager]
  C -->|approve| D{More steps?}
  C -->|reject| X[Notify employee]
  D -- yes --> C2[Next approver / HR]
  D -- no --> F[Deduct balance, update calendar, flag payroll]
  C -->|timeout| ESC[Escalate to delegate]
```

## 4. Time to payroll cycle
```mermaid
flowchart TD
  T1[Raw punches ingested] --> T2[Daily attendance computed]
  T2 --> T3[Exceptions queue: missing punch, unapproved OT]
  T3 --> T4[Corrections and approvals]
  T4 --> T5[Lock attendance for period]
  T5 --> P1[Create draft payroll run]
  P1 --> P2[Compute: gross, premiums, statutory, tax, loans, net]
  P2 --> P3[Exceptions and variance review]
  P3 -->|fix| T4
  P3 --> P4[Preparer submits]
  P4 --> P5[Approver reviews, approves]
  P5 --> P6[Finalize: immutable snapshot]
  P6 --> O1[Payslips published] & O2[Bank file] & O3[GL export] & O4[Remittance data]
```

## 5. Payroll run states
```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Computed: compute
  Computed --> Draft: recompute (inputs changed)
  Computed --> Submitted: preparer submits
  Submitted --> Computed: returned by approver
  Submitted --> Approved: approver approves (SoD)
  Approved --> Finalized: lock and snapshot
  Finalized --> Paid: bank file confirmed
  Finalized --> Reversed: reversal run (logged, reason)
  Paid --> [*]
```

## 6. Data subject request
```mermaid
flowchart LR
  A[Employee submits DSR] --> B[DPO queue, SLA clock]
  B --> C{Type}
  C -->|Access| D[Compile export]
  C -->|Correction| E[Route to HR approval]
  C -->|Erasure/Objection| F{Legal retention applies?}
  F -- yes --> G[Restrict processing, explain basis]
  F -- no --> H[Anonymize/delete, log]
  D & E & G & H --> I[Respond, close, audit]
```

## 7. Offboarding
Resignation/termination recorded → clearance checklist (assets, accountabilities) → final pay computation → approval → release → access revoked at effective date → record moved to retention state → scheduled anonymization.

## 8. Key screens (wireframes now in [wireframes/](wireframes/README.md))
Login/MFA · Home (role-aware) · Employee list · Employee profile (tabs: Personal, Employment, Pay, IDs, Documents, History, Leave, Attendance) · Import wizard · Schedule editor · Attendance grid · Approvals inbox · Payroll run workspace (exceptions-first) · Payslip with "explain" drawer · Statutory exports · Privacy console · Audit viewer · Settings (roles, workflows, holidays, rule sets).

## 9. Sign-in and workspace resolution
```mermaid
sequenceDiagram
  participant U as User
  participant I as Identity provider
  participant A as API
  participant W as Web
  U->>I: Sign in (passkey or TOTP)
  I-->>A: Verified identity
  A->>A: Find account, link employee, load active assignments, derive employee and manager
  alt any privileged assignment and no MFA this session
    A-->>U: Require MFA enrolment or challenge
  end
  A-->>W: Session plus effective access (workspaces, scopes, end dates)
  W-->>U: Last used workspace if still held, else first held
```
If the last-used workspace is no longer held, the user lands on Me and sees a one-line notice.

## 10. Role assignment lifecycle
```mermaid
stateDiagram-v2
  [*] --> Proposed: admin proposes (role, scope, dates, reason)
  Proposed --> Rejected: static SoD fails, or approver declines
  Proposed --> Active: second approver approves (if required)
  Active --> Ended: end date reached, revoked, or employee separated
  Active --> Active: SoD exception expires, flagged in access review
  Rejected --> [*]
  Ended --> [*]
```
Rules: proposer cannot approve their own proposal; payroll, DPO and admin roles need a second approver; `auditor` needs an end date of 90 days at most; ending employment ends every granted assignment in one transaction and revokes sessions. Changes rotate the user's session and show "Your access changed. Reload to continue."

## 11. Approval routing for people with several roles
```mermaid
flowchart TD
  R[Request filed] --> W[Workflow finds approver from reporting line as of today]
  W --> C{Approver is the requester?}
  C -- yes --> N[SoD-2: skip to next level or hr_admin]
  C -- no --> A[Approver acts in Team or HR workspace]
  N --> A
  A --> D{Needs second step?}
  D -- yes --> W
  D -- no --> F[Effect applied, audited]
```
A person who is both HR admin and manager sees their team's requests in **Team** and everything else in **HR**; their own requests never appear in their own approval lists.

## 12. Key screens (updated)
Login/MFA · Home per workspace · People list · Employee 201 file (catalogue strip, hanging labels; sections Personal, Employment, Pay, IDs, Documents, History, Leave, Attendance) · Import wizard · Schedule editor · Attendance grid · Approvals inbox · Payroll run workspace (exceptions first) · Payslip with "explain" drawer · Statutory exports · Role assignments (propose, approve, SoD result) · My roles · Access review · Privacy console · Audit viewer. Visual direction: [ui-design-system](../03-design/ui-design-system.md), live example: [ui-preview](../03-design/hld/ui-preview.html).
