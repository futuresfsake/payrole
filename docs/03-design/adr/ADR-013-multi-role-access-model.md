# ADR-013: Multi-role access model (permissions, scoped and effective-dated role assignments)

Status: Accepted (2026-11-17). Supersedes the single-column role view in the v0.1 RBAC matrix. Related: [ADR-004](ADR-004-multitenancy-rls.md), [ADR-006](ADR-006-auth-provider.md), [ADR-008](ADR-008-effective-dating.md).

## Context
The v0.1 matrix listed nine roles as columns, which reads as "one user, one role". Real SME staff wear several hats: an HR Admin who is also a manager and an employee; a Finance lead who approves payroll but must never prepare it; a founder who is the interim DPO. A one-role model forces either duplicate accounts (breaks audit and SoD) or over-broad super-roles (breaks least privilege).

## Decision
1. **Three separate things.** A *user account* (who signs in), a *person* (the employee record, optional) and *role assignments* (what the account may do, where, and until when).
2. **Permissions are the unit of enforcement.** Code checks `resource:action` (for example `payroll_run:approve`), never a role name. A *role* is only a named bundle of permissions.
3. **A user holds many role assignments.** Each assignment carries a **scope** (`self`, `team`, `org_unit` with subtree, `pay_group`, `tenant`), `valid_from`/`valid_to`, who granted it, who approved it, and a reason. Effective permissions are the **union** of all active assignments, each limited to its own scope.
4. **Two roles are derived, not granted.** `employee` (any account linked to an active employee gets it, scope `self`) and `manager` (any employee with active direct or indirect reports gets it, scope `team`, computed from the effective-dated reporting line). They vanish when the fact stops being true.
5. **Separation of duties is enforced twice.** *Static SoD*: forbidden role pairs cannot be assigned to the same account (assignment is rejected). *Dynamic SoD*: object-level rules checked at action time (no self-approval, preparer is not approver of the same run). Both are domain code with tests, not UI hints.
6. **The workspace switcher is a view filter, not a security boundary.** A multi-role user picks a workspace (Me, Team, HR, Payroll, Admin) to narrow navigation. The server never trusts the selected workspace; it authorizes on the union every time.
7. **Sensitive actions need step-up and a declared purpose** regardless of how many roles the user holds ([access-control](../../04-security/access-control.md)).
8. **Tenant custom roles** (US-007) are allowed but may only combine existing permissions; they cannot create new permissions, and a custom role cannot include `role_assignment:*` or `payroll_run:approve` unless the second-approver rule is satisfied.
9. **Platform operators use a separate identity realm** and have no tenant role assignments; access is break-glass only (SoD-4).

## Consequences
- One account per human; audit trails stay attributable. Offboarding ends the person link and every assignment in one transaction.
- The permission catalog becomes an artifact that is versioned and tested; adding a feature means adding permissions and mapping them to roles.
- Authorization needs the active-assignment set per request. It is cached per session and invalidated on any assignment change or privilege rotation (session rotation already required by access-control).
- Static SoD can block legitimate small-company setups (a 3-person firm where the owner does everything). Mitigation: a documented **exception** with a second approver, an expiry and a quarterly review report, recorded as an assignment flag `sod_exception_id`.
- More tables (see [data-model](../data-model.md)) and a larger test matrix (generated from the catalog, not hand-written).

## Alternatives
- **Single role per user.** Rejected: duplicate accounts or super-roles.
- **Role names checked in code.** Rejected: every new role touches every check; custom roles impossible.
- **Full ABAC policy engine (OPA/Cedar) in v1.** Deferred: the scoped RBAC above covers the stated segment (OD-02); permission checks sit behind one `authorize()` function, so an engine can replace it later without touching callers.
- **Per-role separate logins.** Rejected: weakens MFA and audit, hurts usability.
