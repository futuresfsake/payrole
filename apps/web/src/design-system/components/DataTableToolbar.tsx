"use client";

import type { ReactNode } from "react";
import { Download, SlidersHorizontal } from "lucide-react";
import { Button } from "./Button";

export interface ToolbarColumn {
  id: string;
  header: string;
  visible: boolean;
  canHide: boolean;
  toggle: (visible: boolean) => void;
}

export interface DataTableToolbarProps {
  filters?: ReactNode;
  columns: readonly ToolbarColumn[];
  selectedCount: number;
  bulkActions?: ReactNode;
  /** Present only when the person may export. Export of sensitive columns still needs step-up and a purpose on the server. */
  onExport?: () => void;
}

export function DataTableToolbar({ filters, columns, selectedCount, bulkActions, onExport }: DataTableToolbarProps) {
  const hideable = columns.filter((column) => column.canHide);
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3">
      {selectedCount > 0 ? (
        <div className="flex items-center gap-3">
          <p className="font-semibold">{selectedCount} selected</p>
          {bulkActions}
        </div>
      ) : (
        filters
      )}
      <span className="flex-1" />
      {hideable.length > 0 ? (
        <details className="relative">
          <summary className="inline-flex min-h-8 cursor-pointer list-none items-center gap-2 rounded-control border border-control bg-surface px-4 font-semibold hover:bg-soft">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Columns
          </summary>
          <div className="absolute right-0 z-10 mt-1 w-56 rounded-dialog border border-line bg-surface p-2 shadow-lg">
            {hideable.map((column) => (
              <label key={column.id} className="flex min-h-8 cursor-pointer items-center gap-2 px-2">
                <input type="checkbox" checked={column.visible} onChange={(event) => column.toggle(event.target.checked)} className="h-4 w-4 accent-accent" />
                {column.header}
              </label>
            ))}
          </div>
        </details>
      ) : null}
      {onExport ? (
        <Button icon={<Download className="h-4 w-4" aria-hidden="true" />} onClick={onExport}>
          Export CSV
        </Button>
      ) : null}
    </div>
  );
}
