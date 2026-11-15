# ADR-011: Host on AWS Singapore (ap-southeast-1) with managed services

**Status:** Accepted · **Date:** 2026-11-15 · **Closes:** OD-03

## Context
The product is a multi-tenant SaaS for Philippine employers, run by one person. It stores salary, government IDs and bank data (SPI under RA 10173). We need managed, encrypted, recoverable infrastructure with low operational load (RPO ≤ 15 min, RTO ≤ 4 h, NFR-06) and acceptable latency from the Philippines. Hosting inside the Philippines was considered, but a hyperscaler region in the country is not something to assume; **VERIFY** at each yearly review whether one exists.

## Decision
Run production, staging and dev in **AWS ap-southeast-1 (Singapore)**, in separate accounts per environment under one organisation.

| Concern | Choice |
|---|---|
| App and workers | ECS on Fargate (stateless containers, no cluster to patch) |
| Database | RDS for PostgreSQL, Multi-AZ from private beta, PITR enabled, encrypted with KMS |
| Queue/cache | ElastiCache for Redis (BullMQ, rate limits) |
| Files | S3 with SSE-KMS, versioning, public access blocked, separate buckets for documents, exports, backups |
| Keys | KMS with per-tenant DEKs under a KEK (ADR-007) |
| Secrets | AWS Secrets Manager |
| Edge | CloudFront + WAF in front of the load balancer |
| Email | SES in the same region, with DKIM/SPF/DMARC |
| IaC | OpenTofu, applied from CI only (ADR-002) |
| Backups | Cross-region copy to ap-southeast-2 for DR; restore tested quarterly (NFR-07) |

Cross-border transfer is handled in the privacy notice and the customer DPA (see [data-protection](../../04-security/data-protection.md)). Sub-processors are listed publicly and changes are notified.

Cost control: dev and staging scale to zero outside working hours; production starts single-AZ for Alpha only, Multi-AZ before any real employee data (private beta).

## Consequences
+ Mature managed Postgres, KMS and PITR give the recoverability the NFRs need with one operator.
+ Singapore latency to Manila is acceptable for the NFR-01 targets (to be measured in M0).
− Data leaves the Philippines. Mitigated by contract, encryption with keys we control, and disclosure.
− AWS-specific services behind IaC. Exit path: the app only uses Postgres, Redis, S3-API and SMTP/HTTP email, so a move to another provider is a re-deploy, not a rewrite (RISK-08).
− Fargate costs more than a VPS at small scale. Accepted for lower patching burden.

## Alternatives
- **Azure Southeast Asia / GCP Singapore:** equivalent; chosen AWS for the owner's CI/CD and IaC familiarity and for SES/KMS fit.
- **PaaS (Render/Fly):** fastest to start and good for prototypes, but weaker controls for audit, private networking and key management expected by customers' security reviews.
- **Local colo/VPS in the Philippines:** residency benefit, but the owner would carry HA, patching and DR alone. Rejected for v1.
- **Kubernetes:** overkill for 2 services and 1–2 workers (ADR-001).

## Review triggers
A Philippine region becomes available; a customer requires in-country residency (then offer a dedicated deployment, ADR-004); NPC guidance on cross-border transfer changes.
