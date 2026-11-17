import type { Problem } from "@/lib/problem";
import { Alert } from "./Alert";
import { Button } from "./Button";

export interface ErrorStateProps {
  problem: Problem;
  onRetry?: () => void;
}

/** Shows what the API said (problem+json) and the correlation id support will ask for. */
export function ErrorState({ problem, onRetry }: ErrorStateProps) {
  return (
    <div className="flex max-w-xl flex-col gap-3">
      <Alert tone="danger" title={problem.title}>
        {problem.detail ? <p>{problem.detail}</p> : null}
        <p className="mt-1">
          Reference <span className="font-mono text-[13px]">{problem.correlationId}</span>
        </p>
      </Alert>
      {onRetry ? (
        <div>
          <Button onClick={onRetry}>Try again</Button>
        </div>
      ) : null}
    </div>
  );
}
