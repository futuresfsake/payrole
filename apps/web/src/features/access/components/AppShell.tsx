"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Drawer, ScopeChip, SidebarNav, WorkspaceStrip } from "@/design-system";
import { signOut } from "@/features/auth/api/auth";
import { useAccess } from "../hooks/useAccess";
import { currentPageId, pagesFor, workspaceIdFromPath } from "../utils/navigation";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";

/**
 * Top bar, sidebar and page area. Navigation is filtered by the effective-access object from the API.
 * Which workspace is current comes from the URL and is never sent back to the server as an input.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { access } = useAccess();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentId = workspaceIdFromPath(pathname);
  const workspace = access.workspaces.find((entry) => entry.id === currentId);
  const pages = workspace ? pagesFor(workspace) : [];
  const pageId = currentPageId(pathname, pages);
  const items = pages.map(({ id, label, href, icon }) => ({ id, label, href, icon }));
  const phoneTabs = workspace && (workspace.id === "me" || workspace.id === "team") ? pages : [];

  async function handleSignOut() {
    await signOut();
    router.replace("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar personName={access.person.name} workspaces={access.workspaces} currentWorkspaceId={currentId} onOpenMenu={() => setMenuOpen(true)} onSignOut={handleSignOut} />
      <div className="flex flex-1 md:grid md:grid-cols-[var(--sidebar-w)_minmax(0,1fr)]">
        <aside className="hidden border-r border-line bg-surface p-4 md:block">
          {workspace ? <SidebarNav scopeText={workspace.scope.label} items={items} currentId={pageId} /> : null}
        </aside>
        <main className={`min-w-0 flex-1 p-4 md:p-6 ${phoneTabs.length ? "pb-20 md:pb-6" : ""}`}>
          <div className="mx-auto max-w-[var(--content-max)]">
            {workspace ? (
              <div className="mb-4">
                <ScopeChip scope={workspace.scope} />
              </div>
            ) : null}
            {children}
          </div>
        </main>
      </div>
      {phoneTabs.length ? <BottomNav pages={phoneTabs} currentId={pageId} /> : null}
      <Drawer open={menuOpen} onOpenChange={setMenuOpen} title="Navigation">
        <div className="flex flex-col gap-4">
          <WorkspaceStrip items={access.workspaces.map(({ id, label, href }) => ({ id, label, href }))} currentId={currentId} />
          {workspace ? <SidebarNav scopeText={workspace.scope.label} items={items} currentId={pageId} /> : null}
        </div>
      </Drawer>
    </div>
  );
}
