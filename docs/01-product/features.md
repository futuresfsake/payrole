# Feature Catalog

| Module | Feature | Release | Notes |
|---|---|---|---|
| Platform | Multi-tenant, RBAC, MFA/passkeys, audit log, feature flags, job queue and outbox, transactional email, backups with PITR | M0 | |
| Core HR | Org chart, positions, employee master, compensation profile, effective-dated history, 201 vault, CoE | M1 | |
| Core HR | CSV import/export with validation | M1 | |
| Time | Schedules, holiday calendar, DTR ingest, computation, corrections | M2 | |
| Leave | Types, accrual, requests, balances, calendar | M2 | |
| Workflow | Basic approvals (one/two steps) and in-app notifications | M2 | Cut 1 of the workflow engine |
| ESS | Employee portal: my attendance, leave, requests | M2 | Shell reused in M3/M5 |
| Payroll | Managed rule sets, multiple pay groups, earnings/deductions, statutory, tax, loans, 13th month, retro, off-cycle, payslips, explain-trace, generic bank CSV | M3 | Core differentiator |
| Statutory | SSS/PhilHealth/Pag-IBIG remittance files, BIR 1601-C/1604-C/alphalist/2316 | M4 | |
| Finance | Bank-specific files, GL export, cost allocation | M4 | |
| Reporting | Standard reports, saved filters, exports, scheduled delivery | M4 | |
| ESS/MSS | Profile updates, manager dashboard, announcements, DSR (full PWA experience) | M5 | PWA |
| Workflow | Configurable multi-step approvals, delegation, escalation | M5 | Cut 2: generalises the M2 engine |
| Lifecycle | Onboarding, offboarding, final pay, separation pay, e-sign | M6 | |
| ATS | Requisitions, candidates, offers | M7 (post-GA) | Lite |
| Performance | Goals, reviews | M7 (post-GA) | |
| Learning | Trainings, certifications | M7 (post-GA) | |
| Benefits | Enrollment | M7 (post-GA) | |
| Privacy console | Data inventory, consent log, DSR queue, retention jobs, breach register | M1→M5 | Incremental; breach register and retention required before private beta |
| Integrations | Webhooks, REST API, SSO (OIDC/SAML) | M5 | |
| AI assist | Policy Q&A (RAG), payroll anomaly explanations, resume parsing | Post-GA | Assistive only (ADR-009) |

## Differentiators
1. Explainable payroll (every number has a trace).
2. Effectivity-dated statutory rules with citations.
3. Privacy console built in, not bolted on.
4. Operable by a tiny HR team.

## Explicitly out of scope
See [vision](../00-overview/vision.md) non-goals.
