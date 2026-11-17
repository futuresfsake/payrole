import { CalendarDays, CheckSquare, Home, LayoutGrid, type LucideIcon } from "lucide-react";
import type { WorkspaceDto } from "../api/access";

export interface PageLink {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Pages that exist in this slice. Every other workspace shows a single overview page. */
const PAGES: Partial<Record<WorkspaceDto["id"], PageLink[]>> = {
  me: [
    { id: "home", label: "Home", href: "/me", icon: Home },
    { id: "leave", label: "Leave", href: "/me/leave", icon: CalendarDays },
  ],
  team: [{ id: "approvals", label: "Approvals", href: "/team/approvals", icon: CheckSquare }],
};

export function pagesFor(workspace: WorkspaceDto): PageLink[] {
  return PAGES[workspace.id] ?? [{ id: "overview", label: "Overview", href: `/${workspace.id}`, icon: LayoutGrid }];
}

/** The workspace is the first path segment: /me/leave belongs to "me". */
export function workspaceIdFromPath(pathname: string): string {
  return pathname.split("/")[1] ?? "";
}

export function currentPageId(pathname: string, pages: readonly PageLink[]): string {
  const exact = pages.find((page) => page.href === pathname);
  if (exact) return exact.id;
  const nested = [...pages].sort((a, b) => b.href.length - a.href.length).find((page) => pathname.startsWith(`${page.href}/`));
  return nested?.id ?? pages[0]?.id ?? "";
}
