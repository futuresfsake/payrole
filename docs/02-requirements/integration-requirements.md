# Integration Requirements

| ID | Integration | Direction | Method | Phase | Notes |
|---|---|---|---|---|---|
| INT-01 | Biometric/time clock | In | CSV upload; ZKTeco ADMS push; vendor API later | M2 | Idempotent keys (device, user, ts); raw log retained |
| INT-02 | Identity provider | In/Out | OIDC; SAML for enterprise SSO | M0/M5 | Adapter, ADR-006 |
| INT-03 | Email | Out | Transactional provider (SES/Postmark class) | M0 | DKIM/SPF/DMARC; no PII in subject |
| INT-04 | SMS | Out | Local aggregator | M5 optional | OTP fallback not preferred; cost controls |
| INT-05 | Bank files | Out | Template per bank (CSV/fixed-width/TXT) | M3/M4 | GAP-07; checksum and preview before download |
| INT-06 | Government files | Out | SSS, PhilHealth, Pag-IBIG, BIR templates | M4 | File generation only (OD-07), GAP-08 |
| INT-07 | Accounting/GL | Out | CSV/Excel journal; later API (QuickBooks, Xero, SAP) | M4 | Account mapping per tenant |
| INT-08 | Object storage | Out | S3-compatible | M1 | SSE + presigned URLs with short TTL |
| INT-09 | Malware scanning | Out | ClamAV or managed | M1 | Quarantine bucket |
| INT-10 | Webhooks | Out | HMAC-signed, retries with backoff | M5 | Employee created, run finalized, etc. |
| INT-11 | Public REST API | In | OAuth2 client credentials, per-tenant scopes | M5 | OpenAPI 3.1 |
| INT-12 | E-signature | Out | In-house simple e-sign or provider | M6 | RA 8792 |
| INT-13 | AI provider | Out | Adapter; redaction layer | M6+ | ADR-009 |
| INT-14 | Calendar (ICS) | Out | ICS feed per user | M5 | Leave and holidays |

## Interface standards
- JSON over HTTPS; OpenAPI 3.1 contract-first; semantic versioning; deprecation window 6 months.
- Pagination cursor-based; errors RFC 9457 problem+json.
- Idempotency-Key header on mutating calls (NFR-26).
- Integration failures never block core flows; use outbox and retry (LLD).
