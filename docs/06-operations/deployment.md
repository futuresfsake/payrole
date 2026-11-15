# Deployment

## Environments
| Env | Purpose | Data | Deploy trigger |
|---|---|---|---|
| local | Dev | Synthetic seed | manual |
| dev/preview | PR previews (optional) | Synthetic | PR |
| staging | Prod-like validation, DAST, e2e | Synthetic | merge to `staging` |
| prod | Customers | Real | tagged release from `main`, manual approval |

Branch ↔ env flow in [branching](../07-process/branching.md).

## Topology (initial)
- 2× app containers (stateless) behind load balancer + WAF/CDN
- 1–2× worker containers
- Managed PostgreSQL (HA, PITR) in SEA region (OD-03)
- Managed Redis
- Object storage (versioned, SSE-KMS, separate buckets for documents, exports, backups; public access blocked)
- KMS, secret manager, DNS, TLS certs (auto-renew)

## Release process
1. Merge to `main` → pipeline builds image, runs gates, produces SBOM, signs image.
2. Deploy to staging automatically; smoke + e2e.
3. Tag release `vX.Y.Z`; manual approval gate (owner).
4. Migration step first (expand-only, backward compatible), then rolling app deploy, then workers.
5. Post-deploy smoke test and synthetic checks; auto-rollback on failing health checks.
6. Contract phase of migrations ships in a later release.

## Change freeze
No production deploys within 24 h before/after payroll cut-off and pay dates (tenant-calendar aware) except hotfix S1 with explicit approval.

## Rollback
Application: redeploy previous signed image (≤ 15 min). Data: forward-fix preferred; PITR as last resort with customer comms. Rule-set data releases are versioned and can be superseded by a corrected version.

## Configuration and secrets
Env config validated at boot; secrets from secret manager; per-environment isolation (separate accounts/projects). Rotation runbook for DB, API keys, signing keys.

## Infrastructure as code
All infra in `/infra` (OpenTofu). Plan reviewed in PR; policy-as-code blocks public buckets, unencrypted volumes, open security groups. Drift detection weekly.

## Capacity and cost
Autoscale app on CPU/latency; worker scale on queue depth. Budget alerts at 50/80/100%. Per-tenant usage metering (storage, emails, SMS).

## Go-live checklist (per customer)
- [ ] Tenant created, legal IDs validated
- [ ] SSO/MFA configured
- [ ] Data imported and validated (US-103)
- [ ] Rule sets and holiday calendar verified for the year
- [ ] Parallel run signed off
- [ ] Privacy notice delivered, DPA signed
- [ ] Support contacts and escalation path shared
