# Milestones

Sequenced by risk and dependency: foundations → people record → time → payroll (highest risk, earliest proof) → compliance output → self-service → growth modules → hardening.
Each milestone has an exit gate. No milestone starts until the previous gate is met (except documented overlap).

| M | Name | Theme | Est. (solo, part-time) | Exit gate |
|---|---|---|---|---|
| M0 | Foundations | Repo, CI/CD, auth, tenancy, audit log, design system | 3–4 wks | Login+MFA works, RLS isolation tests green, pipeline gates enforced, deploy to staging |
| M1 | Core HR | Org, positions, employee master, 201 vault, import | 4–5 wks | Employee CRUD with field-level encryption, effective-dated history, CSV import with validation report |
| M2 | Time & Leave | Schedules, DTR ingest, OT, leave types/balances, holiday calendar, approvals | 5–6 wks | Attendance computed for a month of sample data matches hand calc; leave accrual tested |
| M3 | Payroll Engine | Pay periods, earnings/deductions, statutory computation, loans, 13th month, payslips | 8–10 wks | Golden test suite passes; **parallel run on real anonymized data ≤ ₱1 variance/employee** |
| M4 | Statutory & Reporting | Gov reports/files, 2316, alphalist, remittance, bank files, GL export | 5–6 wks | Files validate against agency validators/templates; Finance sign-off |
| M5 | Self-Service & Workflow | ESS/MSS, workflow engine, notifications, PWA, mobile punch | 5 wks | Employee can complete leave/OT/payslip/profile flows on mobile; approval SLA tracked |
| M6 | Onboarding / Offboarding & Recruitment | Checklists, e-sign, final pay, clearance, ATS lite | 5 wks | Offboarding final-pay calc matches rule matrix; ATS pipeline works |
| M7 | Performance, Learning, Benefits | Goals/reviews, trainings, HMO/benefit enrollment, Filipino i18n | 6 wks | Review cycle end-to-end; training records feed 201 |
| M8 | Hardening & GA | Pen test, load test, DR drill, accessibility audit, privacy sign-off, docs | 4–6 wks | Pen-test criticals closed, RTO/RPO met in drill, DPO sign-off, GA checklist signed |

## Release plan
- **Alpha** (M3 exit): internal parallel run only.
- **Private beta** (M5 exit): 1–2 friendly customers, payroll still parallel.
- **GA** (M8 exit): first live payroll customers.

## Critical path
M0 → M1 → M2 → M3 → M4. Payroll depends on time/leave and employee data; compliance depends on payroll.

## Cross-milestone threads
- Security controls land incrementally (see [04-security](../04-security/README.md)); each milestone ends with a security checklist.
- Documentation updated in the same PR as code (Definition of Done).
- Gap register reviewed at each gate.

## Per-milestone detail
| M | Epics | Key stories |
|---|---|---|
| M0 | EP-00 Platform | US-001…US-010 |
| M1 | EP-01 Core HR | US-101…US-112 |
| M2 | EP-02 Time & Leave | US-201…US-212 |
| M3 | EP-03 Payroll | US-301…US-315 |
| M4 | EP-04 Statutory | US-401…US-409 |
| M5 | EP-05 Self-Service/Workflow | US-501…US-509 |
| M6 | EP-06 Lifecycle & ATS | US-601…US-608 |
| M7 | EP-07 Performance/Learning/Benefits | US-701…US-706 |
| M8 | EP-08 Hardening | US-801…US-808 |

Full story list: [epics-and-stories.md](epics-and-stories.md).
