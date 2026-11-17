import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("component catalogue", () => {
  test("has no axe violations at WCAG 2.2 AA", async ({ page }) => {
    await page.goto("/catalogue");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
  });

  test("does not scroll sideways", async ({ page }) => {
    await page.goto("/catalogue");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("screenshot", async ({ page }, info) => {
    await page.goto("/catalogue");
    await page.screenshot({ path: `test-results/catalogue-${info.project.name}.png`, fullPage: true });
  });

  test("blocked approval stays visible and explains the rule", async ({ page }) => {
    await page.goto("/catalogue");
    const block = page.getByRole("region", { name: /Run PG-01/ });
    await expect(block.getByRole("button", { name: "Approve run" })).toBeDisabled();
    await expect(block.getByText("You prepared this run")).toBeVisible();
    await expect(block.getByText(/SoD-1/)).toBeVisible();
  });

  test("masked value reveals only after step-up, with a reason", async ({ page }) => {
    await page.goto("/catalogue");
    await expect(page.getByText("DEV-SSS-····-4821")).toBeVisible();
    await page.getByRole("button", { name: "Show full number" }).click();
    const dialog = page.getByRole("dialog", { name: "Show SSS number" });
    await dialog.getByRole("button", { name: "Confirm" }).click();
    await expect(dialog.getByText("Enter the 6 digits from your authenticator app.")).toBeVisible();
    await dialog.getByLabel("Authenticator code").fill("123456");
    await dialog.getByRole("button", { name: "Confirm" }).click();
    await expect(dialog.getByText("Choose why you need this. It is saved in the audit log.")).toBeVisible();
    await dialog.getByLabel("Why do you need this?").selectOption("Payroll check");
    await dialog.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByText("DEV-SSS-0012-4821")).toBeVisible();
  });

  test("selected states use a neutral fill, not bold or tinted accent text", async ({ page }) => {
    await page.goto("/catalogue");
    const current = page.getByRole("link", { name: "Forms and buttons" });
    const style = await current.evaluate((el) => {
      const css = getComputedStyle(el);
      return { weight: css.fontWeight, background: css.backgroundColor };
    });
    const other = await page.getByRole("link", { name: "DataTable" }).evaluate((el) => getComputedStyle(el).fontWeight);
    expect(style.weight).toBe(other);
    expect(style.background).toBe("rgb(243, 244, 246)");
  });
});
