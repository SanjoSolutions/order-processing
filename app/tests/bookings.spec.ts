import { expect, test } from "@playwright/test"

test("booking", async ({ page }) => {
  await page.goto("http://localhost:3000/book")
  await page.getByRole("button", { name: "Hinzufügen" }).click()
  await page.getByRole("button", { name: "Buchen" }).click()
  await expect(
    page.getByText(/^Der Service .+ wurde .+ gebucht.$/),
  ).toBeVisible()
})
