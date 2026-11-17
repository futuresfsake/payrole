import { Button } from "./Button";

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

/** Server pagination: the parent fetches the page; this only reports and requests. Pages start at 0. */
export function DataTablePagination({ page, pageSize, total, onPageChange }: PaginationState) {
  const first = total === 0 ? 0 : page * pageSize + 1;
  const last = Math.min(total, (page + 1) * pageSize);
  const lastPage = Math.max(0, Math.ceil(total / pageSize) - 1);
  return (
    <div className="mt-3 flex items-center justify-between text-muted">
      <p aria-live="polite">
        {first}–{last} of {total}
      </p>
      <div className="flex gap-2">
        <Button size="sm" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button size="sm" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
