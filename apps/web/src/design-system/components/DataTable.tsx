"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Problem } from "@/lib/problem";
import { EmptyState, type EmptyStateProps } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Skeleton } from "./Skeleton";
import { DataTablePagination, type PaginationState } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  sortable?: boolean;
  /** Identifiers and amounts use the mono face. */
  mono?: boolean;
  hideable?: boolean;
  hiddenByDefault?: boolean;
}

export interface DataTableProps<T> {
  caption: string;
  columns: readonly Column<T>[];
  data: readonly T[];
  getRowId: (row: T) => string;
  compact?: boolean;
  loading?: boolean;
  error?: Problem;
  onRetry?: () => void;
  empty: EmptyStateProps;
  filters?: ReactNode;
  selectedRowId?: string | null;
  onRowClick?: (row: T) => void;
  /** Server sorting: the parent re-fetches. */
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  pagination?: PaginationState;
  /** Providing this turns on row checkboxes. */
  bulkActions?: (selected: T[]) => ReactNode;
  onExport?: () => void;
}

export function DataTable<T>(props: DataTableProps<T>) {
  const { caption, columns, data, getRowId, compact, loading, error, onRetry, empty, filters, selectedRowId, onRowClick, sorting, onSortingChange, pagination, bulkActions, onExport } = props;
  const [visibility, setVisibility] = useState<VisibilityState>(() =>
    Object.fromEntries(columns.filter((column) => column.hiddenByDefault).map((column) => [column.id, false])),
  );
  const [selection, setSelection] = useState<RowSelectionState>({});

  const defs = useMemo<ColumnDef<T>[]>(
    () => [
      ...(bulkActions
        ? [
            {
              id: "select",
              enableHiding: false,
              header: ({ table }) => (
                <input type="checkbox" aria-label="Select all rows on this page" checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} className="h-4 w-4 accent-accent" />
              ),
              cell: ({ row }) => (
                <input type="checkbox" aria-label="Select row" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} onClick={(event) => event.stopPropagation()} className="h-4 w-4 accent-accent" />
              ),
            } satisfies ColumnDef<T>,
          ]
        : []),
      ...columns.map(
        (column): ColumnDef<T> => ({
          id: column.id,
          header: column.header,
          cell: ({ row }) => column.cell(row.original),
          enableSorting: column.sortable ?? false,
          enableHiding: column.hideable ?? false,
        }),
      ),
    ],
    [columns, bulkActions],
  );

  const table = useReactTable({
    data: data as T[],
    columns: defs,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    enableRowSelection: Boolean(bulkActions),
    state: { sorting: sorting ?? [], columnVisibility: visibility, rowSelection: selection },
    onSortingChange: (updater) => onSortingChange?.(typeof updater === "function" ? updater(sorting ?? []) : updater),
    onColumnVisibilityChange: setVisibility,
    onRowSelectionChange: setSelection,
  });

  if (error) return <ErrorState problem={error} onRetry={onRetry} />;

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
  const rowHeight = compact ? "h-8" : "h-10";
  const byId = new Map(columns.map((column) => [column.id, column]));

  return (
    <div>
      <DataTableToolbar
        filters={filters}
        selectedCount={selectedRows.length}
        bulkActions={bulkActions?.(selectedRows)}
        onExport={onExport}
        columns={table.getAllLeafColumns().filter((column) => column.id !== "select").map((column) => ({
          id: column.id,
          header: byId.get(column.id)?.header ?? column.id,
          visible: column.getIsVisible(),
          canHide: column.getCanHide(),
          toggle: (value: boolean) => column.toggleVisibility(value),
        }))}
      />
      {loading ? (
        <Skeleton rows={6} label={`Loading ${caption}`} />
      ) : data.length === 0 ? (
        <EmptyState {...empty} />
      ) : (
        <div role="region" aria-label={caption} tabIndex={0} className="overflow-x-auto rounded-dialog border border-line bg-surface">
          <table className="w-full border-collapse">
            <caption className="sr-only">{caption}</caption>
            <thead className="sticky top-0 bg-bg">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => {
                    const column = byId.get(header.column.id);
                    const sort = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        aria-sort={sort === "asc" ? "ascending" : sort === "desc" ? "descending" : undefined}
                        className={cn("whitespace-nowrap border-b border-line px-4 text-muted", rowHeight, column?.align === "right" ? "text-right" : "text-left")}
                      >
                        {header.column.getCanSort() ? (
                          <button type="button" onClick={header.column.getToggleSortingHandler()} className="inline-flex items-center gap-1 font-semibold hover:text-ink">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {sort === "asc" ? <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /> : sort === "desc" ? <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                          </button>
                        ) : (
                          <span className="font-semibold">{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                const selected = selectedRowId === row.id;
                return (
                  <tr
                    key={row.id}
                    tabIndex={onRowClick ? 0 : undefined}
                    aria-selected={selected || undefined}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    onKeyDown={onRowClick ? (event) => event.key === "Enter" && onRowClick(row.original) : undefined}
                    className={cn("border-b border-line last:border-b-0", onRowClick && "cursor-pointer hover:bg-bg", selected && "bg-soft shadow-[inset_2px_0_0_var(--accent)]")}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const column = byId.get(cell.column.id);
                      return (
                        <td key={cell.id} className={cn("whitespace-nowrap px-4", rowHeight, column?.align === "right" && "text-right", column?.mono && "font-mono text-[13px]")}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {pagination && !loading && data.length > 0 ? <DataTablePagination {...pagination} /> : null}
    </div>
  );
}
