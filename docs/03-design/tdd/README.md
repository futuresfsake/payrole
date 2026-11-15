# Technical Design Documents (TDD)

Here TDD means **Technical Design Document**, a per-story design written before coding when a story is non-trivial. (Test-driven development is spelled out in full elsewhere.)

## When required
Any story touching payroll maths, security, data model changes, integrations, or workflow. Small CRUD stories use the template's "lite" mode.

## Index
| TDD | Covers | Milestone | Status |
|---|---|---|---|
| [TDD-template](TDD-template.md) | Template | n/a | Ready |
| [TDD-import](TDD-import.md) | US-103, US-807 | M1 | Draft |
| [TDD-time-ingest](TDD-time-ingest.md) | US-203 | M2 | Draft |
| [TDD-attendance-engine](TDD-attendance-engine.md) | US-204, US-211 | M2 | Draft |
| [TDD-leave-ledger](TDD-leave-ledger.md) | US-207…US-209 | M2 | Draft |
| [TDD-payroll-engine](TDD-payroll-engine.md) | US-303…US-305, US-309, US-314 | M3 | Draft |
| [TDD-payroll-run-lifecycle](TDD-payroll-run-lifecycle.md) | US-307, US-308, US-312, US-315 | M3 | Draft |
| [TDD-exports](TDD-exports.md) | US-401…US-405, US-407 | M4 | Draft |
| [TDD-workflow](TDD-workflow.md) | US-501…US-503 | M5 | Draft |
| [TDD-dsr](TDD-dsr.md) | US-509, US-805 | M5 | Draft |
| [TDD-final-pay](TDD-final-pay.md) | US-603, US-604 | M6 | Draft |

All are Draft: reviewed once by the author, pending the milestone-start review. A TDD must pass its review checklist (template §9) and security checklist before its story moves to "In Progress". Update the traceability matrix when a TDD is accepted.
