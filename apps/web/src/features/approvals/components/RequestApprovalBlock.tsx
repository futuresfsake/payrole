"use client";

import { useState } from "react";
import { ApprovalBlock, Button } from "@/design-system";
import { formatDate } from "@/lib/dates";
import type { LeaveRequestDto } from "@/features/leave/api/leave";
import { dayRange, daysLabel, toDomainStatus } from "@/features/leave/utils/requestStatus";
import { ReturnDialog } from "./ReturnDialog";

export interface RequestApprovalBlockProps {
  request: LeaveRequestDto;
  onApprove: (request: LeaveRequestDto) => Promise<void>;
  onReturn: (request: LeaveRequestDto, comment: string) => Promise<void>;
}

export function RequestApprovalBlock({ request, onApprove, onReturn }: RequestApprovalBlockProps) {
  const [returning, setReturning] = useState(false);
  const [busy, setBusy] = useState(false);

  async function approve() {
    setBusy(true);
    try {
      await onApprove(request);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <ApprovalBlock
        title={`${request.typeName} from ${request.requesterName}`}
        summary={`${dayRange(request, formatDate)} (${daysLabel(request.days)})${request.note ? `. Note: ${request.note}` : ""}`}
        requester={request.requesterName}
        approver={request.approverName}
        status={toDomainStatus(request.status)}
        requestedAt={request.filedAt}
        decidedAt={request.decidedAt}
        comment={request.decisionComment}
        sod={
          request.routing
            ? { outcome: "rerouted", rule: "SOD_2", reroutedTo: "you", explanation: `${request.requesterName} has no manager above them and can't approve their own request (rule SoD-2), so it came to you.` }
            : { outcome: "passed" }
        }
        actions={
          request.canDecide ? (
            <>
              <Button variant="primary" loading={busy} onClick={approve}>
                Approve leave
              </Button>
              <Button onClick={() => setReturning(true)}>Return to {request.requesterName.split(" ")[0]}</Button>
            </>
          ) : undefined
        }
      />
      <ReturnDialog
        open={returning}
        requesterName={request.requesterName}
        onOpenChange={setReturning}
        onConfirm={async (comment) => {
          await onReturn(request, comment);
          setReturning(false);
        }}
      />
    </>
  );
}
