# UI Design System

Decision: [ADR-015](adr/ADR-015-ui-design-language-revised.md) (supersedes ADR-014). Structure and code layout: [design-architecture](design-architecture.md). Visual reference: [ui-preview.html](hld/ui-preview.html). The running component catalogue lives in the app at `/catalogue`.

## Character
Calm, precise, trustworthy, like Linear or Stripe Dashboard applied to HR and payroll. Hierarchy comes from size, weight and spacing. Borders structure the page; shadows appear only on overlays.

## Tokens
Raw values exist only in `tokens.css`. Components use token names.

### Colour
| Token | Value | Use | Contrast |
|---|---|---|---|
| `--bg` | `#F9FAFB` (gray-50) | app background | |
| `--surface` | `#FFFFFF` | panels, tables, inputs | |
| `--border` | `#E5E7EB` (gray-200) | table and section borders (decorative) | 1.2:1, not for controls |
| `--border-control` | `#6B7280` (gray-500) | inputs, checkboxes, selects | 4.8:1 on white |
| `--text` | `#111827` (gray-900) | primary text | 17.7:1 on white |
| `--text-muted` | `#4B5563` (gray-600) | secondary text | 7.6:1 on white |
| `--accent` | `#2563EB` (blue-600) | primary action, selection, focus, links only | 5.2:1 on white |
| `--accent-hover` | `#1D4ED8` (blue-700) | hover and pressed | |
| `--accent-tint` | `#EFF6FF` (blue-50) | selected row, selected item | blue-700 text 6.2:1 |

### Status (a word plus a small dot in the status colour; no capsule, no tinted pill)
| Status | Text colour | Soft tint (alerts only) | Contrast |
|---|---|---|---|
| success | `#15803D` | `#F0FDF4` | 4.8:1 |
| warning | `#B45309` | `#FFFBEB` | 4.8:1 |
| danger | `#B91C1C` | `#FEF2F2` | 5.9:1 |
| info | `#0E7490` | `#ECFEFF` | 5.2:1 |
| neutral | `#374151` | `#F3F4F6` | 9.4:1 |

Domain mapping: approved is success, pending is warning, returned is info, overdue is danger, SoD-blocked is danger with a lock icon. Every badge has a word and a dot or icon; colour is never the only signal.

### Type
IBM Plex Sans (self-hosted) for everything. IBM Plex Mono only for identifiers, run IDs, reason codes and amounts in tables. Tabular numerals for all numbers; numeric columns right-aligned.

| Step | Size / line | Weight | Use |
|---|---|---|---|
| xs | 12 / 16 | 500 | captions, helper text |
| sm | 13 / 20 | 400 | dense metadata |
| base | 14 / 20 | 400 | body and table text (default) |
| md | 16 / 24 | 400 | forms on mobile, long reading |
| lg | 20 / 28 | 600 | section headings |
| xl | 24 / 32 | 600 | page titles |

### Space, shape, motion
- 4 px base: 4, 8, 12, 16, 24, 32, 48, 64.
- Table rows 40 px default, 32 px compact. Page padding 24 px desktop, 16 px mobile. Content max width 1280 px for forms and detail pages; tables full width.
- Radius 6 px controls, 8 px dialogs. Shadows on menus, dialogs, drawers and toasts only.
- Motion 150 to 200 ms ease-out, for state feedback only. Reduced motion respected.
- Focus: 2 px `--accent` ring, 2 px offset, on every interactive element.
- Touch target 44 px on Me and Team.

### Selected and active states
Neutral gray fill (), same font weight as unselected items. The accent shows only as a 2 px bar (left edge for nav items and rows, bottom edge for tabs) or as the icon colour. No tinted accent pills, no bold accent text. Navigation items are full-width rows with an icon, never shrink-wrapped pills.

## Layout
- **Top bar (48 px):** workspace strip (only workspaces the user's effective access allows), global search, notifications, user menu.
- **Sidebar (240 px, collapsible):** navigation within the current workspace. Mobile: bottom navigation for Me and Team, drawer for the rest.
- **Page header on every screen:** breadcrumb, title, optional one-line description, primary action on the right. At most one primary button per view.
- **Dense workspaces** (HR, Payroll, Admin, Audit): table-first. **Me and Team:** mobile-first list layouts with large targets.

## Components
Each is documented in the catalogue with props, variants and every state (default, hover, focus, disabled, loading, error).

Primitives: Button, IconButton, Input, Select, DatePicker, MoneyInput, Checkbox, Tabs, Badge and StatusBadge, Dialog, Drawer, Toast, Skeleton.
State: EmptyState, ErrorState (problem+json detail and correlation id), Forbidden (reason code in plain words).
Shell: WorkspaceStrip, ScopeChip, PageHeader.
Data: DataTable (sort, filter, sticky header, column visibility, bulk actions, server pagination, CSV export where permitted), Timeline, AuditEntry.
Domain: ApprovalBlock, MaskedValue, StepUpDialog, AccessPreview, ExceptionCountdown, AssignmentRow, FileDownload, OfflineBanner.

## Copy
Plain, specific, non-expert. Name the thing and the next step: "Run PG-02 is waiting for your approval." Buttons are verbs: "Approve run", "Return to preparer". Denials give the reason in words ("You prepared this run, so you can't approve it. Rule SoD-1."), never "Access denied". No filler words, no exclamation marks, no apologies. Files: "Download file" and "Upload to the portal yourself." PHP amounts `₱1,234.56`, negative `−₱1,234.56`. Placeholder rule values carry a visible "Placeholder, verify before use" mark.

## Icons
Lucide, one stroke weight (1.75), 16 and 20 px, about 24 icons. Icon buttons always have an accessible name.

## Accessibility
WCAG 2.2 AA: semantic HTML, full keyboard use, visible focus, labels always visible, status never by colour alone, errors summarised and focused, tables with headers. axe and a screenshot test (360 px and 1280 px) on every route.

## Delivery
`tokens.css` mirrored into the Tailwind theme. Components on Radix primitives (shadcn/ui as a base, restyled to these tokens). Fonts self-hosted via Fontsource, Latin subset. Money is integer centavos formatted by one utility; rates and factors are decimal strings. Dates are Asia/Manila through one utility.
