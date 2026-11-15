# Definitions of Ready and Done

## Definition of Ready (story)
- [ ] Persona, value, AC written (Given/When/Then)
- [ ] FR/BR/NFR links exist; new rules extracted into business-rules
- [ ] Data classification and privacy checklist answered
- [ ] Dependencies and gaps identified
- [ ] TDD present if trigger criteria met
- [ ] Size ≤ 3 days, else split

## Definition of Done (story)
- [ ] Code reviewed (self-review checklist + automated review)
- [ ] Tests: unit, plus property/golden/integration/e2e as applicable; mapped to FR ids in traceability matrix
- [ ] All CI gates green
- [ ] Security check report clean (secrets, SAST, dependency audit)
- [ ] Authorization, tenancy, audit events, and masking verified
- [ ] Logs free of PII; error handling tested
- [ ] Accessibility checked on UI changes
- [ ] Migrations expand/contract safe and reversible plan documented
- [ ] Docs updated: requirements, TDD, API (OpenAPI), runbooks, glossary
- [ ] Feature flag state decided; monitoring/alerts added if new failure modes
- [ ] Deployed to staging and verified
- [ ] Single commit, conventional message, no forbidden trailers

## Definition of Done (milestone)
Exit gate in [milestones](../01-product/milestones.md) satisfied, gap/risk registers updated, retro done, release notes written.
