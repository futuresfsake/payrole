import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SidebarNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface SidebarNavProps {
  scopeText?: string;
  items: readonly SidebarNavItem[];
  currentId: string;
}

/** Full-width rows with an icon. Selected: neutral fill, same weight, thin accent bar and accent icon. */
export function SidebarNav({ scopeText, items, currentId }: SidebarNavProps) {
  return (
    <nav aria-label="Pages" className="w-full">
      {scopeText ? <p className="px-3 pb-3 text-muted">{scopeText}</p> : null}
      <ul className="flex flex-col gap-1">
        {items.map(({ id, label, href, icon: Icon }) => {
          const current = id === currentId;
          return (
            <li key={id}>
              <a
                href={href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-control px-3 py-1.5 transition-colors duration-150 hover:bg-soft",
                  current && "bg-soft before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-sm before:bg-accent",
                )}
              >
                <Icon className={cn("h-4 w-4 flex-none", current ? "text-accent" : "text-muted")} aria-hidden="true" />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
