# Change Record 2026-11-17: multi-role access, restructure, design language, seed

Branch `docs/multi-role-restructure`. Requested by the owner: act as a senior HRIS engineer, make the system multi-role, restructure the documentation to a standard, add a decision table, design an industry-recognised (not generated-looking) frontend, produce an HLD with an HTML version for review first, and create seed data. Later additions: app flow, security overview, authorization, security operations and design architecture documents.

Status: **proposed for owner review.** Nothing here changes code (there is none yet). The owner decides whether to merge.

## 1. Decision table
| ID | Area | Before | After | Why | Alternatives rejected | Reversible by |
|---|---|---|---|---|---|---|
| C-01 | Access model | Nine roles as matrix columns, read as one role per user | One account, many scoped, effective-dated role assignments; permissions are checked, role names are not | Real staff wear several hats; one-role forces duplicate accounts or super-roles | One role per user; role names in code; full ABAC engine now | New ADR superseding ADR-013 |
| C-02 | Roles | 9 roles, Payroll Officer and Finance mixed prepare and approve | 12 system roles: employee and manager derived; executive, timekeeper, hr_admin, payroll_preparer, payroll_approver, tenant_admin, dpo, auditor, recruiter (disabled), platform_ops | Standard HRIS split; makes SoD enforceable | Keep nine | Edit the role table and seed |
| C-03 | Derived roles | Implicit | `employee` and `manager` computed from employment and reporting line | Cannot drift from the org chart | Grant manually | ADR-013 |
| C-04 | Separation of duties | 4 rules in prose | 7 rules, static pairs rejected at assignment, dynamic rules in `authorize()`, exceptions only for SoD-5 and SoD-6, 90 days, second approver | Auditable and testable; SoD-1 has no exception by design | Policy text only | Owner may allow an SoD-1 exception (open question, HLD §13) |
| C-05 | Bootstrap | Not addressed | First one or two `tenant_admin` assignments created at provisioning (flag `is_bootstrap`) | Otherwise the second-approver rule can never start | Allow self-approval once | roles-and-permissions rule 5 |
| C-06 | UI role switching | Home by role | Workspace strip (Me, Team, HR, Payroll, Admin, Privacy, Audit, Dashboards) as a view filter; no impersonation | Multi-role users need orientation without a security change | Impersonation; separate logins | ADR-013, ADR-014 |
| C-07 | Design language | "Ledger" metaphor, private | International Typographic (Swiss) Style, personnel-file metaphor, exact tokens and fonts, contrast verified | A recognised style fits the all-day, dense-data use; owner rejects generated-looking UI | Material, neo-brutalism, ledger everywhere, dark dashboard | ADR-014 |
| C-08 | Fonts | Candidates only | Archivo, IBM Plex Sans, IBM Plex Mono, self-hosted | Privacy (no CDN), identity | System fonts, Inter | ui-design-system |
| C-09 | Document structure | HLD at `03-design/` root, RBAC at `02-requirements/` root | HLD in `03-design/hld/` with md, HTML and UI preview; access docs in `02-requirements/access/`; `db/` for schema and seed | Related artifacts live together; reviewable without tooling | Leave flat; rename all folders (too many broken links for little gain) | git revert |
| C-10 | HLD | v0.1 text and diagrams | v0.2: C4-style levels, access architecture, frontend architecture, key flows, HLD decision table D-01 to D-12, self-contained HTML with a role explorer | Owner asked to check the HLD visually first | Mermaid only | Edit md; HTML is generated from the same content |
| C-11 | App flow | Module navigation | Workspace navigation, sign-in resolution, role assignment lifecycle, SoD-aware approval routing | Matches C-01 and C-06 | | app-flow.md |
| C-12 | Security docs | Four topic files | Added `authorization.md` (decision procedure, scopes, masks, SoD, caching, tests) and `security-operations.md` (calendar, 12 detections, privileged access, keys, vulnerability SLAs); README and access-control updated | Design controls needed an operating model | Fold into access-control | Split or merge files |
| C-13 | Design architecture | Not documented | `03-design/design-architecture.md`: layers, repository layout, role-aware shell, state, responsive, accessibility, gates | Keeps C-07 consistent as the UI grows | Style guide only | |
| C-14 | Seed data | None | Deterministic generator, `seed.sql`, schema subset, verifier with 20 mutation-tested checks; synthetic tenant with 26 employees, `DEV-` identifiers, no real rates | Tests, demos and the UI preview need realistic access shapes | Hand-written SQL; anonymised production data | Delete `db/` |
| C-15 | Commit and push policy | Single-commit rule (branching.md) | For this change only: one commit and one push **per file**, on a branch, not `main` | Owner instruction on 2026-11-17: "push per file" | Squash into one commit | The single-commit rule stays in force for later work |
| C-16 | Data model | No access tables | Added `user_account`, `role`, `permission`, `role_permission`, `role_assignment`, `sod_rule`, `sod_exception` | Support C-01 and C-04 | | data-model.md |

## 2. Files
**New:** ADR-013, ADR-014, `02-requirements/access/roles-and-permissions.md`, `03-design/ui-design-system.md`, `03-design/design-architecture.md`, `03-design/hld/hld.html`, `03-design/hld/ui-preview.html`, `04-security/authorization.md`, `04-security/security-operations.md`, this record, `db/schema/001_core_access.sql`, `db/seed/*`.
**Moved:** `02-requirements/rbac-matrix.md` to `access/rbac-matrix.md` (rewritten); `03-design/high-level-design.md` to `hld/high-level-design.md` (rewritten).
**Updated:** ADR index, data-model, low-level-design §7, access-control, security README, app-flow, personas, wireframes README and W-03, specs index, epics-and-stories link, docs README, root README, glossary, decisions register, branching.

## 3. Verification performed
- Seed: loaded into PostgreSQL via PGlite; 20 checks pass; four deliberate corruptions each made the matching check fail.
- Contrast of every palette pair computed; accent `#D6401F` is 4.0:1 on paper (below 4.5:1), so it is limited to marks and large text, and `#B53217` (5.4:1) is used for small accent text.
- HLD and UI preview rendered in headless Edge at desktop width and inspected; diagram label overflows found and fixed. Phone width was checked only partially (the headless window cannot go below about 500 px), so a real-device pass is still owed.
- Links: the moved files' inbound links were repointed (epics, specs, LLD, access-control, docs README). A full link checker has not been run.

## 4. Not done, for the owner
- Review and approve or change C-01 to C-16 (HLD checklist in `hld.html`).
- Decide whether SoD-1 should ever have an exception for a three-person firm.
- Counsel review of the retention and role-based access wording is still open (OD-12, GAP-03).
- A real-device mobile check, a full link check, and contrast verification of the final components once built.
- No statutory rate was added anywhere; every legal value stays tagged VERIFY.
