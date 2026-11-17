import { Download } from "lucide-react";
import { formatDateTime } from "@/lib/dates";
import { Button } from "./Button";

export interface FileDownloadProps {
  fileName: string;
  /** Where the customer uploads it, for example "the SSS employer portal". */
  portalName: string;
  generatedAt: string;
  onDownload: () => void;
}

/** PayRole only generates files (ADR-003). The wording never implies that PayRole submits anything. */
export function FileDownload({ fileName, portalName, generatedAt, onDownload }: FileDownloadProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-dialog border border-line bg-surface px-5 py-4">
      <div>
        <p className="font-mono text-[13px]">{fileName}</p>
        <p className="text-muted">Made {formatDateTime(generatedAt)}. Upload to {portalName} yourself. PayRole does not send it.</p>
      </div>
      <Button variant="primary" icon={<Download className="h-4 w-4" aria-hidden="true" />} onClick={onDownload}>
        Download file
      </Button>
    </div>
  );
}
