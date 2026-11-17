# Wireframes

Low-fidelity ASCII wireframes for every screen in [app-flow §8](../app-flow.md). They define structure, content, states, and rules, not final visuals.

## Design direction (revised 2026-11-17, [ADR-014](../../03-design/adr/ADR-014-ui-design-language.md); full spec in [ui-design-system](../../03-design/ui-design-system.md))
- **Style:** International Typographic (Swiss) Style on a personnel-file metaphor. Modular 12-column grid, flush-left text, hairline rules, no card boxes, no shadows. Replaces the v0.1 "ledger" identity; the ledger look survives only inside payroll tables (ruled rows, right-aligned tabular figures).
- **Type:** Archivo headings, IBM Plex Sans interface, IBM Plex Mono identifiers. Tabular numerals for money and hours.
- **Palette:** paper `#F4F1EA`, ink `#16181D`, one vermilion accent `#D6401F`; semantic success, warning and error only for status. Light theme only in v1.
- **Signature:** the file-tab catalogue strip on every record (`EMP-0042 · 201 FILE · ACTIVE`) and the workspace tab strip for multi-role users.
- **Shape:** radius 0 (inputs 2 px), 1 px rules, 2 px heavy rule above section heads, focus ring 2 px accent offset 2 px.
- **Density:** dense tables for HR and payroll (desktop first), roomy single-column flows for self-service (mobile first).
- **Copy:** plain and specific, verbs on buttons, no exclamation marks or emoji. Pesos `₱1,234.56`, negative `−₱1,234.56` in the error colour.
- **Role awareness:** the top bar shows only the workspaces the user's role assignments allow (Me, Team, HR, Payroll, Admin, Privacy, Audit). It filters navigation; it never grants access ([ADR-013](../../03-design/adr/ADR-013-multi-role-access-model.md)).
- **Motion and accessibility:** 150 ms state changes only; WCAG 2.2 AA, keyboard first, visible labels, status never by colour alone, 44 px touch targets on mobile.

## Conventions used below
```
[Button]   primary action        (Button)  secondary       <link>  link
[____]     text input            [v ____]  select          [x]/[ ]  checkbox
(•)/( )    radio                 ░░░░      skeleton/loading  ▒▒▒▒  masked value
{!}        error or exception    {i}       info note         ⌛      pending
```
Each screen lists: **Purpose · Roles · Layout · States · Rules · Stories**. Breakpoints: ≥1024 desktop (HR/payroll), 360–767 mobile (ESS/MSS). Shell: top bar (tenant, search, user), left nav (role-aware) on desktop, bottom tab bar on mobile ESS.

## Files
| File | Screens |
|---|---|
| [01-shell-auth-home.md](01-shell-auth-home.md) | Login, MFA, Home (by role), app shell |
| [02-employee-self-service.md](02-employee-self-service.md) | My payslips, leave, attendance, profile, documents, requests |
| [03-manager.md](03-manager.md) | Approvals inbox, team calendar |
| [04-hr-core.md](04-hr-core.md) | Employee list, profile, import wizard, org, onboarding/offboarding |
| [05-time-leave.md](05-time-leave.md) | Schedule editor, attendance grid, holiday calendar, leave settings |
| [06-payroll.md](06-payroll.md) | Pay periods, run workspace, payslip + explain drawer, loans, statutory exports |
| [07-admin-privacy.md](07-admin-privacy.md) | Roles, workflows, rule sets, privacy console, DSR, audit viewer |

## Review checklist per screen
- [ ] Empty, loading, error, partial, and no-permission states shown
- [ ] Sensitive fields masked by default with reveal-with-reason
- [ ] Destructive/irreversible actions need confirm (and step-up where required)
- [ ] Works at 360 px (ESS) / keyboard-only (all)
- [ ] Copy reviewed for plainness
