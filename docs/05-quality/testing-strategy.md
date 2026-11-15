# Testing Strategy

## Quality goals
Correct money, isolated tenants, usable on mobile, accessible, resilient at payday.

## Test pyramid and tooling
| Level | Scope | Tools | Run |
|---|---|---|---|
| Static | Types, lint, format, SQL lint, OpenAPI lint | tsc, ESLint, sqlfluff/pg lint, Spectral | pre-commit, PR |
| Unit | Pure domain (payroll, attendance, leave, rules) | Vitest | PR |
| Property-based | Invariants (determinism, ledger sums, rounding drift) | fast-check | PR |
| Golden / fixture | Payroll, attendance, statutory, final pay | YAML fixtures + Vitest | PR |
| Mutation | Rule and payroll modules | Stryker | nightly |
| Integration | Repositories, RLS, outbox, queues | Testcontainers Postgres/Redis | PR |
| Contract | OpenAPI conformance; agency/bank file templates | Schemathesis/Dredd; validators | PR / M4 |
| E2E | Critical journeys | Playwright | PR (smoke), nightly (full) |
| Security | AuthZ matrix, tenant isolation, SAST/DAST, fuzz | custom, Semgrep, ZAP | PR / staging |
| Accessibility | axe in e2e, manual screen-reader pass | axe, NVDA/VoiceOver | PR / pre-GA |
| Performance | API p95, payroll compute, import | k6 | nightly / pre-release |
| Resilience | Kill worker mid-run, DB failover, restore | chaos scripts | quarterly |
| UAT / parallel run | Real payroll comparison | Variance report | M3 exit, each major rule change |

## Critical journeys (e2e)
1. Login + MFA → role-appropriate home.
2. HR creates employee → encrypted IDs masked in UI.
3. Employee files leave → manager approves → balance and calendar update.
4. Punches ingested → attendance computed → exception resolved → period locked.
5. Payroll draft → exceptions → submit → approve (different user) → finalize → payslip visible → bank file generated.
6. DSR access request → export delivered → audit logged.
7. Offboarding → final pay → access revoked.

## Test data
Synthetic, seeded, deterministic; Filipino names with Ñ and diacritics; edge persons (mid-period hire, MWE, multiple holidays). No production data in non-prod.

## Payroll verification approach
1. Hand-calculated golden cases per rule ([payroll-test-cases](payroll-test-cases.md)).
2. Independent re-implementation in a spreadsheet for a sample (cross-check).
3. Parallel run: ≤ ₱1.00 variance per employee per run or documented explanation.
4. Regression on every rule-set version.

## Coverage and thresholds
See NFR-16. Coverage is a floor, not a goal; mutation score and golden breadth matter more for payroll.

## Defect management
Severity: S1 wrong pay or data leak (stop-ship, hotfix), S2 broken core flow, S3 degraded, S4 cosmetic. S1 requires post-incident review and a new golden test.

## Environments
Local (Docker compose) · CI (ephemeral) · Staging (prod-like, synthetic data) · Prod.

## Entry/exit
Entry to a milestone's testing: TDD reviewed, stories ready. Exit: [quality-gates](quality-gates.md).
