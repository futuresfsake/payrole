# Epics and User Stories

Format: **US-ID** *As a [persona], I want [capability], so that [value].* Priority MoSCoW. AC = acceptance criteria (Given/When/Then abbreviated). Linked FRs in [traceability-matrix](../02-requirements/traceability-matrix.md).

## EP-00 Platform (M0)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-001 | As a system admin, I want to sign in with MFA so that accounts resist credential theft | M | TOTP or passkey enforced for admin/HR/payroll roles; lockout after 5 failed attempts; sessions expire (idle 30 min, absolute 12 h) |
| US-002 | As a platform operator, I want tenant isolation so that no customer sees another's data | M | RLS enforced; cross-tenant query test returns 0 rows; tenant context set per request |
| US-003 | As a DPO, I want an append-only audit log so that I can prove who changed what | M | Insert-only table; entries for create/update/delete/read of sensitive fields; tamper-evident hash chain |
| US-004 | As an engineer, I want the CI pipeline with quality gates so that unsafe code can't merge | M | Lint, typecheck, unit, SAST, secret scan, dependency audit required |
| US-005 | As an engineer, I want IaC and environments (dev/staging/prod) | M | Reproducible deploy from main; staging mirrors prod |
| US-006 | As a user, I want a consistent accessible UI shell | M | WCAG 2.2 AA checks in CI (axe); keyboard navigable |
| US-007 | As an admin, I want role-based access control with custom roles | M | Permission matrix per [rbac-matrix](../02-requirements/rbac-matrix.md); deny by default |
| US-008 | As an operator, I want structured logging and error tracking without PII | S | Log scrubber test; correlation IDs |
| US-009 | As an admin, I want a tenant onboarding wizard (company, tax IDs, pay frequency) | M | Required statutory IDs validated by format |
| US-010 | As an engineer, I want a feature-flag mechanism | S | Per-tenant flags |

## EP-01 Core HR (M1)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-101 | As HR, I create the org structure (company, branch, department, cost center) | M | Hierarchy, effective dating |
| US-102 | As HR, I define positions, job grades, pay grades | M | Salary band validation |
| US-103 | As HR, I bulk import employees from CSV with a validation report | M | Row-level errors, dry run, rollback |
| US-104 | As HR, I maintain an employee master (personal, contact, employment, government IDs) | M | Field-level encryption for TIN/SSS/PhilHealth/Pag-IBIG/bank; format validation |
| US-105 | As HR, I see effective-dated history of employment changes (promotion, transfer, pay change) | M | Point-in-time query; no overwrites |
| US-106 | As HR, I upload documents to a 201 vault with categories and expiry | M | Virus scan; type/size limits; access by role |
| US-107 | As HR, I track dependents and beneficiaries | S | Needed for tax/benefit flags |
| US-108 | As HR, I record employment status (probationary, regular, project, contractual, part-time) and dates | M | Probation end alert (6 months, **VERIFY** rule) |
| US-109 | As HR, I search/filter employees quickly | M | p95 < 300 ms at 500 employees |
| US-110 | As HR, I record disciplinary actions and memos with confidentiality | S | Restricted visibility |
| US-111 | As a DPO, I mark data fields with classification and purpose | S | Data inventory export |
| US-112 | As HR, I issue CoE from template | S | PDF with e-sign stamp |

## EP-02 Time & Leave (M2)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-201 | As HR, I define work schedules (fixed, flexible, shift, compressed) | M | Break rules, grace periods |
| US-202 | As payroll, I maintain the holiday calendar by year/location with type (regular/special/local) | M | Source proclamation cited |
| US-203 | As payroll, I ingest time-clock logs via CSV and device push | M | Idempotent; duplicate suppression; raw logs retained |
| US-204 | As the system, I compute daily attendance: late, undertime, absent, rest day, OT, NSD | M | Matches BR-TIME rules; explainable |
| US-205 | As an employee, I file OT, and my manager approves it | M | Pre-approval required by policy flag |
| US-206 | As an employee, I file time correction (missed punch) | M | Reason + attachment; approval |
| US-207 | As HR, I configure leave types (VL, SL, SIL, maternity, paternity, solo parent, VAWC, special women, bereavement, custom) | M | Statutory minimums enforced |
| US-208 | As the system, I accrue and expire leave per policy, with carry-over and cash conversion | M | Monthly/annual accrual engine; audit trail |
| US-209 | As an employee, I request leave and see balance | M | Overlap checks; half-day; attachments (med cert) |
| US-210 | As a manager, I view team calendar and coverage | S | Conflict warnings |
| US-211 | As payroll, I lock a period's attendance | M | Locked data immutable except via logged unlock |
| US-212 | As HR, I declare a work-suspension event (typhoon) | S | Pay treatment rule (GAP-17) |

