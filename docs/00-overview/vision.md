# Vision

## Problem
Philippine SMEs (50–500 staff) run HR on spreadsheets, biometric exports, and paper 201 files. Payroll is the pain point: statutory contributions (SSS, PhilHealth, Pag-IBIG), withholding tax, holiday/OT/NSD premiums, 13th month, and loans change often and carry legal liability. Existing tools are either enterprise-priced (SAP SuccessFactors, Workday), foreign-first with weak PH statutory depth, or payroll-only with no real HR record.

## Vision statement
A single, trustworthy system of record for the employee lifecycle (hire → pay → grow → exit) that gets Philippine payroll right by default, keeps employee data private by design, and is simple enough for a 2-person HR team to run.

## 2026 standard: what "modern" means here
- **Statutory-correct by construction**: contribution tables, holiday calendars, and tax tables are versioned data, not code. Effectivity-dated.
- **Privacy by design** under RA 10173: field-level encryption of sensitive data, purpose-bound access, consent and retention tracked, 72-hour breach workflow.
- **Auditable**: every change to pay-relevant data is append-only logged (who, what, before/after, why).
- **Self-service first**: employees file leave/OT/corrections from phone; managers approve in two taps.
- **API-first & integrable**: biometric devices, accounting (GL export), banks (payroll file formats), government portals (file generation).
- **AI-assisted, human-decided**: assistive features (policy Q&A, anomaly flags on payroll, resume parsing) never make binding pay decisions. See ADR-009.
- **Accessible & mobile-first**: WCAG 2.2 AA; works on mid-range Android over weak networks.
- **Operable by one person**: boring tech, modular monolith, managed services, runbooks.

## Target users
See [personas.md](personas.md).

## Business goals (12 months post-MVP)
| Goal | Measure |
|---|---|
| Payroll accuracy | ≥ 99.9% of payslips need no manual correction after parallel run |
| Payroll cycle time | Cut-off to payslip release ≤ 1 business day for 200 employees |
| HR admin time | −50% time on leave/attendance reconciliation |
| Compliance | 0 missed statutory filing deadlines; reports generated in correct government format |
| Adoption | ≥ 85% of employees use ESS monthly |

## Non-goals (v1)
- Kasambahay (domestic worker) payroll, seafarers, government-sector (plantilla/GSIS/COA rules).
- Multi-country payroll.
- Full benefits administration with insurance carriers (HMO integration deferred).
- Building our own biometric hardware or a bank.
- Legal advice. The system encodes rules; the customer owns compliance decisions.

## Guiding principles
1. Correctness over features. A wrong payslip is worse than a missing screen.
2. Rules as data, effectivity-dated, with source citations.
3. Least privilege and least data.
4. Every automated number is explainable (payslip "why" breakdown).
5. Decisions are written down (ADRs); gaps are tracked (GAP register).
