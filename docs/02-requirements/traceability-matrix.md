# Traceability Matrix

Maintained per milestone. Columns: Epic → Story → FR → BR/NFR → Design → Test suite. Tests live under `tests/<module>/` with the FR id in the test name.

| Epic | Story | FR | BR / NFR | Design | Test (planned) |
|---|---|---|---|---|---|
| EP-00 | US-001 | FR-001, FR-002 | NFR-08 | HLD §Auth, ADR-006 | e2e/auth-mfa, sec/lockout |
| EP-00 | US-002 | FR-003 | NFR-09 | ADR-004, LLD §Tenancy | int/rls-isolation (negative) |
| EP-00 | US-003 | FR-004 | NFR-18 | LLD §Audit | int/audit-chain, unit/redaction |
| EP-00 | US-011 | NFR-06, NFR-07 | | HLD §Deployment, backup-dr | ops/restore-drill (timed) |
| EP-00 | US-012 | FR-008 | NFR-15, NFR-26 | HLD §Workers | int/job-idempotency, int/outbox-at-least-once |
| EP-00 | US-013 | FR-009 | | INT-03 | int/email-headers |
| EP-00 | US-007 | FR-005, FR-006 | SoD-1..4 | LLD §AuthZ | unit/policy, int/rbac-matrix |
| EP-01 | US-103 | FR-103 | | TDD-import | int/import-dryrun, property/idempotent |
| EP-01 | US-104 | FR-104..106 | BR-PRIV-1 | LLD §Crypto | unit/format-validators, int/field-encryption |
| EP-01 | US-113 | FR-113, FR-106 | BR-RATE-4 | LLD §Crypto, §Effective dating | int/comp-profile-asof, int/field-encryption |
| EP-01 | US-105 | FR-107 | | LLD §Effective dating | int/as-of-query |
| EP-02 | US-203 | FR-203 | | TDD-time-ingest | int/idempotent-ingest |
| EP-02 | US-204, US-215 | FR-204 | BR-TIME-1..7 | TDD-attendance-engine | golden/attendance-*.yaml |
| EP-02 | US-213 | FR-213 | SoD-2 | TDD-workflow (cut 1) | int/approval-v1, int/self-approval-blocked |
| EP-02 | US-214 | FR-214 | NFR-13 | wireframes 02 | int/portal-own-data-only, e2e/portal-mobile |
| EP-02 | US-207/208/216 | FR-207, FR-208 | BR-LV-1..4 | TDD-leave-ledger | unit/accrual, property/ledger-sum |
| EP-03 | US-316 | FR-317 | BR-STAT, BR-TAX | ADR-005 | int/ruleset-approval, int/run-records-version |
| EP-03 | US-303, US-318 | FR-303 | BR-RATE, BR-TIME, BR-RND | TDD-payroll-engine | golden/gross-*.yaml |
| EP-03 | US-304, US-319, US-320 | FR-304 | BR-STAT-1..5 | TDD-payroll-engine, ADR-005 | golden/sss-*, philhealth-*, pagibig-* |
| EP-03 | US-305 | FR-305 | BR-TAX-1..6 | TDD-payroll-engine | golden/tax-* |
| EP-03 | US-307/308/315 | FR-307..309, FR-316 | BR-RUN-1..4 | TDD-payroll-run-lifecycle | e2e/run-lifecycle, property/determinism |
| EP-03 | US-309 | FR-310 | BR-13M | TDD-payroll-engine | golden/13th-* |
| EP-03 | US-314 | FR-315 | NFR-19 | TDD-payroll-engine | int/trace-completeness |
| EP-03 | US-317 | FR-404 | | TDD-exports | int/bank-csv-totals |
| EP-04 | US-401..404 | FR-401..404 | GAP-07/08 | TDD-exports | contract/agency-validators |
| EP-05 | US-501 | FR-501 | | TDD-workflow | int/workflow-escalation |
| EP-05 | US-509 | FR-505 | NFR-11 | TDD-dsr | e2e/dsr-sla |
| EP-05 | US-510 | FR-701 | BR-PRIV, NFR-11 | TDD-dsr | int/retention-dryrun, int/legal-hold |
| EP-05 | US-511 | FR-702 | NFR-11 | TDD-dsr | e2e/breach-72h-clock |
| EP-05 | US-512 | FR-703 | BR-PRIV | TDD-dsr | int/consent-history |
| EP-06 | US-604, US-609 | FR-602 | BR-OFF | TDD-final-pay | golden/final-pay-* |
| EP-08 | US-805 | (verifies FR-505, FR-701..FR-703) | NFR-11 | | audit/dpa-checklist |
| EP-08 | US-809 | | NFR-22 | | int/tenant-export-reconcile |

Coverage rule: a story cannot be marked Done unless its FR rows have a linked, passing test (see [definition-of-done](../07-process/definition-of-done.md)).
