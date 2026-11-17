import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

/** Label, control, hint and error message. Labels are always visible; placeholders are never labels. */
export function Field({ id, label, hint, error, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function controlClass(invalid: boolean): string {
  return cn(
    "min-h-8 w-full rounded-control border bg-surface px-3 py-1 text-ink transition-colors duration-150",
    "placeholder:text-muted disabled:cursor-not-allowed disabled:bg-soft disabled:text-muted read-only:bg-soft",
    invalid ? "border-danger" : "border-control",
  );
}
