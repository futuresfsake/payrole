# Monitoring and Alerting

## Signals
- **Metrics:** request rate/latency/errors (RED), queue depth and age, job success/fail, DB connections/locks/replication lag, payroll compute duration, login failures, 429s, storage growth.
- **Logs:** structured JSON, correlation/request IDs, tenant id (hashed), no PII.
- **Traces:** OpenTelemetry across API → DB → worker.
- **Synthetic checks:** login page, health endpoint, payslip view flow (synthetic tenant) every minute.
- **Business metrics:** payrolls run/finalized, time to finalize, exception counts, ESS adoption.

## SLOs (initial)
| SLI | SLO | Window |
|---|---|---|
| Availability (API success non-5xx) | 99.5% | 30 d |
| Latency p95 reads | < 400 ms | 30 d |
| Payroll compute success | 99.9% of runs without engine error | 30 d |
| Notification delivery within 5 min | 99% | 30 d |

Error budget policy: budget burn > 50% in a window pauses feature releases for reliability work.

## Alerts (page vs ticket)
| Alert | Severity | Action |
|---|---|---|
| API error rate > 2% for 5 min | Page | Runbook RB-01 |
| DB failover or replication lag > 60 s | Page | RB-02 |
| Payroll job failing/stuck > 10 min during window | Page | RB-03 |
| Audit chain verification failure | Page (SEV-1) | RB-04, incident |
| Spike in failed logins / credential stuffing | Page | RB-05 |
| Anomalous bulk export / off-hours privileged access | Page | RB-06, security |
| Queue age > 5 min | Ticket→Page if > 15 | RB-07 |
| Cert expiry < 14 d | Ticket | |
| Backup failure / restore test failure | Page | RB-08 |
| Dependency critical CVE on SBOM | Ticket (SLA clock) | |
| Cost > budget threshold | Ticket | |

Every alert has a runbook with: meaning, impact, diagnosis steps, mitigation, escalation.

## Dashboards
Platform health · Payroll window · Security (auth, authz denials, exports) · Tenant usage · Queue health · SLO burn.

## Privacy in telemetry
Allow-listed log fields; scrubber tests; error tracker with PII scrubbing; IPs truncated in analytics.
