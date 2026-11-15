# Feature Catalog

| Module | Feature | Release | Notes |
|---|---|---|---|
| Platform | Multi-tenant, RBAC, MFA/passkeys, audit log, feature flags | M0 | |
| Core HR | Org chart, positions, employee master, effective-dated history, 201 vault, CoE | M1 | |
| Core HR | CSV import/export with validation | M1 | |
| Time | Schedules, holiday calendar, DTR ingest, computation, corrections | M2 | |
| Leave | Types, accrual, requests, balances, calendar | M2 | |
| Payroll | Multiple pay groups, earnings/deductions, statutory, tax, loans, 13th month, retro, off-cycle, payslips, explain-trace | M3 | Core differentiator |
| Statutory | SSS/PhilHealth/Pag-IBIG remittance files, BIR 1601-C/1604-C/alphalist/2316 | M4 | |
| Finance | Bank files, GL export, cost allocation | M4 | |
| Reporting | Standard reports, saved filters, exports, scheduled delivery | M4 | |
| ESS/MSS | Profile, payslips, leave, OT, approvals, announcements, DSR | M5 | PWA |
| Workflow | Configurable approvals, delegation, escalation | M5 | |
| Lifecycle | Onboarding, offboarding, final pay, e-sign | M6 | |
| ATS | Requisitions, candidates, offers | M6 | Lite |
| Performance | Goals, reviews | M7 | |
| Learning | Trainings, certifications | M7 | |
| Benefits | Enrollment | M7 | |
| Privacy console | Data inventory, consent log, DSR queue, retention jobs, breach register | M1→M5 | Incremental |
| Integrations | Webhooks, REST API, SSO (OIDC/SAML) | M5 | |
| AI assist | Policy Q&A (RAG), payroll anomaly explanations, resume parsing | M6+ | Assistive only (ADR-009) |

## Differentiators
1. Explainable payroll (every number has a trace).
2. Effectivity-dated statutory rules with citations.
3. Privacy console built in, not bolted on.
4. Operable by a tiny HR team.

## Explicitly out of scope
See [vision](../00-overview/vision.md) non-goals.
