# Reviews (Archive)

Archive of past reviews. **Not current guidance.** Current rules live in the numbered folders.

## Index
| Date | Review | Scope | Outcome | Actions tracked in |
|---|---|---|---|---|
| 2026-11-15 | BA Discovery & documentation baseline v0.1 | Whole doc set | See below | gaps.md, open-decisions.md |

## Review 2026-11-15: Documentation baseline v0.1 (self-review)
**Findings**
1. All statutory values are analyst-knowledge, unverified (GAP-01). Must be re-sourced before M3.
2. Retention periods are drafts (GAP-03).
3. Tenancy model (ADR-004) and auth provider (ADR-006) are still Proposed; they block M0 exit.
4. ~~No wireframes yet~~ Closed 2026-11-15: low-fidelity wireframes written (W-01…W-79). Still no visual design or usability testing.
5. ~~Several TDDs are planned, not written~~ Closed 2026-11-15: all 10 TDDs drafted; they have had author review only.
6. Solo-owner review bias: external review scheduled at M0, M3, M8.

**Actions**
| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Source and cite SSS, PhilHealth, Pag-IBIG, BIR tables | Payroll lead | Before M3 start |
| 2 | Counsel review of retention and DPA posture | Owner | Before M1 exit |
| 3 | Decide OD-01, OD-03, OD-04 | Owner | Before M0 exit |
| 4 | Wireframes for core flows | Owner | M1 |
| 5 | Recruit parallel-run partner | Owner | Before M3 |

## Template for new reviews
Date · type (design, security, code, incident PIR, pen test) · scope · reviewers · findings (severity) · actions (owner, due) · closure evidence.
