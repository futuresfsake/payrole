# API Design

Style: REST, JSON, OpenAPI 3.1 (contract-first, lint with Spectral). Base `/v1`. Auth: session cookie (first-party web, SameSite=Lax/Strict, CSRF token) or OAuth2 bearer (integrations).

## Conventions
- Plural nouns; actions as sub-resources: `POST /v1/payroll-runs/{id}/submit`.
- Pagination: `?limit=50&cursor=…`; response `{data:[], next_cursor}`.
- Filtering: `?filter[status]=active&sort=-created_at`.
- Concurrency: `ETag` + `If-Match` on PUT/PATCH; 412 on mismatch.
- Idempotency: `Idempotency-Key` on POST that creates or triggers.
- As-of queries: `?as_of=2026-07-01` for effective-dated resources.
- Errors: RFC 9457 `application/problem+json` with `type`, `title`, `status`, `detail`, `code`, `request_id`, field errors array.
- Rate limits: 429 with `Retry-After`; stricter on `/auth`, exports.
- Versioning: URL major; additive changes only within a version.

## Resource sketch
| Resource | Endpoints (summary) | Permission |
|---|---|---|
| Employees | GET/POST `/employees`, GET/PATCH `/employees/{id}`, GET `/employees/{id}/history` | `employee:*` |
| Identifiers | GET `/employees/{id}/identifiers` (masked), POST `/…/identifiers/{type}/reveal` (reason) | `identifier:read` |
| Compensation | GET/POST `/employees/{id}/compensation` | `compensation:*` |
| Documents | POST `/employees/{id}/documents` (presigned), GET (signed URL) | `document:*` |
| Org | `/org-units`, `/positions` | `org:*` |
| Schedules | `/schedules`, `/schedule-assignments` | `schedule:*` |
| Time | POST `/time-logs:import`, GET `/attendance?period=` | `time:*` |
| Leave | `/leave-types`, `/leave-requests`, `/leave-balances`, POST `/leave-requests/{id}/approve` | `leave:*` |
| Payroll | `/pay-groups`, `/payroll-runs`, POST `…/compute`, `/submit`, `/approve`, `/finalize`, GET `…/results`, `…/results/{emp}/trace` | `payroll_run:*` |
| Payslips | GET `/me/payslips`, `/payslips/{id}.pdf` | self/`payslip:read` |
| Loans | `/loans` | `loan:*` |
| Rules | GET `/rule-sets?type=sss&as_of=` ; POST draft; POST `/approve` | `rules:*` |
| Exports | POST `/exports` {type, period} → job; GET `/exports/{id}` | `export:*` |
| Workflow | GET `/me/tasks`, POST `/tasks/{id}/complete` | self |
| Privacy | `/dsr`, `/breaches`, `/retention-jobs` | `privacy:*` |
| Audit | GET `/audit-logs` | `audit:read` |
| Webhooks | `/webhook-endpoints` | `integration:*` |

## Example: finalize payroll
```
POST /v1/payroll-runs/9f2c…/finalize
Idempotency-Key: 3c1d…
If-Match: "v7"

200 { "id":"9f2c…","status":"finalized","snapshot_hash":"sha256:…","finalized_at":"2026-12-14T10:02:11Z" }
409 problem+json code=RUN_NOT_APPROVED
403 problem+json code=SOD_VIOLATION
```

## Webhooks
`employee.created`, `employee.separated`, `payroll_run.finalized`, `leave_request.approved`. Signed `X-Signature: t=…,v1=HMAC-SHA256`. Retries 24 h with exponential backoff; replay window 5 min.

## Security headers and CORS
CSP strict, HSTS, no wildcard CORS, cookies HttpOnly+Secure.
