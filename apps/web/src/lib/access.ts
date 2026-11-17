/**
 * The effective-access object returned by the API after sign-in (ADR-013).
 * The UI reads it. It never derives access from role names and never sends the chosen workspace back as an input.
 */
export type ScopeType = "self" | "team" | "org_unit" | "pay_group" | "tenant";

export interface AccessScope {
  type: ScopeType;
  /** Human text built by the server, for example "Team: 6 reports". */
  label: string;
}

export interface WorkspaceAccess {
  id: "me" | "team" | "hr" | "payroll" | "admin" | "privacy" | "audit" | "dashboards";
  label: string;
  href: string;
  scope: AccessScope;
  endsAt?: string;
}

export interface EffectiveAccess {
  accessVersion: number;
  workspaces: WorkspaceAccess[];
  permissions: ReadonlyArray<{ code: string; scope: ScopeType }>;
}

export function can(access: EffectiveAccess, permission: string): boolean {
  return access.permissions.some((entry) => entry.code === permission);
}

export function findWorkspace(access: EffectiveAccess, id: WorkspaceAccess["id"]): WorkspaceAccess | undefined {
  return access.workspaces.find((workspace) => workspace.id === id);
}
