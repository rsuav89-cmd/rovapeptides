import { test, expect } from "@playwright/test";

test.describe("form validation", () => {
  test("newsletter rejects a malformed address with an announced error", async ({ page }) => {
    await page.goto("/");
    const email = page.getByLabel("Email address");
    await email.fill("not-an-email");
    await page.getByRole("button", { name: /subscribe/i }).click();

    const error = page.getByRole("alert");
    await expect(error).toContainText(/valid email/i);
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAttribute("aria-describedby", /newsletter-error/);
  });

  test("newsletter accepts a valid address and confirms", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Email address").fill("jane@lab.edu");
    await page.getByRole("button", { name: /subscribe/i }).click();
    await expect(page.getByRole("status")).toContainText(/on the list/i);
  });

  test("contact form marks required fields and carries autocomplete hints", async ({ page }) => {
    await page.goto("/contact");
    const name = page.getByLabel("Name");
    const email = page.getByLabel("Email", { exact: true });
    await expect(name).toHaveAttribute("required", "");
    await expect(name).toHaveAttribute("autocomplete", "name");
    await expect(email).toHaveAttribute("autocomplete", "email");
  });

  test("order tracking requires both fields", async ({ page }) => {
    await page.goto("/track-order");
    await expect(page.getByLabel(/order number/i)).toHaveAttribute("required", "");
    await expect(page.getByLabel(/email used at checkout/i)).toHaveAttribute("autocomplete", "email");
  });
});
