"use client";

import { useState } from "react";
import { Alert, Button, Dialog, Drawer, EmptyState, ErrorState, Forbidden, OfflineBanner, Skeleton, StatusBadge, Toast } from "@/design-system";
import { CatalogueSection, Demo } from "./CatalogueSection";

export function FeedbackDemo() {
  const [dialog, setDialog] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [toast, setToast] = useState(false);
  return (
    <CatalogueSection id="feedback" title="Status, messages and states" description="Every data view has loading, empty, error, forbidden and success states. Status is a word with a small dot, never colour alone.">
      <Demo title="StatusBadge">
        <div className="flex flex-wrap gap-6">
          <StatusBadge status="approved" />
          <StatusBadge status="pending" />
          <StatusBadge status="returned" />
          <StatusBadge status="overdue" />
          <StatusBadge status="sod_blocked" />
          <StatusBadge status="active" />
          <StatusBadge status="ended" />
          <StatusBadge tone="info" label="Contract ends 31 Dec" />
        </div>
      </Demo>
      <Demo title="Alert">
        <div className="flex max-w-2xl flex-col gap-3">
          <Alert tone="warning" title="1 employee has no time record">
            Fix the time record or leave them out of this run.
          </Alert>
          <Alert tone="info" title="Sent to Rico Casa">
            You can't approve your own request, so it went to your manager.
          </Alert>
          <Alert tone="danger" title="Run not submitted">
            Fix the problems above, then try again.
          </Alert>
        </div>
      </Demo>
      <Demo title="Loading (Skeleton)">
        <Skeleton rows={4} label="Loading people" className="max-w-2xl" />
      </Demo>
      <Demo title="Empty">
        <EmptyState title="No one matches those filters" description="Clear the department or status filter, or check the spelling of the name." action={<Button>Clear filters</Button>} />
      </Demo>
      <Demo title="Error (problem+json)">
        <ErrorState
          problem={{ type: "about:blank", title: "People couldn't be loaded", status: 503, detail: "The server took too long to answer.", correlationId: "req-7f3a91c2" }}
          onRetry={() => undefined}
        />
      </Demo>
      <Demo title="Forbidden (reason code in words)">
        <Forbidden reasonCode="SOD_1" correlationId="req-2b84d0e1" />
      </Demo>
      <Demo title="Conflict (stale data)">
        <Alert tone="warning" title="Someone else changed this record">
          Reload to see their changes, then make your change again. Your edits were not saved.
        </Alert>
      </Demo>
      <Demo title="Offline (Me workspace)">
        <div className="max-w-2xl overflow-hidden rounded-dialog border border-line">
          <OfflineBanner forceOffline />
        </div>
      </Demo>
      <Demo title="Dialog, Drawer, Toast (overlays carry the only shadows)">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setDialog(true)}>Open dialog</Button>
          <Button onClick={() => setDrawer(true)}>Open drawer</Button>
          <Button onClick={() => setToast(true)}>Show success message</Button>
        </div>
        <Dialog
          open={dialog}
          onOpenChange={setDialog}
          title="Return this run to the preparer?"
          description="The preparer will see your comment and can fix and resubmit."
          footer={
            <>
              <Button onClick={() => setDialog(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setDialog(false)}>
                Return run
              </Button>
            </>
          }
        >
          <p>Run PG-01, 1–15 Nov 2026.</p>
        </Dialog>
        <Drawer open={drawer} onOpenChange={setDrawer} title="Leave request">
          <p>Details of the request open here without leaving the list.</p>
        </Drawer>
        {toast ? <Toast message="Leave approved. Ena has been told." onClose={() => setToast(false)} /> : null}
      </Demo>
    </CatalogueSection>
  );
}
