# ADR-001: Modular monolith

**Status:** Accepted · **Date:** 2026-11-15

## Context
Solo developer, strong transactional needs (payroll finalisation touches many entities), small initial scale (≤ 25k employees total). Operating many services would consume the entire budget.

## Decision
One deployable (API) plus one worker process from the same codebase. Modules have enforced boundaries (public interfaces, no cross-module table access, architectural tests). Async work via outbox + queue.

## Consequences
+ Simple deploys, local dev, ACID across modules, fast iteration.
+ Seams for later extraction (payroll compute is the first candidate).
− Discipline needed to avoid a "big ball of mud": enforced by dependency-cruiser in CI.
− One scaling unit; mitigated by stateless app and separate worker scaling.

## Alternatives
Microservices (rejected: ops cost, distributed transactions). Serverless functions (rejected: cold starts, long payroll jobs, RLS connection handling).
