# Wireframes

Low-fidelity ASCII wireframes for every screen in [app-flow §8](../app-flow.md). They define structure, content, states, and rules, not final visuals.

## Design direction (revised, [ADR-015](../../03-design/adr/ADR-015-ui-design-language-revised.md); full spec in [ui-design-system](../../03-design/ui-design-system.md))
- **Character:** calm, precise, trustworthy, like Linear or Stripe Dashboard. Gray-50 background, white surfaces, 1 px gray borders, shadows only on overlays.
- **Colour:** gray text, one blue accent (`#2563EB`) for the primary action, selection, focus and links only. Status colours appear only inside badges, as text plus a dot, never colour alone.
- **Type:** IBM Plex Sans throughout, Plex Mono only for identifiers, reason codes and table amounts. Scale 12, 13, 14, 16, 20, 24; body and tables 14; tabular numerals; numbers right-aligned.
- **Shape and space:** radius 6 px (dialogs 8 px), 4 px base unit, rows 40 px (compact 32 px).
- **Layout:** 48 px top bar with the workspace strip, 240 px sidebar, page header with breadcrumb, title and one primary action. Mobile: bottom navigation for Me and Team, drawer for the rest.
- **Density:** HR, Payroll, Admin and Audit are table-first; Me and Team are mobile-first lists with large targets.
- **Copy:** plain and specific, verbs on buttons, reason codes explained in words, no filler.
- **Role awareness:** the top bar shows only workspaces the user's effective access allows. It filters navigation; it never grants access ([ADR-013](../../03-design/adr/ADR-013-multi-role-access-model.md)).
- The ASCII wireframes below describe structure and content. Where they mention the earlier ledger or index-tab look, ADR-015 wins.

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
