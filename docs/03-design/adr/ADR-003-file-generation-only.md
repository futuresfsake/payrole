# ADR-003: Generate government and bank files; do not submit directly

**Status:** Accepted · **Date:** 2026-11-15

## Context
Agency portals (SSS, PhilHealth, Pag-IBIG, BIR) and banks change formats, require employer credentials/certificates, and have unclear automation terms. Storing those credentials makes us a high-value target.

## Decision
Generate validated files and reports; the customer uploads them. Exporters are isolated adapters with versioned templates and contract tests using sample files/validators.

## Consequences
+ No stored agency credentials, lower liability, faster delivery.
− Manual upload step for customers; revisit when official APIs and terms are clear.
− Template maintenance is ongoing (GAP-08); each template carries a version and source note.
