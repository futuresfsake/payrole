import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

export type DomainStatus = "approved" | "pending" | "returned" | "overdue" | "sod_blocked" | "active" | "ended";

const DOMAIN: Record<DomainStatus, { tone: Tone; label: string }> = {
  approved: { tone: "success", label: "Approved" },
  pending: { tone: "warning", label: "Pending" },
  returned: { tone: "info", label: "Returned" },
  overdue: { tone: "danger", label: "Overdue" },
  sod_blocked: { tone: "danger", label: "Blocked by separation of duties" },
  active: { tone: "success", label: "Active" },
  ended: { tone: "neutral", label: "Ended" },
};

const TEXT: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  neutral: "text-neutral",
};

export type StatusBadgeProps =
  | { status: DomainStatus; label?: string; tone?: never }
  | { tone: Tone; label: string; status?: never };

/** A word with a small dot in the status colour. No filled capsule, never colour alone. */
export function StatusBadge(props: StatusBadgeProps) {
  const resolved = props.status ? DOMAIN[props.status] : { tone: props.tone, label: props.label };
  const label = props.label ?? resolved.label;
  const locked = props.status === "sod_blocked";
  return (
    <span className={cn("inline-flex items-center gap-2 whitespace-nowrap", TEXT[resolved.tone])}>
      {locked ? (
        <Lock className="h-4 w-4 flex-none" aria-hidden="true" />
      ) : (
        <span className="h-2 w-2 flex-none rounded-full bg-current" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}
