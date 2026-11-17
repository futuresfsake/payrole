# Authorization

Specification of how PayRole decides whether a person may do something. Decision: [ADR-013](../03-design/adr/ADR-013-multi-role-access-model.md). Roles and catalog: [roles-and-permissions](../02-requirements/access/roles-and-permissions.md). Matrix: [rbac-matrix](../02-requirements/access/rbac-matrix.md). Authentication and sessions: [access-control](access-control.md).

## 1. Principles
1. **Deny by default.** No matching permission in scope means no access.
2. **Permissions, not roles, are checked.** Code asks `payroll_run:approve`, never "is payroll_approver".
3. **Server-side only.** The UI hides what is not allowed; it is never the control.
4. **One decision point.** Every module calls `authorize()`; no module implements its own check.
5. **Layers.** API authorization, then domain SoD, then database tenant isolation (RLS), then optional row-level self rules.
6. **Everything sensitive is explained.** A deny returns a reason code; an allow of S3 or S4 data is audited.

## 2. Model
```
UserAccount 1──* RoleAssignment *──1 Role 1──* RolePermission *──1 Permission
                    │ scope_type, scope_ref, valid_from, valid_to
                    └─ granted_by, approved_by, reason, sod_exception_id
Derived (not stored): employee (any linked active employee), manager (has reports)
```
Effective access = union of the permissions of all active assignments, each limited to its own scope.

## 3. Permission naming and classes
- `resource:action`, lower snake case, for example `employee_identifier:reveal`.
- Actions: `read`, `write`, `request`, `approve`, `return`, `export`, `reveal`, `configure`, `manage`, `propose`, `correct`, `generate`.
- Sensitivity class per permission: S0 public, S1 internal, S2 personal, S3 sensitive personal, S4 financial or secret.
- Flags per permission: `needs_purpose` (bulk or export), `needs_step_up` (default true for S3 and S4 writes, reveals, exports and approvals).
- Adding a permission needs: a catalog entry, default role mapping, a sensitivity class, a test row, and a data-classification entry. A migration test fails if code references a permission that is not in the catalog.

## 4. Scopes
| Scope | Resolved as | Source |
|---|---|---|
| `self` | `resource.employee_id = actor.employee_id` | account to employee link |
| `team` | resource employee is in the actor's reporting subtree **as of today** | effective-dated reporting line |
| `org_unit` | resource's org unit is in the subtree of `scope_ref` | org tree |
| `pay_group` | `resource.pay_group_id = scope_ref` | pay group assignment |
| `tenant` | always true inside the tenant | RLS already isolates tenants |
Rules: a scope is evaluated per resource, never per request. Scope sets are resolved in SQL (recursive CTE over the reporting line) and cached per session with a short TTL and explicit invalidation on assignment, reporting-line, org-unit or employment change. Cycles in the reporting line are rejected at write time.

## 5. Decision procedure
```
authorize(actor, permission, resource, ctx):
  1. A = active assignments(actor, now) ∪ derived roles
  2. C = { a in A | permission ∈ perms(a.role) and scope_contains(a, resource) }
  3. if C empty                     → DENY reason=NO_PERMISSION_IN_SCOPE
  4. if class(permission) ≥ S3 and not recent_step_up(actor, 5 min)
                                    → REQUIRE_STEP_UP
  5. if permission.needs_purpose and ctx.purpose missing
                                    → REQUIRE_PURPOSE
  6. for each dynamic SoD rule r relevant to permission:
       if r.violated(actor, resource) → DENY reason=SOD_<id>
  7. mask = widest field mask among C, **per assignment scope**
  8. audit(actor, permission, resource, decision, reason, purpose)   # S3, S4, all denies
  9. ALLOW(mask)
```
Order matters: a missing permission must not reveal that the object exists beyond what the caller may already know (return 404 for out-of-scope object IDs, 403 for known-but-forbidden actions).

## 6. Field masks
- A permission can carry a mask (list of fields shown, masked or hidden), for example `employee:read` for `executive` shows aggregates only; for `dpo` shows names and masked IDs.
- Several matching assignments produce the **widest mask for the resource within the scope that grants it**. A mask never widens a different resource.
- Masked values are produced on the server; masked data is never sent to the client and hidden by CSS.
- Reveal of a government ID: `employee_identifier:reveal`, step-up, declared purpose, 30-second visibility, audited with the purpose.

