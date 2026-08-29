import { test, expect, type Page } from '@playwright/test'

/*
 * /nahtadi — the two checks Task N3's contract names by hand, plus the
 * structural guards for what N3 deleted.
 *
 * Contract: docs/superpowers/mockups/nahtadi/APPROVED.md
 * Copy:     docs/superpowers/mockups/nahtadi/COPY-LOCKED.md
 */

/* ------------------------------------------------------------------------ *
 * 1. TOKENS
 *
 * `--fg-quiet` is a PROMOTION, not a new token: it is the third consumer of
 * the ink-600 / navy-450 pair, alongside `--about-when` and `--contact-quiet`,
 * and the contract forbids minting a fourth alias. This asserts the promotion
 * actually happened — all three resolve to ONE value per theme — rather than
 * three independent declarations that happen to agree today.
 *
 * IT IS ALSO A GUARD ON A REAL TRAP globals.css documents at
 * `--badge-volunteer-fg`: custom properties are substituted at computed-value
 * time on the element the declaration applies to. An alias written ONLY at
 * `:root` (`--about-when: var(--fg-quiet)`) computes against `:root`'s light
 * value and then inherits that light value into a dark subtree. Restating the
 * alias inside the dark block is what makes it track the theme, and a
 * dark-theme run of this test is what catches its absence.
 *
 * Task B6 flipped dark from `[data-theme="dark"]` to `prefers-color-scheme`,
 * so the switch is now `emulateMedia` rather than an attribute write. It is
 * applied after `goto` on purpose: the last test below reads BOTH themes off
 * one loaded page, which is what proves the two are different values rather
 * than one value agreeing with itself. These are computed-value reads, so
 * switching the media query post-load resolves exactly what a fresh load
 * under that theme would.
 * ------------------------------------------------------------------------ */

/** Reads computed custom properties off `<html>`, under an explicit theme. */
async function tokensUnder(page: Page, theme: 'light' | 'dark', names: string[]) {
  await page.emulateMedia({ colorScheme: theme })
  return page.evaluate((ns) => {
    const styles = getComputedStyle(document.documentElement)
    return Object.fromEntries(ns.map((n) => [n, styles.getPropertyValue(n).trim()]))
  }, names)
}

const QUIET_ALIASES = ['--fg-quiet', '--about-when', '--contact-quiet']

for (const theme of ['light', 'dark'] as const) {
  test(`--fg-quiet is one shared token in the ${theme} theme, not a family of aliases`, async ({ page }) => {
    await page.goto('/nahtadi')
    const values = await tokensUnder(page, theme, QUIET_ALIASES)

    expect(values['--fg-quiet'], '--fg-quiet must be defined').not.toBe('')
    for (const alias of QUIET_ALIASES) {
      expect(values[alias], `${alias} must resolve to --fg-quiet in the ${theme} theme`).toBe(
        values['--fg-quiet']
      )
    }
  })

  test(`--icon-chip is defined in the ${theme} theme`, async ({ page }) => {
    await page.goto('/nahtadi')
    const values = await tokensUnder(page, theme, ['--icon-chip'])
    expect(values['--icon-chip'], '--icon-chip must be defined').not.toBe('')
  })
}

test('the two quiet-token themes are actually different values', async ({ page }) => {
  // Without this, the pair of per-theme tests above would still pass if
  // `--fg-quiet` were defined once at :root and never overridden in dark —
  // which is precisely the inheritance trap they exist to catch.
  await page.goto('/nahtadi')
  const light = await tokensUnder(page, 'light', ['--fg-quiet'])
  const dark = await tokensUnder(page, 'dark', ['--fg-quiet'])
  expect(dark['--fg-quiet']).not.toBe(light['--fg-quiet'])
})

