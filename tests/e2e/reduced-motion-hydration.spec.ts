import { test, expect } from '@playwright/test'

// WHAT THIS ASSERTS: /nahtadi loads and hydrates with no hydration-related
// console error or uncaught page error when the browser reports
// prefers-reduced-motion: reduce.
//
// WHAT IT GENUINELY GUARDS: ReviewsCarousel's useReducedMotion hook
// (src/components/nahtadi/ReviewsCarousel.tsx). The route's `aria-live` value is
// derived from the reduced-motion preference, so any hook that reads the live
// matchMedia value during the *first* client render disagrees with the
// server-rendered HTML and React reports a hydration mismatch.
//
// Verified red/green on 2026-08-23 by swapping the hook implementation:
//
//   useSyncExternalStore + getServerSnapshot()=false  -> PASSES (current code)
//   useState(() => matchMedia(...).matches) + effect  -> FAILS  (the actual
//       pre-fix code at 96cba68^; the run reported exactly
//       `+ aria-live="polite"` / `- aria-live="off"`)
//   useState(false) + effect that calls setReduced()  -> PASSES
//
// The third case passing is correct, not a gap: that shape renders `false` on
// the server AND on the client's first render, so there is no mismatch to
// detect — it only applies the preference in a post-hydration effect. This spec
// fires on a real hydration mismatch and stays silent when there is none.
//
// Uses an explicit browser.newContext({ reducedMotion: 'reduce' }) rather than
// test.use(...) — with this project's chromium project config (devices['Desktop
// Chrome'] spread into `use`), test.use({ reducedMotion: 'reduce' }) did not
// reliably apply the emulated media feature before first paint (verified via
// window.matchMedia(...).matches reading false despite the setting); an
// explicit newContext call was confirmed reliable instead.

const HYDRATION_ERROR_PATTERN = /hydrat|did not match|Minified React error #(418|423|425)/i

test('/nahtadi hydrates without a mismatch under prefers-reduced-motion: reduce', async ({ browser }) => {
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

  // Sanity-check that the emulated media feature actually reached the page —
  // without this the assertion below could pass simply because reduced motion
  // was never applied, which is how this guard would silently rot.
  expect(await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)

  // Give React a moment to finish hydration and flush any warnings.
  await page.waitForTimeout(500)

  await context.close()

  const hydrationErrors = consoleErrors.filter((text) => HYDRATION_ERROR_PATTERN.test(text))
  expect(hydrationErrors, `Unexpected hydration-related console errors: ${JSON.stringify(hydrationErrors, null, 2)}`).toEqual([])
})
