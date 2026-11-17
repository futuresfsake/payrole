"use client";

import type { ReactNode } from "react";
import { ErrorState, Forbidden, Skeleton } from "@/design-system";
import { useResource } from "@/lib/useResource";
import { checkWorkspace } from "../api/access";

export interface WorkspaceGateProps {
  workspaceId: string;
  children: ReactNode;
}

/**
 * Asks the API whether this workspace is allowed, and renders the API's own answer.
 * A forbidden direct link shows the reason code in words. The UI never decides.
 */
export function WorkspaceGate({ workspaceId, children }: WorkspaceGateProps) {
  const { error, loading, reload } = useResource(() => checkWorkspace(workspaceId));
  if (loading) return <Skeleton rows={4} label="Checking your access" className="max-w-3xl" />;
  if (error?.status === 403 && error.reasonCode) return <Forbidden reasonCode={error.reasonCode} correlationId={error.correlationId} />;
  if (error) return <ErrorState problem={error} onRetry={reload} />;
  return <>{children}</>;
}
