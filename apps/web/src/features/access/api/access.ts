import { apiFetch, type ApiSchemas } from "@/lib/api";

export type EffectiveAccessDto = ApiSchemas["EffectiveAccess"];
export type WorkspaceDto = ApiSchemas["WorkspaceAccess"];

export function getEffectiveAccess(): Promise<EffectiveAccessDto> {
  return apiFetch<EffectiveAccessDto>("/api/me/access");
}

/** Entry check. Rejects with an ApiError carrying the reason code when the workspace isn't allowed. */
export function checkWorkspace(id: string): Promise<WorkspaceDto> {
  return apiFetch<WorkspaceDto>(`/api/workspaces/${encodeURIComponent(id)}`);
}
