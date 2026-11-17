# Specifications Overview

This is the entry point to requirements. The BA translation of the vision and stories into testable statements lives in the linked documents.

| Document | Content |
|---|---|
| [functional-requirements.md](functional-requirements.md) | FR-* testable "the system shall" statements by module |
| [business-rules.md](business-rules.md) | BR-* Philippine payroll/HR rules, formulas, rounding. **VERIFY-tagged values** |
| [non-functional-requirements.md](non-functional-requirements.md) | NFR-* performance, availability, security, accessibility, etc. |
| [data-requirements.md](data-requirements.md) | Entities, attributes, classification, retention |
| [access/rbac-matrix.md](access/rbac-matrix.md) | Role × permission matrix (multi-role) |
| [access/roles-and-permissions.md](access/roles-and-permissions.md) | Role catalog, permission catalog, role assignment, SoD |
| [traceability-matrix.md](traceability-matrix.md) | Story → FR → test mapping |
| [integration-requirements.md](integration-requirements.md) | External interfaces |

## BA method
1. **Elicit**: vision, personas, legal sources, competitor review.
2. **Analyze**: decompose into epics and stories; model flows and states ([app-flow](../01-product/app-flow.md)).
3. **Specify**: write FRs with unique IDs, priority, and acceptance criteria; extract business rules separately so they can be tested and versioned independently of UI.
4. **Validate**: walkthrough with payroll/HR practitioners; parallel-run with real data.
5. **Trace**: every FR → story → design → test.
6. **Manage change**: changes via ADR or requirements PR; gaps tracked in [gaps.md](../00-overview/gaps.md).

## Requirement quality checklist
Each FR is: unambiguous, atomic, testable, traceable, prioritized, and states actor + trigger + outcome. Numbers (rates, thresholds) never live in FR text; they reference a rule-set entry.

## Assumptions
- A-01 One legal entity per tenant at launch.
- A-02 Payroll frequencies: weekly, semi-monthly, monthly.
- A-03 Employees are PH-based, paid in PHP.
- A-04 Customer HR is responsible for policy configuration; the system provides compliant defaults.
- A-05 Time source: biometric/CSV/mobile punch; the system does not assume a physical device brand.

## Constraints
- C-01 RA 10173 and its IRR govern personal data handling.
- C-02 Statutory data must be effectivity-dated and cited.
- C-03 Money uses decimal (no binary floats).
- C-04 Solo developer: complexity budget is low; favor boring technology.

## Dependencies
Agency formats (GAP-08), bank formats (GAP-07), hosting (decided, ADR-011), auth provider (decided, ADR-006; M0 spike confirms).
