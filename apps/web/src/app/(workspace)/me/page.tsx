"use client";

import Link from "next/link";
import { Button, PageHeader } from "@/design-system";
import { WorkspaceGate } from "@/features/access/components/WorkspaceGate";
import { useAccess } from "@/features/access/hooks/useAccess";
import { LeaveBalanceTable } from "@/features/leave/components/LeaveBalanceTable";
import { LeaveRequestTable } from "@/features/leave/components/LeaveRequestTable";
import { useMyLeaveRequests } from "@/features/leave/hooks/useLeave";

function Home() {
  const { access } = useAccess();
  const requests = useMyLeaveRequests();
  const first = access.person.name.split(" ")[0];
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Me" }, { label: "Home" }]}
        title={`Good day, ${first}`}
        description="Your leave and your requests."
        action={
          <Link href="/me/leave">
            <Button variant="primary">File a leave request</Button>
          </Link>
        }
      />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section aria-labelledby="my-requests">
          <h2 id="my-requests" className="mb-3 text-base font-semibold">
            My requests
          </h2>
          <LeaveRequestTable requests={requests.data ?? []} loading={requests.loading} error={requests.error} onRetry={requests.reload} />
        </section>
        <section aria-labelledby="my-balance">
          <h2 id="my-balance" className="mb-3 text-base font-semibold">
            Leave balance
          </h2>
          <LeaveBalanceTable />
        </section>
      </div>
    </>
  );
}

export default function MePage() {
  return (
    <WorkspaceGate workspaceId="me">
      <Home />
    </WorkspaceGate>
  );
}
