# ADR-007: Envelope field-level encryption with blind indexes

**Status:** Accepted · **Date:** 2026-11-15

## Context
Government IDs, bank accounts, salary are high-impact data. Disk-level encryption doesn't protect against SQL injection, over-broad DB access, or backups leaking.

## Decision
AES-256-GCM per field with a per-tenant DEK wrapped by a KMS KEK. Exact-match search by HMAC blind index. Masked by default in API serializers. Rotation: KEK annually, DEK on demand; lazy re-encrypt. Decryption only inside the service layer after authorization.

## Consequences
+ Database dump alone is not enough to read SPI.
− No range/LIKE queries on encrypted fields (salary analytics computed in app layer or from permitted decrypted aggregates inside payroll/reporting jobs).
− Key management complexity; mitigated by managed KMS and documented rotation runbook.
