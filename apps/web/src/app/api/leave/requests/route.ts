import { NextResponse } from "next/server";
import { z } from "zod";
import { countLeaveDays } from "@/features/leave/utils/leaveDays";
import { problem, sessionPersonKey, unauthenticated } from "@/server/mock/http";
import { toLeaveRequest } from "@/server/mock/mapper";
import { routeApprover } from "@/server/mock/authorize";
import { balanceFor, leaveStore, nextId, typeName, type StoredLeave } from "@/server/mock/store";

const body = z.object({
  typeCode: z.enum(["VL", "SL"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().max(300).optional(),
});

export async function GET() {
  const key = await sessionPersonKey();
  if (!key) return unauthenticated();
  const mine = leaveStore().filter((request) => request.requesterKey === key).sort((a, b) => b.filedAt.localeCompare(a.filedAt));
  return NextResponse.json(mine.map((request) => toLeaveRequest(request, key)));
}

export async function POST(request: Request) {
  const key = await sessionPersonKey();
  if (!key) return unauthenticated();
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return problem(422, "Check the dates", "Choose a start and an end date.");
  const { typeCode, startDate, endDate, note } = parsed.data;
  const days = countLeaveDays(startDate, endDate);
  if (days === 0) return problem(422, "No working days in that range", "Pick dates that include at least one weekday, and an end date on or after the start date.");
  const { left } = balanceFor(key, typeCode);
  if (days > left) return problem(422, `Not enough ${typeName(typeCode).toLowerCase()}`, `You asked for ${days} ${days === 1 ? "day" : "days"} and have ${left} left.`);
  const clash = leaveStore().some((other) => other.requesterKey === key && other.status !== "returned" && other.startDate <= endDate && other.endDate >= startDate);
  if (clash) return problem(422, "These dates overlap another request", "Change the dates or return the other request first.");

  const { approverKey, routing } = routeApprover(key);
  const stored: StoredLeave = { id: nextId(), requesterKey: key, typeCode, startDate, endDate, days, note, status: "pending", filedAt: new Date().toISOString(), approverKey, routing };
  leaveStore().push(stored);
  return NextResponse.json(toLeaveRequest(stored, key), { status: 201 });
}
