# Access Control

## Authentication
- OIDC via managed provider (ADR-006). Passkeys (WebAuthn) preferred; TOTP fallback; SMS OTP not offered as sole factor.
- MFA mandatory for HR, Payroll, Finance, DPO, Admin, Auditor roles; recommended for all.
- Password policy per NIST 800-63B: length ≥ 12, no composition rules, breached-password screening, no periodic rotation.
- Lockout/slowdown after 5 failures; generic error messages; credential-stuffing detection.
- Step-up (re-auth) required for: approve/finalize payroll, change bank details, reveal government IDs, role changes, export of sensitive data.

## Sessions
- Server-side session store; cookie `__Host-` prefix, HttpOnly, Secure, SameSite=Lax (Strict for admin).
- Idle timeout 30 min (privileged 15 min), absolute 12 h. Rotation on privilege change. Concurrent session list and revoke.
- Access tokens (API clients) ≤ 15 min; refresh rotation with reuse detection.

## Authorization
- Central `authorize()` (LLD §7). Matrix: [rbac-matrix](../02-requirements/access/rbac-matrix.md). Model: one account, many scoped role assignments ([ADR-013](../03-design/adr/ADR-013-multi-role-access-model.md), [roles-and-permissions](../02-requirements/access/roles-and-permissions.md)).
- MFA is required if **any** active assignment is a granted role other than `recruiter` (the derived `employee` and `manager` roles alone do not require it, though it is advised).
- Granting `payroll_*`, `dpo` or `tenant_admin` needs a second approver; static SoD pairs are rejected at proposal time (SoD-1, SoD-5, SoD-6, SoD-7).
- Assignment changes rotate the session and are audited with grantor, approver and reason. Quarterly access review lists every assignment, every SoD exception and every `auditor` grant with its expiry.
- The workspace switcher in the UI hides navigation only. Authorization always uses the full active assignment set.
- Scope resolved from reporting line as-of-today; delegation time-boxed and audited.
- Object IDs are UUIDv7; authorization never relies on ID obscurity.
- DB layer: RLS tenant isolation; optional additional RLS for self-only tables (defence in depth).

## Separation of duties
SoD-1…SoD-4 in RBAC matrix. Enforced in domain layer and tested.

## Privileged access
- Platform ops: no standing production DB access. **Break-glass**: ticket + approver, time-boxed (≤ 60 min) credential, session recorded, tenant notified, audited.
- Admin accounts separate from daily accounts; hardware key required.
- Service accounts: least privilege, per-environment, rotated, workload identity (no static cloud keys).

## Joiner/Mover/Leaver
Employee separation triggers: ESS access disabled at effective date, manager-scope cleaned, delegations revoked, device sessions killed. Quarterly access review report for tenant admins; platform access reviewed monthly.

## API clients
OAuth2 client credentials, per-tenant scopes, secret rotation, IP allow-list optional, rate limits, webhook signing.
