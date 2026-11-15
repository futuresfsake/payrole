# Tech Stack

Principle: boring, well-supported, strongly typed, and operable by one person. Alternatives and reasoning in ADRs.

| Layer | Choice | Why | Alternatives considered | ADR |
|---|---|---|---|---|
| Language | TypeScript (strict) end-to-end | One language, shared types/validators; owner's existing skill | C#/.NET (owner learning, strong for payroll but slower solo velocity now), Kotlin | 002 |
| Frontend | Next.js (App Router) + React, Tailwind with design tokens, PWA | Existing portfolio experience; SSR; accessibility libs | SvelteKit, Remix | 002 |
| UI primitives | Radix/React Aria based components | Accessibility | MUI | 002 |
| Backend | Fastify + zod + OpenAPI generation | Fast, typed, light | NestJS (heavier), Express | 002 |
| DB | PostgreSQL 16+ | RLS, exclusion constraints, numeric, jsonb, mature | MySQL, MongoDB | 004 |
| Data access | Kysely or Drizzle (SQL-first), raw SQL for RLS/migrations | Control over SQL; no ORM magic with RLS | Prisma | 002 |
| Queue/cache | Redis + BullMQ | Simple reliable jobs | Postgres-based queue (pg-boss), SQS | 002 |
| Money | decimal.js in app, `numeric(19,4)` in DB | No floats | big.js | RND |
| Validation | zod schemas shared FE/BE | | | |
| Auth | Managed OIDC provider behind adapter; passkeys + TOTP | Do not build crypto/auth | Keycloak self-host, Auth0, Clerk, Neon Auth | 006 |
| Storage | S3-compatible with SSE-KMS, presigned URLs | | local FS | 002 |
| Search | Postgres FTS/trigram (employee search) | No extra infra | OpenSearch | 002 |
| PDF | Headless-Chromium or React-PDF server-side | Payslip/2316 render | wkhtmltopdf | |
| Email | Transactional provider (SES/Postmark class) | | SMTP self-host | |
| IaC | OpenTofu/Terraform, Docker | | Pulumi | 002 |
| CI/CD | GitHub Actions | Existing workflow | GitLab CI | [ci-cd](../07-process/ci-cd-pipeline.md) |
| Hosting | Managed container platform + managed Postgres in SEA region | Low ops (OD-03 open) | Kubernetes (overkill), VPS | 002 |
| Observability | OpenTelemetry → Grafana/Loki/Tempo or hosted; Sentry (PII-scrubbed) | Vendor neutral | Datadog (cost) | |
| Testing | Vitest, Playwright, fast-check (property), Testcontainers, k6 (load), axe | | Jest, Cypress | [testing](../05-quality/testing-strategy.md) |
| SAST/SCA | Semgrep, CodeQL, npm audit/OSV-Scanner, Gitleaks, Trivy | Matches owner's SDLC preference | Snyk | [security](../04-security/README.md) |
| AI (optional) | Claude API via adapter, RAG over policy docs, PII redaction first | | self-hosted OSS | 009 |
| Docs | Markdown in repo, Mermaid, ADRs, OpenAPI | docs-as-code | Confluence | |

## Versions policy
LTS Node, current Postgres major-1, pin via lockfile and `.nvmrc`; Renovate/Dependabot weekly; minor/patch auto-PR, majors reviewed.

## Explicitly rejected
- Microservices (ADR-001), GraphQL (extra surface; REST+OpenAPI enough), NoSQL for payroll, self-built authentication, client-side-only authorization, storing biometric templates (ADR-010).
