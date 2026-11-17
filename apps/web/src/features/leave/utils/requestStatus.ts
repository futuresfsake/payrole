import type { DomainStatus } from "@/design-system/components/StatusBadge";
import type { LeaveRequestDto } from "../api/leave";

export function toDomainStatus(status: LeaveRequestDto["status"]): DomainStatus {
  return status === "approved" ? "approved" : status === "returned" ? "returned" : "pending";
}

export function dayRange(request: Pick<LeaveRequestDto, "startDate" | "endDate">, format: (iso: string) => string): string {
  return request.startDate === request.endDate ? format(request.startDate) : `${format(request.startDate)} to ${format(request.endDate)}`;
}

export function daysLabel(days: number): string {
  return `${days} ${days === 1 ? "day" : "days"}`;
}
