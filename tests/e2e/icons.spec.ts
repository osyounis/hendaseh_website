import { test, expect } from '@playwright/test'

/**
 * The favicon set and Apple touch icon (`npm run generate:icons`).
 *
 * `/favicon.ico` and `/apple-touch-icon.png` are requested at those exact
 * paths by crawlers, feed readers and Safari without reading any `<link>`, so
 * both must resolve even though the page also declares them. Pixel sizes and
 * opacity are unit-tested in src/lib/__tests__/icons.test.ts.
 */

test('the conventional icon paths serve images', async ({ request }) => {
  for (const [url, type] of [
    ['/favicon.ico', 'image/'],
    ['/apple-touch-icon.png', 'image/png'],
    ['/favicon-16x16.png', 'image/png'],
    ['/favicon-32x32.png', 'image/png'],
  ] as const) {
    const res = await request.get(url)
    expect(res.status(), url).toBe(200)
    expect(res.headers()['content-type'], url).toContain(type)
  }
})

test('the page declares the favicon and a 180px Apple touch icon', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('link[rel="icon"][href="/favicon.ico"]')).toHaveCount(1)
  await expect(
    page.locator('link[rel="apple-touch-icon"][href="/apple-touch-icon.png"][sizes="180x180"]')
  ).toHaveCount(1)
  // The transparent 512 is the OG-card source, not a home-screen icon.
  await expect(page.locator('link[href="/favicon-512x512.png"]')).toHaveCount(0)
})
