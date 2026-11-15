# TDD-attendance-engine: Daily attendance computation

| | |
|---|---|
| Story/FR | US-204, US-211 / FR-204, FR-211 |
| Status | Draft |
| ADRs | 001, 005, 008 |

## 1. Problem and scope
Turn raw punches plus schedule, holidays, and approved requests into per-day minute buckets that payroll consumes. Out of scope: ingesting punches (TDD-time-ingest), approvals (TDD-workflow), pay maths (TDD-payroll-engine).

## 2. Requirements recap
BR-TIME-1…7, BR-RND, FR-204 (late, undertime, absent, OT, NSD, rest day, holiday), FR-211 (period lock), NFR-03 (500 employees × month < 3 min), NFR-21 (Asia/Manila business dates).

## 3. Design

### 3.1 Pure function
`computeDay(input): AttendanceDay` in `packages/domain/attendance`. No I/O.

```
DayInput {
  businessDate, employeeId,
  schedule: { start, end, breakMinutes, isRestDay, graceLateMin, graceUndertimeMin, roundingMode, nsdWindow },
  holiday: null | { type: regular|special|special_working|local },
  punches: [{ ts, source }],        // sorted, deduped
  approved: { ot: [{from,to}], leave: [{type, fraction, paid}], corrections: [{in,out}], suspension? },
  flags: { isExempt, isDailyPaid, isMonthlyPaid }
}
AttendanceDay { minutes: {regular, late, undertime, absent, otOrdinary, otRestDay, otHoliday..., nsd...},
                dayType, flags[], status: ok|exception|locked, trace[] }
```

### 3.2 Algorithm
1. **Shift window:** scheduled start/end as instants in Asia/Manila; overnight shifts belong to the business date of their start.
2. **Pairing punches:** first IN and last OUT inside window `[start − 4h, end + 8h]` (configurable); corrections override. Odd punch count or missing OUT → exception `MISSING_PUNCH` unless a correction exists.
3. **Worked interval** = clamp(actual) ∩ extended window; subtract unpaid break.
4. **Late** = max(0, firstIn − (start + grace)) per rounding mode; **undertime** similarly at end. Leave fractions offset late/absent (half-day leave covers half the window).
5. **Absent** when no worked time and no paid leave, not rest day/holiday-unworked.
6. **Overtime:** worked minutes beyond scheduled minutes, counted only if inside an approved OT interval (policy `preApproval=true`) else flagged `UNAPPROVED_OT` and zeroed. Tiering by day type (ordinary, rest day, special, regular holiday, regular+rest) → bucket names match the premium rule keys.
7. **NSD:** intersect worked interval (regular + OT) with 22:00–06:00 (rule-set `nsdWindow`); minutes split by the day type of each segment when the window crosses midnight.
8. **Day type:** from schedule (rest day) × holiday calendar as of date. Holiday + rest day combos map to rule keys.
9. **Exempt employees:** compute hours for records but zero premium buckets.
10. **Suspension event:** apply tenant treatment (paid / unpaid / leave-charged).
11. **Trace:** each decision recorded for the attendance "why" popover.

### 3.3 Orchestration
Worker `attendance.recompute(employeeId, dateRange)` triggered by: punch ingest, approval completion, schedule/holiday change. Upserts `attendance_day`; skips locked days. Batch by tenant and day; 500 emp × 31 days = 15.5k pure calls, parallelised in chunks.

### 3.4 Locking
`attendance_period_lock(pay_period_id, locked_at, locked_by)`. DB trigger rejects writes to `attendance_day` in a locked period. Unlock requires permission, reason, audit, and invalidates dependent draft runs.

### 3.5 Data
`attendance_day(tenant_id, employee_id, business_date, day_type, minutes jsonb or columns, flags text[], status, rule_version_ids, computed_at, input_hash)`; unique `(tenant_id, employee_id, business_date)`. `input_hash` lets recompute skip unchanged days.

## 4. Security and privacy
Attendance reveals location/habits: visible to self, manager (team), HR, payroll. Mobile punch geolocation not stored in this table. Audit on manual corrections and unlock.

## 5. Failure modes
Clock skew (device time wrong): flag when punch ts is > 5 min in future or older than 7 days at ingest. Duplicate punches within 60 s collapsed. Schedule missing → exception `NO_SCHEDULE`. Recompute racing with lock: lock check inside the same transaction.

## 6. Test plan
- Golden YAML cases: normal day, late with/without grace, undertime, half-day leave, overnight NSD crossing midnight, regular holiday worked, holiday + rest day, OT unapproved/approved, missing punch + correction, exempt employee, suspension day.
- Property: total classified minutes ≤ elapsed minutes; buckets non-negative; idempotent recompute (same input hash → same output); splitting a day at midnight conserves minutes.
- Timezone: run suite with `TZ=UTC` and `TZ=Asia/Manila`.
- Performance: k6/benchmark for NFR-03.

## 7. Rollout
Behind flag `time.engine.v1`; compare against customer's spreadsheet DTR for one month before enabling payroll linkage.

## 8. Open questions
GAP-16 (telecommuting), GAP-17 (suspension pay), per-customer rounding policy defaults, treatment of flexi-time core hours.
