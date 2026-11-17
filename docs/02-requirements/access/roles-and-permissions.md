# Roles, Permissions and Role Assignments

Decision: [ADR-013](../../03-design/adr/ADR-013-multi-role-access-model.md). Matrix view: [rbac-matrix](rbac-matrix.md). Seed: [db/seed](../../../db/seed/README.md).

## 1. Vocabulary
| Term | Meaning |
|---|---|
| User account | A sign-in identity (one per human). May link to zero or one employee. |
| Person | The employee record. Separate from the account so access can end without deleting HR history. |
| Permission | `resource:action`, the only thing code checks. Has a sensitivity class (S0 public, S1 internal, S2 personal, S3 sensitive personal, S4 financial or secret). |
| Role | A named bundle of permissions. System roles are fixed by us; tenant custom roles combine existing permissions. |
| Role assignment | user + role + scope + validity + grantor + approver + reason. The unit of access. |
| Scope | Where a permission applies: `self`, `team`, `org_unit` (with subtree), `pay_group`, `tenant`. |
| Workspace | A UI lens (Me, Team, HR, Payroll, Admin, Privacy, Audit). Filters navigation only. |

## 2. System roles (13)
| # | Role code | Kind | Default scope | Mandatory MFA | Notes |
|---|---|---|---|---|---|
| 1 | `employee` | derived | self | no (advised) | Any account linked to an active employee. Baseline for everyone. |
| 2 | `manager` | derived | team | no (advised) | Any employee with active direct or indirect reports. Gone when the reporting line ends. |
| 3 | `executive` | granted | tenant (aggregates only) | yes | Owner or GM. Headcount and cost dashboards, masked individual data. |
| 4 | `timekeeper` | granted | tenant or org_unit | yes | Schedules, time logs, attendance corrections. No pay data. |
| 5 | `hr_admin` | granted | tenant | yes | Employee records, 201 files, leave policy, onboarding and offboarding. No pay approval. |
| 6 | `payroll_preparer` | granted | pay_group | yes | Builds and submits runs, loans, statutory files. Cannot approve. |
| 7 | `payroll_approver` | granted | tenant | yes | Reviews and approves or returns runs, approves rule-set changes. Cannot prepare. |
| 8 | `tenant_admin` | granted | tenant | yes (hardware key) | Users, roles, SSO, workflow config, integrations. No payroll or HR record access. |
| 9 | `dpo` | granted | tenant | yes | Privacy console, DSRs, breach log, retention approval. |
| 10 | `auditor` | granted, time-boxed | tenant (read only) | yes | External auditor or DOLE inspector. Read and export under a declared purpose. |
| 11 | `recruiter` | granted | tenant (candidates only) | no | Defined now, disabled until the ATS module (post-GA, ADR-012). |
| 12 | `platform_ops` | platform realm | platform | yes (hardware key) | No standing tenant access. Break-glass only (SoD-4). |
| 13 | `custom:*` | tenant-defined | any | per sensitivity | Combines existing permissions only. |

## 3. Permission catalog (excerpt, full list is generated from `permission` table)
Format: `resource:action` ... sensitivity ... roles holding it by default.

| Permission | Class | Held by (default) |
|---|---|---|
| `profile:read` / `profile:request_change` | S2 | employee (self) |
| `employee:read` | S2 | manager (team, basic fields), hr_admin, payroll_preparer, executive (masked), dpo (masked), auditor |
| `employee:write` | S2 | hr_admin |
| `employee_identifier:reveal` | S3 | hr_admin, dpo (step-up and purpose) |
| `employee_medical:read` / `:write` | S3 | hr_admin |
| `compensation:read` | S4 | employee (self), hr_admin, payroll_preparer, payroll_approver, auditor |
| `compensation:write` | S4 | payroll_preparer (change request), payroll_approver (approve) |
| `document:read` / `:write` | S2/S3 | employee (self, limited), hr_admin, dpo, auditor |
| `schedule:read` / `:write` | S1 | employee (self), manager (team), timekeeper, hr_admin |
| `attendance:read` / `:correct` | S2 | employee (self), manager (team), timekeeper |
| `attendance:approve` | S2 | manager (team) |
| `leave:request` | S1 | employee (self) |
| `leave:approve` | S1 | manager (team), hr_admin |
| `leave_policy:write` | S1 | hr_admin |
| `payroll_run:read` / `:prepare` / `:submit` | S4 | payroll_preparer |
| `payroll_run:approve` / `:return` | S4 | payroll_approver |
| `payslip:read` | S4 | employee (self), payroll_preparer, auditor |
| `statutory_export:generate` | S4 | payroll_preparer, payroll_approver |
| `rule_set:draft` / `:approve` | S1 | payroll_preparer / payroll_approver |
| `loan:read` / `:write` | S4 | employee (self read), payroll_preparer |
| `report:headcount` / `:cost` | S2/S4 | executive, hr_admin / payroll_approver, executive |
| `workflow:configure` | S1 | tenant_admin |
| `user:manage` / `role_assignment:propose` | S3 | tenant_admin |
| `role_assignment:approve` | S3 | a second tenant_admin, or dpo for payroll and DPO roles |
| `dsr:file` / `:process` | S2 | employee (file), dpo (process) |
| `audit:read` | S2 | dpo, tenant_admin, auditor |
| `tenant_data:export` | S4 | tenant_admin (dpo approves) |

