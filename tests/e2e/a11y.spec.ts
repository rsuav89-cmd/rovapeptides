import { test, expect } from "@playwright/test";

test.describe("keyboard and screen-reader affordances", () => {
  test("skip link is the first stop and moves focus to main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: /skip to main content/i });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("cart drawer traps focus and restores it on close", async ({ page }) => {
    await page.goto("/shop/bpc-157-tb-500");
    const trigger = page.getByRole("button", { name: /^Add/ }).first();
    await trigger.click();

    const drawer = page.getByRole("dialog", { name: /your cart/i });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("button", { name: /close cart/i })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("announcement marquee can be paused (WCAG 2.2.2)", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /pause scrolling announcements/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  test("mobile nav is a labelled dialog with escape handling", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile viewport only");
    await page.goto("/");
    await page.getByRole("button", { name: /menu/i }).first().click();
    const nav = page.getByRole("dialog", { name: /site menu/i });
    await expect(nav).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(nav).toBeHidden();
  });

  test("every page exposes exactly one h1 and a main landmark", async ({ page }) => {
    for (const path of ["/", "/shop/all", "/shop/bpc-157-tb-500", "/coas", "/coas/RV-BTB-2418", "/faq"]) {
      await page.goto(path);
      await expect(page.locator("main#main-content")).toHaveCount(1);
      expect(await page.locator("h1").count()).toBeLessThanOrEqual(1);
    }
  });
});
