# TDD-workflow: Approval workflow engine

| | |
|---|---|
| Story/FR | US-501, US-502, US-503 / FR-501…FR-503 |
| Status | Draft |
| ADRs | 001 |

## 1. Problem and scope
One engine for leave, OT, time correction, profile change, comp change, requisitions, and document requests: multi-step approvals with delegation, escalation, and notifications. Out of scope: business effects of approval (handled by subscribing modules).

## 2. Design

### 2.1 Definition (per tenant, per request type; versioned)
```json
{
  "type": "leave_request", "version": 3,
  "steps": [
    { "id": "mgr", "approver": {"resolver": "direct_manager"}, "mode": "any",
      "timeoutHours": 48, "onTimeout": "escalate" },
    { "id": "hr",  "approver": {"resolver": "role", "role": "hr_admin"},
      "when": "request.days > 3 || request.leaveType in ['maternity','medical']",
      "timeoutHours": 72, "onTimeout": "remind" }
  ],
  "escalation": {"resolver": "manager_of_manager"},
  "allowSelfApproval": false,
  "onApprove": "emit:leave_request.approved", "onReject": "emit:leave_request.rejected"
}
```
Conditions use a restricted expression language (no arbitrary code); evaluated with a sandboxed parser (e.g. CEL-like), unit-tested; input is a typed request snapshot.

### 2.2 Resolvers
`direct_manager`, `manager_of_manager`, `role(scope)`, `department_head`, `specific_user`, `cost_center_owner`. Resolved at instance start and re-resolved at each step (reporting line may change). If unresolved → fallback to HR admin and flag.

### 2.3 Instance state
`workflow_instance(id, tenant_id, type, definition_version, subject_type, subject_id, requester_id, status, current_step, snapshot jsonb)`; `workflow_task(id, instance_id, step_id, assignee_id, status pending|approved|rejected|delegated|escalated|expired|cancelled, due_at, decided_at, comment)`. Instance snapshot freezes definition version so in-flight requests are unaffected by edits.

### 2.4 Rules
- Requester cannot approve own request (SoD-2); if resolver returns the requester, skip to next resolver.
- Delegation: approver sets delegate + date range; tasks route to delegate with "on behalf of" recorded.
- Escalation timers via delayed jobs (BullMQ) keyed by task id; idempotent; cancelled on decision.
- Concurrency: decision uses `UPDATE … WHERE status='pending'` returning rows; second decider gets 409.
- Cancellation by requester while pending; after final approval, reversal is a new request type (e.g. cancel leave).
- Sensitive-field profile change: always HR step; payroll notified of bank detail changes.

### 2.5 Subscriber contract
Modules subscribe to outcome events from the outbox (`workflow.completed{type, subjectId, outcome}`) and apply effects in their own transaction (idempotent by instance id). Engine never writes to other modules' tables.

### 2.6 Notifications
Events → notification service with templates (email, in-app, push); preferences and quiet hours; digest option for managers; deep links to the approval; email contains no sensitive details (no leave reason, no salary). Mobile quick-approve uses a signed single-use link requiring session or step-up depending on risk.

### 2.7 Audit
Every task decision, delegation, escalation, definition change is audited.

## 3. Security and privacy
Task visibility limited to assignee, requester, HR with permission, auditors. Approver sees only fields needed (leave dates and type shown per policy). Definition editing needs `workflow:configure` and second-admin approval for payroll-affecting types.

## 4. Failure modes
Timer lost (Redis flush): reconciliation job scans pending tasks past due every 5 min. Approver deactivated → tasks reassigned by resolver on next sweep. Definition deletes blocked while instances in flight.

## 5. Test plan
Unit: expression evaluator, resolvers. Integration: multi-step flows, conditional steps, delegation, escalation with fake clock, concurrent approvals. Property: every instance reaches a terminal state or has a pending task assigned to an active user. Security: IDOR on tasks, self-approval attempts. E2E: leave and OT journeys.

## 6. Rollout
Ship with default definitions per request type; edit UI after one customer pilot.

## 7. Open questions
Parallel approvals ("all must approve"), SLA reporting definitions, approver mobile deep-link risk (T-08).
