import { daysUntil, formatDate } from "@/lib/dates";
import { StatusBadge } from "./StatusBadge";

export interface ExceptionCountdownProps {
  endsAt: string;
  /** What is ending: "Exception", "Access". */
  subject: string;
  now?: Date;
}

/** Visible time-box for SoD exceptions (90 days at most) and auditor access. Warns in the last 7 days. */
export function ExceptionCountdown({ endsAt, subject, now }: ExceptionCountdownProps) {
  const days = daysUntil(endsAt, now);
  if (days < 0) return <StatusBadge tone="neutral" label={`${subject} ended ${formatDate(endsAt)}`} />;
  const label = `${subject} ends ${formatDate(endsAt)} (${days === 0 ? "today" : days === 1 ? "1 day left" : `${days} days left`})`;
  return <StatusBadge tone={days <= 7 ? "warning" : "info"} label={label} />;
}
