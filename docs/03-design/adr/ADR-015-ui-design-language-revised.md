# ADR-015: UI design language: calm, precise business software

Status: Accepted (2026-11-17). **Supersedes [ADR-014](ADR-014-ui-design-language.md).** Related: [ADR-013](ADR-013-multi-role-access-model.md).

## Context
ADR-014 chose a Swiss-style, personnel-file look: paper background, vermilion accent, Archivo headings, mono catalogue strips, numbered headings and uppercase labels. On review the owner found the result still looked generated, and asked for the character of Linear or Stripe Dashboard applied to HR and payroll: calm, precise, trustworthy. An HRIS is used all day by people who are not payroll experts, so familiarity and legibility matter more than a distinctive metaphor.

## Decision
1. **Character:** calm, precise, trustworthy, table-first for dense work, list-first on mobile. Hierarchy comes from size, weight and spacing. Hairline borders group related content; shadows appear only on overlays.
2. **Colour:** app background `gray-50`, surfaces white, borders `gray-200`, text `gray-900` and `gray-600`. One accent, `blue-600 #2563EB` (hover `blue-700`, tint `blue-50`), used only for the primary action, selection, focus and links. Status colours (success, warning, danger, info, neutral) are for status badges only, as text plus a dot on a soft tint, never colour alone. No cream or beige.
3. **Type:** one sans family, IBM Plex Sans, self-hosted. IBM Plex Mono only for identifiers, run IDs, reason codes and amounts in tables. Scale 12, 13, 14, 16, 20, 24 px; body and table text 14. Tabular numerals everywhere; numeric columns right-aligned.
4. **Shape and space:** radius 6 px for controls, 8 px for dialogs. 4 px base unit. Table rows 40 px (32 px compact). Page padding 24 px desktop, 16 px mobile. Content max width 1280 px for forms and detail pages; tables are full width.
5. **Motion:** 150 to 200 ms ease-out, for state feedback only.
6. **Layout:** 48 px top bar (workspace strip, search, notifications, user menu), 240 px collapsible sidebar for the current workspace, page header with breadcrumb, title and at most one primary button. Mobile: bottom navigation for Me and Team, drawer for the rest.
7. **Banned:** gradients, glows, blur, gradient text, coloured shadows; heavy black rules and decorative dividers; uppercase letter-spaced eyebrow labels, mono status strips, version or draft badges and numbered section headings; emoji icons, heroes and illustrations; card grids as the default layout; hover scale or bounce; Inter, Roboto and system-font-only styling.
8. **Icons:** Lucide, one stroke weight, a limited set (about 24).
9. **Control borders:** inputs and controls use `gray-500` borders (4.8:1 on white). `gray-200` is only for decorative table and section borders, which fail the 3:1 non-text contrast rule on controls.
10. **Light theme only** in v1; tokens allow a dark theme later.
11. **Selected and active states** (navigation, tabs, rows): a neutral gray fill, the same font weight as unselected items, and the accent only as a thin 2 px bar or as the icon colour. No tinted accent pills and no bold accent text. Navigation items are full-width rows with an icon, never shrink-wrapped pills.
12. **Status display:** status is a word with a small dot in the status colour, with no filled capsule or tinted pill behind it.
13. **Status mapping:** approved is success, pending is warning, returned is info, overdue is danger, SoD-blocked is danger with a lock icon. Each has a word and an icon.

## Consequences
- Familiar patterns lower the learning curve. The visual risk moves from "distinctive" to "generic", so quality depends on spacing discipline, precise copy and real states, not on style.
- All Swiss-style artifacts (ui-design-system, wireframes direction, the HLD page and UI preview) are rewritten. The "catalogue strip" and "workspace strip as index tabs" ideas are dropped; the workspace strip stays as a top-bar control.
- Info status uses cyan, not blue, so the accent stays reserved for actions.
- Contrast was computed for every pair in this ADR: text 17:1 and 7.2:1, accent 5.2:1 on white, status text 4.8:1 or better on its tint.

## Alternatives
- **Keep ADR-014.** Rejected by the owner.
- **Material, Fluent or a stock component kit unmodified.** Rejected: instantly generic. shadcn/ui is used only as a base and is fully restyled to these tokens.
- **Dark-first dashboard.** Rejected: poor for long payroll review.
