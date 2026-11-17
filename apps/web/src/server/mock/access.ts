import type { components } from "@/lib/api-types";
import { PEOPLE, findPerson, teamOf } from "./people";
import { holdsLeaveApprove } from "./authorize";

type EffectiveAccess = components["schemas"]["EffectiveAccess"];
type WorkspaceAccess = components["schemas"]["WorkspaceAccess"];

export function computeAccess(personKey: string): EffectiveAccess | null {
  const person = findPerson(personKey);
  if (!person || !person.active) return null;
  const roles = new Set<string>(person.roles);
  const team = teamOf(personKey);
  const ends = person.accessEndsAt;

  const workspaces: WorkspaceAccess[] = [];
  if (person.isEmployee) workspaces.push({ id: "me", label: "Me", href: "/me", scope: { type: "self", label: "Your own records" } });
  if (team.length > 0) workspaces.push({ id: "team", label: "Team", href: "/team/approvals", scope: { type: "team", label: `Team: ${team.length} ${team.length === 1 ? "person" : "people"}` } });
  if (roles.has("hr_admin") || roles.has("timekeeper")) workspaces.push({ id: "hr", label: "HR", href: "/hr", scope: { type: "tenant", label: roles.has("hr_admin") ? "All employees" : "Time and schedules" } });
  if (roles.has("payroll_preparer") || roles.has("payroll_approver")) workspaces.push({ id: "payroll", label: "Payroll", href: "/payroll", scope: { type: "pay_group", label: "Semi-monthly and monthly pay groups" } });
  if (roles.has("executive")) workspaces.push({ id: "dashboards", label: "Dashboards", href: "/dashboards", scope: { type: "tenant", label: "Totals only, individual data masked" } });
  if (roles.has("dpo")) workspaces.push({ id: "privacy", label: "Privacy", href: "/privacy", scope: { type: "tenant", label: "Whole company" } });
  if (roles.has("tenant_admin")) workspaces.push({ id: "admin", label: "Admin", href: "/admin", scope: { type: "tenant", label: "Whole company, no HR or pay data" } });
  if (roles.has("auditor") || roles.has("dpo") || roles.has("tenant_admin")) workspaces.push({ id: "audit", label: "Audit", href: "/audit", scope: { type: "tenant", label: "Read only" }, ...(ends ? { endsAt: ends } : {}) });

  const permissions: EffectiveAccess["permissions"] = [];
  if (person.isEmployee) permissions.push({ code: "leave:request", scope: "self" }, { code: "payslip:read", scope: "self" });
  if (team.length > 0) permissions.push({ code: "leave:approve", scope: "team" });
  if (roles.has("hr_admin") && team.length === 0) permissions.push({ code: "leave:approve", scope: "tenant" });
  if (holdsLeaveApprove(personKey) && !permissions.some((entry) => entry.code === "leave:approve")) permissions.push({ code: "leave:approve", scope: "team" });

  return { person: { id: person.key, name: person.name }, accessVersion: 1, workspaces, permissions };
}

export function signInPeople(): Array<{ id: string; name: string; title: string }> {
  return PEOPLE.filter((person) => person.active).map(({ key, name, title }) => ({ id: key, name, title }));
}
