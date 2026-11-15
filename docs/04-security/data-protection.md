# Data Protection

## Roles under the DPA
- **Customer (employer)** = Personal Information Controller (PIC).
- **PayRole operator** = Personal Information Processor (PIP) acting on documented instructions; needs a data processing agreement (DPA contract) with each customer. **GAP-13**: confirm registration and DPO obligations with counsel/NPC.
- **Sub-processors:** hosting, IdP, email/SMS, AI (optional), error tracking. Maintain a public list; notify customers of changes.

## Data inventory
Maintained in-product (FR-112) and in [data-requirements](../02-requirements/data-requirements.md). Each field: classification, purpose, lawful basis (contract, legal obligation, consent for optional), retention, recipients.

## Lawful basis defaults (employer side, customer confirms)
- Employment contract and legal obligation: payroll, statutory remittances, labor records.
- Legitimate interest: attendance, security logs.
- Consent: optional features (mobile geolocation, selfie punch, photo in directory, AI features), recorded in consent log, revocable.

## Encryption
- In transit: TLS 1.2+ (1.3 preferred), HSTS, internal TLS to DB/Redis.
- At rest: managed disk/DB encryption + field-level (ADR-007) for government IDs, bank, salary, medical.
- Backups encrypted with separate keys; object storage SSE-KMS.
- Key management: KMS, annual KEK rotation, DEK per tenant, break-glass key access split between two people.

## Masking and minimisation
Default masked display (last 4 of IDs). Reveal requires permission + reason (audited). Logs never contain SPI. Test data is synthetic; production data never copied to lower environments (if needed: irreversible anonymisation pipeline).

## Retention and disposal
Per [data-requirements](../02-requirements/data-requirements.md) (draft, GAP-03). Retention job: dry-run report → customer approval option → anonymise/delete → certificate log. Legal hold flag overrides. Backups age out within 35 days; deleted data's backup retention disclosed in notice.

## Data subject rights (RA 10173)
Access, correction, erasure/blocking, objection, data portability, damages. Portal (FR-505) with SLA clock (default respond within 15 days internally; **VERIFY** legal timelines). Identity verified before disclosure. Export in machine-readable format (JSON/CSV + PDF).

## Breach management
Detect → contain → assess (SPI? risk of serious harm?) → notify NPC and affected data subjects within 72 hours of knowledge or reasonable belief when required (**VERIFY** NPC Circular 16-03 and updates) → remediate → post-incident review. Breach register in Privacy console (FR-702). Customers (PICs) notified immediately by PIP per contract (target ≤ 24 h).

## Cross-border transfer
If hosted outside PH: disclosed in privacy notice and DPA; contract clauses and security parity; record transfer map. OD-03 decides.

## Employee notice
Template privacy notice delivered at onboarding: what data, why, who sees it, retention, rights, contact DPO.

## Privacy by design checklist (per story)
- [ ] Is each new field necessary? Classified? Purpose documented?
- [ ] Masked by default? Access permission defined?
- [ ] Retention defined? Included in DSR export and erasure?
- [ ] Logged without content?
- [ ] DPIA needed (new sensitive processing, AI, biometrics, location)?
