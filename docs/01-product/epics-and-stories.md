# Epics and User Stories

Format: **US-ID** *As a [persona], I want [capability], so that [value].* Priority MoSCoW (M = Must, S = Should, C = Could). AC = acceptance criteria (Given/When/Then abbreviated). Linked FRs in [traceability-matrix](../02-requirements/traceability-matrix.md).

Rules for this file:
- IDs are never reused or renumbered. A story that moves or is retired keeps its ID in the change log below.
- Every story must meet the Definition of Ready in [definition-of-done](../07-process/definition-of-done.md): testable AC and size ≤ 3 days. Stories marked **(split at refine)** are still too big and get split before they enter a sprint.
- Build order inside a milestone is in [milestones](milestones.md).

## EP-00 Platform (M0)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-001 | As a system admin, I want to sign in with MFA so that accounts resist credential theft | M | TOTP or passkey enforced for admin/HR/payroll roles; lockout after 5 failed attempts; sessions expire (idle 30 min, absolute 12 h) |
| US-002 | As a platform operator, I want tenant isolation so that no customer sees another's data | M | RLS enforced; cross-tenant query test returns 0 rows; tenant context set per request |
| US-003 | As a DPO, I want an append-only audit log so that I can prove who changed what | M | Insert-only table; entries for create/update/delete/read of sensitive fields; tamper-evident hash chain |
| US-004 | As an engineer, I want the CI pipeline with quality gates so that unsafe code can't merge | M | Lint, typecheck, unit, SAST, secret scan, dependency audit required; a deliberately failing PR is blocked |
| US-005 | As an engineer, I want IaC and environments (dev/staging/prod) | M | Reproducible deploy from main; staging mirrors prod; migrations run in pipeline |
| US-006 | As a user, I want a consistent accessible UI shell | M | WCAG 2.2 AA checks in CI (axe); keyboard navigable; font and palette decision recorded |
| US-007 | As an admin, I want role-based access control with custom roles | M | Permission matrix per [rbac-matrix](../02-requirements/access/rbac-matrix.md); deny by default; matrix test fails on any undeclared permission |
| US-008 | As an operator, I want structured logging and error tracking without PII | S | Log scrubber test; correlation IDs |
| US-009 | As an admin, I want a tenant onboarding wizard (company, tax IDs, pay frequency) | M | Required statutory IDs validated by format |
| US-010 | As an engineer, I want a feature-flag mechanism | S | Per-tenant flags; flag state audited |
| US-011 | As an operator, I want automated backups with point-in-time recovery so that a bad deploy or deletion is recoverable from day one | M | Daily full + WAL (NFR-07); a restore into a scratch DB is performed and timed against RPO/RTO (NFR-06) before M0 exit |
| US-012 | As an engineer, I want a background job queue and transactional outbox so that imports, payroll compute, exports and notifications run reliably | M | Jobs are idempotent, retried with backoff, dead-lettered; outbox delivers events at-least-once; job status visible to the requester |
| US-013 | As a user, I want transactional email (invites, MFA enrolment, password reset) so that account flows work | M | SPF/DKIM/DMARC pass; no PII in subject lines; bounce handling logged |

## EP-01 Core HR (M1)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-101 | As HR, I create the org structure (company, branch, department, cost center) | M | Hierarchy, effective dating; cycle in the tree rejected |
| US-102 | As HR, I define positions, job grades, pay grades | M | Salary band validation; regional minimum wage check against the wage-order table (GAP-04, BR-RATE-4: warn, not block, for exempt categories) when a salary is saved |
| US-103 | As HR, I bulk import employees from CSV with a validation report | M | Row-level errors, dry run, rollback; depends on US-104 and US-113 |
| US-104 | As HR, I maintain an employee master (personal, contact, employment, government IDs) | M | Field-level encryption for TIN/SSS/PhilHealth/Pag-IBIG/bank; format validation |
| US-105 | As HR, I see effective-dated history of employment changes (promotion, transfer, pay change) | M | Point-in-time query; no overwrites |
| US-106 | As HR, I upload documents to a 201 vault with categories and expiry | M | Virus scan; type/size limits; access by role |
| US-107 | As HR, I track dependents and beneficiaries | S | Needed for tax/benefit flags |
| US-108 | As HR, I record employment status (probationary, regular, project, contractual, part-time) and dates | M | Probation end alert (6 months, **VERIFY** rule) |
| US-109 | As HR, I search/filter employees quickly | M | p95 < 300 ms at 500 employees |
| US-110 | As HR, I record disciplinary actions and memos with confidentiality | S | Restricted visibility |
| US-111 | As a DPO, I mark data fields with classification and purpose | S | Data inventory export |
| US-112 | As HR, I issue CoE from template | S | PDF with e-sign stamp |
| US-113 | As payroll, I set up each employee's compensation and payroll profile (basic pay, pay basis, pay group, tax status, bank account, statutory enrolment flags, previous-employer income) so that payroll has a single source of pay inputs | M | Effective-dated; salary and bank fields encrypted (FR-106); change requires reason and is audited; every payroll input read by US-303…US-305 comes from this record |

