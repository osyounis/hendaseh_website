import { test, expect } from '@playwright/test'
import { ALL_ROUTES, THEMES } from './routes'

/*
 * THE SYSTEM-THEME FLIP (Task B6).
 *
 * Dark used to be opt-in behind `[data-theme="dark"]`, so in production the
 * site was light for everyone and the dark theme only existed in tests and on
 * /dev/tokens. This flipped it to `prefers-color-scheme`, in ONE commit,
 * sitewide — a partial flip would have put the dark nav over white pages.
 *
 * That makes the dark theme a real user-facing surface for the first time, and
 * these are the checks that it actually reaches every page. The theme is set
 * with `emulateMedia` BEFORE navigation, so each page is parsed and painted
 * under the theme exactly as a viewer whose OS is in that mode receives it.
 *
 * WHAT THIS CATCHES THAT AXE DOES NOT: axe (a11y.spec.ts) audits whatever it
 * is given. If a route silently failed to respond to the theme at all it would
 * render its light self under dark and axe would pass it, because the light
 * theme is accessible. The `light !== dark` assertions below are what notice
 * that the page never changed.
 */

/** Reads the paint that actually lands on the page, not the token behind it. */
async function paint(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const html = getComputedStyle(document.documentElement)
    const body = getComputedStyle(document.body)
    return {
      colorScheme: html.colorScheme,
      background: body.backgroundColor,
      color: body.color,
      surface: html.getPropertyValue('--surface').trim(),
      fgStrong: html.getPropertyValue('--fg-strong').trim(),
      fgBody: html.getPropertyValue('--fg-body').trim(),
      accent: html.getPropertyValue('--accent').trim(),
      edge: html.getPropertyValue('--edge').trim(),
    }
  })
}

for (const route of ALL_ROUTES) {
  for (const theme of THEMES) {
    test(`${route} paints a complete ${theme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme })
      await page.goto(route)

      const p = await paint(page)

      /*
       * `color-scheme: light dark` is what makes the UA paint scrollbars, the
       * caret and autofill to match. It is easy to leave off — nothing in the
       * page's own styling depends on it — and the symptom is a white
       * scrollbar down the side of a dark page, which reads as a bug in the
       * design rather than a missing declaration.
       */
      expect(p.colorScheme, `${route}: <html> must declare both themes`).toBe('light dark')

      // Every semantic token the pages build on must resolve in this theme.
      // An empty string here is the inheritance trap globals.css documents at
      // `--badge-volunteer-fg`: a token left out of the dark block.
      for (const [name, value] of Object.entries(p)) {
        expect(value, `${route}: ${name} must resolve in the ${theme} theme`).not.toBe('')
      }

      // The body is actually painted with the theme's ground, not left on the
      // UA default. `--surface` may be a var() chain, so this compares the
      // resolved paint rather than the declaration.
      expect(p.background, `${route}: body must be painted`).toMatch(/^rgba?\(/)
      expect(p.background, `${route}: body must not be transparent`).not.toBe('rgba(0, 0, 0, 0)')
    })
  }

  test(`${route} actually changes between the two themes`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(route)
    const light = await paint(page)

    await page.emulateMedia({ colorScheme: 'dark' })
    const dark = await paint(page)

    /*
     * The core assertion of the flip. Before it, every one of these would have
     * been identical in both modes on every route, because nothing on the page
     * responded to the media query. If a future change scopes the dark block
     * to a subtree, or a page opts itself out, this is what fails.
     */
    expect(dark.background, `${route}: the page ground must differ by theme`).not.toBe(
      light.background
    )
    expect(dark.color, `${route}: body text must differ by theme`).not.toBe(light.color)
    expect(dark.fgStrong, `${route}: --fg-strong must differ by theme`).not.toBe(light.fgStrong)
    expect(dark.accent, `${route}: --accent must differ by theme`).not.toBe(light.accent)
  })
}

/*
 * The attribute is gone, and staying gone is the point: a `data-theme` written
 * back onto the document — by a theme toggle, by a copied snippet from the
 * committed mockups (which are documents and still use it) — would do nothing
 * at all now, silently. This fails loudly instead.
 */
test('no page ships the retired data-theme attribute', async ({ page }) => {
  for (const route of ALL_ROUTES) {
    await page.goto(route)
    const count = await page.locator('[data-theme]').count()
    expect(count, `${route} must not carry data-theme — it is no longer wired to anything`).toBe(0)
  }
})
