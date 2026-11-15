# ADR-009: AI is assistive; no autonomous pay or employment decisions

**Status:** Accepted · **Date:** 2026-11-15

## Context
2026 products ship AI features. HR data is sensitive and decisions affect livelihoods; hallucination or bias in pay/employment decisions is unacceptable. Automated decision-making and profiling raise privacy duties.

## Decision
Permitted: policy Q&A over customer documents with citations, payroll anomaly explanations, draft summaries, resume parsing for recruiter review. Forbidden: any AI output that writes pay, leave, hiring, or discipline outcomes without a human action. A redaction layer removes direct identifiers before any external model call; external AI usage is per-tenant opt-in, listed as a sub-processor, and logged (prompt metadata, not content). Evaluate models via an adapter; keep an eval set for regressions.

## Consequences
+ Clear privacy and liability boundary.
− Some "magic" features deliberately not offered.
− Requires redaction tooling and DPIA before M6 AI features ship.
