# Glossary

| Term | Meaning |
|---|---|
| 201 File | Traditional employee record folder (contracts, IDs, clearances, memos). Digital equivalent = Employee Document Vault |
| ADR | Architecture Decision Record |
| ATS | Applicant Tracking System |
| BIR | Bureau of Internal Revenue (tax authority) |
| BR | Business Rule |
| CBA | Collective Bargaining Agreement |
| CoE | Certificate of Employment |
| COLA | Cost of Living Allowance |
| DOLE | Department of Labor and Employment |
| DPA | Data Privacy Act of 2012 (RA 10173) |
| DPIA / PIA | (Data) Privacy Impact Assessment |
| DPO | Data Protection Officer |
| DTR | Daily Time Record |
| eBIR / eFPS | BIR electronic filing systems |
| ESS / MSS | Employee / Manager Self-Service |
| FR / NFR | Functional / Non-Functional Requirement |
| GAP | Identified missing information, capability, or decision |
| HLD / LLD | High-Level / Low-Level Design |
| HRIS | Human Resource Information System |
| Holiday, Regular | Legal holiday: 100% pay even if unworked (rate multiples apply when worked) |
| Holiday, Special Non-Working | "No work, no pay" unless company policy says otherwise |
| JWT | JSON Web Token |
| MSC | Monthly Salary Credit (SSS contribution base) |
| MFA | Multi-Factor Authentication |
| NPC | National Privacy Commission |
| NSD | Night Shift Differential |
| OT | Overtime |
| PII / SPI | Personal Information / Sensitive Personal Information (DPA terms) |
| PSGC | Philippine Standard Geographic Code (region/province/city/barangay) |
| PIC / PIP | Personal Information Controller / Processor (DPA roles) |
| MWE | Minimum Wage Earner (tax-exempt basic pay under BIR rules) |
| SoD | Separation of Duties |
| RLS | Row-Level Security (PostgreSQL) |
| DEK / KEK | Data / Key Encryption Key |
| SBOM | Software Bill of Materials |
| SAST / SCA / DAST | Static analysis / Software composition analysis / Dynamic analysis security testing |
| PhilHealth | Philippine Health Insurance Corporation |
| Pag-IBIG | Home Development Mutual Fund (HDMF) |
| RBAC / ABAC | Role-based / Attribute-based access control |
| RPO / RTO | Recovery Point / Time Objective |
| SIL | Service Incentive Leave (5 days after 1 year, for covered employees) |
| SLO / SLI | Service Level Objective / Indicator |
| SSS | Social Security System |
| TDD | Technical Design Document (per story). Not test-driven development; that is spelled out |
| TIN | Tax Identification Number |
| 13th Month Pay | Mandatory under PD 851, at least 1/12 of basic salary earned in the calendar year |
| 2316 | BIR Certificate of Compensation Payment / Tax Withheld |
| 1601-C | Monthly remittance return of income taxes withheld on compensation |
| 1604-C | Annual information return of income taxes withheld on compensation |
| Alphalist | Annual list of employees and tax withheld, attached to 1604-C |
| RMC / RR / RA / PD | Revenue Memorandum Circular / Revenue Regulation / Republic Act / Presidential Decree |
| PayRole | Product name (provisional pending trademark check, OD-15) |
| Role assignment | A grant of one role to one user account with a scope, validity dates, grantor, approver and reason. The unit of access (ADR-013) |
| Derived role | A role computed from facts rather than granted: `employee` (linked to an active employee) and `manager` (has reports) |
| Scope | Where a permission applies: self, team, org unit, pay group or tenant |
| Workspace | A UI lens (Me, Team, HR, Payroll, Admin, Privacy, Audit, Dashboards) that filters navigation; never a security control |
| Static SoD | Forbidden role pairs, rejected when an assignment is proposed |
| Dynamic SoD | Object-level rules checked at action time, such as no self-approval |
| SoD exception | A recorded, second-approved, time-boxed (90 days at most) waiver of SoD-5 or SoD-6 |
| Bootstrap assignment | The first tenant-admin assignment(s), created at tenant provisioning without a proposer or approver |
| Seed data | Synthetic development data (`db/seed`); never real people or real statutory rates |
