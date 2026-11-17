# Design Architecture (frontend structure)

How the interface code is organised so the visual language ([ADR-015](adr/ADR-015-ui-design-language-revised.md)) stays consistent and the multi-role shell ([ADR-013](adr/ADR-013-multi-role-access-model.md)) stays safe. System architecture: [HLD](hld/high-level-design.md). Look and feel: [ui-design-system](ui-design-system.md).

## 1. Stack
Next.js App Router, TypeScript strict, Tailwind with design tokens as CSS variables, Radix primitives (shadcn/ui as a base, fully restyled to the tokens), TanStack Table, React Hook Form with Zod, Lucide icons, a typed API client generated from OpenAPI, Vitest, Playwright and axe. Fonts self-hosted through Fontsource. Changing any of these needs the owner's approval.

## 2. Layers
| Layer | Holds | Rule |
|---|---|---|
| Tokens | colour, type, spacing, radius, motion | One CSS file of variables; the only place raw values exist |
| Primitives | Radix-based behaviour restyled with tokens | No domain knowledge |
| Shared components | Button, Input, DataTable, StatusBadge, Dialog, ApprovalBlock, MaskedValue … | Props typed, every state in the catalogue |
| Feature components | Domain screens' parts (`features/leave/components/...`) | Compose shared components; no fetch inside |
| Routes | `src/app/(workspace)/...` pages | Wire features to the API, own page headers |

## 3. Folder layout
```
src/
  design-system/        tokens.css, primitives/, components/, icons/, catalogue/
  features/<domain>/    components/ hooks/ schemas/ api/ utils/
  app/
    (auth)/             sign-in, MFA
    (me)/ (team)/ (hr)/ (payroll)/ (admin)/ (privacy)/ (audit)/ (dashboards)/
    catalogue/          design-system catalogue page
  lib/                  access (effective-access client), money, dates, problem+json
  mocks/                MSW handlers built from the seed data
openapi/                hand-written OpenAPI spec until the backend publishes one
```
Naming: PascalCase components, camelCase hooks (`useX`), kebab-case folders, one component per file, named exports, props typed as `<Component>Props`. About 150 lines per component at most.

## 4. Separation rules
- Components render. Hooks hold behaviour. Zod schemas hold validation. `utils` hold formatting. API calls live in `features/<domain>/api`. No `fetch` in presentational components.
- **Never branch on role names.** Components ask the effective-access object (`can('leave:approve', resource)`), which comes from the API.
- Money is integer centavos formatted by one utility. Rates and factors are decimal strings. Dates are Asia/Manila through one utility.
- No PII in URLs or logs. No `console.log`.

## 5. Role-aware shell
1. After sign-in the API returns `effectiveAccess`: workspaces, scope descriptions and assignment end dates.
2. A workspace registry maps each workspace to its route group, sidebar items and entry permission. Items show when the user holds the permission in any scope.
3. The workspace strip shows only allowed workspaces. A single-workspace user sees no strip.
4. Each page declares a required permission. A direct link to a forbidden page renders the `Forbidden` state from the API's response with the reason in words.
5. The scope chip text comes from the server so it always matches what the query used.
6. On an `access_version` change the shell shows "Your access changed. Reload to continue." and blocks writes until reload.
7. The selected workspace is never sent to the API as an input. No impersonation.

## 6. Data and state
Server components fetch with the user's session. Mutations carry idempotency keys for financial actions. Client state is limited to form state, dialogs and table sort or filter; filters live in the URL. Optimistic updates only for non-financial toggles. Masked values arrive already masked; reveal requests step-up and, where required, a purpose, shows for 30 seconds, then re-masks. Stale data and write conflicts surface as a `ConflictNotice` with a reload action.

## 7. Responsive
| Width | Layout | Used by |
|---|---|---|
| 1280 and up | top bar, 240 px sidebar, tables full width | HR, Payroll, Admin, Audit |
| 768 to 1279 | sidebar collapses to icons | managers on tablets |
| 360 to 767 | single column, bottom navigation (Me, Team), drawer for the rest | employees, managers |
Dense tables become stacked record lists on narrow screens, with columns prioritised by configuration.

## 8. Quality gates
| Gate | Tooling |
|---|---|
| Every route passes axe | Playwright plus axe |
| Screenshot test at 360 px and 1280 px for every route | Playwright |
| Full keyboard use and visible focus | manual pass per release plus tests |
| Token contrast pairs meet AA | script in CI over `tokens.css` |
| No raw colour or font values outside tokens | lint rule |
| Banned patterns (gradients, emoji, filler words, uppercase eyebrow labels) | lint and review checklist |
| TypeScript strict, no unused imports, no dead code | tsc and lint |

## 9. Governance
A new shared component needs: purpose, props, states, accessibility notes, and a catalogue entry. Tokens change only by ADR amendment and must pass the contrast script. Components are never forked per workspace.
