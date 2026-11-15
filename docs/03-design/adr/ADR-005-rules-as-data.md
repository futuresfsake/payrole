# ADR-005: Statutory rules as effectivity-dated, cited data

**Status:** Accepted · **Date:** 2026-11-15

## Context
Contribution tables, tax brackets, holiday calendars, minimum wage, and premium rates change by circular, sometimes mid-year (GAP-01, -04, -05).

## Decision
Rules live in `rule_set_version` rows: `agency`, `type`, `effective_from/to`, `data` (JSON validated by schema), `source_citation` (circular/RA number + URL), `checksum`, `approved_by`. Engine resolves `ruleAt(type, date)`. Drafts require approval by a second person (SoD). Finalized runs store the version ids used. Code contains formulas only; no magic numbers (lint rule bans numeric literals in rule modules).

## Consequences
+ A rate change is a data release, not a code deploy, and is auditable.
+ Re-computation reproduces historic results.
− Requires a rule-set editor, schema validation, and golden tests per version.
− Initial data entry effort and verification burden (VERIFY tags).
