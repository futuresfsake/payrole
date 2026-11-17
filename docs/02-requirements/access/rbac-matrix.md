# RBAC Matrix (multi-role)

Companion to [roles-and-permissions](roles-and-permissions.md) and [ADR-013](../../03-design/adr/ADR-013-multi-role-access-model.md). A user holds **several** roles; effective access is the union of their active assignments, each limited to its own scope. Read a column as "what this role adds", not "what a person with only this role can do".

Scopes: **S** self · **T** team · **O** org unit (subtree) · **G** pay group · **C** tenant · **P** platform.
Legend: R read · C create · U update · D delete · A approve · X export · M masked read · Rq request only. Blank = no access (deny by default). `recruiter` is defined but disabled until the ATS module, so it has no column.

| Capability | employee | manager | executive | timekeeper | hr_admin | payroll_preparer | payroll_approver | tenant_admin | dpo | auditor | platform_ops |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Own profile | R, Rq S | | | | | | | | | | |
| Employee basic info | R S | R T | M C | R O/C | RCU C | R G | R(M) C | | R(M) C | R C | |
| Government IDs | R S | | | | RU C (reveal: step-up) | R G | | | R(M) C | R(M) C | |
| Compensation | R S | | M C (aggregate) | | R C | RCU G (change request) | R, A C | | | R C | |
| Documents (201) | R S (limited) | | | | RCUD C | | | | R C | R C | |
| Medical / disciplinary | | | | | RCU C | | | | | | |
| Schedules, holidays | R S | R T | | RCU O/C | RCU C | R G | | | | R C | |
| Time logs, attendance | R S | R, A T | | RCU O/C | RCU C | R G | | | | R C | |
| Leave request / approve | RC S | A T | | | RCUA C | R G | | | | R C | |
| Payroll run | | | | | | RCU, submit G | R, A, return C | | | R C | |
| Payslip | R S | | | | | R G | | | | R C | |
| Statutory exports | | | | | | RCX G | RX C | | | R C | |
| Rule sets | | | | | | RCU (draft) | A | R | | R C | |
| Loans | R S | | | | | RCU G | R C | | | R C | |
| Headcount reports | | R T | R C | | R C | | | | | R C | |
| Payroll cost reports | | | R C | | | R G | R C | | | R C | |
| Workflow config | | | | | R | | | RCU C | | | |
| Users and role assignments | | | | | | | | R, propose C | R, A (payroll, DPO roles) | R C | |
| Privacy console / DSR | RC S | | | | R | | | | RCUA C | R C | |
| Audit log | | | | | | | | R C | R C | R C | R (P, no tenant PII) |
| Tenant data export | | | | | | | | RX C | A | | |
| Production data access | | | | | | | | | | | **Break-glass only**, logged, time-boxed, tenant consent |

## Typical combinations
| Person type | Granted roles (plus derived `employee`, and `manager` if they have reports) |
|---|---|
| Founder / GM | `executive` (+ `dpo` interim, OD-14) |
| HR lead | `hr_admin` |
| Payroll clerk | `payroll_preparer` (+ `timekeeper` allowed) |
| Finance controller | `payroll_approver` |
| IT | `tenant_admin` |
| Office timekeeper | `timekeeper` scoped to an org unit |
| External auditor | `auditor` with `valid_to` |

## Forbidden combinations (static SoD)
| Pair | Rule | Exception allowed |
|---|---|---|
| `payroll_preparer` + `payroll_approver` | SoD-1 | No |
| `tenant_admin` + (`payroll_preparer`, `payroll_approver`, `hr_admin`) | SoD-5 | Yes, second approver, ≤ 90 days |
| `dpo` + `tenant_admin` | SoD-6 | Yes, same terms |
| `auditor` + any role with a write permission | SoD-7 | No |
| `platform_ops` + any tenant role | SoD-4 | No |

## Dynamic rules (checked per action)
- SoD-2: no self-approval of leave, overtime, profile, pay change or loan, including when the user holds the approving permission themselves.
- SoD-1: the approver of a payroll run is never its preparer or the author of a rule-set version in it.
- SoD-3: role assignments to payroll, DPO and admin roles need a second approver who is not the proposer.

## ABAC conditions
Manager scope comes from the effective-dated reporting line as of today. Delegation is time-boxed and audited. Sensitive fields (class S3, S4) need the permission, a valid declared purpose on bulk read or export, and a step-up in the last 5 minutes.
