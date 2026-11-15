# Data Privacy Act Compliance Plan (RA 10173)

## NPC five pillars → our plan
| Pillar | Obligation | Plan / owner |
|---|---|---|
| 1. Governance (DPO) | Appoint DPO, accountability | OD-14; owner interim DPO; written designation |
| 2. Risk assessment | PIA / DPIA before new processing | PIA at M1, DPIA for biometrics/location/AI (M5–M6), repeat annually |
| 3. Organisational | Policies, training, contracts | Privacy policy, security policy, staff training, DPAs with customers, sub-processor agreements |
| 4. Physical/technical | Access control, encryption, logging, backups | [04-security](../04-security/README.md) |
| 5. Breach management | Detect, notify, document | [incident-response](../06-operations/incident-response.md); FR-702 |

## Principles mapping
| Principle | Implementation |
|---|---|
| Transparency | Privacy notice at onboarding; data inventory; purposes visible in profile |
| Legitimate purpose | Lawful-basis field per processing purpose; consent only for optional processing |
| Proportionality | Field-level necessity review; masked by default; no biometric templates (ADR-010) |

## Data subject rights
Access, correction, erasure/blocking, objection, portability, damages: FR-505. Self-service request form → DPO queue → fulfilment → audit. Identity verification before disclosure. Fulfilment SLA internal 15 days (**VERIFY** legal timeline).

## Sensitive personal information inventory (initial)
Age/birth date, marital status, government-issued identifiers, health data (medical certificates, sick leave reasons), disciplinary/legal proceedings, salary-linked financial data (treated as high-confidentiality even where not strictly SPI). Handling per [data-protection](../04-security/data-protection.md).

## Roles and contracts
- Customer = PIC; PayRole = PIP. DPA contract template to be drafted and counsel-reviewed (GAP-09).
- Data sharing: none with third parties other than sub-processors and agencies at the customer's direction (file downloads by customer).
- Cross-border: hosted in AWS Singapore (ADR-011), disclosed in notice and DPA.

## Registration and filings
Determine whether registration of data processing systems/DPO with NPC is required for the operator and for customers; document outcome (GAP-13). Provide customers a guide to register their HR processing where applicable.

## Evidence pack (for audits and customer due diligence)
Privacy notice, PIA reports, data inventory export, DPA template, sub-processor list, security overview + pen test summary, breach register extract, DSR metrics, training records, access reviews.

## Open items
GAP-03 (retention), GAP-13 (registration), GAP-14 (biometrics classification), OD-03 (region), OD-14 (DPO).
