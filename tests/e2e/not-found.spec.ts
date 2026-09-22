import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { THEMES } from './routes'

/**
 * The branded 404 (`src/app/not-found.tsx`).
 *
 * Before it existed, an unknown URL rendered Next's built-in page, which
 * shipped TWO `<title>` tags (the homepage tagline first, then Next's own)
 * and offered no way back but the nav. The single-title assertion is the one
 * that catches a regression to that built-in page.
 *
 * `/projects/reddit-nlp` is here as well as a made-up URL because card-tier
 * slugs reach this page by a different path: `dynamicParams = false` on
 * `/projects/[slug]`, not an unmatched route.
 */

const MISSING = ['/this-page-does-not-exist', '/projects/reddit-nlp'] as const

for (const url of MISSING) {
  test(`${url} returns the branded 404`, async ({ page }) => {
    const response = await page.goto(url)
    expect(response?.status()).toBe(404)

    expect(await page.locator('head title').count()).toBe(1)
    await expect(page).toHaveTitle('Page Not Found - Omar Younis')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)

    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page can’t be found.')

    // The status code is shown, quietly, ABOVE the headline -- and outside
    // it, so the h1 a screen reader announces is still the message itself.
    const code = page.getByTestId('not-found-code')
    await expect(code).toHaveText('404')
    const [codeBox, h1Box] = await Promise.all([code.boundingBox(), page.locator('h1').boundingBox()])
    expect(codeBox!.y + codeBox!.height).toBeLessThanOrEqual(h1Box!.y)
  })
}

test('the 404 offers a way back to Home and to Projects', async ({ page }) => {
  await page.goto(MISSING[0])
  const main = page.locator('main')

  await main.getByRole('link', { name: 'Go to homepage' }).click()
  await expect(page).toHaveURL('/')

  await page.goto(MISSING[0])
  await main.getByRole('link', { name: 'View projects' }).click()
  await expect(page).toHaveURL('/projects')
})

test('the 404 does not scroll sideways on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto(MISSING[0])
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  )
  expect(overflow).toBe(0)
})

for (const theme of THEMES) {
  test(`the 404 has no axe violations in the ${theme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
    await page.goto(MISSING[0])
    await page.evaluate(() => document.fonts.ready)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const summary = results.violations.map((v) => ({
      id: v.id,
      help: v.help,
      nodes: v.nodes.map((n) => n.target.join(' ')),
    }))
    expect(summary, `404 (${theme})`).toEqual([])
  })
}
