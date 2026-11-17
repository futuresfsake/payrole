import { describeReason, type ReasonCode } from "@/lib/problem";
import { Alert } from "./Alert";

export interface ForbiddenProps {
  reasonCode: ReasonCode;
  correlationId?: string;
}

/** Rendered from the API's 403 response. Never a bare "Access denied": it says why, in words, with the code. */
export function Forbidden({ reasonCode, correlationId }: ForbiddenProps) {
  const reason = describeReason(reasonCode);
  return (
    <div className="max-w-xl">
      <h1 className="mb-4 text-2xl font-semibold">You can't do this</h1>
      <Alert tone="danger" title={reason.title}>
        <p>{reason.body}</p>
        <p className="mt-1">
          Reason code <span className="font-mono text-[13px]">{reasonCode}</span>
          {correlationId ? (
            <>
              , reference <span className="font-mono text-[13px]">{correlationId}</span>
            </>
          ) : null}
        </p>
      </Alert>
    </div>
  );
}
