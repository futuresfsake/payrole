import { cn } from "@/lib/cn";

export type TimelineState = "done" | "current" | "upcoming" | "blocked";

export interface TimelineStep {
  label: string;
  state: TimelineState;
  /** Who did it and when, for finished steps. */
  note?: string;
}

const BAR: Record<TimelineState, string> = {
  done: "border-t-success",
  current: "border-t-accent",
  upcoming: "border-t-line",
  blocked: "border-t-danger",
};

export interface TimelineProps {
  steps: readonly TimelineStep[];
  label: string;
}

/** Horizontal steps, for example Prepare, Submit, Approve, Lock. State is also in text, not colour alone. */
export function Timeline({ steps, label }: TimelineProps) {
  const stateText: Record<TimelineState, string> = { done: "done", current: "in progress", upcoming: "not started", blocked: "blocked" };
  return (
    <ol aria-label={label} className="flex flex-wrap gap-2">
      {steps.map((step, index) => (
        <li key={step.label} aria-current={step.state === "current" ? "step" : undefined} className={cn("min-w-32 flex-1 border-t-2 pt-2", BAR[step.state])}>
          <span className={cn(step.state === "upcoming" ? "text-muted" : "text-ink")}>
            {index + 1}. {step.label}
          </span>
          <span className="block text-xs text-muted">
            {stateText[step.state]}
            {step.note ? `, ${step.note}` : ""}
          </span>
        </li>
      ))}
    </ol>
  );
}
