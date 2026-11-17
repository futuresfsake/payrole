# Security Operations

How security is run day to day once the system is live (and, in staging, from M0). The owner is the security lead and, interim, the DPO (OD-14), so every routine here is sized for one person with a backup. Design-time controls are in [access-control](access-control.md), [authorization](authorization.md) and [secure-sdlc](secure-sdlc.md). Incidents: [incident-response](../06-operations/incident-response.md). Monitoring: [monitoring](../06-operations/monitoring.md).

## 1. Roles and responsibilities
| Duty | Owner | Backup |
|---|---|---|
| Security lead (triage, decisions, reviews) | Project owner | Named contractor (before first paying customer) |
| Interim DPO (privacy requests, breach notice) | Project owner (OD-14) | Outsourced DPO before first paying customer |
| Tenant security contact (access reviews, role approvals) | Each tenant's `tenant_admin` and a second approver | Tenant's `dpo` or owner |
| Platform operator (production access, break-glass requester) | Project owner | none standing; break-glass only |
Conflict note: the owner holds several hats. Approvals that need a second person (break-glass, SoD exceptions for the platform team) use the backup contractor; until one exists, those actions are blocked, not waived.

## 2. Calendar
| Cadence | Activity | Evidence kept |
|---|---|---|
| Daily | Review high-severity alerts and failed-login anomalies; check backup job status; check dependency and secret-scan alerts | alert log |
| Weekly | Review privileged actions (role grants, SoD exceptions, break-glass, bulk exports); triage vulnerability queue; review new third-party dependencies | weekly review note |
| Monthly | **Platform access review** (who can reach production, keys, CI secrets); patch window; verify audit-chain head hash; review top denied authorization reasons | review record |
| Quarterly | **Tenant access review** report to each tenant (every assignment, scope, end date, SoD exception, auditor grant); restore test; secrets and key rotation per §6; tabletop or detection drill | signed report per tenant |
| Twice a year | Incident tabletop (scenarios in incident-response); threat model refresh | tabletop notes |
| Yearly | External penetration test (from GA); DR drill; policy review; ASVS re-check; sub-processor review | test report, DR log |

## 3. Detection use cases
Each has a log source, a rule, a severity and a first response. Logs come from the audit log, application logs, identity provider and cloud trail ([audit-logging](audit-logging.md)).

| ID | What it detects | Rule (starting point) | Sev | First response |
|---|---|---|---|---|
| DET-01 | Privilege grant | any `role_assignment` to a payroll, DPO or admin role | 2 | Confirm second approver; check reason |
| DET-02 | SoD exception created or near expiry | exception created; ≤ 7 days to expiry | 3 | Confirm business need; renew or end |
| DET-03 | Denied SoD attempt | repeated `SOD_*` denials by one actor | 3 | Ask the actor; check for scripted attempts |
| DET-04 | Sensitive reveal pattern | > 20 `employee_identifier:reveal` by one actor in an hour, or after 22:00 Manila time | 2 | Contact actor and tenant admin; suspend if unexplained |
| DET-05 | Bulk export | any export of S3 or S4 data; larger than usual for the tenant | 2 | Verify purpose; confirm recipient |
| DET-06 | Cross-tenant signal | RLS violation error, tenant mismatch in a job, or a query without tenant context | 1 | Treat as SEV-1 until disproved |
| DET-07 | Break-glass | any break-glass session | 2 | Verify ticket; review recorded session at expiry |
| DET-08 | Authentication abuse | credential stuffing signature, impossible travel, MFA fatigue (many pushes) | 2 | Block, force reset, notify user |
| DET-09 | Assignment after separation | any active assignment on an account whose employee has ended | 2 | End assignment, revoke sessions, review |
| DET-10 | Audit gap | chain verification fails or a gap in `seq` | 1 | Freeze, preserve, incident |
| DET-11 | Payroll anomaly | approval by an actor with a recent role change; run approved in under 60 seconds after submit | 3 | Review the run before payment |
| DET-12 | Auditor activity | `auditor` account reads outside its declared purpose or window | 3 | Contact the tenant, end grant if needed |
Rules are stored as code beside the alerting config, tested against seeded events (the seed includes scenarios for DET-03, DET-04 and DET-09), and tuned from the first month of data.

