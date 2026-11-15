# ADR-004: Shared-schema multi-tenancy with Postgres Row-Level Security

**Status:** Accepted (OD-01 closed 2026-11-15) · **Date:** 2026-11-15

## Context
SaaS economics need many tenants on one stack; isolation failures are existential (RISK-06).

## Decision
Single database, shared schema, `tenant_id` on every table, RLS `FORCE`d, app role without BYPASSRLS, tenant set via `SET LOCAL` per transaction. Per-tenant encryption keys (ADR-007). Platform operators have no standing access; break-glass is time-boxed and audited. Large/regulated customers may later get a dedicated database using the same code.

## Consequences
+ Defence in depth: bug in a query still can't cross tenants.
+ Cheap per-tenant cost.
− Pooling must be transaction-scoped (no session-level tenant leakage). PgBouncer in transaction mode is compatible with `SET LOCAL`.
− Cross-tenant analytics for the operator require explicit, privacy-safe aggregation jobs.
− Noisy neighbour risk; per-tenant rate limits and job quotas.

## Verification
CI: schema lint (every tenant table has policy), negative tests per module, fuzz test that swaps tenant context mid-request must fail.

## Acceptance conditions
Before M0 exit: the schema lint, negative tenant tests and the mid-request tenant-swap fuzz test pass in CI, and RLS performance is benchmarked at the NFR scale (25,000 employees). If the benchmark fails NFR-01, revisit policy shape (not the model) first.

## Alternatives
Schema-per-tenant (migration fan-out pain), database-per-tenant (cost/ops), app-layer filtering only (rejected: single bug = breach).
