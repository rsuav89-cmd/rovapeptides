import { test, expect } from "@playwright/test";

test.describe("catalog navigation", () => {
  test("home → all products → filtered by category", async ({ page }) => {
    await page.goto("/");

    // Hero CTA must land on a buyable surface, not an interstitial.
    await page.getByRole("link", { name: /browse all peptides/i }).click();
    await expect(page).toHaveURL(/\/shop\/all$/);

    const count = page.getByRole("status").filter({ hasText: /products?$/ }).first();
    await expect(count).toBeVisible();
    const before = Number((await count.textContent())?.match(/\d+/)?.[0] ?? 0);
    expect(before).toBeGreaterThan(0);

    // Category filter is a group of toggles (not ARIA tabs) after the a11y pass.
    const group = page.getByRole("group", { name: /product categories/i });
    await expect(group).toBeVisible();
    const longevity = group.getByRole("button", { name: "Longevity" });
    await longevity.click();
    await expect(longevity).toHaveAttribute("aria-pressed", "true");

    const after = Number((await count.textContent())?.match(/\d+/)?.[0] ?? 0);
    expect(after).toBeGreaterThan(0);
    expect(after).toBeLessThanOrEqual(before);
  });

  test("product cards are real links, not click handlers", async ({ page }) => {
    await page.goto("/shop/all");
    const first = page.locator("article a[href^='/shop/']").first();
    await expect(first).toHaveAttribute("href", /\/shop\/.+/);
    await first.click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("collection pages render and link back to products", async ({ page }) => {
    await page.goto("/shop");
    const collection = page.locator("a[href^='/shop/collections/']").first();
    await collection.click();
    await expect(page).toHaveURL(/\/shop\/collections\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
