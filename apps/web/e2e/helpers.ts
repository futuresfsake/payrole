import type { Page } from "@playwright/test";

export const PEOPLE = {
  ena: "Ena Villanueva, Sales Associate",
  sofia: "Sofia Lee, Sales Supervisor",
  rico: "Rico Casa, General Manager",
  hana: "Hana Reyes, HR Lead",
  rey: "Rey Padilla, Warehouse Supervisor",
} as const;

export async function signInAs(page: Page, person: keyof typeof PEOPLE): Promise<void> {
  await page.goto("/sign-in");
  await page.getByLabel("Sign in as").selectOption({ label: PEOPLE[person] });
  await page.getByLabel("Authenticator code").fill("123456");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/me");
}

export async function signOut(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("**/sign-in");
}

/** Each project files different dates so parallel runs on one server don't overlap. */
export function datesFor(projectName: string, base: "feb" | "mar"): { start: string; end: string; label: string } {
  const desktop = projectName.startsWith("desktop");
  const day = desktop ? 8 : 1;
  const month = base === "feb" ? "02" : "03";
  const start = `2027-${month}-${String(day).padStart(2, "0")}`;
  const end = `2027-${month}-${String(day + 1).padStart(2, "0")}`;
  const name = base === "feb" ? "Feb" : "Mar";
  return { start, end, label: `${day} ${name} 2027 to ${day + 1} ${name} 2027` };
}
