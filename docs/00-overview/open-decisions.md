# Decisions Register

Every decision that was open at baseline v0.1 is now decided (2026-11-15, owner with senior-engineer recommendation). Architecture-level decisions live in an ADR; product, commercial and operational ones are recorded here with the reason.

Status: **Decided** (final until its review trigger fires), **Decided, conditional** (final, with a stated check that can reverse it).

| ID | Decision | Choice | Why | Review trigger | Status |
|---|---|---|---|---|---|
| OD-01 | Product model | Multi-tenant SaaS, shared schema, `tenant_id` plus Postgres RLS | Cheapest per tenant; RLS gives defence in depth against query bugs ([ADR-004](../03-design/adr/ADR-004-multitenancy-rls.md)) | A customer demands a dedicated database | Decided |
| OD-02 | Initial segment | 50–200 employees, single legal entity, semi-monthly and monthly pay | Matches solo capacity and the 500-employee NFR headroom; multi-entity groups are a different data model | 3 paying customers in a different segment | Decided |
| OD-03 | Hosting | AWS Singapore (ap-southeast-1), managed containers and Postgres ([ADR-011](../03-design/adr/ADR-011-hosting-aws-singapore.md)) | Managed PITR, KMS and low ops; no assumption of an in-country region | A PH region exists, or customer requires residency | Decided |
| OD-04 | Auth provider | Managed OIDC behind `IdentityPort`; default **Auth0**, confirmed by a 2-day scored spike at M0 start; fallback managed Keycloak ([ADR-006](../03-design/adr/ADR-006-auth-provider.md)) | Do not build authentication; mature MFA, passkeys and SAML | Spike fails a veto criterion; cost at 25k users unacceptable | Decided, conditional |
| OD-05 | Time-clock integration | CSV upload and ZKTeco ADMS push in M2; mobile punch in M5; no vendor-specific API in v1 | ZKTeco-class devices are the common SME install; CSV is the universal fallback; idempotent ingest (TDD-time-ingest) | A partner uses a device that supports neither | Decided |
| OD-06 | Bank files | Generic CSV in M3 (US-317); bank templates in M4 (US-404) for the **parallel-run partner's bank first**, then the next two most common among pilot customers (default order: BDO, BPI, Metrobank). Specs obtained from the banks or customers, never guessed | Build only formats we can validate against a real spec (GAP-07) | Partner bank is not in the default list | Decided |
| OD-07 | Government filing | File generation only; the customer uploads ([ADR-003](../03-design/adr/ADR-003-file-generation-only.md)) | No stored agency credentials; lower liability | Agencies publish official APIs with clear terms | Decided |
| OD-08 | Mobile | PWA first (WebAuthn, push); no native app | One codebase; adequate for ESS flows | Mobile punch or offline needs exceed PWA limits (revisit after beta) | Decided |
| OD-09 | AI scope | Assistive only; no PII to external models without a DPA review and redaction ([ADR-009](../03-design/adr/ADR-009-ai-assistive-only.md)); all AI features are post-GA | Payroll liability; privacy | A DPIA clears a specific feature | Decided |
| OD-10 | Pricing model | Per employee per month with a minimum monthly fee per tenant. Amounts set before private beta, from measured cost per tenant (NFR-24) | Matches how SME payroll is bought; cost scales with employees | First customer conversations | Decided (model only; amounts open until beta) |
| OD-11 | Payslip delivery | Portal only in v1. No emailed payslip PDFs. Email carries a notification with a deep link, no amounts | Avoids salary data in mailboxes and password-PDF support burden (T-08) | A customer needs email delivery; then encrypted PDF with a per-user passphrase, as a flag | Decided |
| OD-12 | Retention periods | Adopt the draft table in [data-protection](../04-security/data-protection.md), applying the **longest applicable period** where laws conflict. The retention engine (US-510) runs in **dry-run only** until counsel confirms (GAP-03); no automated deletion of payroll or 201 data before then | Over-retaining is recoverable; wrongly deleting statutory records is not | Counsel review completes | Decided, conditional |
| OD-13 | Language | English (en-PH) in v1, all strings externalised; Filipino as post-GA US-705 | Payroll terms are English in practice; i18n-ready avoids rework | Customer demand | Decided |
| OD-14 | Data Protection Officer | The owner is the written, interim DPO. Formal designation document signed before private beta; outsourced DPO considered before the first paying customer | Required by RA 10173 for the processor; cheapest compliant path | First paying customer, or conflict of interest | Decided |
| OD-15 | Name | **PayRole is the working name.** Brand strings and domain live in one config module and one doc so a rename is a find-and-replace; IPOPHL search and domain check done by M3; rename before beta if the search finds a conflict or the mark is judged too weak | A near-homophone of "payroll" is likely a weak, descriptive mark, but a rename before launch is cheap | IPOPHL result; first external demo | Decided, conditional |
| OD-16 | Access model | Multi-role: one account, many scoped effective-dated role assignments, permission checks, static and dynamic SoD ([ADR-013](../03-design/adr/ADR-013-multi-role-access-model.md)) | Real staff hold several roles; keeps audit attributable and least privilege intact | A tenant needs rules RBAC cannot express (then an ABAC engine behind `authorize()`) | Decided |
| OD-17 | Design language | International Typographic (Swiss) Style on a personnel-file metaphor, light theme only in v1 ([ADR-014](../03-design/adr/ADR-014-ui-design-language.md)) | Recognised, dense-data friendly, avoids generated-looking UI | Usability testing fails or the owner changes direction | Decided |

## Dependencies now unblocked
- M0 may start: OD-01, OD-03, OD-04 are decided (the 2-day auth spike is the first M0 task).
- M2 integration scope is fixed (OD-05).
- M3 bank scope is fixed (OD-06); the first bank is named by the partner (GAP-02).
- Private beta needs: OD-10 amounts, OD-14 designation document, OD-15 search result, OD-12 counsel sign-off or dry-run-only retention.

## How decisions change
A decided item is reopened only by its review trigger. Reopening means a new ADR (or a dated edit here for non-architecture items) that supersedes the old one; history stays in git.
