import { NextResponse } from "next/server";
import { computeAccess } from "@/server/mock/access";
import { problem, sessionPersonKey, unauthenticated } from "@/server/mock/http";

/** Entry check. A workspace the person's access doesn't include is refused with the reason code, never hidden behind a bare 403. */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const key = await sessionPersonKey();
  const access = key ? computeAccess(key) : null;
  if (!access) return unauthenticated();
  const workspace = access.workspaces.find((entry) => entry.id === id);
  if (!workspace) return problem(403, "No permission in this scope", `Your access doesn't include the ${id} workspace.`, "NO_PERMISSION_IN_SCOPE");
  return NextResponse.json(workspace);
}
