# TDD-dsr: Data subject requests, retention, breach register

| | |
|---|---|
| Story/FR | US-509, US-805 / FR-505, FR-701, FR-702, FR-703 |
| Status | Draft |
| ADRs | 007, 010 |

## 1. Problem and scope
Support employees' privacy rights under RA 10173, automate retention, and track breaches. The employer is the controller; the product gives them the tooling and an audit trail.

## 2. Design

### 2.1 DSR intake and queue
`dsr(id, tenant_id, subject_employee_id, type access|correction|erasure|objection|portability|blocking, status, received_at, due_at, verified_at, assigned_to, outcome, outcome_reason, closed_at)`.
Employee submits via ESS (authenticated, so identity already verified; ex-employees via verified email link + HR verification). Due date default = received + 15 days (configurable; VERIFY legal timeline). SLA timer with reminders at 50%/80%/due.

### 2.2 Fulfilment
| Type | Mechanism |
|---|---|
| Access/portability | **Data collector** walks the data inventory: each module registers a `SubjectDataProvider.export(employeeId)` returning structured records + file references. Output: JSON + CSV + PDF summary in an encrypted ZIP, delivered via signed URL; excludes other persons' data and privileged internal notes (flagged fields) |
| Correction | Creates a profile-change workflow (TDD-workflow); on approval updates via effective-dated correction |
| Erasure / blocking | Evaluator checks legal-retention holds per data class (payroll, tax, labor). Retained data → **restrict processing** flag (blocked from normal access, kept for legal purpose) and written explanation; non-required data (e.g. optional photo, applicant data) anonymised/deleted. Decision recorded by DPO |
| Objection | DPO review; may disable optional processing (consent withdrawn) |

Each module also registers `SubjectDataEraser.anonymize(employeeId, scope)` with a dry-run. Registration is enforced by a CI test: every table with an employee reference must be declared in the inventory as provider/eraser or explicitly exempt with a legal basis.

### 2.3 Retention engine
`retention_policy(data_class, retain_months, basis, action anonymize|delete)` per tenant (defaults from data requirements; customer approves). Nightly job:
1. Select eligible records (separation date + retention elapsed, no legal hold).
2. **Dry run** report to DPO (counts per class); auto-run only after tenant opts in; otherwise manual approval.
3. Execute anonymisation (replace identifiers with irreversible tokens, retain aggregates needed for statutory totals) or deletion; delete files from object storage including versions.
4. Write erasure ledger entry (`entity, id hash, date, basis`) so restores can re-apply (backup-dr).
5. Certificate of disposal available for audits.
Legal hold: `legal_hold(subject, reason, set_by, expires)` suspends actions.

### 2.4 Consent and notices
`consent_log(subject, purpose, notice_version, granted_at, withdrawn_at, channel)`. Optional features check consent at runtime. Privacy notice versions stored; acknowledgment tracked on onboarding.

### 2.5 Breach register
`breach_incident(id, detected_at, reported_at, description, data_classes, subjects_count_est, risk_assessment, serious_harm_likelihood, npc_notified_at, subjects_notified_at, customers_notified_at, containment, root_cause, status)`. Creating an incident starts a 72-hour countdown from detection, tasks assigned from the template (assess → notify → remediate → review), and links to the incident record in operations. Export package for NPC notification content (nature, data involved, measures, contact) generated from fields; notices reviewed by DPO/counsel before sending.

## 3. Security and privacy
DSR exports contain high-sensitivity data: generated on demand, encrypted, link expiry 24 h, one download, audited; delivered only to the verified subject. DPO role separated from HR/payroll. Request content (free text) treated as sensitive.

## 4. Failure modes
Provider module throws → export marked partial with error list, DPO notified; never silently omit. Anonymiser failure mid-run → per-record transaction, resumable. Backup restore → erasure ledger replay verified in DR drill.

## 5. Test plan
Unit: SLA clock, evaluator rules. Integration: full access export contains every inventory-declared source for a seeded employee (completeness test); erasure dry-run vs run equality; retention hold respected; restore replay. E2E: DSR journey from ESS. Security: another employee cannot fetch export; link expiry.

## 6. Rollout
Inventory and providers grow with modules; CI inventory test turns on at M1 so no table escapes.

## 7. Open questions
GAP-03 retention values, GAP-13 NPC specifics, handling DSRs involving data in backups and in third-party processors (IdP, email logs).
