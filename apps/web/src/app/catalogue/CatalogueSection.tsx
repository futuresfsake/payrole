import type { ReactNode } from "react";

export interface CatalogueSectionProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function CatalogueSection({ id, title, description, children }: CatalogueSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mb-10 scroll-mt-6">
      <h2 id={`${id}-title`} className="text-xl font-semibold leading-7">
        {title}
      </h2>
      <p className="mb-4 mt-1 max-w-[68ch] text-muted">{description}</p>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

export interface DemoProps {
  title: string;
  children: ReactNode;
}

export function Demo({ title, children }: DemoProps) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