## 4. Privileged access management
- **Production access:** none standing. Break-glass request needs a ticket, a reason, a second approver, a time-box of at most 60 minutes, hardware-key sign-in, session recording, immediate tenant notice and a post-use review within one business day.
- **Cloud and CI:** SSO with hardware keys, separate admin identities, least-privilege roles, workload identity for services, no static cloud keys. Production deploys need the pipeline's approval gate.
- **Tenant privileged roles:** grants of `payroll_preparer`, `payroll_approver`, `dpo`, `tenant_admin` need a second approver; the quarterly review lists them all.
- **Service accounts:** inventoried, one per purpose and environment, rotated, with an owner and an expiry.

## 5. Joiner, mover, leaver (platform and tenant)
- **Tenant side:** employment end ends all granted assignments, delegations and sessions at the effective date (automatic). Movers (transfer between departments) end `org_unit` and `team` scopes tied to the old unit and require a new proposal for the new one. The quarterly report highlights assignments whose holder changed department.
- **Platform side:** access is created per ticket and reviewed monthly; leaving the platform team triggers a same-day revocation checklist (cloud, CI, IdP, password manager, break-glass rota).

## 6. Keys, secrets and rotation
| Item | Rotation | Notes |
|---|---|---|
| Field encryption data keys (ADR-007) | rewrap on KMS key rotation yearly; re-encrypt on suspected exposure | per tenant data key, KEK in KMS |
| Blind-index HMAC key | on suspected exposure only (rebuild indexes) | planned as a migration |
| API client secrets | 90 days or on change of staff | tenant self-service rotation |
| Webhook signing secrets | 180 days | dual-secret overlap window |
| CI and cloud credentials | OIDC, no static keys; other secrets 90 days | secret scan blocks commits |
| Break-glass credentials | single use, expire in 60 minutes | never stored |
Secret exposure drill: revoke, rotate, search history, notify; practised at the tabletop.

## 7. Vulnerability and patch management
| Severity (CVSS or judgment) | Fix target | Rule |
|---|---|---|
| Critical, exploited or remote, in a reachable path | 48 hours | hotfix path from `main` |
| High | 7 days | next release or hotfix |
| Medium | 30 days | planned |
| Low | 90 days or accept with note | backlog |
Sources: dependency audit and OSV, Semgrep and CodeQL, Trivy on images, cloud advisories, penetration test findings, responsible-disclosure inbox (`security.txt` published at GA, acknowledgement within 3 business days). Exceptions need a written acceptance with an expiry and are listed in the monthly review. SLAs count from the day the finding is confirmed.

## 8. Tenant-facing security operations
- **Access review report** each quarter (per tenant): assignments, scopes, end dates, exceptions, dormant accounts (no sign-in for 60 days), accounts with privileged roles lacking MFA, auditor grants. The tenant admin signs it in the product; unsigned reports escalate after 14 days.
- **Security notices:** access-changed banners, new-device sign-in email, break-glass notice, breach notification per [incident-response](../06-operations/incident-response.md).
- **Data export and deletion:** `tenant_data:export` needs `dpo` approval; deletion follows retention (dry-run only until counsel confirms, OD-12).

## 9. Metrics reported monthly
Count of privileged accounts and of SoD exceptions; share of privileged accounts with phishing-resistant MFA (target 100 percent); mean time to revoke after separation (target under 1 hour); open vulnerabilities by age against SLA; alert volume and false-positive rate per detection; break-glass uses and review completion; restore test result; audit-chain verification result.

## 10. Readiness checklist before the first customer
- [ ] Detection rules DET-01 to DET-12 implemented and tested on seed events
- [ ] Monthly and quarterly review templates created and dry-run once
- [ ] Break-glass procedure rehearsed with the backup approver
- [ ] `security.txt` and a monitored security mailbox in place
- [ ] Key rotation runbook tested on staging
- [ ] Backup contractor named for second-approver duties
