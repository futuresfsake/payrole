# Low-Level Design

## 1. Repository layout (monorepo, pnpm workspaces)
```
/apps/web            Next.js PWA (UI only; calls API)
/apps/api            HTTP API (Fastify) + OpenAPI
/apps/worker         Queue workers (BullMQ)
/packages/domain     Pure domain logic (payroll engine, attendance engine, leave ledger): NO I/O
/packages/modules/*  Module services, repositories, policies
/packages/rules      Rule-set schemas, loaders, validators
/packages/db         Migrations, schema, RLS policies, seed
/packages/shared     Types, money, dates, errors
/packages/exports    Government/bank/GL file generators
/infra               IaC (Terraform/OpenTofu), Dockerfiles
/docs                This documentation
/tests               e2e, golden fixtures, security tests
```
Dependency direction: apps → modules → domain/shared. `domain` imports nothing infrastructural.

## 2. Request lifecycle
1. TLS → WAF → API.
2. Auth middleware validates session; resolves `actor` {userId, tenantId, roles, employeeId}.
3. Open DB transaction; `SET LOCAL app.tenant_id`, `app.user_id`.
4. Route handler → validates input (zod) → service.
5. Service calls `authorize(actor, action, resource, purpose?)` → loads data via repository → domain logic → persists → emits events into **outbox** (same transaction).
6. Commit. Response (problem+json on errors).
7. Outbox dispatcher publishes events to workers (audit enrichment, notifications, projections).

## 3. Tenancy and RLS
```sql
ALTER TABLE employee ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON employee
  USING (tenant_id = current_setting('app.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
```
- App connects with a non-owner role without BYPASSRLS. Migrations use a separate owner role.
- CI test: for every table with `tenant_id`, an RLS policy exists (schema lint) and a negative cross-tenant test runs.
- Workers set tenant context per job.

## 4. Effective dating
Tables: `employment`, `compensation`, `org_assignment`, `rule_set_version`, etc.
Columns: `valid_from date NOT NULL`, `valid_to date NULL` (exclusive, NULL = open), `recorded_at timestamptz`, `recorded_by`, `superseded_at timestamptz NULL`.
- Exclusion constraint prevents overlap: `EXCLUDE USING gist (employee_id WITH =, daterange(valid_from, valid_to) WITH &&) WHERE (superseded_at IS NULL)`.
- Corrections close the old row (`superseded_at`) and insert the new. Never UPDATE values in place.
- Query "as of D": `valid_from <= D AND (valid_to IS NULL OR D < valid_to) AND superseded_at IS NULL`.

## 5. Crypto and sensitive fields
- Envelope encryption: per-tenant data key (DEK) wrapped by KMS key (KEK). DEK cached in memory with TTL.
- AES-256-GCM; ciphertext format `v1:keyId:nonce:ct:tag`. Key rotation by re-wrap (DEK) and lazy re-encrypt.
- Searchable identifiers: HMAC-SHA256 blind index (per-tenant HMAC key) stored beside ciphertext, for exact match only.
- Display masking at serializer level: default masked (`***-**-1234`); unmask requires permission + audit entry with reason.
- Passwords not stored locally (IdP). Secrets via secret manager, never env files in repo.

## 6. Audit log
```
audit_log(id, tenant_id, seq, ts, actor_id, actor_type, action, entity, entity_id,
          before_redacted jsonb, after_redacted jsonb, reason, ip, ua, request_id,
          prev_hash bytea, hash bytea)
```
- `hash = SHA256(prev_hash || canonical(row))`, per-tenant chain by `seq`. INSERT-only: privileges revoked for UPDATE/DELETE; trigger blocks them.
- Daily job verifies chain and stores the head hash externally (object-lock storage) for tamper evidence.
- Sensitive values stored as hashes/field names only (e.g. "salary changed"), never plaintext.

