import { test, expect } from '@playwright/test'

test('/capabilities permanently redirects to /about', async ({ page }) => {
  const response = await page.goto('/capabilities')
  await expect(page).toHaveURL(/\/about$/)
  const redirectedFrom = response?.request().redirectedFrom()
  const redirectResponse = await redirectedFrom?.response()
  expect(redirectResponse?.status()).toBe(308)
})
