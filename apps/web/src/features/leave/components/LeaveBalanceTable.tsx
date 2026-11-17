"use client";

import { DataTable, type Column } from "@/design-system";
import type { LeaveBalanceDto } from "../api/leave";
import { useLeaveBalances } from "../hooks/useLeave";

const COLUMNS: Column<LeaveBalanceDto>[] = [
  { id: "type", header: "Kind of leave", cell: (row) => row.typeName },
  { id: "left", header: "Days left", cell: (row) => row.daysLeft.toFixed(1), align: "right", mono: true },
  { id: "used", header: "Days used", cell: (row) => row.daysUsed.toFixed(1), align: "right", mono: true },
];

export function LeaveBalanceTable() {
  const { data, error, loading, reload } = useLeaveBalances();
  return (
    <div>
      <DataTable
        caption="Leave balance for 2026"
        columns={COLUMNS}
        data={data ?? []}
        getRowId={(row) => row.typeCode}
        loading={loading}
        error={error}
        onRetry={reload}
        empty={{ title: "No leave balance yet", description: "Your leave types appear after HR sets up your leave policy." }}
      />
      <p className="mt-2 text-muted">Days in 2026. Requests waiting for approval are not taken off until they are approved.</p>
    </div>
  );
}
