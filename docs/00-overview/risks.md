# Risk Register

Score = Likelihood (1–5) × Impact (1–5).

| ID | Risk | L | I | Score | Mitigation | Owner |
|---|---|---|---|---|---|---|
| RISK-01 | Payroll miscalculation from stale/wrong statutory data | 3 | 5 | 15 | Rules as versioned data with citations, golden tests, parallel run, "explain this number" view | Payroll lead |
| RISK-02 | Data breach of employee PII/SPI (IDs, TIN, SSS no., salary) | 2 | 5 | 10 | Field-level encryption, RLS, MFA, audit, 72h breach runbook, pen test | Security |
| RISK-03 | Scope explosion (HRIS is huge) | 5 | 3 | 15 | Milestone gates; payroll + core HR first; defer performance/learning | Owner |
| RISK-04 | Single-person bus factor | 4 | 4 | 16 | Docs-first, ADRs, runbooks, boring tech, IaC | Owner |
| RISK-05 | Government file formats change or are undocumented | 4 | 3 | 12 | Isolate in export adapters, versioned templates, spike each | Eng |
| RISK-06 | Multi-tenant isolation bug leaks across customers | 2 | 5 | 10 | Postgres RLS + tenant-scoped tests in CI + negative tests | Eng |
| RISK-07 | Time-clock integration instability | 3 | 3 | 9 | CSV fallback; idempotent ingest | Eng |
| RISK-08 | Over-reliance on managed vendor (auth/db) | 3 | 3 | 9 | Adapter interfaces, export paths, documented exit plan | Eng |
| RISK-09 | Legal exposure from presenting rules as advice | 3 | 4 | 12 | Disclaimers, customer sign-off on policy config, counsel review | Owner |
| RISK-10 | AI feature leaks PII or hallucinates policy | 3 | 4 | 12 | Assistive only, RAG with citations, no PII to external models by default | Eng |
| RISK-11 | Adoption: employees ignore ESS | 3 | 3 | 9 | Mobile-first UX, WhatsApp/Viber-free notifications via email/SMS/push, onboarding | Product |
| RISK-12 | Cost overruns from cloud/SMS | 2 | 3 | 6 | Budgets and alerts, per-tenant metering | Ops |
| RISK-13 | Time zone/date bugs in cut-offs | 3 | 3 | 9 | Store UTC + business-date columns for Asia/Manila; tests across boundaries | Eng |
| RISK-14 | Money rounding errors | 3 | 4 | 12 | Decimal arithmetic only (no floats), rounding policy in BR-RND, property tests | Eng |