## EP-03 Payroll (M3)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-301 | As payroll, I define pay groups, frequencies, cut-offs, pay dates | M | Semi-monthly, monthly, weekly |
| US-302 | As payroll, I define earning and deduction types (taxable/non-taxable flags) | M | Per-code statutory treatment |
| US-303 | As the system, I compute gross pay from salary, attendance, OT, premiums | M | Decimal math; BR-PAY-* rules |
| US-304 | As the system, I compute SSS, PhilHealth, Pag-IBIG (employee+employer) from effectivity-dated tables | M | Golden tests; VERIFY tables |
| US-305 | As the system, I compute withholding tax (annualized method, TRAIN schedule) | M | Year-end adjustment |
| US-306 | As payroll, I manage loans (SSS, Pag-IBIG, company, cash advance) with amortization | M | Deduction priority order |
| US-307 | As payroll, I run a payroll in draft, review exceptions, and approve | M | Variance vs previous period; anomaly flags |
| US-308 | As payroll, I lock and finalize payroll; finalization is immutable | M | Corrections via adjustment in next run |
| US-309 | As payroll, I compute 13th month pay (pro-rated) and other benefits | M | BR-13M rules |
| US-310 | As an employee, I view and download my payslip | M | Itemized, explainable |
| US-311 | As payroll, I handle retro pay and back pay adjustments | M | Re-computation of deltas |
| US-312 | As payroll, I handle off-cycle runs (bonus, final pay) | M | Separate run type |
| US-313 | As payroll, I perform tax year-end true-up and refunds | M | Annualization |
| US-314 | As the system, I show "why this number" breakdown | M | Step-level trace |
| US-315 | As Finance, I approve payroll with separation of duties | M | Preparer ≠ approver |

## EP-04 Statutory & Reporting (M4)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-401 | Generate monthly remittance reports for SSS, PhilHealth, Pag-IBIG | M | Format per agency (GAP-08) |
| US-402 | Generate BIR 1601-C data and the 1604-C/alphalist data file | M | Validates against BIR tool |
| US-403 | Generate and distribute 2316 | M | PDF per employee, secured delivery |
| US-404 | Generate bank payment files | M | Template per bank (GAP-07) |
| US-405 | GL journal export | S | Configurable account mapping |
| US-406 | Payroll register, variance, headcount, turnover, absenteeism reports | M | Export CSV/PDF |
| US-407 | DOLE 13th-month compliance report | S | Per DOLE format **VERIFY** |
| US-408 | Remittance calendar with reminders | S | Due-date rules |
| US-409 | Auditor read-only export package | S | Time-boxed access |

## EP-05 Self-Service & Workflow (M5)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-501 | Configurable approval workflows (multi-step, delegate, escalate) | M | Timeouts, substitutes |
| US-502 | ESS profile update requests with HR approval | M | Sensitive-field change approval |
| US-503 | Notifications (email, push, in-app, SMS optional) | M | Preferences, quiet hours |
| US-504 | PWA install, offline-tolerant forms | S | Queue submit when online |
| US-505 | Mobile punch with geofence + selfie option | C | Privacy review GAP-14 |
| US-506 | Manager dashboard: pending approvals, team status | M | |
| US-507 | Employee document requests (CoE, payslip copy) | S | |
| US-508 | Announcements and policy acknowledgments | S | Ack tracking |
| US-509 | Data-subject requests (access, correction, erasure) portal | M | SLA clock |

## EP-06 Lifecycle & ATS (M6)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-601 | Onboarding checklist and task assignment | M | Templates per role |
| US-602 | E-signature on contracts and policies | S | RA 8792 considerations |
| US-603 | Offboarding workflow, clearance, asset return | M | |
| US-604 | Final pay computation (prorated salary, 13th month, leave conversion, tax, separation pay where applicable) | M | BR-OFF matrix |
| US-605 | Job requisitions and approval | S | |
| US-606 | Candidate pipeline and interview scheduling | S | Applicant data retention |
| US-607 | Offer letter generation → hire handoff to Core HR | S | |
| US-608 | Exit interview and analytics | C | |

## EP-07 Performance, Learning, Benefits (M7)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-701 | Goal/OKR setting and tracking | S | |
| US-702 | Review cycles (self, manager, calibration) | S | |
| US-703 | Training catalog, enrollment, completion, certificates | S | Expiring certs (e.g., OSH) |
| US-704 | Benefits enrollment (HMO, allowances) | C | |
| US-705 | Filipino language option | C | |
| US-706 | Org analytics dashboards | S | |

## EP-08 Hardening (M8)
| ID | Story | P | Key AC |
|---|---|---|---|
| US-801 | Third-party penetration test and remediation | M | |
| US-802 | Load and soak testing | M | Targets per NFR |
| US-803 | DR drill | M | RTO/RPO met |
| US-804 | WCAG audit | M | |
| US-805 | Privacy impact assessment and DPO sign-off | M | |
| US-806 | Customer documentation, in-app help | S | |
| US-807 | Data migration toolkit & runbook | S | |
| US-808 | GA readiness checklist | M | |

MoSCoW: M = Must, S = Should, C = Could.
