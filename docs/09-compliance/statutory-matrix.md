# Statutory Matrix

Status column: Planned / Designed / Implemented / Verified. "Evidence" fills in as features ship. All rows **VERIFY** against primary source before Verified.

| # | Source | Obligation (engineering view) | Feature / FR | Milestone | Evidence (to produce) | Status |
|---|---|---|---|---|---|---|
| C-01 | RA 10173 §11 | Process by transparency, legitimate purpose, proportionality | Data inventory FR-112; privacy notice; purpose binding | M1 | Inventory export, notice template | Designed |
| C-02 | RA 10173 §16 | Honour data-subject rights (access, correction, erasure/blocking, objection, portability, damages) | FR-505 DSR portal | M5 | DSR e2e test, SLA report | Designed |
| C-03 | RA 10173 §20–21 | Reasonable and appropriate organisational, physical, technical security; accountability | [04-security](../04-security/README.md) | M0–M8 | ASVS checklist, pen test | Designed |
| C-04 | RA 10173 §20(f) / NPC Circular 16-03 | Breach notification to NPC and data subjects within 72 h when required | FR-702 breach workflow | M5 | Tabletop record | Designed |
| C-05 | RA 10173 / NPC | Appoint DPO; register data processing systems where required | OD-14, GAP-13 | Pre-GA | Registration proof | Open |
| C-06 | RA 10173 §26 | Penalties for SPI processing without basis: avoid collecting unnecessary SPI | Minimisation, ADR-010 | M1 | Review | Designed |
| C-07 | Labor Code Art. 128 / DOLE | Keep payroll and employment records available for inspection (≥ 3 years) | Retention policy; auditor export FR-704 | M4 | Retention config, export test | Designed |
| C-08 | Labor Code (hours of work, rest days, OT, NSD, holiday pay) | Correct premium computation | BR-TIME, FR-204, FR-303 | M2–M3 | Golden tests PC-02..09 | Designed |
| C-09 | Labor Code Art. 95 | Service Incentive Leave (5 days) | BR-LV, FR-207 | M2 | Unit tests | Designed |
| C-10 | PD 851 | 13th month pay, by Dec 24, pro-rated | BR-13M, FR-310 | M3 | TM-01..04 | Designed |
| C-11 | RA 11210 | 105-day maternity leave (+15 solo parent), 60 days miscarriage | BR-LV | M2 | Config validation tests | Designed |
| C-12 | RA 8187 | Paternity leave 7 days | BR-LV | M2 | | Designed |
| C-13 | RA 8972 / RA 11861 | Solo parent leave 7 days | BR-LV | M2 | | Designed |
| C-14 | RA 9262 | VAWC leave 10 days | BR-LV | M2 | | Designed |
| C-15 | RA 9710 | Special leave for women | BR-LV | M2 | | Designed |
| C-16 | Wage orders (regional) | Minimum wage validation | GAP-04, BR-RATE-4 | M3 | Data table + tests | Open |
| C-17 | SSS Law RA 11199 | Employer registers employees, deducts and remits contributions, files reports | BR-STAT, FR-304, FR-401 | M3–M4 | SS tests ST-01..03 | Designed |
| C-18 | RA 11223 / PhilHealth circulars | Premium deduction and remittance | BR-STAT, FR-401 | M3–M4 | ST-04..05 | Designed |
| C-19 | RA 9679 Pag-IBIG | Contribution deduction and remittance | BR-STAT, FR-401 | M3–M4 | ST-06 | Designed |
| C-20 | NIRC as amended by TRAIN; BIR RRs | Withholding on compensation; 1601-C monthly; 1604-C + alphalist annually; 2316 | BR-TAX, FR-305, FR-402..403 | M3–M4 | TX-01..09; BIR validators | Designed |
| C-21 | BIR record keeping | Books and records retention (up to 10 years suggested) | Retention policy | M4 | | Open (GAP-03) |
| C-22 | RA 11058 OSH | Safety training records, accident reporting data | Training module, records FR | M7 | | Planned |
| C-23 | RA 11313 / RA 7877 | Policy acknowledgement and training records | FR-506 | M5 | Ack report | Planned |
| C-24 | RA 8792 | Electronic documents/signatures legally valid; integrity | FR-604 | M6 | | Planned |
| C-25 | Termination rules (Labor Code Arts. 297–299) | Separation pay by cause; final pay | BR-OFF, FR-602 | M6 | FP-01..02 | Open (GAP-15) |
| C-26 | DOLE advisories | CoE within 3 days; final pay within 30 days | BR-OFF-3/4 | M6 | | Designed |
| C-27 | RA 11165 telecommuting | Telecommuting terms recorded | Schedule type; GAP-16 | M2 | | Open |
| C-28 | Magna Carta for Disabled / Senior / equal opportunity | No discriminatory data use in ATS | ATS design review | M6 | | Planned |
