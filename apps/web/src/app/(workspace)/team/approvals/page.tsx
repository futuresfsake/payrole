"use client";

import { PageHeader } from "@/design-system";
import { WorkspaceGate } from "@/features/access/components/WorkspaceGate";
import { ApprovalsInbox } from "@/features/approvals/components/ApprovalsInbox";

export default function ApprovalsPage() {
  return (
    <WorkspaceGate workspaceId="team">
      <PageHeader crumbs={[{ label: "Team" }, { label: "Approvals" }]} title="Approvals" description="Requests from the people you decide for. Your own requests never appear here." />
      <ApprovalsInbox />
    </WorkspaceGate>
  );
}
