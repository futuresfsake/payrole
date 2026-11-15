# Personas and Stakeholders

| ID | Persona | Goals | Pain today | Key modules |
|---|---|---|---|---|
| P1 | **HR Admin (Hana)**, 1–3 person HR team | Maintain records, run onboarding/offboarding, answer employee questions | Spreadsheets, repeated data entry, paper 201 | Core HR, Docs, Reports |
| P2 | **Payroll Officer (Paolo)** | Accurate, on-time payroll and remittances | Manual computation, rate changes, last-minute attendance fixes | Payroll, Statutory, Time |
| P3 | **Employee (Ena)**, office or field, often on mobile | See payslip, file leave/OT, update info | Chasing HR via chat for basic info | ESS |
| P4 | **Line Manager (Marco)** | Approve leave/OT, see team calendar, run reviews | Approvals buried in chat/email | MSS, Performance |
| P5 | **Finance Controller (Faye)** | Payroll cost, GL posting, budgets | Re-keying payroll into accounting | Reports, GL export |
| P6 | **Company Owner / GM** | Headcount, cost, risk exposure | No single view | Dashboards |
| P7 | **Data Protection Officer (Dan)** | Demonstrate DPA compliance, handle data-subject requests | No inventory, no access logs | Privacy console, Audit |
| P8 | **System Admin / IT** | Users, SSO, integrations, backups | Shadow tools | Admin, Integrations |
| P9 | **External auditor / DOLE inspector** | Verify records | Records scattered | Read-only audit export |
| P10 | **Recruiter** | Fill roles | Resumes by email | ATS |

## Stakeholder map
- **Sponsor/decision maker:** project owner.
- **Regulators (indirect):** BIR, SSS, PhilHealth, Pag-IBIG, DOLE, NPC.
- **Vendors:** hosting provider, SMS/email provider, bank file specs, biometric vendors.

## Segment assumptions (see OD-02)
- Single legal entity per tenant at launch; multi-entity (group of companies) in M8+.
- Monthly/semi-monthly pay frequency dominates; weekly and daily-paid supported by rule engine.
- Mix of office (fixed schedule) and shift/field staff.
