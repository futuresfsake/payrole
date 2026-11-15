# TDD-<slug>: <Title>

| | |
|---|---|
| Story/FR | US-… / FR-… |
| Author / date | |
| Status | Draft / Reviewed / Implemented |
| Related ADRs | |

## 1. Problem and scope
What, why, what is out of scope.

## 2. Requirements recap
FR/BR/NFR ids with the exact rules relied upon.

## 3. Design
- Components and responsibilities
- Data changes (tables, migrations, RLS, indexes)
- API changes (OpenAPI diff)
- Sequence / state diagram
- Algorithms and edge cases

## 4. Security and privacy
Threats touched (T-ids), data classification, authz checks, audit events, retention.

## 5. Failure modes
Partial failure, retries, idempotency, concurrency, rollback.

## 6. Test plan
Unit, property, golden, integration, e2e, security, a11y, performance. Mapping to FR ids.

## 7. Rollout
Feature flag, migration order (expand/contract), backfill, monitoring, rollback plan.

## 8. Open questions / gaps
Link GAP-ids.

## 9. Review checklist
- [ ] Rules reference rule-set data, not literals
- [ ] Tenant isolation covered
- [ ] Audit events defined
- [ ] No PII in logs
- [ ] Docs and traceability updated
