import type { ReactNode } from "react";
import { formatDateTime } from "@/lib/dates";
import { describeReason, type ReasonCode } from "@/lib/problem";
import { Alert } from "./Alert";
import { StatusBadge, type DomainStatus } from "./StatusBadge";

export interface SodResult {
  outcome: "passed" | "blocked" | "rerouted";
  rule?: ReasonCode;
  /** For a reroute: who it went to and why, in words. */
  reroutedTo?: string;
}

export interface ApprovalBlockProps {
  title: string;
  summary: string;
  requester: string;
  approver?: string;
  status: DomainStatus;
  requestedAt: string;
  decidedAt?: string;
  comment?: string;
  sod?: SodResult;
  /** Approve and return buttons. Rendered even when blocked, so the control is never hidden. */
  actions?: ReactNode;
}

export function ApprovalBlock({ title, summary, requester, approver, status, requestedAt, decidedAt, comment, sod, actions }: ApprovalBlockProps) {
  const blocked = sod?.outcome === "blocked" && sod.rule;
  const rerouted = sod?.outcome === "rerouted";
  return (
    <section aria-label={title} className="grid rounded-dialog border border-line bg-surface md:grid-cols-[minmax(0,1fr)_280px]">
      <div className="p-5">
        <h3 className="font-semibold">{title}</h3>
        <p className="mb-3 text-muted">{summary}</p>
        <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-y-1">
          <dt className="text-muted">Requested by</dt>
          <dd>{requester}</dd>
          <dt className="text-muted">Approver</dt>
          <dd>{approver ?? "Not assigned yet"}</dd>
          <dt className="text-muted">Requested</dt>
          <dd>{formatDateTime(requestedAt)}</dd>
          {decidedAt ? (
            <>
              <dt className="text-muted">Decided</dt>
              <dd>{formatDateTime(decidedAt)}</dd>
            </>
          ) : null}
          {comment ? (
            <>
              <dt className="text-muted">Comment</dt>
              <dd>{comment}</dd>
            </>
          ) : null}
        </dl>
        {blocked && sod?.rule ? (
          <div className="mt-4">
            <Alert tone="danger" title={describeReason(sod.rule).title}>
              {describeReason(sod.rule).body}
            </Alert>
          </div>
        ) : null}
        {rerouted ? (
          <div className="mt-4">
            <Alert tone="info" title={`Sent to ${sod?.reroutedTo ?? "the next approver"}`}>
              {sod?.rule ? describeReason(sod.rule).body : "The usual approver can't decide this request."}
            </Alert>
          </div>
        ) : null}
      </div>
      <div className="border-t border-line p-5 md:border-l md:border-t-0">
        <h4 className="mb-1 font-semibold">Decision</h4>
        <p className="mb-3">
          <StatusBadge status={status} />
        </p>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}
