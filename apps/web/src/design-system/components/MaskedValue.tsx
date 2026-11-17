"use client";

import { useEffect, useState } from "react";
import { Eye, Lock } from "lucide-react";
import { describeReason, type ReasonCode } from "@/lib/problem";
import { Button } from "./Button";
import { StepUpDialog, type StepUpInput, type StepUpResult } from "./StepUpDialog";

export type DataClass = "S0" | "S1" | "S2" | "S3" | "S4";

export interface MaskedValueProps {
  label: string;
  /** Already masked by the server. The real value is never in the page until revealed. */
  masked: string;
  dataClass: DataClass;
  permitted: boolean;
  /** Why reveal is not allowed, shown in words when `permitted` is false. */
  deniedReason?: ReasonCode;
  purposes?: readonly string[];
  /** Server call. Reveal is audited there; this component only asks. */
  reveal: (input: StepUpInput) => Promise<StepUpResult & { value?: string }>;
  visibleSeconds?: number;
}

/** Masked by default. Reveal needs permission, a step-up check and (where required) a purpose, then re-masks. */
export function MaskedValue({ label, masked, dataClass, permitted, deniedReason, purposes, reveal, visibleSeconds = 30 }: MaskedValueProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (value === null) return;
    const timer = setTimeout(() => setValue(null), visibleSeconds * 1000);
    return () => clearTimeout(timer);
  }, [value, visibleSeconds]);

  async function confirm(input: StepUpInput): Promise<StepUpResult> {
    const result = await reveal(input);
    if (result.ok && result.value) setValue(result.value);
    return result.ok ? { ok: true } : result;
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="font-mono text-[13px]" aria-label={value === null ? `${label}, hidden` : label}>
        {value ?? masked}
      </span>
      <span className="text-xs text-muted">{dataClass} sensitive</span>
      {value !== null ? (
        <span className="text-muted">Shown for {visibleSeconds} seconds. Your reason is in the audit log.</span>
      ) : permitted ? (
        <>
          <Button size="sm" icon={<Eye className="h-4 w-4" aria-hidden="true" />} onClick={() => setOpen(true)}>
            Show full number
          </Button>
          <StepUpDialog open={open} onOpenChange={setOpen} title={`Show ${label}`} purposes={purposes} onConfirm={confirm} />
        </>
      ) : (
        <span className="inline-flex items-center gap-1 text-muted">
          <Lock className="h-4 w-4" aria-hidden="true" />
          {deniedReason ? describeReason(deniedReason).title : "Your roles can't show this"}
        </span>
      )}
    </span>
  );
}
