# Milestones

Sequenced by risk and dependency: foundations → people record → time → payroll (highest risk, earliest proof) → compliance output → self-service and privacy → lifecycle → hardening and GA → growth modules after GA.
Each milestone has an exit gate. No milestone starts until the previous gate is met, except the documented overlaps below.

## Sequence

`M0 → M1 → M2 → M3 → M4 → M5 → M6 → M8 (GA) → M7`

M7 keeps its number so story IDs stay stable, but it runs **after GA**. Nothing in M7 is needed to run a customer's payroll.

| M | Name | Theme | Est. (solo, part-time) | Exit gate |
|---|---|---|---|---|
| M0 | Foundations | Repo, CI/CD, auth, tenancy, audit log, jobs/outbox, email, backups, design system | 4–5 wks | Login+MFA works, RLS isolation tests green, pipeline gates enforced, deploy to staging, **backup restore tested and timed**, external review done |
| M1 | Core HR | Org, positions, employee master, compensation profile, 201 vault, import | 5–6 wks | Employee CRUD with field-level encryption, effective-dated history, compensation profile, CSV import with validation report; **parallel-run partner confirmed (GAP-02)**; counsel review of retention started (GAP-03) |
| M2 | Time & Leave | Schedules, DTR ingest, OT, leave, holiday calendar, **basic approvals and employee portal** | 7–8 wks | Attendance computed for a month of sample data matches hand calc; leave accrual tested; an employee files leave/OT/correction and a manager approves it in-app |
| M3 | Payroll Engine | Rule sets, pay periods, earnings/deductions, statutory computation, loans, 13th month, payslips, generic bank CSV | 10–12 wks | Golden test suite passes; **parallel run on real anonymized data ≤ ₱1 variance/employee**; external review done |
| M4 | Statutory & Reporting | Gov reports/files, 2316, alphalist, remittance, bank templates, GL export | 5–6 wks | Files validate against agency validators/templates; Finance sign-off |
| M5 | Self-Service, Workflow & Privacy | ESS/MSS, configurable workflow, notifications, PWA, mobile punch, retention, breach register, DSR | 5–6 wks | Employee completes leave/OT/payslip/profile flows on mobile; approval SLA tracked; **breach register and retention engine live** |
| M6 | Lifecycle | Onboarding, offboarding, clearance, final pay, separation pay, e-sign | 4–5 wks | Offboarding final-pay calc matches rule matrix; separation matrix counsel-reviewed |
| M8 | Hardening & GA | Pen test, load test, DR drill, accessibility audit, privacy sign-off, docs, tenant export | 4–6 wks | Pen-test criticals closed, RTO/RPO met in drill, DPO sign-off, **two consecutive live parallel payroll cycles within tolerance**, GA checklist signed |
| M7 | Growth Modules (post-GA) | ATS lite, goals/reviews, training, benefits, Filipino i18n, analytics | 6–8 wks | Review cycle end-to-end; ATS pipeline works; training records feed 201 |

Pre-GA total: roughly 44–54 weeks of solo part-time work (the 2026-11-15 review raised this from 39–48 by adding stories that were missing, not by padding). Treat the totals as ranges to re-plan at each gate, not commitments.

## Release plan
- **Alpha** (M3 exit): internal parallel run only.
- **Private beta** (M5 exit): 1–2 friendly customers, payroll still parallel. Real employee data enters here, so the beta gate also needs US-510 and US-511 done, the DPO appointed (OD-14), and the NPC registration question answered (GAP-13).
- **GA** (M8 exit): first live payroll customers.
- **Post-GA** (M7): growth modules, shipped per customer demand.

## Critical path
M0 → M1 → M2 → M3 → M4. Payroll depends on time/leave and employee data; compliance depends on payroll.
Longest-lead external dependency: the parallel-run partner (GAP-02). Recruit it during M1, not at M3 exit.

## Allowed overlaps
These are the only exceptions to "previous gate first":
- **Agency format spikes** (GAP-07, GAP-08) start during M3 so M4 is not blocked on research.
- **Rule-set sourcing** (GAP-01) happens during M2 so US-316 has verified data to load at M3 start.
- **Wireframe and copy work** for the next milestone may run in the last week of the current one.
No code for the next milestone merges before the gate.

## Per-milestone detail and build order
Build order is the order in which stories should be started inside the milestone, because each depends on the one before.

| M | Epics | Stories | Build order |
|---|---|---|---|
| M0 | EP-00 Platform | US-001…US-013 | 005, 004, 012, 013, 002, 003, 007, 001, 011, 006, 009, 008, 010 |
| M1 | EP-01 Core HR | US-101…US-113 | 101, 102, 104, 113, 105, 108, 106, 103, 109, then S-priority stories |
| M2 | EP-02 Time & Leave | US-201…US-216 | 201, 202, 213, 214, 203, 204, 215, 205, 206, 207, 208, 216, 209, 211, then S-priority |
| M3 | EP-03 Payroll | US-301…US-320 | 316, 301, 302, 303, 318, 304, 319, 320, 305, 306, 307, 314, 315, 308, 309, 310, 317, 311, 312, 313 |
| M4 | EP-04 Statutory | US-401…US-409 | 401, 402, 404, 403, 406, then S-priority |
| M5 | EP-05 Self-Service, Workflow & Privacy | US-501…US-512 | 501, 503, 502, 511, 510, 509, 506, then S/C-priority |
| M6 | EP-06 Lifecycle | US-601…US-604, US-609 | 601, 603, 604, 609, 602 |
| M7 | EP-07 Growth Modules (post-GA) | US-701…US-710 | By customer demand |
| M8 | EP-08 Hardening | US-801…US-809 | 802, 801, 803, 804, 805, 807, 809, 806, 808 |

## Cross-milestone threads
- Security controls land incrementally (see [04-security](../04-security/README.md)); each milestone ends with a security checklist.
- Documentation updated in the same PR as code (Definition of Done).
- Gap register, risk register and open decisions reviewed at each gate.
- External review at M0, M3 and M8 (see [workflows](../07-process/workflows.md)).

Full story list: [epics-and-stories.md](epics-and-stories.md).
