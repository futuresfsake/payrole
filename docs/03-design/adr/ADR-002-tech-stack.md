# ADR-002: Technology stack

**Status:** Accepted · **Date:** 2026-11-15

## Context
Need a typed, mainstream stack the owner already uses (Next.js, Node, Postgres), low ops, strong ecosystem for PDF, queues, and testing.

## Decision
TypeScript strict; Next.js PWA; Fastify API; PostgreSQL; Redis/BullMQ; S3-compatible storage; SQL-first data access (Kysely/Drizzle); GitHub Actions; OpenTofu; managed container hosting in a SEA region (final region OD-03).

## Consequences
+ One language, shared zod schemas, fast onboarding of future contributors.
+ Postgres features (RLS, exclusion constraints) do heavy lifting.
− Node CPU-bound payroll compute: mitigated by workers and chunking; revisit if NFR-02 breached.
− ORM-free data layer means writing more SQL; accepted for RLS/effective-dating control.

## Alternatives
C#/.NET (strong fit for payroll and owner is learning it; deferred to avoid slowing delivery; revisit for payroll service extraction). NestJS, Prisma (RLS friction). Kubernetes (overkill). MongoDB (weak integrity for money).