## 4. Role assignment
Fields: `user_id`, `role_id`, `scope_type`, `scope_ref`, `valid_from`, `valid_to`, `granted_by`, `approved_by`, `reason`, `sod_exception_id`, `status` (`proposed`, `active`, `ended`, `rejected`). Effective-dated like all history ([ADR-008](../../03-design/adr/ADR-008-effective-dating.md)); never updated in place, ended and re-created.

Rules:
1. A proposer cannot approve their own proposal (SoD-2, SoD-3).
2. Assignments to `payroll_preparer`, `payroll_approver`, `dpo` and `tenant_admin` need a second approver.
3. `auditor` assignments must have `valid_to` (maximum 90 days, renewable).
4. Derived roles are computed at request time, never stored as assignments.
5. **Bootstrap:** the first one or two `tenant_admin` assignments are created at tenant provisioning by the platform onboarding procedure (flag `is_bootstrap`, no proposer or approver, reason recorded). They are listed in the first access review and are the only assignments allowed without a second approver. Later admins need one.
6. Ending employment ends every granted assignment at the effective date, in the same transaction, and revokes sessions.

## 5. Resolution algorithm
```
authorize(actor, permission, resource, purpose?):
  assignments = active assignments for actor at now()   # + derived employee/manager
  candidates  = assignments whose role grants `permission`
  allowed     = any candidate whose scope contains `resource`
                 self       -> resource.employee_id == actor.employee_id
                 team       -> resource.employee_id in reporting-line subtree(actor.employee_id) as of today
                 org_unit   -> resource.org_unit_id in subtree(scope_ref)
                 pay_group  -> resource.pay_group_id == scope_ref
                 tenant     -> always (tenant already isolated by RLS)
  if not allowed                          -> DENY (default)
  if permission.class >= S3 and no step-up in last 5 min -> REQUIRE_STEP_UP
  if permission needs purpose and not purpose            -> REQUIRE_PURPOSE
  if dynamic SoD rule violated (see section 6)           -> DENY with reason code
  audit(decision); return ALLOW (with field masks from the matching candidates; the widest mask wins)
```
Field masks: if one assignment gives masked access and another full access, the result is full access **for the resource in the scope of the assignment that grants it**; masks never leak across scopes.

## 6. Separation of duties
| ID | Type | Rule |
|---|---|---|
| SoD-1 | Static + dynamic | `payroll_preparer` and `payroll_approver` cannot be assigned to one account; and the approver of a run can never be its preparer. |
| SoD-2 | Dynamic | No one approves their own request (leave, OT, profile change, pay change, loan), including when they hold the approving permission themselves. |
| SoD-3 | Process | Granting `payroll_*`, `dpo` or `tenant_admin` needs a second approver who is not the proposer. |
| SoD-4 | Static | Platform operators hold no tenant assignments; access is break-glass. |
| SoD-5 | Static | `tenant_admin` cannot hold `payroll_preparer`, `payroll_approver` or `hr_admin` (admin could grant themselves data access). |
| SoD-6 | Static | `dpo` cannot hold `tenant_admin` (conflict of interest in privacy oversight). |
| SoD-7 | Static | `auditor` cannot hold any role with a write permission in the same tenant. |

Exceptions (small tenants): allowed only with a recorded exception (second approver, expiry within 90 days, listed in the quarterly access review). SoD-1 and SoD-4 have **no exceptions**.

## 7. Worked examples
| Person | Assignments | Effective result |
|---|---|---|
| Hana, HR admin, also manages the HR clerk | derived `employee`, derived `manager` (team of 1), granted `hr_admin` | Files own leave (approved by her manager, not herself), approves her clerk's leave, edits all records. Cannot approve her own leave (SoD-2). |
| Faye, finance controller | derived `employee`, granted `payroll_approver` | Approves runs. A proposal to add `payroll_preparer` is rejected by SoD-1. |
| Owner Rico, interim DPO | derived `employee`, `executive`, `dpo` | Sees dashboards and privacy console. Adding `tenant_admin` is rejected (SoD-6) unless an exception is approved. |
| Ines, IT | derived `employee`, `tenant_admin` | Manages users and roles. Cannot open a payslip or a 201 file. |
| External auditor | `auditor`, `valid_to` 60 days | Read and export under a declared purpose; ends automatically. |

## 8. Testing
The catalog and matrix are machine-readable (`db/seed/` loads them). Tests are generated: for every (role, permission, scope) a positive and a negative case; every SoD rule has a property test that tries to violate it ([testing-strategy](../../05-quality/testing-strategy.md)).
