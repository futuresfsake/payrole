# ADR-006: Managed OIDC provider behind an adapter

**Status:** Accepted, conditional on the M0 spike (OD-04 closed 2026-11-15) · **Date:** 2026-11-15

## Context
Authentication is high-risk to build. The product must support MFA, passkeys, SSO later, and account recovery safely.

## Decision
Use a managed OIDC provider; the app only depends on an `IdentityPort` (verify token, map claims → actor, revoke session, enrol MFA). Server-side session for the web app; short-lived tokens for APIs. Provider evaluated against: MFA/passkeys, PH data-transfer terms, pricing at 25k users, export/exit path, SAML support.

## Selection
Default provider: **Auth0** (managed). Fallback: managed Keycloak. The first M0 task is a 2-day scored spike against the default; the default stands unless it fails a veto criterion.

Veto criteria (any one fails the candidate):
1. No enforceable MFA policy per role, or no passkey (WebAuthn) support.
2. No SAML/OIDC enterprise connection path for later SSO (INT-02).
3. No bulk user export with password hashes or documented migration path (exit plan, RISK-08).
4. Data-processing terms unacceptable for a PH processor (cross-border, sub-processor list, breach notice window).
5. Estimated cost at 25,000 monthly active users is above the NFR-24 infrastructure budget once OD-10 amounts exist. Pricing is **unverified** here and must be taken from the vendor's current page at spike time.

Record the scored result as a dated addendum to this ADR. The app depends only on `IdentityPort`, so a failed spike changes an adapter, not the product.

## Consequences
+ Less security-critical code to own.
− Vendor dependency and cost; exit plan = adapter swap + user export (RISK-08).
− Data about identities (email, name) is processed by a third party: record in the data-inventory and DPA/sub-processor list.
