import Link from "next/link";
import { cn } from "@/lib/cn";
import type { PageLink } from "../utils/navigation";

export interface BottomNavProps {
  pages: readonly PageLink[];
  currentId: string;
}

/** Phone navigation for Me and Team: large targets, icon and word, neutral fill for the current page. */
export function BottomNav({ pages, currentId }: BottomNavProps) {
  return (
    <nav aria-label="Pages" className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface md:hidden">
      {pages.map(({ id, label, href, icon: Icon }) => {
        const current = id === currentId;
        return (
          <Link
            key={id}
            href={href}
            aria-current={current ? "page" : undefined}
            className={cn("relative flex min-h-[var(--tap)] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs", current && "bg-soft before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-accent")}
          >
            <Icon className={cn("h-5 w-5", current ? "text-accent" : "text-muted")} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
