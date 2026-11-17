"use client";

import { useState } from "react";
import { Alert, EmptyState, ErrorState, Forbidden, Skeleton, Tabs, Toast } from "@/design-system";
import { asProblem } from "@/lib/api";
import { describeReason, type Problem } from "@/lib/problem";
import type { LeaveRequestDto } from "@/features/leave/api/leave";
import { decideApproval } from "../api/approvals";
import { useApprovals } from "../hooks/useApprovals";
import { RequestApprovalBlock } from "./RequestApprovalBlock";

export function ApprovalsInbox() {
  const { data, error, loading, reload } = useApprovals();
  const [notice, setNotice] = useState<string | null>(null);
  const [failure, setFailure] = useState<Problem | null>(null);

  async function decide(request: LeaveRequestDto, decision: "approve" | "return", comment?: string) {
    setFailure(null);
    try {
      const updated = await decideApproval(request.id, { decision, comment });
      setNotice(decision === "approve" ? `Leave approved. ${updated.requesterName.split(" ")[0]} has been told.` : `Request returned to ${updated.requesterName.split(" ")[0]}.`);
      reload();
    } catch (cause) {
      setFailure(asProblem(cause));
      reload();
    }
  }

  if (loading && !data) return <Skeleton rows={4} label="Loading approvals" className="max-w-3xl" />;
  if (error?.status === 403 && error.reasonCode) return <Forbidden reasonCode={error.reasonCode} correlationId={error.correlationId} />;
  if (error) return <ErrorState problem={error} onRetry={reload} />;

  const waiting = (data ?? []).filter((request) => request.status === "pending");
  const decided = (data ?? []).filter((request) => request.status !== "pending");
  const list = (items: LeaveRequestDto[], empty: { title: string; description: string }) =>
    items.length === 0 ? (
      <EmptyState {...empty} />
    ) : (
      <div className="flex flex-col gap-4">
        {items.map((request) => (
          <RequestApprovalBlock key={request.id} request={request} onApprove={(item) => decide(item, "approve")} onReturn={(item, comment) => decide(item, "return", comment)} />
        ))}
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {failure ? (
        failure.status === 409 ? (
          <Alert tone="warning" title={failure.title}>
            {failure.detail} The list below is up to date.
          </Alert>
        ) : (
          <Alert tone="danger" title={failure.reasonCode ? describeReason(failure.reasonCode).title : failure.title}>
            {failure.reasonCode ? describeReason(failure.reasonCode).body : failure.detail}
          </Alert>
        )
      ) : null}
      <Tabs
        label="Approval lists"
        items={[
          { value: "waiting", label: `Waiting (${waiting.length})`, content: list(waiting, { title: "Nothing is waiting for you", description: "New requests from your team show up here. You'll see them as soon as they're filed." }) },
          { value: "decided", label: `Decided (${decided.length})`, content: list(decided, { title: "No decisions yet", description: "Requests you approve or return move here." }) },
        ]}
      />
      {notice ? <Toast message={notice} onClose={() => setNotice(null)} /> : null}
    </div>
  );
}
