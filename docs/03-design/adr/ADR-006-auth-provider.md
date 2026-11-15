# ADR-006: Managed OIDC provider behind an adapter

**Status:** Proposed (pending OD-04) · **Date:** 2026-11-15

## Context
Authentication is high-risk to build. The product must support MFA, passkeys, SSO later, and account recovery safely.

## Decision
Use a managed OIDC provider; the app only depends on an `IdentityPort` (verify token, map claims → actor, revoke session, enrol MFA). Server-side session for the web app; short-lived tokens for APIs. Provider evaluated against: MFA/passkeys, PH data-transfer terms, pricing at 25k users, export/exit path, SAML support.

## Consequences
+ Less security-critical code to own.
− Vendor dependency and cost; exit plan = adapter swap + user export (RISK-08).
− Data about identities (email, name) is processed by a third party: record in the data-inventory and DPA/sub-processor list.
