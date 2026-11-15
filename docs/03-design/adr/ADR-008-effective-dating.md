# ADR-008: Effective-dated tables; never overwrite

**Status:** Accepted · **Date:** 2026-11-15

## Context
Payroll needs "what was true on date D" (retro pay, audits, year-end). In-place updates destroy history.

## Decision
Employment, compensation, org assignment, and rule sets are effective-dated (`valid_from`, `valid_to`) with `recorded_at` and `superseded_at` (bitemporal-lite). Overlap prevented by exclusion constraints. Corrections supersede rows; they never mutate.

## Consequences
+ Point-in-time queries, reproducible payroll, clean audit story.
− More complex queries; encapsulated in repository helpers `asOf()`.
− UI must express "effective on" for changes.
