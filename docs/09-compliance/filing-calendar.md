# Recurring Filing and Remittance Calendar (to drive reminders, US-408)

Due dates differ by agency, employer size/category, filing method, and are amended periodically. These are **placeholders to VERIFY**; store as rule-set data with citations, not as code.

| Obligation | Frequency | Typical timing (VERIFY) | Source |
|---|---|---|---|
| BIR 1601-C (withholding on compensation) | Monthly | By the 10th of following month (extended for eFPS filers) | BIR RR |
| BIR 0605 / payment | Monthly | With 1601-C | BIR |
| BIR 1604-C + Alphalist | Annual | By January 31 of following year | BIR |
| BIR 2316 to employees | Annual | By January 31 (or on separation) | BIR |
| SSS contributions (R-5/ePRS) | Monthly | Per employer-ID-last-digit schedule | SSS circular |
| PhilHealth premium (RF-1/EPRS) | Monthly | By 15th–end of following month by schedule | PhilHealth circular |
| Pag-IBIG contributions (MCRF) | Monthly | By 10th of following month | Pag-IBIG circular |
| 13th month pay | Annual | On/before December 24 | PD 851 |
| DOLE 13th-month report | Annual | By January 15 | DOLE |
| Service Incentive Leave conversion | Annual | Per policy / year-end | Labor Code |
| Minimum wage updates | Event | On wage order effectivity | RTWPB |
| Holiday proclamations | Event / annual | Annual calendar import in December | Malacañang |

## Reminder design
Reminder lead times configurable (default 7 days and 2 days). Due-date rules in rule-set data. Missed reminders raise an item on the payroll officer's dashboard. The system never files for the customer (ADR-003).