## EP-02 Time & Leave (M2)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-201 | As HR, I define work schedules (fixed, flexible, shift, compressed) | M | Break rules, grace periods |
| US-202 | As payroll, I maintain the holiday calendar by year/location with type (regular/special/local) | M | Source proclamation cited |
| US-203 | As payroll, I ingest time-clock logs via CSV and device push | M | Idempotent; duplicate suppression; raw logs retained |
| US-204 | As the system, I compute daily attendance: worked hours, late, undertime, absent | M | Golden cases per BR-TIME-2, BR-TIME-3, BR-TIME-6; each figure carries an explanation string. OT, NSD, rest day and holiday are US-215 |
| US-205 | As an employee, I file OT, and my manager approves it | M | Pre-approval required by policy flag; runs on the US-213 approval service |
| US-206 | As an employee, I file time correction (missed punch) | M | Reason + attachment; approval via US-213 |
| US-207 | As HR, I configure leave types (VL, SL, SIL, maternity, paternity, solo parent, VAWC, special women, bereavement, custom) | M | Statutory minimums enforced |
| US-208 | As the system, I accrue and expire leave per policy | M | Monthly/annual accrual engine; ledger sums to balance (property test); audit trail. Carry-over and cash conversion are US-216 |
| US-209 | As an employee, I request leave and see balance | M | Overlap checks; half-day; attachments (med cert); approval via US-213 |
| US-210 | As a manager, I view team calendar and coverage | S | Conflict warnings |
| US-211 | As payroll, I lock a period's attendance | M | Locked data immutable except via logged unlock |
| US-212 | As HR, I declare a work-suspension event (typhoon) | S | Pay treatment rule (GAP-17) |
| US-213 | As an employee or manager, I want a basic approval service (one or two steps, manager and HR-role resolvers, in-app notification) so that OT, correction and leave requests work in M2 | M | Requester cannot approve own request (SoD-2); decisions are atomic (second decider gets 409); in-app notification on submit/decide. M5 US-501 generalises this engine, it does not replace it |
| US-214 | As an employee, I want a minimal portal (my attendance, my leave, my requests, my payslip placeholder) so that I can use the features M2 builds | M | Employees see only their own data (RBAC test); usable at 360 px; shell reused by US-310 and M5 ESS stories |
| US-215 | As the system, I classify attendance hours into OT, night shift differential, rest day and holiday buckets | M | Golden cases per BR-TIME-1, BR-TIME-4, BR-TIME-5, BR-TIME-7 and the BR-TIME premium table; holiday type from US-202; unapproved OT excluded when the pre-approval flag is on |
| US-216 | As the system, I carry over, forfeit and cash-convert leave at year end per policy | M | Conversion amount feeds payroll as an earning; unit tests for each policy combination |