/* ------------------------------------------------------------------------ *
 * 2. THE SCREENSHOT RAIL — the check the contract names by hand
 *
 * "N3 REQUIREMENT — an e2e assertion that the first screenshot's left edge
 *  equals the card's content edge at several widths."
 *
 * ONE assertion catches BOTH bugs the design round fixed, which is why it is
 * written as an equality against a measured content edge rather than against a
 * hard-coded inset:
 *
 *   (a) THE CENTRING CALC. `padding-inline` was `calc(50% - 105px)`, i.e.
 *       (clientWidth - itemWidth) / 2 — which centres the first and last item
 *       and IS the dead space at both ends, by construction. It scaled with
 *       the viewport (61.5px at 390, 214.5px at 720, 42px at 1024+), so any
 *       inset asserted as a NUMBER would have to be re-derived per width and a
 *       wrong one would still look plausible. Against the card's own content
 *       edge the calc fails everywhere it bites.
 *
 *   (b) THE SNAPPORT. `scroll-snap-align: start` snaps to the SNAPPORT, which
 *       is the scroll container's PADDING box, not its content box. Without a
 *       matching `scroll-padding-inline` the browser snaps the first item to
 *       the padding-box edge on load and scrolls the leading inset away, so
 *       the first screenshot sits at the card's inner BORDER edge instead of
 *       its content edge. Nothing in the stylesheet couples the two
 *       properties, so only a rendered measurement catches a breakpoint where
 *       one was updated and the other was not.
 *
 * The widths are the ones the mockup was verified at, and the multi-width
 * sweep is the point: a single-width check is exactly what let (a) ship, since
 * the calc happened to equal the correct inset at 1024 and above.
 */

const RAIL_WIDTHS = [390, 500, 720, 880, 1024, 1280, 1440, 1728]

