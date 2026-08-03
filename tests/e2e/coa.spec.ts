import { test, expect } from "@playwright/test";

const BATCH = "RV-BPC-2431";

test.describe("certificate of analysis", () => {
  test("server-rendered batch page exposes the analyte table", async ({ page }) => {
    await page.goto(`/coas/${BATCH}`);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(BATCH);

    const table = page.getByRole("table");
    await expect(table).toBeVisible();
    await expect(table.getByRole("columnheader")).toHaveCount(5);
    // Seven analytes on every released batch.
    await expect(table.locator("tbody tr")).toHaveCount(7);
    await expect(table).toContainText("RP-HPLC");
    await expect(table).toContainText("LC-MS");
    await expect(page.getByText(/US Analytical Labs/i).first()).toBeVisible();

    // The data must exist in the HTML, not only after hydration.
    const html = await page.content();
    expect(html).toContain("Bacterial Endotoxins");
  });

  test("query deep link prefills and resolves the lookup", async ({ page }) => {
    await page.goto(`/coas?batch=${BATCH}`);
    const modal = page.getByRole("dialog", { name: new RegExp(BATCH, "i") });
    await expect(modal).toBeVisible();
    await expect(modal.getByRole("table")).toContainText("Karl Fischer");
  });

  test("unknown batch reports failure politely", async ({ page }) => {
    await page.goto("/coas");
    await page.getByLabel(/batch number/i).fill("RV-NOPE-0000");
    await page.getByRole("button", { name: /look up/i }).click();
    await expect(page.getByRole("status")).toContainText(/no certificate found/i);
  });

  test("product page links to its own batch certificate", async ({ page }) => {
    await page.goto("/shop/bpc-157");
    const link = page.getByRole("link", { name: /certificate of analysis/i }).first();
    await expect(link).toHaveAttribute("href", /\/coas\/RV-/);
  });
});
