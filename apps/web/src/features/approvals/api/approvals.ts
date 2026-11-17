import { apiFetch, type ApiSchemas } from "@/lib/api";
import type { LeaveRequestDto } from "@/features/leave/api/leave";

export type DecisionDto = ApiSchemas["Decision"];

export function listApprovals(): Promise<LeaveRequestDto[]> {
  return apiFetch<LeaveRequestDto[]>("/api/approvals");
}

export function decideApproval(id: string, decision: DecisionDto): Promise<LeaveRequestDto> {
  return apiFetch<LeaveRequestDto>(`/api/approvals/${encodeURIComponent(id)}/decision`, { method: "POST", json: decision });
}