## 7. Separation of duties
| Rule | Where enforced | Behaviour on violation |
|---|---|---|
| SoD-1 preparer ≠ approver (static) | assignment proposal and approval | proposal rejected, no exception |
| SoD-1 approver ≠ preparer or rule author (dynamic) | `authorize()` on `payroll_run:approve` | DENY `SOD_1` |
| SoD-2 no self-approval | `authorize()` on every `:approve` | DENY `SOD_2`, workflow routes upward |
| SoD-3 second approver for privileged grants | assignment workflow | stays `proposed` until a different approver acts |
| SoD-4 platform realm separate | identity realm, no tenant assignment possible | cannot be created |
| SoD-5 admin ≠ HR or payroll | assignment proposal | rejected unless an exception is approved (≤ 90 days) |
| SoD-6 DPO ≠ admin | assignment proposal | same |
| SoD-7 auditor read only | assignment proposal | rejected, no exception |
Exceptions are rows in `sod_exception` (rule, approver, expiry, reason) referenced by the assignment, listed in the quarterly access review, and expire automatically.

## 8. Delegation
- A manager can delegate `leave:approve` and `attendance:approve` for a fixed period to another employee. Delegation creates a time-boxed assignment with `scope=team` and `granted_by=delegator`.
- Cannot delegate: payroll approval, role administration, DPO functions, anything S3 or S4 write.
- The delegate gains nothing the delegator did not hold, and SoD-2 still applies to the delegate.
- Delegations end when either party separates, and are visible in "My roles".

## 9. Step-up and purpose
Step-up (re-authentication with passkey or TOTP, valid 5 minutes) is required for payroll approval and finalization, bank detail changes, government-ID reveal, role changes, sensitive exports and tenant data export. Purpose is a short controlled list plus free text, stored with the audit event. Bulk reads of S3 or S4 data without purpose are denied.

## 10. Where it is enforced
| Layer | Check |
|---|---|
| API route | `authorize()` before any handler logic; routes without a declared permission fail the build (route table test) |
| Service | object-level checks with the loaded resource (scope needs the resource's owner, org unit, pay group) |
| Domain | dynamic SoD and state-machine rules (payroll run status, leave status) |
| Database | RLS by `tenant_id`; self-only tables get an extra policy; no `BYPASSRLS` role in the app |
| Reports and exports | row filtering and masks applied in the query, then re-checked before file generation |
| Background jobs | run as a service principal with an explicit permission list and the originating actor recorded |
| UI | navigation filtering from `effectiveAccess()`; not a control |

## 11. Caching and invalidation
The session holds a snapshot of active assignment ids and a version number. Anything that changes access increments the user's `access_version`; the next request notices the mismatch, reloads, and rotates the session. Reporting-line and org changes increment an affected-users batch. Maximum staleness without a change event: 60 seconds for scope sets, zero for assignment changes.

## 12. Failure modes and responses
| Failure | Response |
|---|---|
| Assignment table unreachable | fail closed: deny all except health check |
| Scope resolver error | deny the single check, log with correlation id, alert on rate |
| Conflicting masks | take the narrower mask and alert (bug in catalog) |
| Reporting-line cycle detected | reject the write; if found at read, treat manager scope as empty and alert |
| Permission referenced but not in catalog | build fails; at runtime deny |

## 13. Reason codes (stable, documented for support)
`NO_PERMISSION_IN_SCOPE`, `STEP_UP_REQUIRED`, `PURPOSE_REQUIRED`, `SOD_1` to `SOD_7`, `ASSIGNMENT_EXPIRED`, `ACCOUNT_SUSPENDED`, `TENANT_SUSPENDED`, `OUT_OF_SCOPE_OBJECT` (returned to the client as 404).

## 14. Testing
- **Generated matrix test:** for every (role, permission, scope) the catalog generates an allow case and an out-of-scope deny case.
- **SoD property tests:** randomised sequences of grants, requests and approvals; the invariant "no one approves their own request and no account holds a forbidden pair without a live exception" must hold.
- **Tenant isolation test:** every table and every route is exercised as tenant A against tenant B ids.
- **Route coverage:** a test lists all routes and fails if a route lacks a permission declaration.
- **Seed scenarios:** the [seed](../../db/seed/README.md) includes the multi-role people from the worked examples, a manager loop, a time-boxed auditor and an SoD exception, so tests and demos use realistic access shapes.
- **Mutation testing** on the policy function (Stryker) with a target score agreed in [quality-gates](../05-quality/quality-gates.md).

## 15. Out of scope for v1
Attribute-based policy engine (OPA or Cedar), per-field user-defined policies, customer-managed keys. Revisit triggers are in ADR-013 alternatives.
