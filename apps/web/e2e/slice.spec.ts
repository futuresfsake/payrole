import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { datesFor, signInAs, signOut } from "./helpers";

async function expectNoAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
}

async function expectNoSidewaysScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("sign-in, leave request, manager approval", () => {
  test("sign-in page: validation, axe, no sideways scroll", async ({ page }, info) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Choose who you are signing in as.")).toBeVisible();
    await expect(page.getByText("Enter the 6 digits from your authenticator app.")).toBeVisible();
    await expectNoAxeViolations(page);
    await expectNoSidewaysScroll(page);
    await page.screenshot({ path: `test-results/sign-in-${info.project.name}.png`, fullPage: true });
  });

  test("a wrong authenticator code is explained, not generic", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Sign in as").selectOption({ label: "Ena Villanueva, Sales Associate" });
    await page.getByLabel("Authenticator code").fill("000000");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("That code didn't match")).toBeVisible();
    await expect(page.getByText("Try the newest code from your authenticator app.")).toBeVisible();
  });

  test("employee files leave and the manager approves it", async ({ page }, info) => {
    const dates = datesFor(info.project.name, "feb");
    await signInAs(page, "ena");
    await expect(page.getByRole("heading", { name: "Good day, Ena" })).toBeVisible();
    await expectNoAxeViolations(page);
    await expectNoSidewaysScroll(page);
    await page.screenshot({ path: `test-results/me-home-${info.project.name}.png`, fullPage: true });

    await page.goto("/me/leave");
    await page.getByLabel("First day").fill(dates.start);
    await page.getByLabel("Last day").fill(dates.end);
    await expect(page.getByText("2 days off, counting weekdays only.")).toBeVisible();
    await expectNoAxeViolations(page);
    await expectNoSidewaysScroll(page);
    await page.screenshot({ path: `test-results/leave-${info.project.name}.png`, fullPage: true });
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByText("Request sent to Sofia Lee.")).toBeVisible();
    await expect(page.getByRole("cell", { name: dates.label })).toBeVisible();
    await signOut(page);

    await signInAs(page, "sofia");
    await page.goto("/team/approvals");
    const block = page.getByRole("region", { name: "Vacation leave from Ena Villanueva" }).filter({ hasText: dates.label });
    await expect(block).toBeVisible();
    await expectNoAxeViolations(page);
    await expectNoSidewaysScroll(page);
    await page.screenshot({ path: `test-results/approvals-${info.project.name}.png`, fullPage: true });
    await block.getByRole("button", { name: "Approve leave" }).click();
    await expect(page.getByText("Leave approved. Ena has been told.")).toBeVisible();
    await page.getByRole("tab", { name: /Decided/ }).click();
    await expect(page.getByRole("region", { name: "Vacation leave from Ena Villanueva" }).filter({ hasText: dates.label })).toBeVisible();
  });

  test("a returned request needs a comment", async ({ page }, info) => {
    const dates = datesFor(info.project.name, "mar");
    await signInAs(page, "ena");
    await page.goto("/me/leave");
    await page.getByLabel("First day").fill(dates.start);
    await page.getByLabel("Last day").fill(dates.end);
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByText("Request sent to Sofia Lee.")).toBeVisible();
    await signOut(page);

    await signInAs(page, "sofia");
    await page.goto("/team/approvals");
    const block = page.getByRole("region", { name: "Vacation leave from Ena Villanueva" }).filter({ hasText: dates.label });
    await block.getByRole("button", { name: "Return to Ena" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Return request" }).click();
    await expect(dialog.getByText("Tell them what to change, in a few words.")).toBeVisible();
    await dialog.getByLabel("Your comment").fill("Please move it a week later");
    await dialog.getByRole("button", { name: "Return request" }).click();
    await expect(page.getByText("Request returned to Ena.")).toBeVisible();
  });
});

test.describe("separation of duties and access", () => {
  test("SoD-2: a request with no manager goes to HR and the requester never sees it in their own approvals", async ({ page }, info) => {
    const dates = datesFor(info.project.name, "mar");
    await signInAs(page, "rico");
    await page.goto("/me/leave");
    await page.getByLabel("First day").fill(dates.start.replace("-03-", "-04-"));
    await page.getByLabel("Last day").fill(dates.end.replace("-03-", "-04-"));
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByText("Request sent to Hana Reyes.")).toBeVisible();
    await expect(page.getByText("went to Hana Reyes").first()).toBeVisible();
    await signOut(page);

    await signInAs(page, "hana");
    await page.goto("/team/approvals");
    const fromRico = page.getByRole("region", { name: "Vacation leave from Rico Casa" }).first();
    await expect(fromRico).toBeVisible();
    await expect(fromRico.getByText(/rule SoD-2/)).toBeVisible();
    await expect(page.getByRole("region", { name: /from Hana Reyes/ })).toHaveCount(0);
  });

  test("a direct link to a workspace you don't have shows the reason in words", async ({ page }, info) => {
    await signInAs(page, "ena");
    await page.goto("/hr");
    await expect(page.getByText("No permission in this scope")).toBeVisible();
    await expect(page.getByText("NO_PERMISSION_IN_SCOPE")).toBeVisible();
    await expectNoAxeViolations(page);
    await page.screenshot({ path: `test-results/forbidden-${info.project.name}.png`, fullPage: true });
    await page.goto("/team/approvals");
    await expect(page.getByText("No permission in this scope")).toBeVisible();
  });

  test("the workspace strip only lists workspaces the access object allows", async ({ page, isMobile }) => {
    test.skip(Boolean(isMobile) || page.viewportSize()?.width === 360, "The strip is in the drawer on phones");
    await signInAs(page, "hana");
    const strip = page.getByRole("navigation", { name: "Workspaces" });
    await expect(strip.getByRole("link")).toHaveText(["Me", "Team", "HR"]);
    await signOut(page);
    await signInAs(page, "ena");
    await expect(page.getByRole("navigation", { name: "Workspaces" })).toHaveCount(0);
  });

  test("a stale second tab gets a conflict message, not a silent overwrite", async ({ browser }, info) => {
    test.skip(!info.project.name.startsWith("desktop"), "Only one project can decide the seeded request");
    const context = await browser.newContext({ baseURL: "http://127.0.0.1:3100", viewport: { width: 1280, height: 900 } });
    const first = await context.newPage();
    await signInAs(first, "rey");
    await first.goto("/team/approvals");
    const second = await context.newPage();
    await second.goto("/team/approvals");
    const open = (page: Page) => page.getByRole("region", { name: "Sick leave from Luis Garcia" }).getByRole("button", { name: "Approve leave" });
    await expect(open(second)).toBeVisible();
    await open(first).click();
    await expect(first.getByText("Leave approved. Luis has been told.")).toBeVisible();
    await open(second).click();
    await expect(second.getByText("Someone already decided this request")).toBeVisible();
    await context.close();
  });
});
