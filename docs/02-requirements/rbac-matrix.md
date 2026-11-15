# RBAC Matrix

Scopes: **S** self · **T** team (direct/indirect reports) · **D** department · **C** company · **P** platform (operator).
Legend: R read · C create · U update · D delete · A approve · X export · M masked read. Blank = no access. Deny by default.

| Capability | Employee | Manager | HR Admin | Payroll Officer | Finance | DPO | Sys Admin | Auditor (RO) | Platform Ops |
|---|---|---|---|---|---|---|---|---|---|
| Own profile | R,U(req) S | | | | | | | | |
| Employee basic info | S | R T | RCU C | R C | R(M) C | R(M) C | | R C | |
| Gov IDs | R S | | RU C | R C | | R(M) C | | R(M) C | |
| Salary/compensation | R S | | R C | RCU C | R C | | | R C | |
| Documents (201) | R S(limited) | | RCUD C | | | R C | | R C | |
| Medical/disciplinary | | | RCU C | | | | | | |
| Schedules | R S | R T | RCU C | R C | | | | R C | |
| Time logs/attendance | R S | R,A T | RCU C | RU C | | | | R C | |
| Leave request/approve | RC S | A T | RCUA C | R C | | | | R C | |
| Payroll run | | | | RCU, submit C | A C | | | R C | |
| Payslip | R S | | | R C | R C | | | R C | |
| Statutory reports | | | | RCX C | RX C | | | R C | |
| Rule sets | | | | RCU (draft) | A | | R | R | |
| Loans | R S | | | RCU C | R C | | | R C | |
| Workflow config | | | R | | | | RCU | | |
| Roles/users | | | | | | | RCU C | | |
| Privacy console/DSR | RC S | | R | | | RCUA C | | R C | |
| Audit log | | | | | | R C | R C | R C | R(P, no tenant PII) |
| Tenant data export | | | | | | A | RX C | | |
| Production data access | | | | | | | | | **Break-glass only**, logged, time-boxed, tenant consent |

## Separation of duties (SoD)
- SoD-1 Payroll preparer ≠ approver ≠ role admin who granted rights.
- SoD-2 Users cannot approve their own requests (leave, OT, profile, pay change).
- SoD-3 Role/permission changes require a second admin approval for payroll and DPO roles.
- SoD-4 Platform operators have no standing access to tenant data (break-glass, ADR-004).

## ABAC conditions
Manager scope computed from the effective-dated reporting line. Delegation is time-boxed. Sensitive fields require both permission and a valid purpose (declared on bulk read/export).
