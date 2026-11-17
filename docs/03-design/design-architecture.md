# Design Architecture (frontend and design system)

How the user interface is structured so that the Swiss-style language ([ADR-014](adr/ADR-014-ui-design-language.md)) stays consistent and the multi-role shell ([ADR-013](adr/ADR-013-multi-role-access-model.md)) stays safe. System architecture is in the [HLD](hld/high-level-design.md); look and feel in [ui-design-system](ui-design-system.md); live example in [ui-preview](hld/ui-preview.html).

## 1. Layers (each depends only on the layer above it in this list)
| Layer | What it holds | Rule |
|---|---|---|
| 1. Tokens | colour, type scale, spacing (8 px), rules, focus ring, motion | One CSS file of custom properties; the only place raw hex values exist |
| 2. Primitives | accessible unstyled behaviour (Radix or React Aria): dialog, menu, tabs, combobox, tooltip | No visual decisions here |
| 3. Components | Button, Input, Select, Table, StatusMark, Banner, Dialog, MaskedValue | Styled only with tokens; every state specified ([ui-design-system](ui-design-system.md)) |
| 4. Patterns | CatalogueStrip, HangingLabelRecord, DenseTable, ApprovalBlock, WorkspaceStrip, ScopeChip, ErrorSummary, EmptyState | Compose components; own layout rules |
| 5. Workspaces | route groups `/me /team /hr /payroll /admin /privacy /audit /dashboards` | Own navigation, page titles, scope chip text |
| 6. Screens | pages built from patterns, wired to API | No new visual rules; if one is needed, add it to a lower layer |

## 2. Repository layout (planned)
```
apps/web/            Next.js App Router
  app/(me)/ (team)/ (hr)/ (payroll)/ (admin)/ (privacy)/ (audit)/ (dashboards)/
  lib/access/        effectiveAccess() client, workspace registry
packages/ui/         tokens.css, primitives wrappers, components, patterns, stories
packages/schemas/    zod schemas shared with the API
packages/i18n/       en-PH strings (all copy lives here)
packages/icons/      custom line icon set, SVG sources and generated components
```

## 3. Role-aware shell architecture
1. After sign-in the API returns `effectiveAccess`: the list of workspaces, for each the scope description, and the assignment end dates.
2. A **workspace registry** maps workspace id to route group, left-rail items, and the entry permission. Items are included when the user holds the item's permission in any scope.
3. The shell renders the **WorkspaceStrip** only when two or more workspaces exist. The last used workspace is remembered per user (preference only).
4. Each page declares `requiredPermission`; a guard calls the API. A direct URL to a forbidden page shows a plain 403 page ("You do not have access to this page. Your roles: …") and records nothing client-side.
5. The **ScopeChip** text comes from the server so it always matches what the query used.
6. The shell listens for the `access_version` change header; on change it shows the "Your access changed. Reload to continue." banner and blocks further writes until reload.
7. Nothing in the client treats the selected workspace as authority. API calls carry no workspace parameter.

## 4. Data and state
- Server components fetch through the API using the session; mutations go through server actions or API calls with idempotency keys for financial actions.
- Client state is limited to form state, open dialogs and table sort or filter; URL carries filters so views are shareable and testable.
- Optimistic updates are allowed for non-financial toggles only; payroll and approvals always wait for the server.
- Money and hours come from the API as strings or integers and are formatted by one shared formatter (₱, minus sign, tabular figures).
- Masked fields arrive already masked. The reveal flow requests step-up and purpose, shows the value for 30 seconds, then re-masks.

## 5. Responsive strategy
| Breakpoint | Layout | Used by |
|---|---|---|
| ≥ 1024 | top bar, workspace strip, 220 px left rail, 12-column content | HR, payroll, admin, audit |
| 768 to 1023 | rail collapses to a horizontal page strip | managers on tablets |
| 360 to 767 | single column, bottom tab bar (Home, Payslips, Leave, Me) for Me; other workspaces open as a sheet | employees, managers |
Dense tables turn into stacked record lists below 768 px; columns are prioritised per table by a config, not by hiding at random.

## 6. Accessibility architecture
Landmarks (header, nav for workspaces, nav for pages, main). Skip link first. Focus moves to the page title on route change and to the error summary on failed submit. Tables use captions and header scopes. Status uses text plus a shape. The strip is a set of buttons with `aria-current`, not a decorative tab imitation. Reduced-motion media query respected. Axe runs on every route in CI, plus a manual keyboard pass per release.

## 7. Quality gates for the design system
| Gate | Tooling |
|---|---|
| Token contrast pairs meet AA (script in CI) | custom check over `tokens.css` |
| No raw colour or font values outside tokens | stylelint rule |
| Every component has all states in a story | Storybook with interaction tests |
| Visual regression on shell, record page, dense table, form (desktop and mobile) | Playwright screenshots, owner-approved baselines |
| Accessibility | axe in CI, manual keyboard and screen-reader pass per release |
| Copy | lint for banned words ("seamless", "supercharge", "unlock", exclamation marks, emoji) |
| Bundle | budgets per route; fonts self-hosted and subset |

## 8. Governance
- A new pattern needs a short note: problem, why existing patterns fail, states, accessibility. Reviewed by the owner.
- Tokens change only by ADR amendment; a colour change must pass the contrast script.
- Components are never forked per workspace.
- The preview page is updated with any pattern change so the owner can review visually before it ships.

## 9. Open items
- Icon set: 24 icons needed for navigation and status; draw during M0.
- Chart style: payroll cost trend uses a ruled table first; one restrained line chart is allowed on Dashboards with pattern fills (colour-blind safe). To be specified when the first chart is built.
- Dark theme: out of v1; tokens are structured to allow it.
