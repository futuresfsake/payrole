import { NextResponse } from "next/server";
import { z } from "zod";
import { mayDecide } from "@/server/mock/authorize";
import { problem, sessionPersonKey, unauthenticated } from "@/server/mock/http";
import { toLeaveRequest } from "@/server/mock/mapper";
import { leaveStore } from "@/server/mock/store";

const body = z.object({ decision: z.enum(["approve", "return"]), comment: z.string().max(300).optional() });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const key = await sessionPersonKey();
  if (!key) return unauthenticated();
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return problem(422, "Choose approve or return");

  const stored = leaveStore().find((entry) => entry.id === id);
  if (!stored) return problem(404, "That request wasn't found");

  const verdict = mayDecide(key, stored);
  if (!verdict.allow) {
    return verdict.status === 404
      ? problem(404, "That request wasn't found")
      : problem(403, "You can't decide this request", undefined, verdict.reasonCode);
  }
  if (stored.status !== "pending") return problem(409, "Someone already decided this request", "Reload to see the decision. Nothing was changed.");

  stored.status = parsed.data.decision === "approve" ? "approved" : "returned";
  stored.decidedAt = new Date().toISOString();
  if (parsed.data.comment) stored.decisionComment = parsed.data.comment;
  return NextResponse.json(toLeaveRequest(stored, key));
}
