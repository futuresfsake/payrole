"use client";

import { Alert, Button, DataTable, StatusBadge, type Column } from "@/design-system";
import type { Problem } from "@/lib/problem";
import { formatDate } from "@/lib/dates";
import type { LeaveRequestDto } from "../api/leave";
import { dayRange, toDomainStatus } from "../utils/requestStatus";

const COLUMNS: Column<LeaveRequestDto>[] = [
  { id: "dates", header: "Dates", cell: (row) => dayRange(row, formatDate) },
  { id: "type", header: "Kind", cell: (row) => row.typeName },
  { id: "days", header: "Days", cell: (row) => row.days.toFixed(1), align: "right", mono: true },
  { id: "approver", header: "Decided by", cell: (row) => row.approverName },
  { id: "status", header: "Status", cell: (row) => <StatusBadge status={toDomainStatus(row.status)} /> },
];

export interface LeaveRequestTableProps {
  requests: readonly LeaveRequestDto[];
  loading: boolean;
  error?: Problem;
  onRetry: () => void;
  onFileNew?: () => void;
}

export function LeaveRequestTable({ requests, loading, error, onRetry, onFileNew }: LeaveRequestTableProps) {
  const rerouted = requests.filter((request) => request.routing && request.status === "pending");
  return (
    <div className="flex flex-col gap-3">
      {rerouted.map((request) => (
        <Alert key={request.id} tone="info" title={`Your request for ${dayRange(request, formatDate)} went to ${request.routing?.reroutedTo}`}>
          You have no manager above you, and you can't approve your own request (rule SoD-2). {request.routing?.reroutedTo} decides it instead.
        </Alert>
      ))}
      <DataTable
        caption="My leave requests"
        columns={COLUMNS}
        data={requests}
        getRowId={(row) => row.id}
        loading={loading}
        error={error}
        onRetry={onRetry}
        empty={{
          title: "You haven't asked for leave yet",
          description: "Once you file a request it shows here, with who decides it and what they said.",
          action: onFileNew ? <Button onClick={onFileNew}>File a leave request</Button> : undefined,
        }}
      />
    </div>
  );
}
