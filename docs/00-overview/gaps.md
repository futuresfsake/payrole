# Gap Register

Gaps = missing information, unverified assumptions, or capabilities we know we lack. Raised by business analysis; reviewed each milestone.

| ID | Gap | Impact | Owner | Resolution path | Status |
|---|---|---|---|---|---|
| GAP-01 | Current-year statutory tables (SSS MSC/brackets, PhilHealth rate/floor/ceiling, Pag-IBIG cap, BIR withholding table) not independently verified. Figures in docs are **VERIFY** | Wrong payroll = legal exposure | Payroll lead | Pull primary-source circulars, store with citation in `rule_sets` table; golden tests | Open |
| GAP-02 | No access to a real PH payroll dataset for parallel-run testing | Cannot prove accuracy | Owner | Confirm a friendly SME partner for anonymized parallel run by M1 exit (not M3 exit: lead time is long). Fallback for Alpha only: 30+ hand-computed scenarios reviewed by an external payroll practitioner. GA still requires two live parallel cycles | Open |
| GAP-03 | Retention periods (payroll, 201 file, applicants, CCTV/biometric logs) need legal confirmation | DPA + DOLE + BIR conflict risk | DPO/counsel | Counsel review; default to longest applicable | Open |
| GAP-04 | Wage-order minimum wage by region (17 regions) and its changes | Minimum wage validation | Payroll lead | Ship as data table, effectivity-dated | Open |
| GAP-05 | Holiday proclamations change yearly, plus local special days | Wrong holiday pay | Payroll lead | Annual calendar import + admin override + proclamation citation | Open |
| GAP-06 | De minimis benefit ceilings and non-taxable 13th-month/other-benefits cap | Tax computation | Payroll lead | Data table, VERIFY | Open |
| GAP-07 | Bank file formats | Cannot generate bank uploads | Owner | Request specs from banks / customers | Open |
| GAP-08 | Government e-filing formats (BIR alphalist data file, SSS R-3/R-5 / ePRS, PhilHealth RF-1/EPRS, Pag-IBIG MCRF/ e-files) change | Reports rejected | Payroll lead | Spike per agency during M3 (allowed overlap in milestones), so M4 is not blocked on research | Open |
| GAP-09 | No legal review of employment contract / policy templates | Liability | Counsel | Ship templates as "samples", customer-owned | Open |
| GAP-10 | Accessibility testing with real assistive-tech users | WCAG claims unproven | QA | Manual audit before GA | Open |
| GAP-11 | Union/CBA scenarios and unusual pay types (piece-rate, commission, tipped) | Edge coverage | BA | Defer; spec in M8 backlog | Open |
| GAP-12 | Trademark and domain clearance for "PayRole" (near-homophone of "payroll", possibly weak or descriptive; many similar payroll brands likely) | Rebrand cost | Owner | IPOPHL search, domain and social handle check | Open |
| GAP-13 | NPC registration thresholds and current circular requirements for the SaaS operator as personal information processor | Compliance | DPO | Counsel + NPC site check | Open |
| GAP-14 | Biometric data classification (SPI?) and lawful basis for time-clock face/fingerprint | High privacy risk | DPO | Avoid storing templates; accept device-side match IDs only (see ADR-010) | Proposed |
| GAP-15 | Separation pay, final pay timing, clearance rules per cause of termination | Offboarding calc | BA + counsel | Rule matrix in BR-OFF; DOLE guidance cited | Open |
| GAP-16 | Work-from-home / telecommuting attendance rules under current law | Time rules | BA | Policy-driven schedule type | Open |
| GAP-17 | Disaster scenario: typhoon/force-majeure work suspension and pay | Payroll edge | BA | Admin-declared "suspension event" with pay treatment rule | Open |
| GAP-18 | Load profile unknown (concurrent users at cut-off) | Capacity | Eng | Assume 500 emp/tenant, 50 tenants; load test M8 | Open |
| GAP-19 | Funding/budget for pen test and external security review | Security assurance | Owner | Budget before GA | Open |
| GAP-20 | Data migration inputs: customers' legacy formats | Onboarding effort | BA | Import templates + validation report (US-103) | Open |
