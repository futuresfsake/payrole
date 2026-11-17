import type { components } from "@/lib/api-types";
import { findPerson } from "./people";
import { typeName, type StoredLeave } from "./store";

type LeaveRequest = components["schemas"]["LeaveRequest"];

/** Shapes a stored request for one viewer. `canDecide` is computed here, from facts, never by the UI. */
export function toLeaveRequest(stored: StoredLeave, viewerKey: string): LeaveRequest {
  const requester = findPerson(stored.requesterKey);
  const approver = findPerson(stored.approverKey);
  return {
    id: stored.id,
    requesterName: requester?.name ?? "Unknown",
    typeName: typeName(stored.typeCode),
    startDate: stored.startDate,
    endDate: stored.endDate,
    days: stored.days,
    ...(stored.note ? { note: stored.note } : {}),
    status: stored.status,
    filedAt: stored.filedAt,
    ...(stored.decidedAt ? { decidedAt: stored.decidedAt } : {}),
    ...(stored.decisionComment ? { decisionComment: stored.decisionComment } : {}),
    approverName: approver?.name ?? "Not assigned",
    canDecide: stored.status === "pending" && stored.approverKey === viewerKey && stored.requesterKey !== viewerKey,
    ...(stored.routing ? { routing: stored.routing } : {}),
  };
}
