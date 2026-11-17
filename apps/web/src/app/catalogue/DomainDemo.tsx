"use client";

import { useState } from "react";
import { ApprovalBlock, AuditEntry, Button, ExceptionCountdown, FileDownload, MaskedValue, ScopeChip, StepUpDialog, Timeline } from "@/design-system";
import { CatalogueSection, Demo } from "./CatalogueSection";
import { PURPOSES } from "./fixtures";

const NOW = new Date("2026-11-17T08:00:00+08:00");

export function DomainDemo() {
  const [stepUp, setStepUp] = useState(false);
  return (
    <CatalogueSection id="domain" title="Payroll and access components" description="Blocked actions stay visible and say why. Sensitive values are masked until a permitted, audited reveal.">
      <Demo title="ApprovalBlock: pending, blocked by SoD-1, rerouted by SoD-2">
        <div className="flex flex-col gap-4">
          <ApprovalBlock
            title="Leave request from Ena Villanueva"
            summary="Vacation leave, 22 to 24 Dec 2026 (3 days). Balance after approval: 3.5 days."
            requester="Villanueva, Ena"
            approver="Lee, Sofia"
            status="pending"
            requestedAt="2026-11-14T10:20:00+08:00"
            sod={{ outcome: "passed" }}
            actions={
              <>
                <Button variant="primary">Approve leave</Button>
                <Button>Return to Ena</Button>
              </>
            }
          />
          <ApprovalBlock
            title="Run PG-01 · 1–15 Nov 2026"
            summary="Semi-monthly pay group, 6 employees, net ₱46,975.35."
            requester="Santos, Paolo (preparer)"
            approver="Lim, Faye"
            status="sod_blocked"
            requestedAt="2026-11-16T15:05:00+08:00"
            sod={{ outcome: "blocked", rule: "SOD_1" }}
            actions={
              <>
                <Button variant="primary" disabled>
                  Approve run
                </Button>
                <Button disabled>Return to preparer</Button>
              </>
            }
          />
          <ApprovalBlock
            title="Leave request from Hana Reyes"
            summary="Vacation leave, 28 to 30 Dec 2026 (3 days)."
            requester="Reyes, Hana"
            approver="Casa, Rico"
            status="pending"
            requestedAt="2026-11-16T09:00:00+08:00"
            sod={{ outcome: "rerouted", rule: "SOD_2", reroutedTo: "Rico Casa, her manager" }}
          />
        </div>
      </Demo>
      <Demo title="Timeline: payroll run">
        <Timeline
          label="Payroll run steps"
          steps={[
            { label: "Prepare", state: "done", note: "Paolo Santos, 16 Nov" },
            { label: "Submit", state: "done", note: "16 Nov" },
            { label: "Approve", state: "blocked", note: "approver prepared this run" },
            { label: "Lock", state: "upcoming" },
          ]}
        />
      </Demo>
      <Demo title="MaskedValue: permitted (opens step-up with purpose) and denied">
        <div className="flex flex-col gap-3">
          <MaskedValue
            label="SSS number"
            masked="DEV-SSS-····-4821"
            dataClass="S3"
            permitted
            purposes={PURPOSES}
            reveal={async (input) => (input.code === "000000" ? { ok: false, message: "That code didn't match. Try the newest one." } : { ok: true, value: "DEV-SSS-0012-4821" })}
          />
          <MaskedValue label="TIN" masked="DEV-TIN-····-1190" dataClass="S3" permitted={false} deniedReason="NO_PERMISSION_IN_SCOPE" reveal={async () => ({ ok: false, message: "Not allowed." })} />
        </div>
      </Demo>
      <Demo title="StepUpDialog">
        <Button onClick={() => setStepUp(true)}>Approve payroll run</Button>
        <StepUpDialog open={stepUp} onOpenChange={setStepUp} title="Approve run PG-01" onConfirm={async () => ({ ok: true })} />
      </Demo>
      <Demo title="ScopeChip">
        <div className="flex flex-wrap gap-3">
          <ScopeChip scope={{ type: "self", label: "Your own records" }} />
          <ScopeChip scope={{ type: "team", label: "Team: 6 reports" }} />
          <ScopeChip scope={{ type: "org_unit", label: "Warehouse and Logistics" }} />
          <ScopeChip scope={{ type: "pay_group", label: "Semi-monthly (operations)" }} />
          <ScopeChip scope={{ type: "tenant", label: "All employees" }} />
        </div>
      </Demo>
      <Demo title="ExceptionCountdown: SoD exception and auditor time-box">
        <div className="flex flex-col gap-2">
          <ExceptionCountdown subject="Exception SoD-5" endsAt="2026-12-04" now={NOW} />
          <ExceptionCountdown subject="Auditor access" endsAt="2027-01-15" now={NOW} />
          <ExceptionCountdown subject="Exception SoD-6" endsAt="2026-11-21" now={NOW} />
          <ExceptionCountdown subject="Access" endsAt="2026-11-01" now={NOW} />
        </div>
      </Demo>
      <Demo title="AuditEntry">
        <ul className="max-w-4xl rounded-dialog border border-line bg-surface">
          <AuditEntry actor="Hana Reyes" action="revealed" resource="employee_identifier:SSS" at="2026-11-16T14:02:00+08:00" outcome="allowed" dataClass="S3" purpose="Payroll check" correlationId="req-1a2b3c4d" />
          <AuditEntry actor="Faye Lim" action="tried to approve" resource="payroll_run:PG-01" at="2026-11-16T15:30:00+08:00" outcome="denied" reasonCode="SOD_1" correlationId="req-5e6f7a8b" />
        </ul>
      </Demo>
      <Demo title="FileDownload (PayRole makes the file; you upload it)">
        <FileDownload fileName="SSS-R3-2026-10.csv" portalName="the SSS employer portal" generatedAt="2026-11-10T09:15:00+08:00" onDownload={() => undefined} />
      </Demo>
    </CatalogueSection>
  );
}
