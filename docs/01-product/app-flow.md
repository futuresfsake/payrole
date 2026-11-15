# Application Flows

Mermaid diagrams (render in GitHub/VS Code). Screens are named for later wireframing.

## 1. Global navigation (information architecture)
```mermaid
flowchart TD
  Login --> MFA --> Home
  Home --> ESS[My Space]
  Home --> MSS[My Team]
  Home --> HR[HR Admin]
  Home --> PAY[Payroll]
  Home --> RPT[Reports]
  Home --> PRIV[Privacy Console]
  Home --> ADM[Settings]
  ESS --> E1[Payslips] & E2[Leave] & E3[Attendance] & E4[Profile] & E5[Documents] & E6[Requests]
  MSS --> M1[Approvals] & M2[Team calendar] & M3[Reviews]
  HR --> H1[Employees] & H2[Org] & H3[Onboarding] & H4[Offboarding] & H5[Recruitment]
  PAY --> P1[Pay periods] & P2[Run payroll] & P3[Loans] & P4[Statutory] & P5[Bank files]
```

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
