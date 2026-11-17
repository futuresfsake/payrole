# Seed data

Synthetic development data for PayRole: one fictional tenant, **Casa Verde Trading Corp.** (`casa-verde-demo`), with 26 employees, 28 user accounts, 12 system roles, a 44-permission catalog, 15 role assignments, leave, schedules, pay periods and workflow definitions. "Today" in the data is **2026-11-17**.

## Safety rules
- Everything is invented. No real person, employer or number.
- Government identifiers are `DEV-SSS-0007-4821` style and are stored under a `devseed:` prefix. A check fails if any other pattern appears.
- Statutory rule sets are **placeholders** with no rates (`is_placeholder = true`). Real values are loaded through the rule-set import after verification (docs tag them VERIFY).
- Holidays and leave-type statutory days are placeholders as well; confirm against the proclamations and the law before use.
- Never load this into a customer or production database. Staging uses synthetic data only ([deployment](../../docs/06-operations/deployment.md)).

## Files
| File | Purpose |
|---|---|
| `../schema/001_core_access.sql` | Schema subset the seed needs (a dev aid until the M0 migrations exist; no RLS or encryption yet) |
| `generate.mjs` | Deterministic generator (fixed random seed, same output every run) |
| `seed.sql` | Generated seed, one transaction. **Do not edit by hand**; change `generate.mjs` and re-run |
| `people.json` | Employee list for the UI preview and tests (ids, numbers, departments, managers) |
| `verify.mjs` | Loads schema and seed into in-memory PostgreSQL (PGlite) and runs 20 invariant checks |

## Use
```
cd db/seed
npm install
npm run generate     # rewrites seed.sql and people.json
npm run verify       # loads and checks
```
Into a real PostgreSQL 16 database:
```
psql "$DATABASE_URL" -f ../schema/001_core_access.sql -f seed.sql
```

## Who is in it
Org: Executive Office, HR and Admin, Finance, IT and Systems, Operations with Sales and Warehouse and Logistics underneath. Two pay groups: Semi-monthly (operations) and Monthly (office).

| Person | Employee no. | Granted roles | Why they exist |
|---|---|---|---|
| Rico Casa, General Manager | EMP-0001 | `executive`, `dpo` | Owner with an interim DPO hat; second approver for payroll grants |
| Hana Reyes, HR Lead | EMP-0002 | `hr_admin`; temporary `tenant_admin` (from 2026-11-23, SoD-5 exception) | Multi-role manager; has a pending leave request she cannot approve herself |
| Faye Lim, Finance Controller | EMP-0003 | `payroll_approver` | A proposal to add `payroll_preparer` was **rejected** (SoD-1) |
| Ines Bautista, IT Lead | EMP-0004 | `tenant_admin` (bootstrap) | Can manage roles; no HR or payroll data |
| Marco Dizon, Operations Manager | EMP-0005 | none (derived `manager`) | Manager of a subtree two levels deep |
| Paolo Santos, Payroll Officer | EMP-0006 | `payroll_preparer` on both pay groups, `timekeeper` | One person, several scopes |
| Noel Aquino, IT Support | EMP-0010 | `tenant_admin` (bootstrap) | Second admin; approves the DPO grant |
| Mara Villar, Operations Assistant | EMP-0025 | `timekeeper` scoped to Warehouse and Logistics | Org-unit scope example |
| Dante Ramos, HR Clerk | EMP-0007 | none now; an **ended** `timekeeper` assignment | History example |
| Carla Mendoza | none | `auditor`, ends 2027-01-15 | External, no employee record, time-boxed |
| Platform On-call | none | `platform_ops` (platform realm) | Break-glass only, no tenant |
| Carlo Dela Cruz | EMP-0024 | none | Separated 2026-10-31; account disabled |
| Everyone else | | derived `employee` (and `manager` where they have reports) | Rank-and-file |

Scenarios covered for tests and demos: self-approval trap (Hana's request routes to Rico), team scope through the reporting line, org-unit scope, pay-group scope, time-boxed auditor, SoD-1 rejection, SoD-5 exception with expiry, bootstrap admins, a probationary employee, a contractual employee with a contract end date, a separated employee, a pending leave request chain, closed, open and scheduled pay periods.

Not seeded on purpose: time logs, attendance days, payroll runs and results, payslips, loans, audit log. They are produced by the engines and have their own golden fixtures ([payroll test cases](../../docs/05-quality/payroll-test-cases.md)).

## Checks (`verify.mjs`)
Counts and roles; SoD-1 and every static SoD pair (live exception or none); second approver on privileged grants; auditor end date within 90 days; exception length and expiry; one current manager each and no cycles in the reporting line; leave approver is never the requester and is the current manager; non-negative leave balances; separated employees have no live access; every identifier is a `DEV-` value; MFA for every holder of a granted role; rule sets carry no rates; the platform operator has no tenant; scope references resolve. The checks were mutation-tested: breaking the data on purpose (removing an exception, activating the rejected proposal, self-approving, removing an auditor end date) makes the matching check fail.
