import type { ReasonCode } from "@/lib/problem";
import { PEOPLE, findPerson } from "./people";

export interface Routing {
  reroutedTo: string;
  reasonCode: "SOD_2";
}

export interface RouteResult {
  approverKey: string;
  routing?: Routing;
}

/**
 * Who decides a request. The usual approver is the manager on the reporting line today.
 * If there is no manager, or the manager would be the requester, SoD-2 sends it to an HR admin who is not the requester.
 */
export function routeApprover(requesterKey: string): RouteResult {
  const requester = findPerson(requesterKey);
  const manager = requester?.managerKey ? findPerson(requester.managerKey) : undefined;
  if (manager && manager.key !== requesterKey && manager.active) return { approverKey: manager.key };
  const hr = PEOPLE.find((person) => person.roles.includes("hr_admin") && person.key !== requesterKey && person.active);
  if (!hr) throw new Error("No HR admin available to route the request");
  return { approverKey: hr.key, routing: { reroutedTo: hr.name, reasonCode: "SOD_2" } };
}

export type Decision = { allow: true } | { allow: false; status: 403 | 404; reasonCode: ReasonCode };

/**
 * Decide-permission check for one request.
 * - The requester never decides their own request (SoD-2).
 * - Anyone other than the assigned approver gets a 404, so ids outside their scope stay invisible.
 */
export function mayDecide(actorKey: string, request: { requesterKey: string; approverKey: string }): Decision {
  if (request.requesterKey === actorKey) return { allow: false, status: 403, reasonCode: "SOD_2" };
  if (request.approverKey !== actorKey) return { allow: false, status: 404, reasonCode: "NO_PERMISSION_IN_SCOPE" };
  return { allow: true };
}

/** leave:approve is held by managers (team scope) and HR admins (tenant scope). Both are checked from facts, not names in the UI. */
export function holdsLeaveApprove(personKey: string): boolean {
  const person = findPerson(personKey);
  if (!person) return false;
  const hasReports = PEOPLE.some((other) => other.managerKey === personKey && other.active);
  return hasReports || person.roles.includes("hr_admin");
}
