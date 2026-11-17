"use client";

import { use } from "react";
import { Button, EmptyState, PageHeader } from "@/design-system";
import { WorkspaceGate } from "@/features/access/components/WorkspaceGate";

/** Every workspace without built pages. A direct link to one the person lacks shows the API's reason, in words. */
export default function WorkspaceOverview({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = use(params);
  const label = workspace.charAt(0).toUpperCase() + workspace.slice(1);
  return (
    <WorkspaceGate workspaceId={workspace}>
      <PageHeader crumbs={[{ label }, { label: "Overview" }]} title={label} />
      <EmptyState title="Nothing to show here yet" description="This workspace isn't part of the first slice. Sign-in, Me, leave requests and manager approvals are built." action={<Button onClick={() => history.back()}>Go back</Button>} />
    </WorkspaceGate>
  );
}