for (const width of RAIL_WIDTHS) {
  test(`the screenshot rail starts at the card's content edge at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/nahtadi')

    const card = page.locator('.nh-shots .nh-band')
    const rail = page.locator('.nh-rail')
    const firstShot = page.locator('.nh-rail .nh-shot').first()
    await firstShot.waitFor()

    // The card's CONTENT edge: border-box left, plus its own border and
    // padding, read from the browser rather than assumed — the inset is 42px
    // on desktop and 22px below 880, and hard-coding either would make this
    // test a copy of the stylesheet instead of a check on it.
    const contentLeft = await card.evaluate((el) => {
      const s = getComputedStyle(el)
      return (
        el.getBoundingClientRect().left +
        parseFloat(s.borderLeftWidth) +
        parseFloat(s.paddingLeft)
      )
    })

    const shotLeft = await firstShot.evaluate((el) => el.getBoundingClientRect().left)

    // Sub-pixel tolerance only: this is an alignment, not an approximation.
    expect(
      Math.abs(shotLeft - contentLeft),
      `first screenshot at x=${shotLeft}, card content edge at x=${contentLeft}`
    ).toBeLessThan(1)

    // Bug (b) leaves the rail scrolled on load rather than mis-padded, so the
    // edges could still line up if the test only ever measured after a scroll.
    // Assert the rail is genuinely at rest at its start.
    expect(await rail.evaluate((el) => el.scrollLeft), 'rail must rest at scrollLeft 0').toBe(0)
  })
}

/* ------------------------------------------------------------------------ *
 * 3. THE PAUSE CONTROL
 *
 * The button's STATE is React's and is unit-tested in
 * src/components/nahtadi/__tests__/ReviewsCarousel.test.tsx. The two
 * assertions below are the half that is CSS, and so can only be checked with
 * a stylesheet loaded:
 *
 *   - The accessible NAME flips with the icon. Both words are always in the
 *     markup and `display: none` hides one — which removes a node from the
 *     accessible name computation as well as from the page, so the name can
 *     never say "Pause" while the icon shows a play triangle. jsdom loads no
 *     stylesheet, so under vitest both words are in the name and this can only
 *     be asserted here.
 *
 *   - Under prefers-reduced-motion the control is gone ENTIRELY. Auto-advance
 *     is already off there, so a pause button would be a control for something
 *     that is not moving, and leaving it focusable would put a purposeless
 *     stop in the tab order. It is hidden in CSS rather than by conditional
 *     rendering precisely because the server renders the no-preference value:
 *     rendering it conditionally would reintroduce the hydration mismatch
 *     tests/e2e/reduced-motion-hydration.spec.ts guards on this same page.
 * ------------------------------------------------------------------------ */

test('the pause control renames itself when pressed', async ({ page }) => {
  await page.goto('/nahtadi')

  const pause = page.getByRole('button', { name: 'Pause the reviews' })
  await expect(pause).toBeVisible()
  await expect(page.getByRole('button', { name: 'Play the reviews' })).toHaveCount(0)

  await pause.click()

  await expect(page.getByRole('button', { name: 'Play the reviews' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Pause the reviews' })).toHaveCount(0)
})

test('the pause control is absent under prefers-reduced-motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/nahtadi')

  // prev/next and the dots remain — the carousel becomes manual, it does not
  // lose its controls.
  await expect(page.getByRole('button', { name: 'Next review' })).toBeVisible()
  await expect(page.locator('.nh-rv-pause')).toBeHidden()

  await context.close()
})

/* ------------------------------------------------------------------------ *
 * 4. THE CAROUSEL DOES NOT CHANGE HEIGHT
 *
 * Every review is stacked in ONE grid cell, so the container sizes to the
 * tallest permanently. The version this replaced rendered one review at a time
 * under a `min-h-[300px]` FLOOR — and the reviews run 122 to 200 characters,
 * so the taller ones pushed straight past it and everything below the carousel
 * jumped as they rotated.
 *
 * WHAT WOULD MAKE THIS FAIL: reverting to a one-at-a-time render (the slide
 * count drops to one), or taking the slides out of the shared grid cell so
 * they stack vertically and each rotation resizes the container. Both are the
 * regression; a re-introduced `min-height` would not fix either.
 * ------------------------------------------------------------------------ */

test('the reviews carousel keeps one height across every review', async ({ page }) => {
  await page.goto('/nahtadi')

  const stack = page.locator('.nh-rv-stack')
  const slides = page.locator('.nh-rv-slide')
  const count = await slides.count()
  expect(count, 'every review must be in the DOM — that is what sets the height').toBe(6)

  // All six occupy the same grid cell, so they share one top edge.
  const tops = await slides.evaluateAll((els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().top))
  )
  expect(new Set(tops).size, `slides are not stacked: tops ${tops.join(', ')}`).toBe(1)

  // Step through all six and confirm the container never resizes.
  const heights: number[] = []
  for (let i = 0; i < count; i += 1) {
    await page.locator('.nh-rv-dot').nth(i).click()
    heights.push(Math.round(await stack.evaluate((el) => el.getBoundingClientRect().height)))
  }
  expect(new Set(heights).size, `carousel resized as reviews rotated: ${heights.join(', ')}`).toBe(1)
})

/* ------------------------------------------------------------------------ *
 * 5. THE RULED DELETIONS
 *
 * Each of these was removed by a ruling, not by taste, so each gets a guard
 * that fails if it is ever restored by a well-meaning later pass:
 *
 *   - The newsletter section and its `EmailSignup` component. It was the
 *     site's ONLY runtime third-party dependency (a client-side POST to
 *     buttondown.com), and it sat one section below "Nothing leaves your
 *     device." and "Nahtadi collects nothing and transmits nothing". The
 *     claims are about the app, not the site, so it was not false — it READ as
 *     false, which on a privacy-first page is the same problem.
 *   - The @Hendaseh Instagram link, which lived inside that section. The
 *     account exists but has no content, and "Proof, not promises" governs. It
 *     returns at SITE level when it is active, not here.
 *   - "Scroll to see more →". The rail's scroll buttons are present at every
 *     width, so the sentence was redundant; and grammar v2 bans Unicode arrows
 *     outright, with the chevron reserved for internal navigation.
 * ------------------------------------------------------------------------ */

test('the newsletter, the Instagram link and the scroll hint are gone', async ({ page }) => {
  await page.goto('/nahtadi')

  await expect(page.locator('form')).toHaveCount(0)
  await expect(page.locator('input[type="email"]')).toHaveCount(0)
  await expect(page.locator('a[href*="instagram"]')).toHaveCount(0)
  await expect(page.getByText('Stay in the Loop')).toHaveCount(0)
  await expect(page.getByText(/Scroll to see more/)).toHaveCount(0)

  // The affordance the hint described is still there, at this width and every
  // other — which is why deleting the sentence cost nothing.
  await expect(page.getByRole('button', { name: 'Scroll right' })).toBeVisible()
})

test('the page makes no runtime third-party request', async ({ page }) => {
  // The claim H2 restores is that the site has NO runtime third-party
  // dependency. Cloudflare's analytics beacon is first-party infrastructure
  // for this zone and is injected sitewide, so it is not what this asserts;
  // anything else leaving the origin is.
  //
  // Matched on HOSTNAME, not against `page.url()`: the page's URL is
  // `about:blank` when the document request itself fires, so an origin
  // comparison would flag the page's own navigation.
  const offOrigin: string[] = []
  page.on('request', (request) => {
    const { hostname } = new URL(request.url())
    const isSelf = hostname === 'localhost' || hostname === '127.0.0.1'
    const isCloudflare = /(^|\.)cloudflare(insights)?\.com$/.test(hostname)
    if (!isSelf && !isCloudflare) offOrigin.push(request.url())
  })

  await page.goto('/nahtadi')
  await page.waitForLoadState('networkidle')

  expect(offOrigin, `unexpected third-party requests: ${offOrigin.join(', ')}`).toEqual([])
})
