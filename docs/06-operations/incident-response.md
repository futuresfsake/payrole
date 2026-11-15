# Incident Response

## Severity
| Sev | Definition | Response | Example |
|---|---|---|---|
| SEV-1 | Data breach, cross-tenant exposure, wrong payroll released at scale, prod down at payday | Immediate, all hands | Tenant A sees tenant B data |
| SEV-2 | Core flow broken, partial outage, single-tenant wrong pay | < 1 h | Payroll compute failing for one tenant |
| SEV-3 | Degraded, workaround exists | Same day | Slow reports |
| SEV-4 | Minor | Backlog | Cosmetic |

## Process
1. **Detect/report**: alert, customer, or internal. Open incident record with timestamp (start of the 72 h clock for suspected personal-data breaches).
2. **Triage**: assign severity, incident commander (owner), scribe.
3. **Contain**: revoke sessions/keys, disable feature flag, block IPs, isolate tenant, stop exports. Preserve evidence (logs, snapshots).
4. **Assess**: scope (tenants, records, data classes), SPI involved? Risk of serious harm? Use [data-protection](../04-security/data-protection.md) breach assessment.
5. **Notify**: customers (PICs) immediately per DPA (target ≤ 24 h); NPC and data subjects within 72 h where required (**VERIFY** current NPC rules); regulators/others per counsel.
6. **Eradicate/recover**: fix root cause, rotate secrets, restore from backup if needed, verify.
7. **Communicate**: status updates every 60 min for SEV-1/2.
8. **Post-incident review** within 5 working days: blameless, timeline, root cause, actions with owners; new tests/golden cases added; archive in [10-reviews](../10-reviews/README.md).

## Payroll-specific playbook
- Wrong finalized payroll: freeze payment file; if not yet paid, reverse run with reason and re-run; if paid, create correction adjustment, notify affected employees via approved template, record in audit.
- Statutory table error: publish corrected rule version, recompute affected drafts, list finalized runs affected and quantify variance.

## Contacts and tooling
Maintain on-call roster (owner + backup), customer contact list, NPC contact, counsel, vendor support. Pager + status page. Templates for customer and NPC notices live in this folder (add at M8).

## Exercises
Tabletop twice a year; scenario list: credential theft of payroll user, leaked export link, vendor breach, ransomware, rule-set error.
