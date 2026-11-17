import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  /** Why it is empty, in plain words. */
  description: string;
  /** The next step, usually a Button. */
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="max-w-xl rounded-dialog border border-line bg-surface p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mb-4 mt-1 text-muted">{description}</p>
      {action}
    </div>
  );
}
