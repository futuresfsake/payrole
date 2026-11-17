"use client";

import { useState } from "react";
import { PageHeader, Toast } from "@/design-system";
import { WorkspaceGate } from "@/features/access/components/WorkspaceGate";
import { LeaveBalanceTable } from "@/features/leave/components/LeaveBalanceTable";
import { LeaveRequestForm } from "@/features/leave/components/LeaveRequestForm";
import { LeaveRequestTable } from "@/features/leave/components/LeaveRequestTable";
import { useMyLeaveRequests } from "@/features/leave/hooks/useLeave";

function Leave() {
  const requests = useMyLeaveRequests();
  const [toast, setToast] = useState<string | null>(null);
  return (
    <>
      <PageHeader crumbs={[{ label: "Me", href: "/me" }, { label: "Leave" }]} title="Leave" description="File a request and see who decides it." />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-labelledby="new-request">
          <h2 id="new-request" className="mb-3 text-base font-semibold">
            New request
          </h2>
          <LeaveRequestForm
            onFiled={(created) => {
              requests.reload();
              setToast(`Request sent to ${created.approverName}.`);
            }}
          />
        </section>
        <section aria-labelledby="leave-balance">
          <h2 id="leave-balance" className="mb-3 text-base font-semibold">
            Balance
          </h2>
          <LeaveBalanceTable />
        </section>
      </div>
      <section aria-labelledby="leave-history" className="mt-8">
        <h2 id="leave-history" className="mb-3 text-base font-semibold">
          My requests
        </h2>
        <LeaveRequestTable requests={requests.data ?? []} loading={requests.loading} error={requests.error} onRetry={requests.reload} />
      </section>
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </>
  );
}

export default function LeavePage() {
  return (
    <WorkspaceGate workspaceId="me">
      <Leave />
    </WorkspaceGate>
  );
}
