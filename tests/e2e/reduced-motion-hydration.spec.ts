import { test, expect } from '@playwright/test'

// Guards against React hydration mismatches on /nahtadi for visitors with
// prefers-reduced-motion set — this is the condition under which
// ReviewsCarousel's useReducedMotion hook (src/components/nahtadi/ReviewsCarousel.tsx)
// could disagree between the server-rendered HTML and the client's first
// hydration render if it ever regresses back to a non-hydration-safe pattern.
//
// Uses an explicit browser.newContext({ reducedMotion: 'reduce' }) rather than
// test.use(...) — with this project's chromium project config (devices['Desktop
// Chrome'] spread into `use`), test.use({ reducedMotion: 'reduce' }) did not
// reliably apply the emulated media feature before first paint (verified via
// window.matchMedia(...).matches reading false despite the setting); an
// explicit newContext call was confirmed reliable instead.

const HYDRATION_ERROR_PATTERN = /hydrat|did not match|Minified React error #(418|423|425)/i

test('/nahtadi hydrates cleanly with prefers-reduced-motion: reduce', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()

  const consoleErrors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message)
  })

  await page.goto('/nahtadi')
  // Give React a moment to complete hydration and flush any mismatch warnings.
  await page.waitForTimeout(500)

  await context.close()

  const hydrationErrors = consoleErrors.filter((text) => HYDRATION_ERROR_PATTERN.test(text))
  expect(hydrationErrors, `Unexpected hydration-related console errors: ${JSON.stringify(hydrationErrors, null, 2)}`).toEqual([])
})
