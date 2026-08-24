import { test, expect } from '@playwright/test'

test('/capabilities permanently redirects to /about', async ({ page }) => {
  const response = await page.goto('/capabilities')
  await expect(page).toHaveURL(/\/about$/)
  const redirectedFrom = response?.request().redirectedFrom()
  const redirectResponse = await redirectedFrom?.response()
  expect(redirectResponse?.status()).toBe(308)
})

test('/projects/nahtadi permanently redirects to /nahtadi', async ({ page }) => {
  const response = await page.goto('/projects/nahtadi')
  await expect(page).toHaveURL(/\/nahtadi$/)
  const redirectedFrom = response?.request().redirectedFrom()
  const redirectResponse = await redirectedFrom?.response()
  expect(redirectResponse?.status()).toBe(308)
})

// The tier contract: `card` projects have no detail page. `reddit-nlp` is a card
// project, so /projects/[slug] must not resolve it — dynamicParams = false makes
// every slug outside generateStaticParams a 404.
test('a card-tier project slug returns 404', async ({ page }) => {
  const response = await page.goto('/projects/reddit-nlp')
  expect(response?.status()).toBe(404)
})
