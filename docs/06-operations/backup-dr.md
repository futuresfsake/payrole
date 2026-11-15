# Backup and Disaster Recovery

## Targets
RPO ≤ 15 min, RTO ≤ 4 h (NFR-06).

## Backup strategy
| Asset | Method | Frequency | Retention | Storage |
|---|---|---|---|---|
| PostgreSQL | Managed PITR (WAL) + daily snapshot | Continuous / daily | 35 d | Separate region/account, encrypted |
| Object storage (documents, exports) | Versioning + cross-region replication | Continuous | Versions 90 d; legal hold aware | Object lock for audit anchors |
| Audit chain heads | Daily anchor | Daily | 10 y | Object-lock bucket |
| Config/IaC | Git | Per change | Forever | Remote |
| Secrets/KMS | Provider-managed with key backup policy | | | Split custody for break-glass |

Backups are immutable (object lock) and stored under credentials that production workloads cannot delete (ransomware resistance, T-14).

## Restore testing
Quarterly: restore latest snapshot to isolated environment, verify row counts, RLS, audit chain, decrypt sample fields with KMS, run smoke e2e, record time achieved vs RTO.

## DR scenarios
| Scenario | Strategy |
|---|---|
| App host failure | Auto-replace containers |
| DB primary failure | Managed HA failover (< 5 min) |
| Region outage | Restore to secondary region from replicated backups + IaC (RTO 4 h); communicate |
| Data corruption/bad migration | PITR to timestamp into new instance, reconcile, cut over |
| Accidental tenant data deletion | Tenant-scoped restore from PITR into staging, export/replay |
| Key compromise | Rotate KEK/DEK, re-encrypt, revoke sessions |
| Vendor (IdP) outage | Break-glass admin path; cached session grace; status communications |

## Right-to-erasure vs backups
Erasures are applied to live data immediately; backups age out within retention window; restore procedure re-applies the erasure ledger after any restore. Disclosed in privacy notice.

## Drill record template
Date · scenario · participants · RPO/RTO achieved · issues · fixes · sign-off.
