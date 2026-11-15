# ADR-012: Payroll-first GA; growth modules after GA

**Status:** Accepted · **Date:** 2026-11-15 · **Related:** RISK-03, RISK-15, GAP-02, milestones

## Context
An HRIS has an unbounded feature surface and one builder. The 2026-11-15 review found that the plan carried Should/Could features (ATS, performance, learning, benefits) ahead of GA, and that the parallel-run partner, the longest-lead dependency, was scheduled too late. The product's reason to exist is correct Philippine payroll on a trustworthy employee record (vision, principle 1).

## Decision
1. **GA means: core HR, time and leave, payroll, statutory output, self-service, privacy controls, lifecycle with final pay.** That is M0–M6 plus M8 hardening.
2. **M7 (ATS, goals/reviews, training, benefits, Filipino UI, analytics) ships after GA**, in the order customers ask for. M7 keeps its number so IDs stay stable; the sequence is `M0 → … → M6 → M8 → M7`.
3. **A story is cut or deferred before a gate is moved.** Order of cutting: Could, then Should, never a payroll Must.
4. **Parallel run policy:**
   - A partner SME must be confirmed by the M1 exit.
   - Alpha (M3 exit) may pass on 30+ hand-computed scenarios reviewed by an external payroll practitioner if no partner data exists yet. Alpha is internal only.
   - Private beta needs at least one real anonymized parallel cycle.
   - GA needs **two consecutive live parallel cycles within ₱1 per employee**.
5. **Rule-set values are never released unverified.** Anything tagged VERIFY must have a primary-source citation and a second approver (US-316) before it is active in a customer-visible run.
6. **Final pay ships pre-GA.** Customers have resignations in every payroll period, so US-604 and US-609 are in M6, ahead of GA.

## Consequences
+ Scope before GA is bounded and every item is tied to payroll correctness or legal duty.
+ The riskiest external dependency has a date and a fallback.
− GA is later than a "feature-complete HRIS" competitor demo. Accepted: a wrong payslip costs more than a missing screen.
− Sales conversations about performance/ATS must wait; track the demand to order M7.
− M7 sits out of numeric order, which needs a note wherever milestones are listed (done in milestones.md).

## Alternatives
- **Ship everything before GA:** 6–8 more weeks and more surface to secure, test and support. Rejected.
- **Ship payroll only (no ESS/lifecycle):** rejected; payslips, leave and final pay are what HR actually needs weekly, and ESS is the adoption driver (vision goal: 85% ESS use).
- **Renumber so M7 is Hardening:** rejected; it breaks every story, FR and TDD reference for no functional gain.
