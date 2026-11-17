import type { ReactNode } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  crumbs: readonly Crumb[];
  title: string;
  description?: string;
  /** At most one primary button per view. */
  action?: ReactNode;
}

export function PageHeader({ crumbs, title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <nav aria-label="Breadcrumb" className="mb-2 text-muted">
          <ol className="flex flex-wrap gap-1">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex gap-1">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-ink">
                    {crumb.label}
                  </a>
                ) : (
                  <span aria-current={index === crumbs.length - 1 ? "page" : undefined}>{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="text-2xl font-semibold leading-8">{title}</h1>
        {description ? <p className="mt-1 max-w-[64ch] text-muted">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}