## EP-03 Payroll (M3)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-316 | As payroll, I manage versioned, effectivity-dated rule sets (contribution tables, tax table, minimum wage, de minimis caps) with a source citation and second-person approval | M | Rule set cannot go live without citation and approver ≠ author; run records the rule-set version used (ADR-005). **Build first in M3** |
| US-301 | As payroll, I define pay groups, frequencies, cut-offs, pay dates | M | Semi-monthly, monthly, weekly |
| US-302 | As payroll, I define earning and deduction types (taxable/non-taxable flags) | M | Per-code statutory treatment |
| US-303 | As the system, I compute basic pay from the compensation profile, attendance and proration | M | Decimal math; BR-RATE and BR-RND golden cases; mid-period hires and separations prorated. Premiums are US-318 |
| US-318 | As the system, I compute OT, night differential, rest-day and holiday premiums | M | Golden cases for every row of the BR-TIME multiplier table; consumes US-215 buckets |
| US-304 | As the system, I compute SSS (employee, employer, EC) from effectivity-dated tables | M | Golden tests; table values **VERIFY** (GAP-01) |
| US-319 | As the system, I compute PhilHealth (employee, employer) from effectivity-dated rules | M | Floor/ceiling and split per rule set; golden tests; **VERIFY** |
| US-320 | As the system, I compute Pag-IBIG (employee, employer) from effectivity-dated rules | M | Cap per rule set; golden tests; **VERIFY** |
| US-305 | As the system, I compute withholding tax (annualized method, TRAIN schedule) | M | Previous-employer income and MWE exemption honoured; golden tests per BR-TAX; year-end adjustment is US-313 |
| US-306 | As payroll, I manage loans (SSS, Pag-IBIG, company, cash advance) with amortization | M | Deduction priority order; deduction never drives net pay below the configured floor |
| US-307 | As payroll, I run a payroll in draft, review exceptions, and approve | M | Variance vs previous period; anomaly flags; compute job via US-012; 500 employees < 2 min (NFR-02) **(split at refine: run/compute vs exception review)** |
| US-308 | As payroll, I lock and finalize payroll; finalization is immutable | M | Corrections via adjustment in next run; UPDATE on finalized rows rejected |
| US-309 | As payroll, I compute 13th month pay (pro-rated) and other benefits | M | BR-13M rules |
| US-310 | As an employee, I view and download my payslip | M | Itemized, explainable; delivered through the US-214 portal |
| US-311 | As payroll, I handle retro pay and back pay adjustments | M | Re-computation of deltas |
| US-312 | As payroll, I handle off-cycle runs (bonus, special payments) | M | Separate run type. Final-pay rules (separation, clearance) are M6 US-604 and reuse this run type |
| US-313 | As payroll, I perform tax year-end true-up and refunds | M | Annualization |
| US-314 | As the system, I show "why this number" breakdown | M | Step-level trace; every payslip line has a trace row (trace-completeness test) |
| US-315 | As Finance, I approve payroll with separation of duties | M | Preparer ≠ approver, enforced server-side |
| US-317 | As payroll, I export a generic bank payment CSV for a finalized run | M | Checksum and preview before download; totals equal run net pay; bank-specific templates are US-404 (M4) |

## EP-04 Statutory & Reporting (M4)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-401 | Generate monthly remittance reports for SSS, PhilHealth, Pag-IBIG | M | Format per agency (GAP-08); spike first |
| US-402 | Generate BIR 1601-C data and the 1604-C/alphalist data file | M | Validates against BIR tool |
| US-403 | Generate and distribute 2316 | M | PDF per employee, secured delivery |
| US-404 | Generate bank-specific payment files (top 3 banks) | M | Template per bank (GAP-07); builds on US-317 |
| US-405 | GL journal export | S | Configurable account mapping; debits equal credits |
| US-406 | Payroll register, variance, headcount, turnover, absenteeism reports | M | Export CSV/PDF; 10k rows < 30 s or async (NFR-04) |
| US-407 | DOLE 13th-month compliance report | S | Per DOLE format **VERIFY** |
| US-408 | Remittance calendar with reminders | S | Due-date rules |
| US-409 | Auditor read-only export package | S | Time-boxed access; access expires automatically and is audited |

## EP-05 Self-Service, Workflow & Privacy (M5)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-501 | Configurable approval workflows: generalise the US-213 engine to multi-step, conditional steps, delegate, escalate | M | Timeouts, substitutes; in-flight instances keep their definition version |
| US-502 | ESS profile update requests with HR approval | M | Sensitive-field change approval; payroll notified of bank detail change |
| US-503 | Notifications (email, push, in-app, SMS optional) | M | Preferences, quiet hours; no sensitive details in email body |
| US-504 | PWA install, offline-tolerant forms | S | Queue submit when online; no sensitive data cached offline |
| US-505 | Mobile punch with geofence + selfie option | C | Privacy review GAP-14; no biometric templates stored (ADR-010); consent notice shown |
| US-506 | Manager dashboard: pending approvals, team status | M | Shows only direct and indirect reports; load < 1 s at 50 reports |
| US-507 | Employee document requests (CoE, payslip copy) | S | Request routes to HR; fulfilled document delivered in portal; audited |
| US-508 | Announcements and policy acknowledgments | S | Ack tracking; unacknowledged report |
| US-509 | Data-subject requests (access, correction, erasure) portal | M | SLA clock |
| US-510 | As a DPO, I run a retention engine with legal hold so that data is anonymised or deleted on schedule | M | Per record class from [data-protection](../04-security/data-protection.md); legal hold blocks deletion; each run logged; dry-run report before first live run |
| US-511 | As a DPO, I keep a breach register with a 72-hour notification workflow | M | Clock starts at "discovered"; overdue alert; template notices; audit trail. **Required before private beta** |
| US-512 | As a DPO, I keep a consent and notice log for optional processing | S | Versioned notice text; per-subject consent history; withdrawal honoured |

