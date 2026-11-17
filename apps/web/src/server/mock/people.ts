/**
 * Mock identity data taken from the seed tenant (db/seed). Development only: the real API reads PostgreSQL.
 * Roles here mirror the seeded role assignments. `employee` and `manager` are derived, never listed.
 */
export type GrantedRole = "executive" | "dpo" | "hr_admin" | "payroll_preparer" | "payroll_approver" | "tenant_admin" | "timekeeper" | "auditor";

export interface MockPerson {
  key: string;
  name: string;
  title: string;
  /** Key of the current manager, or null at the top of the reporting line. */
  managerKey: string | null;
  roles: readonly GrantedRole[];
  /** Employee records only. The external auditor has none. */
  isEmployee: boolean;
  /** Accounts that end (auditor time-box). */
  accessEndsAt?: string;
  active: boolean;
}

const p = (key: string, name: string, title: string, managerKey: string | null, roles: GrantedRole[] = [], extra: Partial<MockPerson> = {}): MockPerson => ({
  key, name, title, managerKey, roles, isEmployee: true, active: true, ...extra,
});

export const PEOPLE: readonly MockPerson[] = [
  p("rico", "Rico Casa", "General Manager", null, ["executive", "dpo"]),
  p("hana", "Hana Reyes", "HR Lead", "rico", ["hr_admin"]),
  p("faye", "Faye Lim", "Finance Controller", "rico", ["payroll_approver"]),
  p("ines", "Ines Bautista", "IT and Systems Lead", "rico", ["tenant_admin"]),
  p("marco", "Marco Dizon", "Operations Manager", "rico"),
  p("paolo", "Paolo Santos", "Payroll Officer", "faye", ["payroll_preparer", "timekeeper"]),
  p("dante", "Dante Ramos", "HR Clerk", "hana"),
  p("bea", "Bea Tan", "Accounting Clerk", "faye"),
  p("ana", "Ana Pineda", "Accounting Clerk", "faye"),
  p("noel", "Noel Aquino", "IT Support", "ines", ["tenant_admin"]),
  p("sofia", "Sofia Lee", "Sales Supervisor", "marco"),
  p("ena", "Ena Villanueva", "Sales Associate", "sofia"),
  p("mika", "Mika Torres", "Sales Associate", "sofia"),
  p("jun", "Jun Mercado", "Sales Associate", "sofia"),
  p("tess", "Tess Navarro", "Customer Service Representative", "sofia"),
  p("vince", "Vince Salonga", "Sales Associate", "sofia"),
  p("sam", "Sam Ortega", "Sales Associate", "sofia"),
  p("rey", "Rey Padilla", "Warehouse Supervisor", "marco"),
  p("luis", "Luis Garcia", "Warehouse Staff (probationary)", "rey"),
  p("anton", "Anton Cruz", "Warehouse Staff", "rey"),
  p("joel", "Joel Cruz", "Driver (contractual)", "rey"),
  p("gina", "Gina Ocampo", "Driver", "rey"),
  p("lito", "Lito Bernardo", "Warehouse Staff", "rey"),
  p("mara", "Mara Villar", "Operations Assistant", "marco", ["timekeeper"]),
  p("pia", "Pia Lacson", "Executive Assistant", "rico"),
  p("carla", "Carla Mendoza", "External auditor", null, ["auditor"], { isEmployee: false, accessEndsAt: "2027-01-15" }),
];

export function findPerson(key: string): MockPerson | undefined {
  return PEOPLE.find((person) => person.key === key);
}

export function reportsOf(key: string): MockPerson[] {
  return PEOPLE.filter((person) => person.managerKey === key && person.active);
}

/** Direct and indirect reports, from the reporting line as of today. */
export function teamOf(key: string): MockPerson[] {
  const direct = reportsOf(key);
  return direct.flatMap((person) => [person, ...teamOf(person.key)]);
}
