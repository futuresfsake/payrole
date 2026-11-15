# Audit Logging

## Two kinds of logs
| | Audit log | Operational log |
|---|---|---|
| Purpose | Accountability: who did what to which record | Debugging, performance |
| Store | Postgres `audit_log` (append-only, hash-chained) + external anchor | Log pipeline (Loki/hosted) |
| Retention | 10 years (draft, GAP-03) | 30–90 days |
| Content | Actor, action, entity, redacted before/after, reason | Events, timings, errors; **no PII/SPI** |
| Access | DPO, Auditor, Sys Admin (read) | Engineers |

## Events (minimum)
Auth: login success/failure, MFA enrol/reset, session revoke, step-up. 
Authz: permission denied (rate-limited), role changes, delegation. 
Data: create/update/delete for employee, employment, compensation, bank, identifiers, documents, leave, time corrections, loans, rule sets, workflows. 
Sensitive reads: identifier reveal, salary view by non-self, document download, bulk exports (with reason). 
Payroll: run create/compute/submit/approve/finalize/reverse, unlock attendance. 
Privacy: DSR actions, retention jobs, consent changes, breach register. 
Admin: tenant settings, integrations, webhook secrets rotation, break-glass.

## Record shape
See LLD §6. Redaction: store changed field names and hashed/encrypted values; for non-sensitive fields store before/after values.

## Integrity
Hash chain per tenant; nightly verification; head hash anchored daily to object-lock storage; verification failure pages the owner (SEV-1).

## Review
Weekly automated report: privileged actions, off-hours access, mass reads, failed auth spikes, rule-set changes. Monthly manual review by owner/DPO. Alerts: see [monitoring](../06-operations/monitoring.md).

## Customer access
Tenant admins and auditors view/export their tenant's audit log (time-boxed auditor accounts). Platform operators cannot read tenant audit content, only chain health.
