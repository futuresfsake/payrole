# UI Design System

Decision: [ADR-014](adr/ADR-014-ui-design-language.md). Preview: [ui-preview.html](hld/ui-preview.html) (open in a browser).

## Direction in five lines
- **Style:** International Typographic (Swiss) Style. Grid, flush-left text, hierarchy by size and weight, rules instead of boxes.
- **Metaphor:** the personnel file. A catalogue strip opens every record; labels hang in a left rail, values on the right.
- **Type:** Archivo for headings, IBM Plex Sans for the interface, IBM Plex Mono for identifiers. Tabular numerals everywhere money or hours appear.
- **Palette:** warm paper, near-black ink, one vermilion accent. Three semantic colours, used only for status.
- **Signature detail:** the file-tab catalogue strip (`EMP-0042 · 201 FILE · ACTIVE`) and the workspace tab strip for multi-role users.

## Tokens
| Token | Value | Use | Contrast on paper |
|---|---|---|---|
| `--paper` | `#F4F1EA` | page background | n/a |
| `--surface` | `#FBFAF6` | inputs, table body, panels | n/a |
| `--ink` | `#16181D` | text, primary button fill, heavy rules | 15.7:1 |
| `--muted` | `#5A5D64` | secondary text, input borders, icons | 5.9:1 |
| `--rule` | `#C9C3B6` | hairlines between rows (decorative only) | 1.6:1 |
| `--accent` | `#D6401F` | current-location marker, focus ring, counters, marks (non-text, or text ≥ 24 px) | 4.0:1 |
| `--accent-text` | `#B53217` | small accent text, links in body copy | 5.4:1 |
| `--ok` | `#1F6B4A` | approved, active, balanced | 5.7:1 |
| `--warn` | `#8A5A00` | pending, expiring | 5.3:1 |
| `--err` | `#B3261E` | rejected, failed, negative amounts | 5.8:1 |

Rules: input borders and focus indicators must reach 3:1 against their neighbours, so inputs use `--muted`, not `--rule`. Status is never colour alone: each state also has a word and a glyph. Pairs are checked by a token test in CI.

## Type scale (base 16 px, 8 px grid, ratio about 1.25)
| Role | Face | Size / line | Weight | Case |
|---|---|---|---|---|
| Display (page title) | Archivo | 40 / 44 | 700 | sentence |
| H2 (section) | Archivo | 24 / 32 | 700 | sentence, 2 px rule above |
| H3 (group) | Archivo | 18 / 24 | 600 | sentence |
| Body | IBM Plex Sans | 16 / 24 | 400 | |
| Dense table | IBM Plex Sans | 14 / 20 | 400 | tabular figures |
| Label | IBM Plex Sans | 12 / 16 | 600 | uppercase, +0.06em tracking |
| Identifier | IBM Plex Mono | 13 / 20 | 500 | as stored |

Measure 68 characters max for prose. Money right-aligned with `font-variant-numeric: tabular-nums lining-nums`. Pesos `₱1,234.56`; negative `−₱1,234.56` in `--err`.

## Grid and layout
- 12 columns, 24 px gutter, 8 px base unit, max content width 1280.
- **Shell (desktop):** 56 px top bar (tenant, search, workspace strip, user), 240 px left rail (navigation for the current workspace), content in the remaining 12-column grid.
- **Record pages (hanging labels):** 3 columns of labels, 9 columns of values, 1 px rule between groups. Looks like a filled personnel card; no card boxes.
- **Dense tables (HR, payroll):** 40 px rows, sticky header, 1 px row rules, no zebra, selected row marked by a 4 px accent bar on the left edge.
- **Mobile (self-service):** one column, bottom tab bar (Home, Payslips, Leave, Me), 44 px targets, the workspace strip collapses into a sheet.
- Asymmetry on purpose: wide left margin for labels, narrow right margin; whitespace carries the hierarchy.

## Multi-role shell
- The **workspace strip** sits in the top bar as index tabs: `Me · Team · HR · Payroll · Admin · Privacy · Audit`. Only workspaces backed by an active role assignment appear. The current one has a 3 px accent underline.
- A **scope chip** under the page title states what the user is looking at: `HR · all employees`, `Team · 6 reports`, `Payroll · Semi-monthly pay group`.
- **Empty workspace** for a one-role employee: no strip at all, just the ESS navigation.
- **Role change** mid-session (assignment added or ended) shows a plain notice "Your access changed. Reload to continue." and rotates the session; there is no silent change.
- Navigation is filtered; every action is still authorized on the server ([ADR-013](adr/ADR-013-multi-role-access-model.md)).
- **Acting-as is not offered.** No impersonation in v1; support uses break-glass.

## Components (all with states)
| Component | Notes | States specified |
|---|---|---|
| Button | Primary: ink fill, paper text. Secondary: 1 px ink border. Tertiary: text with underline. Radius 0. | rest, hover (accent underline or 8% ink tint), active, focus (2 px accent ring, 2 px offset), disabled (muted, no hover), loading (label stays, text "Saving…") |
| Input / select | 40 px, 1 px `--muted` border, radius 2, label above, helper below | rest, hover, focus, filled, error (err border + message with icon glyph), disabled, read-only (no border) |
| Table | Sticky header, sortable column marked by triangle glyph, right-aligned numbers | loading (row skeleton rules), empty (written instruction), error (what failed, retry), selected |
| Status mark | Word plus glyph: `● Active`, `◐ Pending`, `■ Rejected`, `○ Draft`. Not a pill. | per status |
| Catalogue strip | Mono line above page title: `EMP-0042 · 201 FILE · ACTIVE · EFFECTIVE 2026-11-01` | normal, restricted (shows `MASKED` where fields are masked) |
| Approval block | Two columns: facts left, decision right; Approve (primary), Return (secondary) | pending, decided, locked by SoD (explains why) |
| Masked value | `▒▒▒▒ 4821`, button "Reveal" needs step-up and purpose | masked, revealed (timer), denied |
| Toast / banner | Banner at top of content, no floating toasts; text plus close | info, success, warning, error |
| Dialog | For irreversible actions only; names the object and consequence | rest, confirming, error |
| Form | Single column up to 640 px; error summary at top with anchors | validation, submitted, saved |

## Icons
Small custom line set (16 and 24 px, 1.5 px stroke, square caps), drawn from the same grid as the type. Used for navigation and status glyphs only. No emoji, no icon-in-circle decoration, no illustrations.

## Motion
150 ms for state changes only (colour, underline). No entrance animations. Respects `prefers-reduced-motion`.

## Copy rules
- Verbs on buttons: "Approve payroll", "Return to preparer", "File leave".
- Errors state what happened and what to do: "Payroll run not submitted. 3 employees have no time record for 1–15 Nov. Fix them or exclude them."
- No exclamation marks, emoji, "seamless", "supercharge", "unlock", "oops".
- Dates `15 Nov 2026` in prose, `2026-11-15` in tables and files. Times 24-hour, Asia/Manila.

## Accessibility
WCAG 2.2 AA. Keyboard-only complete; skip link; visible focus; labels always visible; error summary with focus management; tables have headers and captions; touch targets ≥ 44 px on mobile; text scales to 200% without loss; `prefers-reduced-motion` honoured. Axe runs in CI on every route ([testing-strategy](../05-quality/testing-strategy.md)).

## Delivery
Tokens are CSS custom properties in one file, mirrored to Tailwind theme. Fonts self-hosted via Fontsource, Latin subset, `font-display: swap`. Components on Radix or React Aria primitives (tech-stack). A visual-regression suite (Playwright screenshots) covers shell, record page, dense table and form on desktop and mobile.
