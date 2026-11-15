# Open Decisions

Decisions still needed. Each has a recommendation so work is not blocked. Closed items move to an ADR.

| ID | Decision | Options | Recommendation | Needed by | Status |
|---|---|---|---|---|---|
| OD-01 | Product model: internal tool vs multi-tenant SaaS | Single-tenant per customer / multi-tenant shared DB / multi-tenant schema-per-tenant | Multi-tenant shared DB with `tenant_id` + Postgres row-level security (ADR-004) | Before M0 exit | Proposed |
| OD-02 | Initial market segment | 50–200 / 200–500 / enterprise | 50–200 employees, single entity | Before M1 | Proposed |
| OD-03 | Hosting region | AWS Singapore / Azure SEA / local PH colo / PaaS (Render/Fly) | Managed cloud in Singapore, PH-resident backup optional; DPA cross-border via contract. **VERIFY** availability of a PH region at decision time | Before M0 exit | Open |
| OD-04 | Auth provider | Build on library / Keycloak / managed (Auth0, Clerk, Neon Auth) | Managed OIDC provider with MFA, behind an adapter (ADR-006) | M0 | Proposed |
| OD-05 | Biometric / time-clock integration | CSV import / vendor API / ZKTeco ADMS push / mobile geo-punch | CSV + ZKTeco push in M2; mobile punch M5 | M2 | Open |
| OD-06 | Bank payroll file formats | BDO, BPI, Metrobank, UnionBank, Landbank, InstaPay/PESONet | Generic CSV in M3, top 3 bank templates in M4. **GAP-07** need current specs from banks | M3 | Open |
| OD-07 | Government filing method | File generation only / direct e-submission | File generation only (no direct submission credentials stored) | M4 | Proposed |
| OD-08 | Native mobile vs PWA | Native / React Native / PWA | PWA first, WebAuthn/push, revisit at M7 | M5 | Proposed |
| OD-09 | AI features scope | None / assistive only / agentic | Assistive only, no PII to third-party models without DPA review (ADR-009) | M6 | Proposed |
| OD-10 | Pricing / licensing | Per employee per month / flat tier | Out of scope for docs; track separately | Pre-launch | Open |
| OD-11 | Payslip delivery | Portal only / email PDF (password) / both | Portal default, encrypted PDF email optional | M3 | Proposed |
| OD-12 | Data retention periods | By record class | Defined in [data-protection](../04-security/data-protection.md) draft; **needs legal confirmation** (GAP-03) | M3 | Open |
| OD-13 | Language | English only / English + Filipino | English v1, i18n-ready strings, Filipino at M7 | M1 | Proposed |
| OD-14 | Who is the Data Protection Officer for the SaaS operator | Owner / hired / outsourced | Owner interim, appoint formally before first customer | Pre-launch | Open |
| OD-15 | Product name and trademark | PayRole (chosen by owner 2026-11-15) / Plantilla / Kawani | Check IPOPHL and domain availability (GAP-12). Descriptive near-homophone of "payroll" may be a weak mark | Pre-launch | Chosen, unverified |
