# Secure SDLC

Security gates are automated pipeline stages (details in [ci-cd-pipeline](../07-process/ci-cd-pipeline.md)).

| Stage | Control | Tool (candidate) | Blocks merge? |
|---|---|---|---|
| Pre-commit | Secret scan, lint, format, typecheck | Gitleaks, ESLint, Prettier, tsc via `.githooks` | Local block |
| PR | SAST | Semgrep (custom rules: no string-built SQL, no floats for money, no `console.log` of PII), CodeQL | Yes (high+) |
| PR | Dependency audit (SCA) | OSV-Scanner / npm audit, license check | Yes (high+, known exploited) |
| PR | IaC scan | Trivy/Checkov, policy-as-code | Yes |
| PR | Unit/integration incl. tenant-isolation and authz matrix tests | Vitest + Testcontainers | Yes |
| PR | Schema lint (RLS present, audit triggers, no plaintext SPI columns) | custom script | Yes |
| PR | Architecture tests (module boundaries) | dependency-cruiser | Yes |
| Build | Container scan, SBOM (CycloneDX), provenance attestation, image signing | Trivy, syft, cosign | Yes |
| Staging | DAST baseline | OWASP ZAP | Warn → block on high |
| Release | Evidence bundle attached to release (test results, scans, SBOM, approvals) | CI artifact | Yes |
| Production | Runtime alerts, WAF, vuln feed on SBOM | | n/a |
| Periodic | External pen test (pre-GA, annual), threat model review, access review, restore drill | | |

## Rules
- Pin GitHub Actions by commit SHA; least-privilege `GITHUB_TOKEN`; OIDC to cloud; protected branches; required reviews (owner self-review checklist + automated gates if solo); signed commits.
- No secrets in repo, env examples have placeholders only; secret rotation runbook.
- Dependencies: justify each new runtime dependency in PR; prefer standard library/well-maintained packages; weekly Renovate.
- Security review checklist in PR template: authz, tenancy, input validation, output encoding, logging, crypto, error handling, rate limits.
- Pre-commit/PR security check report is produced before every commit/push (secrets, static analysis, dependency audit) and stored with the evidence artifact.
- Vulnerability SLAs per NFR-10; exceptions recorded with expiry.

## Evidence artifacts
Each story produces: test report, coverage delta, scan results, TDD link, traceability row update. Stored in `evidence/<story-id>/` (gitignored large binaries; summaries committed).
