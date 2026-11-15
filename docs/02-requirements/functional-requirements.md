# Functional Requirements

Priority: M/S/C. Story column links to [epics-and-stories](../01-product/epics-and-stories.md).

## Platform
| ID | Requirement | P | Story |
|---|---|---|---|
| FR-001 | The system shall authenticate users via OIDC with password+MFA or passkey | M | US-001 |
| FR-002 | The system shall require MFA for all roles with access to compensation, government IDs, or admin functions | M | US-001 |
| FR-003 | The system shall restrict every data access to the user's tenant | M | US-002 |
| FR-004 | The system shall record an append-only audit entry for create/update/delete of any HR/payroll entity and for read of sensitive fields | M | US-003 |
| FR-005 | The system shall enforce permissions by role and scope (self, team, department, company) with deny-by-default | M | US-007 |
| FR-006 | The system shall allow admins to define custom roles from granular permissions | S | US-007 |
| FR-007 | The system shall provide tenant setup capturing legal name, TIN, SSS/PhilHealth/Pag-IBIG employer numbers, RDO code, pay frequency | M | US-009 |

## Core HR
| ID | Requirement | P | Story |
|---|---|---|---|
| FR-101 | The system shall maintain a hierarchical organization (company → branch → department → team, plus cost centers) with effective dates | M | US-101 |
| FR-102 | The system shall maintain positions and grades with salary bands | M | US-102 |
| FR-103 | The system shall import employees from CSV, validate each row, and show a downloadable error report before commit | M | US-103 |
| FR-104 | The system shall store employee personal, contact, employment, and government ID data | M | US-104 |
| FR-105 | The system shall validate TIN, SSS, PhilHealth, and Pag-IBIG number formats | M | US-104 |
| FR-106 | The system shall encrypt government IDs, bank account numbers, and salary at the field level | M | US-104 |
| FR-107 | The system shall keep employment changes as effective-dated records and support "as of date" queries | M | US-105 |
| FR-108 | The system shall store documents with category, expiry, and restricted access, and malware-scan uploads | M | US-106 |
| FR-109 | The system shall track employment status and notify HR N days before probation end | M | US-108 |
| FR-110 | The system shall track dependents and beneficiaries | S | US-107 |
| FR-111 | The system shall generate a Certificate of Employment from a template | S | US-112 |
| FR-112 | The system shall maintain a data inventory: field → classification → purpose → retention | S | US-111 |

## Time and Leave
| ID | Requirement | P | Story |
|---|---|---|---|
| FR-201 | The system shall support fixed, flexible, shift-based, and compressed schedules | M | US-201 |
| FR-202 | The system shall maintain a holiday calendar with type (regular, special non-working, special working, local), date, and citation | M | US-202 |
| FR-203 | The system shall ingest time logs from CSV and device push, idempotently, preserving raw logs | M | US-203 |
| FR-204 | The system shall compute daily attendance (worked hours, late, undertime, absent, OT, NSD, rest day, holiday) per BR-TIME | M | US-204 |
| FR-205 | The system shall support OT requests with approval and configurable pre-approval requirement | M | US-205 |
| FR-206 | The system shall support time-correction requests with reason and approval | M | US-206 |
| FR-207 | The system shall support configurable leave types including statutory leaves | M | US-207 |
| FR-208 | The system shall accrue, carry over, expire, and convert leave per policy | M | US-208 |
| FR-209 | The system shall allow leave requests with balance check, half-day, and attachments | M | US-209 |
| FR-210 | The system shall show a team leave calendar | S | US-210 |
| FR-211 | The system shall lock attendance per period; unlocking requires a reason and is audited | M | US-211 |
| FR-212 | The system shall support work-suspension events with a configurable pay treatment | S | US-212 |

## Payroll
| ID | Requirement | P | Story |
|---|---|---|---|
| FR-301 | The system shall support pay groups with frequency, cut-off, and pay dates | M | US-301 |
| FR-302 | The system shall support configurable earning and deduction codes with tax/contribution treatment flags | M | US-302 |
| FR-303 | The system shall compute gross pay from rate, attendance, premiums per BR-PAY | M | US-303 |
| FR-304 | The system shall compute SSS, PhilHealth, Pag-IBIG contributions from effectivity-dated rule sets | M | US-304 |
| FR-305 | The system shall compute withholding tax using the configured method and tax table | M | US-305 |
| FR-306 | The system shall manage loans with schedules, priority, and balance | M | US-306 |
| FR-307 | The system shall support run lifecycle: draft, computed, submitted, approved, finalized, paid, reversed | M | US-307, US-308 |
| FR-308 | The system shall flag exceptions: negative net pay, variance over threshold, missing data, contribution anomalies | M | US-307 |
| FR-309 | The system shall enforce separation of duties between preparer and approver | M | US-315 |
| FR-310 | The system shall compute 13th month pay | M | US-309 |
| FR-311 | The system shall generate payslips and publish them to ESS | M | US-310 |
| FR-312 | The system shall compute retro adjustments and apply deltas | M | US-311 |
| FR-313 | The system shall support off-cycle runs | M | US-312 |
| FR-314 | The system shall perform annualization and year-end true-up | M | US-313 |
| FR-315 | The system shall store a step-by-step calculation trace per employee per run | M | US-314 |
| FR-316 | The system shall make finalized runs immutable; corrections are new adjustments | M | US-308 |

## Statutory and Reporting
| ID | Requirement | P | Story |
|---|---|---|---|
| FR-401 | Generate SSS, PhilHealth, Pag-IBIG remittance files/reports | M | US-401 |
| FR-402 | Generate BIR 1601-C, 1604-C and alphalist data | M | US-402 |
| FR-403 | Generate BIR 2316 per employee | M | US-403 |
| FR-404 | Generate bank payment files | M | US-404 |
| FR-405 | Export GL journals | S | US-405 |
| FR-406 | Provide standard HR and payroll reports with export | M | US-406 |
| FR-407 | Provide remittance deadline calendar and reminders | S | US-408 |

## Self-service and Workflow
| ID | Requirement | P | Story |
|---|---|---|---|
| FR-501 | Configurable multi-step approvals with delegation and escalation | M | US-501 |
| FR-502 | Employees may request changes to their profile; sensitive-field changes require approval | M | US-502 |
| FR-503 | Notifications via email/in-app/push with user preferences | M | US-503 |
| FR-504 | Employees view and download payslips, 2316, and leave balances | M | US-310 |
| FR-505 | Data subject request intake, SLA tracking, and fulfilment | M | US-509 |
| FR-506 | Policy acknowledgment tracking | S | US-508 |

## Lifecycle
| ID | Requirement | P | Story |
|---|---|---|---|
| FR-601 | Onboarding/offboarding checklists | M | US-601, US-603 |
| FR-602 | Final pay computation per BR-OFF | M | US-604 |
| FR-603 | Candidate pipeline and offer-to-hire handoff | S | US-606, US-607 |
| FR-604 | E-signature on documents | S | US-602 |

## Privacy and Admin
| ID | Requirement | P | Story |
|---|---|---|---|
| FR-701 | Retention policy engine with scheduled anonymization/deletion with legal hold | M | US-805 |
| FR-702 | Breach register and 72-hour notification workflow | M | US-805 |
| FR-703 | Consent and notice log for optional processing | S | US-805 |
| FR-704 | Auditor read-only time-boxed access | S | US-409 |
