"use client";

import { useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { Button, DataTable, StatusBadge, type Column } from "@/design-system";
import { formatPhp } from "@/lib/money";
import { CatalogueSection, Demo } from "./CatalogueSection";
import { PEOPLE, type PersonRow } from "./fixtures";

const COLUMNS: Column<PersonRow>[] = [
  { id: "no", header: "No.", cell: (row) => row.no, mono: true, sortable: true },
  { id: "name", header: "Name", cell: (row) => row.name, sortable: true },
  { id: "department", header: "Department", cell: (row) => row.department, hideable: true },
  { id: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
  { id: "monthly", header: "Monthly rate", cell: (row) => formatPhp(row.monthlyCentavos), align: "right", mono: true, sortable: true, hideable: true },
];

export function DataDemo() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string | null>("p3");
  const pageSize = 4;

  // Stands in for the server: sorts, then slices.
  const rows = useMemo(() => {
    const sorted = [...PEOPLE];
    const sort = sorting[0];
    if (sort) {
      const key = sort.id === "monthly" ? "monthlyCentavos" : (sort.id as "no" | "name");
      sorted.sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * (sort.desc ? -1 : 1));
    }
    return sorted.slice(page * pageSize, page * pageSize + pageSize);
  }, [sorting, page]);

  return (
    <CatalogueSection id="data" title="DataTable" description="Sortable, filterable, sticky header, column visibility, bulk actions, server pagination and export. Numbers are right-aligned in the mono face.">
      <Demo title="Default: sort, select a row, paginate, hide columns, export">
        <DataTable
          caption="People"
          columns={COLUMNS}
          data={rows}
          getRowId={(row) => row.id}
          selectedRowId={selected}
          onRowClick={(row) => setSelected(row.id)}
          sorting={sorting}
          onSortingChange={setSorting}
          pagination={{ page, pageSize, total: PEOPLE.length, onPageChange: setPage }}
          onExport={() => undefined}
          empty={{ title: "No people yet", description: "Add your first employee, or import a spreadsheet." }}
        />
      </Demo>
      <Demo title="Compact rows with bulk actions">
        <DataTable
          caption="People, compact"
          compact
          columns={COLUMNS.slice(0, 4)}
          data={PEOPLE}
          getRowId={(row) => row.id}
          bulkActions={(selection) => <Button size="sm">Download {selection.length} records</Button>}
          empty={{ title: "No people yet", description: "Add your first employee." }}
        />
      </Demo>
      <Demo title="Loading">
        <DataTable caption="People" columns={COLUMNS} data={[]} getRowId={(row) => row.id} loading empty={{ title: "", description: "" }} />
      </Demo>
      <Demo title="Empty">
        <DataTable
          caption="People"
          columns={COLUMNS}
          data={[]}
          getRowId={(row) => row.id}
          empty={{ title: "No one matches those filters", description: "Clear the department or status filter.", action: <Button>Clear filters</Button> }}
        />
      </Demo>
      <Demo title="Error">
        <DataTable
          caption="People"
          columns={COLUMNS}
          data={[]}
          getRowId={(row) => row.id}
          error={{ type: "about:blank", title: "People couldn't be loaded", status: 503, correlationId: "req-91ae44d0" }}
          onRetry={() => undefined}
          empty={{ title: "", description: "" }}
        />
      </Demo>
    </CatalogueSection>
  );
}
