# Architecture Decision Records

Format: Context → Decision → Consequences → Alternatives. Status: Proposed | Accepted | Superseded. A decision is not "Accepted" until the owner signs it off in the PR.

| ADR | Title | Status |
|---|---|---|
| [001](ADR-001-modular-monolith.md) | Modular monolith | Accepted |
| [002](ADR-002-tech-stack.md) | TypeScript / Postgres / Redis stack, boring hosting | Accepted |
| [003](ADR-003-file-generation-only.md) | Generate government/bank files; no direct submission | Accepted |
| [004](ADR-004-multitenancy-rls.md) | Shared-schema multi-tenancy with Postgres RLS | Accepted |
| [005](ADR-005-rules-as-data.md) | Statutory rules as effectivity-dated, cited data | Accepted |
| [006](ADR-006-auth-provider.md) | Managed OIDC behind an adapter | Accepted (conditional on M0 spike) |
| [007](ADR-007-field-encryption.md) | Envelope field-level encryption with blind indexes | Accepted |
| [008](ADR-008-effective-dating.md) | Effective-dated tables, never overwrite | Accepted |
| [009](ADR-009-ai-assistive-only.md) | AI is assistive; no autonomous pay decisions | Accepted |
| [010](ADR-010-no-biometric-templates.md) | Do not store biometric templates | Accepted |
| [011](ADR-011-hosting-aws-singapore.md) | Host on AWS Singapore with managed services | Accepted |
| [012](ADR-012-payroll-first-release-scope.md) | Payroll-first GA; growth modules after GA | Accepted |
