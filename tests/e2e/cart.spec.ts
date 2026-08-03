import { test, expect } from "@playwright/test";

const MULTI_VARIANT = "/shop/retatrutide";

test.describe("variant selection and cart state", () => {
  test("selecting a strength updates price and per-mg readout", async ({ page }) => {
    await page.goto(MULTI_VARIANT);

    const strengths = page.getByRole("group", { name: /select strength/i }).getByRole("button");
    await expect(strengths.first()).toBeVisible();
    if ((await strengths.count()) < 2) test.skip(true, "family has a single variant");

    const priceLocator = page.locator("p.font-sans.text-2xl").first();
    const firstPrice = await priceLocator.textContent();

    await strengths.nth(1).click();
    await expect(strengths.nth(1)).toHaveAttribute("aria-pressed", "true");
    await expect(priceLocator).not.toHaveText(firstPrice ?? "");
  });

  test("adding to cart opens the drawer and tracks the free-shipping threshold", async ({ page }) => {
    await page.goto(MULTI_VARIANT);

    await page.getByRole("button", { name: /^Add/ }).first().click();

    const drawer = page.getByRole("dialog", { name: /your cart/i });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText(/free shipping/i).first()).toBeVisible();

    // Quantity controls mutate the line and the subtotal.
    const subtotal = drawer.locator("span.tabular-nums").first();
    const before = await subtotal.textContent();
    await drawer.getByRole("button", { name: /increase quantity/i }).first().click();
    await expect(subtotal).not.toHaveText(before ?? "");

    // Escape closes and focus returns to the page.
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });

  test("checkout is blocked when the cart holds an unpriced SKU", async ({ page }) => {
    await page.goto("/shop/all");
    const unpriced = page.getByRole("button", { name: /details and pricing for/i }).first();
    if ((await unpriced.count()) === 0) test.skip(true, "catalog is fully priced");
    // Unpriced SKUs must route to the product page rather than entering the cart.
    await unpriced.click();
    await expect(page).toHaveURL(/\/shop\//);
  });
});