## 7. Authorization
- Permissions: `resource:action` (e.g. `compensation:read`, `payroll_run:approve`).
- Model: [ADR-013](adr/ADR-013-multi-role-access-model.md). A user has many **role assignments** (role + scope + validity). Effective access is the union; derived roles `employee` and `manager` are computed per request, never stored.
- Scope resolver: `self | team | org_unit | pay_group | tenant`. Team and org-unit scopes come from the effective-dated reporting line and org tree as of today. Resolved sets are cached per session and invalidated on any assignment, reporting-line or privilege change.
- `authorize(actor, permission, resource, purpose?)` returns `ALLOW(fieldMask) | DENY(reason) | REQUIRE_STEP_UP | REQUIRE_PURPOSE`. Algorithm in [roles-and-permissions §5](../02-requirements/access/roles-and-permissions.md).
- Policy function is pure and unit-tested against the [RBAC matrix](../02-requirements/access/rbac-matrix.md) (matrix is machine-readable, loaded from the seeded `permission` and `role_permission` tables; tests are generated from it).
- Static SoD (forbidden role pairs) runs when an assignment is proposed or approved; dynamic SoD (approver ≠ preparer, requester ≠ approver) runs inside `authorize()`. Property tests try to violate each rule.
- The UI workspace selector is a navigation filter only; the server never reads it.

## 8. Payroll engine (summary; see [TDD-payroll-engine](tdd/TDD-payroll-engine.md))
Pure pipeline: `PayrollInput(snapshot) → steps[] → PayrollResult + Trace`. Steps are ordered, each pure: gross → premiums → taxable base → statutory → tax → loans → net. Output deterministic and hash-stamped.

## 9. Attendance engine
Input: schedule, holiday calendar (as of date), approved OT/leave/corrections, raw punches. Output per day: minute buckets {regular, late, undertime, OT tiers, NSD, rest day, holiday, absent}. Pure, unit-golden-tested; business-date normalised to Asia/Manila.

## 10. Leave ledger
Append-only ledger entries (`accrual`, `usage`, `adjustment`, `expiry`, `conversion`). Balance = SUM(ledger). Invariant: balance never negative unless policy allows. Property test: replaying ledger reproduces balance.

## 11. Workflow engine
Definition JSON (steps, approver resolver, timeout, escalation, delegate). Instance state machine persisted. Tasks idempotent; timers via delayed jobs.

## 12. Background jobs (BullMQ)
| Queue | Jobs | Retry | Notes |
|---|---|---|---|
| payroll | compute-run | 3, backoff | Chunk by employee batches; idempotent via run version |
| ingest | time-log import | 5 | Dedup key |
| exports | file generation | 3 | Stored in S3 with signed URL |
| notify | email/push | 8 exp backoff | DLQ |
| retention | anonymize/purge | 1 | Dry-run report first |
| audit | chain verify | 1 | |

## 13. API conventions
REST, resource-oriented: `/v1/employees`, `/v1/payroll-runs/{id}/submit`. OpenAPI 3.1 as source; generated client for web. Cursor pagination. ETag + If-Match for optimistic concurrency. Idempotency-Key for POST. See [api-design](api-design.md).

## 14. Frontend structure
Next.js App Router, server components for read pages, client components for forms. Design system with tokens; form library + zod schemas shared with API. A11y: eslint-plugin-jsx-a11y + axe in e2e. PWA via service worker (cache static shell only; never cache API responses containing PII).

## 15. Error and logging
- Error taxonomy: Validation, Authz, NotFound, Conflict, RuleViolation, Integration, Internal.
- Logger with allow-list serializers; deny-list for fields flagged SPI. Unit test feeds sample PII and asserts it is absent in output.

## 16. Migrations
Forward-only SQL migrations (expand → migrate → contract). Every migration reviewed for lock impact. Rule-set data migrations versioned separately with citations.

## 17. Configuration
12-factor env config, validated at boot (zod). Feature flags per tenant table. No secrets in repo.
