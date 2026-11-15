# TDD-time-ingest: Time-log ingestion

| | |
|---|---|
| Story/FR | US-203 / FR-203 |
| Status | Draft |
| ADRs | 001, 010 |

## 1. Problem and scope
Receive punches from CSV uploads and device pushes safely, idempotently, and keep raw logs. Out of scope: computing attendance, mobile punch (US-505).

## 2. Design

### 2.1 Sources
| Source | Mechanism | Auth |
|---|---|---|
| CSV | Upload in UI → async job | User session + `time:import` |
| Device push (ZKTeco ADMS-style or HTTPS webhook) | `POST /v1/time-logs:ingest` batch | Per-device API key (hashed at rest) + optional IP allow-list; keys rotatable |

### 2.2 Raw log table
`time_log_raw(id, tenant_id, device_id, source, employee_ref, ts_utc, ts_local_business_date, direction hint, payload_hash, received_at, batch_id, status)`. Append-only. Unique `(tenant_id, device_id, employee_ref, ts_utc)` → duplicates ignored (idempotent). Original file kept in object storage by checksum for 3 years (NFR retention).

### 2.3 Pipeline
1. Receive → store batch record (`batch_id`, checksum, source, uploader).
2. Parse and validate rows: timestamp parse with explicit timezone (device default Asia/Manila), employee reference mapping (`employee_device_map`: badge/PIN → employee, effective-dated); unknown refs go to `time_log_quarantine` with reason.
3. Bulk insert with `ON CONFLICT DO NOTHING`; counts returned (inserted, duplicate, rejected, quarantined).
4. Emit `TimeLogsIngested{employeeIds, dateRange}` via outbox → attendance recompute.
5. Import report downloadable (CSV of rejected rows with reasons).

### 2.4 Validation rules
Timestamp not > 5 min in future, not older than 60 days (warn; configurable); max 50k rows per batch; file ≤ 20 MB; UTF-8 with BOM tolerance; CSV injection safe on re-export (prefix `'` for cells starting `= + - @`).

### 2.5 Device clock drift
Per-device offset setting; ingestion stores both device ts and corrected ts. Alert if a device has no pushes for > 24 h on working days.

### 2.6 Biometrics
Only employee reference + timestamp accepted. Payload fields resembling templates are rejected and logged (ADR-010).

## 3. Security and privacy
Device keys scoped to tenant and ingest endpoint only; rate-limit per device; payload size caps; never log full rows. Replay protection via idempotency and optional timestamp window. Attendance data classified Personal.

## 4. Failure modes
Partial batch failure → per-row status, batch committed with rejects listed. Device retries → deduped. Worker down → outbox retains events. Large CSV → streamed parsing, chunked inserts (5k rows).

## 5. Test plan
Unit: parsers, timezone handling, dedupe key. Integration: idempotent re-upload of same file yields zero new rows; unknown badge quarantine; cross-tenant key misuse rejected. Property: random shuffles/duplicates of rows yield identical final table. Security: oversize, malformed, CSV-injection cases.

## 6. Rollout
CSV first (M2), device push after pilot with one device model; device onboarding guide in [local-development](../../08-guides/local-development.md) follow-up.

## 7. Open questions
OD-05 vendor list, mobile punch geofence data retention, handling of devices that cannot send direction (IN/OUT inferred by order).
