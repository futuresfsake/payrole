# Non-Functional Requirements

Assumed scale (GAP-18): 50 tenants × up to 500 employees = 25,000 employees; 2,500 concurrent users peak at payroll cut-off and approval days.

| ID | Category | Requirement | Measure / Target |
|---|---|---|---|
| NFR-01 | Performance | Interactive page/API reads | p95 < 400 ms, p99 < 1 s |
| NFR-02 | Performance | Payroll compute for 500 employees | < 2 min end-to-end |
| NFR-03 | Performance | Attendance compute for a 500-employee month | < 3 min |
| NFR-04 | Performance | Report export (10k rows) | < 30 s, async beyond |
| NFR-05 | Availability | Monthly uptime | 99.5% at GA (higher later); stricter during payroll windows (change freeze) |
| NFR-06 | Recoverability | RPO / RTO | RPO ≤ 15 min, RTO ≤ 4 h |
| NFR-07 | Durability | Backups | Daily full + continuous WAL, 35-day retention, quarterly restore test |
| NFR-08 | Security | Authentication | MFA for privileged roles; passkeys supported |
| NFR-09 | Security | Encryption | TLS 1.2+ (prefer 1.3) in transit; AES-256 at rest; field-level for SPI |
| NFR-10 | Security | Vulnerability SLA | Critical ≤ 7 d, High ≤ 30 d, Medium ≤ 90 d |
| NFR-11 | Privacy | DPA | Compliance matrix in [09-compliance](../09-compliance/README.md) maintained; breach notification workflow ≤ 72 h |
| NFR-12 | Accessibility | Standard | WCAG 2.2 AA on core flows |
| NFR-13 | Usability | Mobile | Core ESS flows usable at 360 px width on 3G-class latency (< 3 s TTI on mid-range Android) |
| NFR-14 | Compatibility | Browsers | Last 2 versions of Chrome, Edge, Safari, Firefox; Android Chrome, iOS Safari |
| NFR-15 | Scalability | Horizontal | Stateless app tier; jobs on queue; DB vertical first, read replica later |
| NFR-16 | Maintainability | Code quality | Test coverage ≥ 80% line on domain/payroll packages, ≥ 95% on rule engine; zero lint errors |
| NFR-17 | Observability | Telemetry | Structured logs, metrics, traces; no PII in logs |
| NFR-18 | Auditability | Audit log | 100% coverage of write operations on regulated entities; retained ≥ 10 years (**VERIFY**) |
| NFR-19 | Data integrity | Money | Decimal only; payroll determinism property tests |
| NFR-20 | Internationalization | i18n | All UI strings externalized; en-PH default; Filipino-ready |
| NFR-21 | Time | Time zone | Store UTC timestamps; business dates in Asia/Manila |
| NFR-22 | Portability | Exit | Full data export in open formats; vendor adapters |
| NFR-23 | Documentation | Docs as code | Docs updated in same PR as change |
| NFR-24 | Cost | Infra budget | Target < ₱X per tenant per month (set at OD-10) |
| NFR-25 | Support | Operability | Runbook for each alert; on-call = owner |
| NFR-26 | Idempotency | APIs | All mutating integration endpoints accept idempotency keys |
| NFR-27 | Rate limiting | Abuse control | Per-user and per-IP limits on auth and exports |
