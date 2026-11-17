import { cn } from "@/lib/cn";

export interface WorkspaceStripItem {
  id: string;
  label: string;
  href: string;
}

export interface WorkspaceStripProps {
  items: readonly WorkspaceStripItem[];
  currentId: string;
}

/**
 * Top-bar workspace switcher. It only filters navigation: the chosen workspace is never sent to the API as an input.
 * Selected item: neutral fill, same weight, thin accent bar.
 */
export function WorkspaceStrip({ items, currentId }: WorkspaceStripProps) {
  return (
    <nav aria-label="Workspaces" className="flex h-full items-stretch">
      {items.map((item) => {
        const current = item.id === currentId;
        return (
          <a
            key={item.id}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={cn(
              "relative flex items-center px-4 transition-colors duration-150 hover:bg-soft",
              current && "bg-soft after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
