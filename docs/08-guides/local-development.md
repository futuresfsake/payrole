# Local Development

> The codebase is not scaffolded yet (M0). This guide defines the target developer experience; update as the repo takes shape.

## Prerequisites
Node LTS (via `.nvmrc`), pnpm, Docker Desktop, Git, an editor with ESLint/Prettier.

## Setup
```bash
git clone <repo> payrole && cd payrole
git config core.hooksPath .githooks
corepack enable && pnpm install
cp .env.example .env.local            # placeholders only; never commit real values
docker compose up -d postgres redis minio mailpit
pnpm db:migrate && pnpm db:seed       # synthetic data, Filipino names, edge-case employees
pnpm dev                              # web :3000, api :4000, worker
```

## Local services
| Service | Purpose | Port |
|---|---|---|
| Postgres 16 | DB with RLS | 5432 |
| Redis | Queue/cache | 6379 |
| MinIO | S3-compatible storage | 9000 |
| Mailpit | Email capture | 8025 |
| Mock IdP (Dex/Keycloak dev) | OIDC login | 5556 |

## Common tasks
| Task | Command |
|---|---|
| Unit + golden tests | `pnpm test` |
| Integration tests | `pnpm test:int` (Testcontainers) |
| E2E | `pnpm test:e2e` |
| Mutation (rules) | `pnpm test:mutation` |
| Lint/typecheck | `pnpm lint && pnpm typecheck` |
| Security check (secrets, SAST, deps) | `pnpm security:check` |
| New migration | `pnpm db:new <name>` |
| Regenerate API client | `pnpm api:gen` |
| Run one payroll fixture | `pnpm payroll:fixture PC-02` |

## Rules for local work
- Synthetic data only; never import production data.
- Never commit `.env*` (except `.env.example`).
- Run `pnpm security:check` before every commit.
- Use a test tenant; verify RLS by running as the app role, not the owner.
- Time zone for tests pinned to Asia/Manila; tests also run in UTC to catch bugs.

## Troubleshooting
- RLS returns no rows: tenant context not set (`SET LOCAL app.tenant_id`).
- Money mismatch: look for float use; the lint rule should catch it.
- Hooks not running: confirm `git config core.hooksPath`.
