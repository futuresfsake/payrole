import { countLeaveDays } from "@/features/leave/utils/leaveDays";
import { routeApprover, type Routing } from "./authorize";

export type LeaveTypeCode = "VL" | "SL";
export type LeaveStatus = "pending" | "approved" | "returned";

export interface StoredLeave {
  id: string;
  requesterKey: string;
  typeCode: LeaveTypeCode;
  startDate: string;
  endDate: string;
  days: number;
  note?: string;
  status: LeaveStatus;
  filedAt: string;
  decidedAt?: string;
  decisionComment?: string;
  approverKey: string;
  routing?: Routing;
}

const TYPE_NAMES: Record<LeaveTypeCode, string> = { VL: "Vacation leave", SL: "Sick leave" };
export const typeName = (code: LeaveTypeCode): string => TYPE_NAMES[code];

/** Seed ledger: yearly entitlement, and the balance left at the start of today after earlier 2026 usage. */
const ENTITLEMENT: Record<string, Record<LeaveTypeCode, number>> = {
  default: { VL: 15, SL: 7 },
  luis: { VL: 7.5, SL: 3.5 },
};
const OPENING_LEFT: Record<string, Partial<Record<LeaveTypeCode, number>>> = {
  ena: { VL: 6.5 },
  rey: { VL: 10 },
};

function seedRequest(id: string, requesterKey: string, typeCode: LeaveTypeCode, startDate: string, endDate: string, status: LeaveStatus, filedAt: string, note?: string): StoredLeave {
  const { approverKey, routing } = routeApprover(requesterKey);
  return {
    id, requesterKey, typeCode, startDate, endDate, days: countLeaveDays(startDate, endDate), status, filedAt, note, approverKey, routing,
    decidedAt: status === "pending" ? undefined : filedAt,
  };
}

function initial(): StoredLeave[] {
  return [
    seedRequest("lr-ena-vl", "ena", "VL", "2026-12-22", "2026-12-24", "pending", "2026-11-14T10:20:00+08:00", "Family trip"),
    seedRequest("lr-hana-vl", "hana", "VL", "2026-12-28", "2026-12-30", "pending", "2026-11-16T09:00:00+08:00"),
    seedRequest("lr-marco-sl", "marco", "SL", "2026-11-10", "2026-11-11", "approved", "2026-11-10T08:10:00+08:00"),
    seedRequest("lr-mika-vl", "mika", "VL", "2026-11-24", "2026-11-24", "approved", "2026-11-12T11:00:00+08:00"),
    seedRequest("lr-luis-sl", "luis", "SL", "2026-11-13", "2026-11-13", "pending", "2026-11-13T07:45:00+08:00"),
    seedRequest("lr-faye-vl", "faye", "VL", "2026-12-01", "2026-12-02", "approved", "2026-11-05T14:30:00+08:00"),
  ];
}

const globalStore = globalThis as unknown as { __payroleLeave?: StoredLeave[] };

/** In-memory for the mock API. Restarting the server resets it to the seed. */
export function leaveStore(): StoredLeave[] {
  globalStore.__payroleLeave ??= initial();
  return globalStore.__payroleLeave;
}

export function balanceFor(personKey: string, typeCode: LeaveTypeCode): { left: number; used: number } {
  const entitlement = (ENTITLEMENT[personKey] ?? ENTITLEMENT.default)[typeCode];
  const openingLeft = OPENING_LEFT[personKey]?.[typeCode] ?? entitlement;
  const approvedSince = leaveStore()
    .filter((request) => request.requesterKey === personKey && request.typeCode === typeCode && request.status === "approved")
    .reduce((sum, request) => sum + request.days, 0);
  const left = openingLeft - approvedSince;
  return { left, used: entitlement - left };
}

export function nextId(): string {
  return `lr-${Math.random().toString(16).slice(2, 10)}`;
}
