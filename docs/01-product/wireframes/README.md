# Wireframes

Low-fidelity ASCII wireframes for every screen in [app-flow §8](../app-flow.md). They define structure, content, states, and rules, not final visuals.

## Design direction (decided first, per owner's rule against generic "vibecoded" UI)
- **Identity: the ledger.** Payroll is accounting; the product looks like a well-kept ledger book: ruled rows, right-aligned tabular figures, thin rules instead of cards, section headers like ledger headings. No dashboard card grids, no gradient hero blocks.
- **Typography:** non-system fonts. Headings and figures in a serif with good numerals (candidates: Source Serif 4, Newsreader), UI text in a humanist sans (candidates: Public Sans, Instrument Sans). Tabular lining numerals for all money. Final choice at M0 design-system story.
- **Palette (restricted):** paper off-white background, ink near-black text, one muted green-black accent for primary actions, one brick red for errors/negative, one ochre for warnings. Nothing else. Dark mode inverts paper/ink, same accents adjusted for contrast. Every pair ≥ WCAG AA.
- **Shape:** radius ≤ 6 px, 1 px rules, no drop shadows (use rules and tint), focus ring 2 px solid accent offset 2 px.
- **Density:** dense tables for HR/payroll (desktop-first), roomy single-column flows for ESS (mobile-first).
- **Copy:** plain, specific, no exclamation marks or emoji; buttons are verbs ("Approve payroll", not "Let's go"). Errors say what happened and what to do. Pesos shown `₱1,234.56`, negative in red with minus sign (not parentheses only).
- **Motion:** none except focus and 150 ms state changes; respects reduced motion.
- **Accessibility:** keyboard first, visible labels (no placeholder-as-label), error summaries, tables with proper headers, touch targets ≥ 44 px on ESS, text scale to 200%.

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