## EP-06 Lifecycle (M6)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-601 | Onboarding checklist and task assignment | M | Templates per role; overdue tasks flagged |
| US-602 | E-signature on contracts and policies | S | RA 8792 considerations; signed copy hash stored |
| US-603 | Offboarding workflow, clearance, asset return | M | Access revoked at effective date; clearance items block final-pay release |
| US-604 | Final pay computation (prorated salary, 13th month, leave conversion, tax, loan offsets) | M | BR-OFF matrix golden cases; reuses off-cycle run (US-312) |
| US-609 | Separation pay and cause-specific rules in final pay | M | Cause-by-cause matrix cited to DOLE guidance (GAP-15); counsel-reviewed before release |

## EP-07 Growth Modules (M7, after GA)
Not required for the first live payroll customers. Sequenced after GA to contain scope (RISK-03).

| ID | Story | P | Key AC |
|---|---|---|---|
| US-701 | Goal/OKR setting and tracking | S | Goals owned by employee, visible to manager; progress history kept |
| US-702 | Review cycles (self, manager, calibration) | S | Cycle states open/closed; ratings hidden until release |
| US-703 | Training catalog, enrollment, completion, certificates | S | Expiring certs (e.g., OSH) alert 30 days ahead |
| US-704 | Benefits enrollment (HMO, allowances) | C | Enrollment window; dependents from US-107 |
| US-705 | Filipino language option | C | All strings externalised (NFR-20); language switch per user |
| US-706 | Org analytics dashboards | S | Headcount, turnover, tenure; aggregates suppressed below 5 people |
| US-707 | Job requisitions and approval (moved from US-605) | S | Uses the approval engine; approved requisition creates an open position |
| US-708 | Candidate pipeline and interview scheduling (moved from US-606) | S | Applicant data retention per US-510 |
| US-709 | Offer letter generation and hire handoff to Core HR (moved from US-607) | S | Accepted offer prefills an employee draft |
| US-710 | Exit interview and analytics (moved from US-608) | C | Responses visible to HR only; reported in aggregate |

## EP-08 Hardening (M8)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-801 | Third-party penetration test and remediation | M | Zero open critical or high findings at exit |
| US-802 | Load and soak testing | M | Targets per NFR-01…NFR-03 at the GAP-18 load profile |
| US-803 | DR drill | M | RTO ≤ 4 h and RPO ≤ 15 min measured (NFR-06) |
| US-804 | WCAG audit | M | Manual audit with assistive tech on core flows (GAP-10); no open A/AA failures |
| US-805 | Privacy impact assessment and DPO sign-off | M | Verifies US-509…US-512 operate end to end; signed checklist per [dpa-compliance](../09-compliance/dpa-compliance.md) |
| US-806 | Customer documentation, in-app help | S | Every Must flow has a help article |
| US-807 | Data migration toolkit & runbook | S | Import templates and rollback tested on a customer-shaped dataset |
| US-808 | GA readiness checklist | M | All GA gate items in [quality-gates](../05-quality/quality-gates.md) signed |
| US-809 | As a tenant admin, I export all my tenant's data in open formats | S | Complete export reconciles to row counts; delivered as an encrypted archive (NFR-22) |

## Change log (2026-11-15 review)
| Change | Reason |
|---|---|
| Added US-011…US-013 | Backups, job queue and email are prerequisites for every later milestone |
| Added US-113 | No story owned payroll's pay inputs |
| Added US-213, US-214 | M2 stories need approvals, notifications and employee login that were scheduled for M5 |
| Added US-215, US-216; narrowed US-204, US-208 | Original stories were larger than 3 days |
| Added US-316 | ADR-005 and RISK-01 require rule sets as managed data; no story existed |
| Added US-317 | OD-06 promises a generic bank CSV in M3 |
| Added US-318…US-320; narrowed US-303, US-304 | Split by rule family so each is testable alone |
| Added US-510…US-512 | FR-701…FR-703 were mapped to a sign-off story (US-805), so nothing built them |
| Added US-609; narrowed US-604 | Separation pay is a separate legal matrix (GAP-15) |
| Moved ATS (US-605…US-608) to EP-07 as US-707…US-710 | Not needed for first live payroll; contains pre-GA scope |
| M7 sequenced after GA | See [milestones](milestones.md) |
| Added US-809 | NFR-22 and RISK-08 exit plan had no story |
| Filled blank or untestable AC | Definition of Ready requires testable AC |
