"use client";

import { LogOut, Menu } from "lucide-react";
import { IconButton, WorkspaceStrip } from "@/design-system";
import type { WorkspaceDto } from "../api/access";

export interface TopBarProps {
  personName: string;
  workspaces: readonly WorkspaceDto[];
  currentWorkspaceId: string;
  onOpenMenu: () => void;
  onSignOut: () => void;
}

export function TopBar({ personName, workspaces, currentWorkspaceId, onOpenMenu, onSignOut }: TopBarProps) {
  return (
    <header className="flex h-12 items-center gap-3 border-b border-line bg-surface px-3 md:gap-6 md:px-6">
      <IconButton label="Open navigation" onClick={onOpenMenu} className="md:hidden">
        <Menu className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      <span className="font-semibold">PayRole</span>
      <span className="hidden text-muted lg:inline">Casa Verde Trading Corp.</span>
      {workspaces.length > 1 ? (
        <div className="hidden h-full md:block">
          <WorkspaceStrip items={workspaces.map(({ id, label, href }) => ({ id, label, href }))} currentId={currentWorkspaceId} />
        </div>
      ) : null}
      <span className="flex-1" />
      <span className="hidden text-muted sm:inline">{personName}</span>
      <IconButton label="Sign out" onClick={onSignOut}>
        <LogOut className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    </header>
  );
}
