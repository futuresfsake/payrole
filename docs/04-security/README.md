# Security Overview

Security posture for a system holding salary, government IDs, and health/disciplinary data of Filipino employees.

| Document | Content |
|---|---|
| [threat-model.md](threat-model.md) | STRIDE analysis, abuse cases, T-ids |
| [access-control.md](access-control.md) | Authn, sessions, authz, SoD, break-glass |
| [data-protection.md](data-protection.md) | Encryption, masking, retention, DSR, breach handling |
| [audit-logging.md](audit-logging.md) | What is logged, tamper evidence, review |
| [secure-sdlc.md](secure-sdlc.md) | Gates in the pipeline, secrets, dependencies, supply chain |

## Principles
1. Least privilege, deny by default.
2. Defence in depth: UI check ≠ security; every check is server-side, plus RLS at the DB.
3. Minimise data collected and displayed.
4. Everything sensitive is encrypted, masked, and logged.
5. Assume breach: limit blast radius (tenant keys, segmented roles), detect fast, recover.
6. Security is a pipeline gate, not a phase (see [secure-sdlc](secure-sdlc.md)).

## Standards referenced
OWASP ASVS 4.0.3 (target Level 2; Level 3 for payroll/auth areas), OWASP Top 10, OWASP API Security Top 10, NIST SP 800-63B (authenticators), CIS benchmarks for hosting, ISO/IEC 27001 control themes (alignment, not certification at v1), PH DPA + NPC issuances.

## Security acceptance for GA
- [ ] ASVS L2 checklist complete with evidence
- [ ] External penetration test, criticals/highs closed
- [ ] Tenant-isolation tests green in CI for all modules
- [ ] DR drill and restore test passed
- [ ] DPO sign-off on PIA, notice, retention
- [ ] Incident response tabletop done
- [ ] Secrets scan and dependency audit clean on release commit
