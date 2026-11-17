# Security Overview

Security posture for a system holding salary, government IDs, and health/disciplinary data of Filipino employees.

| Document | Content |
|---|---|
| [threat-model.md](threat-model.md) | STRIDE analysis, abuse cases, T-ids |
| [access-control.md](access-control.md) | Authentication, sessions, privileged access, joiner/mover/leaver, API clients |
| [authorization.md](authorization.md) | Multi-role authorization: permissions, scopes, field masks, SoD, step-up, caching, tests |
| [data-protection.md](data-protection.md) | Encryption, masking, retention, DSR, breach handling |
| [audit-logging.md](audit-logging.md) | What is logged, tamper evidence, review |
| [secure-sdlc.md](secure-sdlc.md) | Gates in the pipeline, secrets, dependencies, supply chain |
| [security-operations.md](security-operations.md) | Running security day to day: access reviews, detections, vulnerabilities, keys, break-glass, calendar |

Related: [roles and permissions](../02-requirements/access/roles-and-permissions.md), [RBAC matrix](../02-requirements/access/rbac-matrix.md), [ADR-013](../03-design/adr/ADR-013-multi-role-access-model.md), [incident response](../06-operations/incident-response.md).

## Principles
1. Least privilege, deny by default.
2. Defence in depth: UI check ≠ security; every check is server-side, plus RLS at the DB.
3. Minimise data collected and displayed.
4. Everything sensitive is encrypted, masked, and logged.
5. Assume breach: limit blast radius (tenant keys, segmented roles), detect fast, recover.
6. Security is a pipeline gate, not a phase (see [secure-sdlc](secure-sdlc.md)).
7. One account per person, many scoped role assignments. Permissions are checked, role names are not ([ADR-013](../03-design/adr/ADR-013-multi-role-access-model.md)).
8. Separation of duties is code, not policy text: static pairs at assignment time, dynamic rules at action time.
9. Operators have no standing access to customer data.

## Standards referenced
OWASP ASVS 4.0.3 (target Level 2; Level 3 for payroll/auth areas), OWASP Top 10, OWASP API Security Top 10, NIST SP 800-63B (authenticators), NIST RBAC model (INCITS 359: hierarchical and constrained RBAC, static and dynamic SoD), CIS benchmarks for hosting, ISO/IEC 27001 control themes (alignment, not certification at v1), PH DPA + NPC issuances.

## Security acceptance for GA
- [ ] ASVS L2 checklist complete with evidence
- [ ] External penetration test, criticals/highs closed
- [ ] Tenant-isolation tests green in CI for all modules
- [ ] Generated authorization matrix tests green; every SoD rule has a passing violation-attempt test
- [ ] Quarterly access review report produced once from seed or pilot data
- [ ] Break-glass drill done (request, grant, expiry, tenant notice, audit)
- [ ] DR drill and restore test passed
- [ ] DPO sign-off on PIA, notice, retention
- [ ] Incident response tabletop done
- [ ] Secrets scan and dependency audit clean on release commit
