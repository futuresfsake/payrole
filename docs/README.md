# PayRole HRIS: Documentation Index

> Name: **PayRole** (provisional until the trademark check, OD-15). A Philippine-first Human Resource Information System (HRIS) for SMEs (50–500 employees).
> Status: **Pre-build / Discovery complete, Design draft v0.2 for owner review** (2026-11-17)
> Author: Business Analysis + Architecture (single author: the project owner)

## How to read this

| Folder | The question it answers | Start with |
|---|---|---|
| [00-overview](00-overview/) | Why are we building this, and which decisions are still open? | [vision.md](00-overview/vision.md) |
| [01-product](01-product/) | What are we building: milestones, stories, features, flows, [wireframes](01-product/wireframes/README.md) | [milestones.md](01-product/milestones.md) |
| [02-requirements](02-requirements/) | What exact rules and targets must the system meet? | [specs.md](02-requirements/specs.md) |
| [03-design](03-design/) | How is it built: HLD (md and visual), design architecture, UI design system, ADRs, TDDs | [hld/high-level-design.md](03-design/hld/high-level-design.md) |
| [04-security](04-security/) | How do we protect users and employee data, and run security day to day? | [README.md](04-security/README.md) |
| [db](../db/seed/README.md) | Schema subset and synthetic seed data | [db/seed/README.md](../db/seed/README.md) |
| [05-quality](05-quality/) | How do we know it works? | [testing-strategy.md](05-quality/testing-strategy.md) |
| [06-operations](06-operations/) | How does it run in production? | [deployment.md](06-operations/deployment.md) |
| [07-process](07-process/) | How do we work: branching, CI/CD, story pipeline | [workflows.md](07-process/workflows.md) |
| [08-guides](08-guides/) | Hands-on how-tos | [local-development.md](08-guides/local-development.md) |
| [09-compliance](09-compliance/) | What does Philippine law require, and where is the proof? | [README.md](09-compliance/README.md) |
| [10-reviews](10-reviews/) | What did past reviews find? (archive) | [README.md](10-reviews/README.md) |
| [00-overview/change-record-2026-11-17.md](00-overview/change-record-2026-11-17.md) | What changed in the multi-role restructure, and why (decision table) | |
| [GLOSSARY.md](GLOSSARY.md) | Every acronym and term | |

## Reading order by role

- **Stakeholder / sponsor:** vision → milestones → open-decisions → risks
- **Business analyst / QA:** specs → functional-requirements → business-rules → traceability-matrix → testing-strategy
- **Engineer:** hld/high-level-design → tech-stack → low-level-design → ADRs → local-development
- **Security / DPO:** 04-security (authorization, security-operations) → 09-compliance → threat-model
- **Ops:** deployment → monitoring → incident-response → backup-dr

## Document conventions

- IDs: `FR-` functional req, `NFR-` non-functional, `BR-` business rule, `US-` story, `EP-` epic, `ADR-` decision, `TDD-` technical design, `GAP-` gap, `RISK-` risk, `OD-` open decision, `T-` threat.
- Every FR traces to a story and a test (see [traceability-matrix](02-requirements/traceability-matrix.md)).
- **VERIFY** tag = a legal rate, threshold, or rule that changes over time. It must be confirmed against the primary source (SSS, PhilHealth, Pag-IBIG, BIR, DOLE, NPC) before it is coded or released. Nothing tagged VERIFY is legal advice.
- Currency PHP. Time zone Asia/Manila (UTC+8, no DST). Dates ISO 8601.
