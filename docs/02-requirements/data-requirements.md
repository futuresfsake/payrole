# Data Requirements

## Classification
| Class | Examples | Controls |
|---|---|---|
| **Public** | Product docs | None |
| **Internal** | Org chart, job titles | Auth required |
| **Personal (PI)** | Name, email, phone, address, birth date, photo | RBAC, TLS, at-rest |
| **Sensitive Personal (SPI)** | Government IDs (TIN, SSS, PhilHealth, Pag-IBIG), health/medical certs, marital status, disciplinary/legal proceedings, age/birth date (DPA lists age as SPI) | Field-level encryption, masked, reason-logged reads, restricted roles |
| **Financial-confidential** | Salary, bank accounts, loans, payslips | Field-level encryption, strict RBAC, export controls |
| **Secrets** | Keys, tokens | KMS/secret manager only |

## Core entities
| Entity | Key attributes | Notes |
|---|---|---|
| Tenant | id, legal_name, tin, employer numbers, settings | RLS root |
| User | id, tenant_id, employee_id?, email, mfa, status | |
| Role / Permission / Assignment | scope | |
| OrgUnit | type, parent, valid_from/to | effective-dated |
| Position, JobGrade | band min/max | |
| Employee | id, number, names, DOB, gender, civil status, contact | PI/SPI split table |
| EmployeeIdentifier | type(TIN/SSS/…), value_enc, hash | blind index for lookup |
| Employment | employee_id, status, hire_date, regularization, separation, position, org, manager, valid_from/to | effective-dated |
| Compensation | base_rate, rate_type, factor, allowances, valid_from/to | encrypted |
| BankAccount | bank, account_enc | |
| Dependent | relation, DOB, tax flags | |
| Document | category, storage_key, checksum, expiry, visibility | |
| Schedule, ScheduleAssignment | pattern, grace, break | |
| HolidayCalendar, Holiday | type, date, citation | |
| TimeLog (raw) | employee, ts, source, device | immutable |
| AttendanceDay | computed minutes by category, flags, status | recomputable |
| LeaveType, LeavePolicy, LeaveBalance, LeaveLedger, LeaveRequest | | ledger = append-only |
| OvertimeRequest, TimeCorrection | | |
| PayGroup, PayPeriod | | |
| EarningCode, DeductionCode | taxability flags | |
| PayrollRun | type, status, snapshot hash | |
| PayrollResult | per employee lines, trace JSON | immutable after finalize |
| PayrollLine | code, amount, qty, rate, source | |
| Loan, LoanSchedule, LoanPayment | | |
| RuleSet, RuleSetVersion | agency, type, effective_from/to, data JSON, citation | ADR-005 |
| WorkflowDefinition, WorkflowInstance, Task | | |
| Notification, Preference | | |
| DSR (data subject request) | type, status, due | |
| BreachIncident | | |
| AuditLog | actor, action, entity, before/after (redacted), reason, hash chain | append-only |
| Candidate, Requisition, Offer | | M6 |
| Goal, Review, Training, Enrollment, Benefit | | M7 |

## Data quality rules
- Required: employee number unique per tenant; hire date ≤ today + 90d; TIN/SSS formats valid (checksum where defined).
- Names normalized (NFC), supports Ñ and diacritics.
- Phone in E.164; addresses structured (region/province/city/barangay) using PSGC codes (**VERIFY** current PSGC source).
- No duplicate employee by (normalized name + DOB) without override reason.

## Retention (DRAFT. Needs counsel, GAP-03)
| Record | Draft retention | Basis |
|---|---|---|
| Payroll records | ≥ 3 years DOLE; tax records up to 10 years (BIR). **Use 10 years** | Labor Code Art. 128 / NIRC / RR 17-2013 **VERIFY** |
| 201 file after separation | 5 years then anonymize | Prescription periods for money claims (3 yrs) / illegal dismissal (4 yrs) **VERIFY** |
| Applicants (not hired) | 12 months, consent to extend | Data minimization |
| Time logs raw | 3 years | |
| Audit log | 10 years | |
| Medical documents | Delete after purpose served + 1 yr | Minimization |
| Biometric templates | Not stored (ADR-010) | |
