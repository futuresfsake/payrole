import { formatDateTime } from "@/lib/dates";
import { StatusBadge } from "./StatusBadge";
import type { DataClass } from "./MaskedValue";

export interface AuditEntryProps {
  actor: string;
  action: string;
  resource: string;
  at: string;
  outcome: "allowed" | "denied";
  dataClass?: DataClass;
  purpose?: string;
  reasonCode?: string;
  correlationId: string;
}

/** One line of the audit log. Sensitive values appear as field names, never as the values. */
export function AuditEntry({ actor, action, resource, at, outcome, dataClass, purpose, reasonCode, correlationId }: AuditEntryProps) {
  return (
    <li className="grid gap-1 border-b border-line px-4 py-3 last:border-b-0 md:grid-cols-[160px_minmax(0,1fr)_140px]">
      <time dateTime={at} className="text-muted">
        {formatDateTime(at)}
      </time>
      <div>
        <p>
          <span className="font-semibold">{actor}</span> {action} <span className="font-mono text-[13px]">{resource}</span>
        </p>
        <p className="text-xs text-muted">
          {dataClass ? `${dataClass} sensitive. ` : ""}
          {purpose ? `Reason: ${purpose}. ` : ""}
          {reasonCode ? (
            <>
              Reason code <span className="font-mono">{reasonCode}</span>.{" "}
            </>
          ) : null}
          Reference <span className="font-mono">{correlationId}</span>
        </p>
      </div>
      <div>{outcome === "allowed" ? <StatusBadge tone="success" label="Allowed" /> : <StatusBadge tone="danger" label="Denied" />}</div>
    </li>
  );
}
