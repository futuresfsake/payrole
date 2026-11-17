import { apiFetch, type ApiSchemas } from "@/lib/api";

export type LeaveBalanceDto = ApiSchemas["LeaveBalance"];
export type LeaveRequestDto = ApiSchemas["LeaveRequest"];
export type NewLeaveRequestDto = ApiSchemas["NewLeaveRequest"];

export function getLeaveBalances(): Promise<LeaveBalanceDto[]> {
  return apiFetch<LeaveBalanceDto[]>("/api/leave/balances");
}

export function listMyLeaveRequests(): Promise<LeaveRequestDto[]> {
  return apiFetch<LeaveRequestDto[]>("/api/leave/requests");
}

export function fileLeaveRequest(input: NewLeaveRequestDto): Promise<LeaveRequestDto> {
  return apiFetch<LeaveRequestDto>("/api/leave/requests", { method: "POST", json: input });
}
