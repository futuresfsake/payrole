# Reviews (Archive)

Archive of past reviews. **Not current guidance.** Current rules live in the numbered folders.

## Index
| Date | Review | Scope | Outcome | Actions tracked in |
|---|---|---|---|---|
| 2026-11-15 | BA Discovery & documentation baseline v0.1 | Whole doc set | See below | gaps.md, open-decisions.md |
| 2026-11-15 | Senior-engineer review of milestones and stories | milestones.md, epics-and-stories.md and dependants | See below | epics-and-stories.md change log |

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

## Review 2026-11-15: Milestones and stories (self-review, senior-engineer lens)
**Findings**
| # | Severity | Finding | Resolution |
|---|---|---|---|
| 1 | High | M2 needs approvals, notifications and employee login (US-205, US-206, US-209) but the workflow engine, notifications and ESS were scheduled for M5 | Added US-213 (basic approvals) and US-214 (portal) to M2; M5 US-501 now generalises the engine (TDD-workflow, two cuts) |
| 2 | High | No story owned payroll inputs (basic pay, tax status, bank, statutory enrolment) | Added US-113 and FR-113 |
| 3 | High | No story for rule-set management although ADR-005 and RISK-01 depend on it | Added US-316 and FR-317; built first in M3 |
| 4 | High | FR-701…FR-703 (retention, breach register, consent) mapped to US-805, a sign-off story, so nothing built them; real data enters at private beta (M5) | Added US-510…US-512; US-805 now verifies; beta gate requires US-510 and US-511 |
| 5 | Medium | M0 lacked backups, job queue/outbox and email although the HLD and NFR-07 assume them | Added US-011…US-013 |
| 6 | Medium | OD-06 promises a generic bank CSV in M3; no M3 story | Added US-317 |
| 7 | Medium | US-204, US-208, US-303, US-304, US-604 exceed the 3-day Definition of Ready | Split into US-204/215, US-208/216, US-303/318, US-304/319/320, US-604/609 |
| 8 | Medium | M6 (ATS) and M7 (performance, learning, benefits) sit before GA and feed RISK-03; first payroll customers do not need them | ATS moved to EP-07 (US-707…US-710); M7 runs after GA |
| 9 | Medium | Parallel-run partner is recruited at M3 exit, the longest-lead item in the plan; M3 gate has no fallback | Recruit by M1 exit; Alpha fallback; GA requires two live parallel cycles; RISK-15 added |
| 10 | Low | About 30 stories had blank or untestable AC | AC filled; build order added per milestone |
| 11 | Low | "No milestone starts before the previous gate" conflicts with research that must start early | Allowed overlaps documented in milestones.md |

**Not changed (judgment calls to confirm with the owner)**
- M7 keeps its number but runs after M8. Renumbering was rejected because it would break every story, FR and TDD reference.
- Estimates rose to 44–54 weeks pre-GA because stories were missing, not because of padding. They remain unvalidated guesses.
- Story sizes were judged from titles and AC, not from spikes. Re-check when each milestone is refined.

**Actions**
| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Confirm the M7-after-GA decision | Owner | Before M0 exit |
| 2 | Recruit parallel-run partner | Owner | M1 exit |
| 3 | Source and cite rule-set data so US-316 has real values to load | Payroll lead | During M2 |
| 4 | Split stories marked "split at refine" (US-307) | Owner | M3 refine |

## Template for new reviews
Date · type (design, security, code, incident PIR, pen test) · scope · reviewers · findings (severity) · actions (owner, due) · closure evidence.
