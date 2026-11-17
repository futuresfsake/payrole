import { cn } from "@/lib/cn";

export interface SkeletonProps {
  rows?: number;
  /** Accessible description of what is loading. */
  label: string;
  className?: string;
}

/** Ruled placeholder rows. No shimmer: motion is for state feedback only. */
export function Skeleton({ rows = 5, label, className }: SkeletonProps) {
  return (
    <div role="status" aria-label={label} className={cn("rounded-dialog border border-line bg-surface", className)}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-10 border-b border-line last:border-b-0" />
      ))}
    </div>
  );
}
