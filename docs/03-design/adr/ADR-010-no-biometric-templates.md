# ADR-010: Do not store biometric templates

**Status:** Accepted · **Date:** 2026-11-15

## Context
Biometric data (fingerprint, face) is highly sensitive; classification under the DPA needs counsel confirmation (GAP-14). Breach of templates is irreversible.

## Decision
The system stores only punch events (employee reference, timestamp, device id) from time clocks. Matching and templates stay on the device. Mobile punch with selfie is optional, off by default, stores no face template, retains selfie images for a short period (default 30 days) and requires a privacy notice and DPIA.

## Consequences
+ Smaller breach impact and compliance burden.
− Cannot offer cloud-based face matching; customers rely on device matching.
