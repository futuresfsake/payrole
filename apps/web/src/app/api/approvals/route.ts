import { NextResponse } from "next/server";
import { holdsLeaveApprove } from "@/server/mock/authorize";
import { problem, sessionPersonKey, unauthenticated } from "@/server/mock/http";
import { toLeaveRequest } from "@/server/mock/mapper";
import { leaveStore } from "@/server/mock/store";

/** Requests assigned to the signed-in person. Their own requests never appear here (SoD-2). */
export async function GET() {
  const key = await sessionPersonKey();
  if (!key) return unauthenticated();
  if (!holdsLeaveApprove(key)) return problem(403, "No permission in this scope", "Your roles don't include approving leave.", "NO_PERMISSION_IN_SCOPE");
  const assigned = leaveStore()
    .filter((request) => request.approverKey === key && request.requesterKey !== key)
    .sort((a, b) => b.filedAt.localeCompare(a.filedAt));
  return NextResponse.json(assigned.map((request) => toLeaveRequest(request, key)));
}
