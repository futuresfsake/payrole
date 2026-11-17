# ADR-014: UI design language: International Typographic Style on a personnel-file metaphor

Status: **Superseded by [ADR-015](ADR-015-ui-design-language-revised.md)** (2026-11-17). Kept for history; do not implement. It superseded the "ledger" direction in the v0.1 wireframes README.

## Context
The owner rejects interfaces that look generated: rounded card grids, gradient heroes, pill chips, emoji icons, system fonts. The v0.1 direction ("the ledger") was a private metaphor, not a recognised style, and it fits payroll screens but not onboarding, leave, org charts or a multi-role shell. An HRIS is used all day by non-designers, so the look must be a known, proven system rather than novelty.

## Decision
1. **Style: International Typographic (Swiss) Style.** Modular grid, flush-left ragged-right text, hierarchy from size, weight and whitespace, hairline rules instead of boxes, one restrained accent. Data density follows enterprise-grade conventions (8 px base unit, 2x grid, tabular figures), as in IBM Carbon and Bloomberg-class terminals, so it stays usable for payroll.
2. **Metaphor: the personnel file (the "201 file").** Every record page opens with a catalogue strip like a folder tab (`EMP-0042 · 201 FILE · ACTIVE`). Labels hang in a left rail and values sit to the right, like a filled-in personnel card. This is the single signature detail.
3. **Typography:** Archivo (headings), IBM Plex Sans (interface text), IBM Plex Mono (identifiers, codes). Tabular lining numerals for all money and hours. Self-hosted (Fontsource), no third-party font CDN (privacy, NFR).
4. **Palette (exact):** paper `#F4F1EA`, surface `#FBFAF6`, ink `#16181D`, rule `#C9C3B6`, muted `#5A5D64`, one accent vermilion `#D6401F` (text form `#B53217`), semantic only: success `#1F6B4A`, warning `#8A5A00`, error `#B3261E`. No gradients. Light theme only in v1; tokens allow a dark theme later.
5. **Geometry:** radius 0 (inputs 2 px), 1 px rules, 2 px heavy rule above section heads, no shadows, focus ring 2 px accent offset 2 px.
6. **Role-aware shell:** a workspace strip (Me, Team, HR, Payroll, Admin) shows only workspaces the user's role assignments allow ([ADR-013](ADR-013-multi-role-access-model.md)). It filters navigation; it is not a security control.
7. **Copy:** plain and specific, verbs on buttons, no exclamation marks, no emoji, no marketing words. Icons are a small custom-weight line set used only where text alone is ambiguous.
8. **Accessibility:** WCAG 2.2 AA, keyboard first, visible labels, status never conveyed by colour alone, 44 px touch targets on mobile self-service.

## Consequences
- The design is recognisable and defensible ("Swiss grid, enterprise density"), and cheap to keep consistent because it is token- and grid-driven.
- No dark mode, illustrations or playful empty states in v1; empty states are written instructions.
- Contrast of the vermilion accent on paper is below AA for body text, so the accent is limited to marks, rules, focus and large text; the darker text form `#B53217` is used for small accent text. A script checks every token pair in CI (design-token test).
- Three font families add about 100 KB; subset to Latin and load only the used weights.

## Alternatives
- **Material / Fluent defaults.** Rejected: instantly generic, the opposite of the brief.
- **Neo-brutalism.** Rejected: trendy, poor at dense data, tiring in all-day use.
- **Ledger identity everywhere (v0.1).** Rejected: private metaphor, weak outside payroll.
- **Dark-first "dashboard" look.** Rejected: the owner's standing rule against it and poor for long payroll review.
