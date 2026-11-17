/** Synthetic rows taken from the seed tenant (Casa Verde Trading Corp.). DEV- identifiers only. */
export interface PersonRow {
  id: string;
  no: string;
  name: string;
  department: string;
  status: "active" | "ended";
  monthlyCentavos: number;
}

export const PEOPLE: readonly PersonRow[] = [
  { id: "p2", no: "EMP-0002", name: "Reyes, Hana", department: "HR and Admin", status: "active", monthlyCentavos: 6_200_000 },
  { id: "p3", no: "EMP-0003", name: "Lim, Faye", department: "Finance", status: "active", monthlyCentavos: 8_500_000 },
  { id: "p5", no: "EMP-0005", name: "Dizon, Marco", department: "Operations", status: "active", monthlyCentavos: 6_800_000 },
  { id: "p12", no: "EMP-0012", name: "Villanueva, Ena", department: "Sales", status: "active", monthlyCentavos: 2_200_000 },
  { id: "p19", no: "EMP-0019", name: "Garcia, Luis", department: "Warehouse and Logistics", status: "active", monthlyCentavos: 1_800_000 },
  { id: "p24", no: "EMP-0024", name: "Dela Cruz, Carlo", department: "Warehouse and Logistics", status: "ended", monthlyCentavos: 1_800_000 },
];

export const PURPOSES = ["Payroll check", "Government filing", "Employee request"] as const;
