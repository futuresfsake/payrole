# Threat Model

## Assets
A1 Salary & payslips · A2 Government IDs & bank accounts · A3 Medical/disciplinary records · A4 Payroll integrity (what gets paid) · A5 Audit log · A6 Credentials/keys · A7 Tenant isolation · A8 Availability at payday.

## Actors
External attacker (credential stuffing, phishing, scanners) · Malicious/curious employee · Rogue HR/payroll insider (ghost employee, salary tampering) · Compromised manager account · Malicious tenant admin · Platform operator insider · Supply-chain compromise · Departed employee.

## Trust boundaries
Internet ↔ WAF/API · API ↔ DB · API ↔ IdP · API ↔ object storage · Worker ↔ third-party (email/SMS/AI) · Tenant ↔ tenant · Operator ↔ tenant data.

## Threat register (STRIDE)
| ID | Threat | STRIDE | Asset | Likelihood | Impact | Mitigations | Residual |
|---|---|---|---|---|---|---|---|
| T-01 | Credential stuffing / phishing on privileged accounts | S | A1–A4 | H | H | MFA/passkeys mandatory for privileged roles, breached-password check, rate limit, anomaly alerts, session binding | Medium |
| T-02 | Cross-tenant data access via IDOR/SQL bug | I | A7 | M | Critical | RLS FORCE, tenant-scoped repos, negative CI tests, opaque UUIDs | Low |
| T-03 | Ghost employee or salary tampering by insider | T | A4 | M | H | SoD (preparer≠approver), approval of comp changes, audit chain, variance exceptions, new-employee report each run | Medium |
| T-04 | Mass export of salary/ID data | I | A1,A2 | M | H | Permission + purpose, export rate limit, DLP-style alerts, masked by default, signed expiring URLs | Medium |
| T-05 | Audit log tampering | R/T | A5 | L | H | Append-only, hash chain, external head anchoring, restricted DB role | Low |
| T-06 | SQL injection / ORM misuse | T/I | all | L | Critical | Parameterised queries only, lint ban on string-concat SQL, SAST, DB least-privilege | Low |
| T-07 | XSS stealing session / acting as user | S/T | all | M | H | CSP strict, output encoding, HttpOnly cookies, Trusted Types, sanitise rich text | Low |
| T-08 | CSRF on approvals | T | A4 | M | M | SameSite, CSRF tokens, re-auth for finalize/approve payroll | Low |
| T-09 | Malicious file upload (malware, polyglot, zip bomb) | T | all | M | M | Type sniffing, size caps, AV scan, quarantine, no execution, separate domain for downloads | Low |
| T-10 | Time-log spoofing / buddy punching / replay | S | A4 | H | M | Device auth keys, signed pushes, anomaly rules (impossible travel for mobile), approval of corrections | Medium |
| T-11 | Rule-set poisoning (altered tax/contribution table) | T | A4 | L | H | SoD approval, checksums, citations, golden tests, change alerts | Low |
| T-12 | Secrets leakage (repo, logs, CI) | I | A6 | M | H | Gitleaks pre-commit + CI, secret manager, OIDC to cloud (no long-lived keys), log scrubbing | Low |
| T-13 | Supply-chain (malicious npm package, CI action) | T | all | M | H | Lockfile, pinned action SHAs, provenance (SLSA-style), OSV scanning, minimal deps, Renovate review | Medium |
| T-14 | Ransomware / destructive attack | D | A8 | L | H | Immutable backups, separate account for backups, restore drills | Low |
| T-15 | DDoS / abuse at payday | D | A8 | M | M | WAF/CDN, rate limiting, autoscale, queue backpressure | Medium |
| T-16 | Operator insider reads tenant data | I | all | L | H | No standing access, break-glass with tenant notice, per-tenant keys, audit | Medium |
| T-17 | Breach of third-party processor (email, IdP, AI) | I | A1–A3 | M | M | Data minimisation to vendors, DPAs, sub-processor list, no salary in emails | Medium |
| T-18 | Payslip email interception | I | A1 | M | M | Portal-first delivery, link-only emails, optional encrypted PDF | Low |
| T-19 | Account takeover via recovery flow | S | A1–A3 | M | H | IdP recovery with HR verification for privileged accounts, notify on change | Medium |
| T-20 | Prompt injection in AI features | T/I | A1–A3 | M | M | Assistive-only, no tool access to writes, redaction, output filtering | Low |
| T-21 | Race conditions double-pay / double-approve | T | A4 | L | H | Idempotency keys, optimistic locking, unique constraints on run+employee | Low |
| T-22 | Misconfigured storage bucket exposure | I | A2,A3 | L | Critical | IaC with policy-as-code (block public), bucket policies tests, scanners | Low |
| T-23 | Insecure direct export links shared | I | A1 | M | M | Short TTL, single-use token option, audit | Low |
| T-24 | Dependency on stale statutory data causes underpayment | – | A4 | M | H | See RISK-01 | Medium |

## Abuse cases (selected)
- AC-1 HR clerk edits own salary effective date back-dated, then runs retro. → comp change needs approver; retro run shows delta exception; audit.
- AC-2 Manager approves OT for friends to inflate pay. → OT report per approver, thresholds, payroll review.
- AC-3 Employee changes bank account just before payday. → profile change approval, cooling period flag, notification to old contact.

## Review cadence
On every new module, integration, or architectural change; at each milestone gate; annually.
