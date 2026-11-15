# Quality Gates

## Per-PR (automated, blocking)
- [ ] Lint, format, typecheck clean
- [ ] Unit, property, golden, integration tests pass
- [ ] Coverage thresholds (NFR-16) and no coverage drop in domain packages
- [ ] SAST, secret scan, SCA, IaC scan: no high/critical
- [ ] Tenant-isolation and RBAC matrix tests pass
- [ ] Schema lint: RLS present, no plaintext SPI columns
- [ ] OpenAPI lint and contract tests pass
- [ ] Axe checks pass on changed views
- [ ] Docs/traceability updated (checked by script: FR ids referenced by tests exist)

## Per-release (staging)
- [ ] Full e2e suite green
- [ ] DAST baseline no high
- [ ] Performance budget: API p95 within NFR-01
- [ ] Migration dry-run against production-size synthetic data
- [ ] Rollback verified
- [ ] SBOM + provenance generated and signed

## Milestone exit gates
See [milestones](../01-product/milestones.md). Additionally for each milestone: security checklist, gap register review, risk register review, open-decision review.

## GA gate (M8)
Pen test closed, DR drill passed, WCAG audit, DPO sign-off, parallel-run evidence, runbooks complete, support process ready, customer-facing terms and privacy notice reviewed by counsel.

## Definition of Done
See [definition-of-done](../07-process/definition-of-done.md).
