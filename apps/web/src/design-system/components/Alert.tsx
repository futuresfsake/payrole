import type { ReactNode } from "react";
import { AlertTriangle, Info, Lock } from "lucide-react";
import { cn } from "@/lib/cn";

export type AlertTone = "warning" | "danger" | "info";

export interface AlertProps {
  tone: AlertTone;
  title: string;
  children?: ReactNode;
}

const BORDER: Record<AlertTone, string> = { warning: "border-l-warning", danger: "border-l-danger", info: "border-l-info" };
const ICON_COLOR: Record<AlertTone, string> = { warning: "text-warning", danger: "text-danger", info: "text-info" };

export function Alert({ tone, title, children }: AlertProps) {
  const Icon = tone === "danger" ? Lock : tone === "warning" ? AlertTriangle : Info;
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex gap-3 rounded-control border border-l-[3px] border-line bg-surface px-4 py-3", BORDER[tone])}>
      <Icon className={cn("mt-0.5 h-4 w-4 flex-none", ICON_COLOR[tone])} aria-hidden="true" />
      <div>
        <p className="font-semibold">{title}</p>
        {children ? <div className="text-muted">{children}</div> : null}
      </div>
    </div>
  );
}
