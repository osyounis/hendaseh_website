import { test, expect, type Page } from '@playwright/test'

/**
 * Contact page (Task B4).
 *
 * Contract: docs/superpowers/mockups/contact/APPROVED.md + the v2 pair.
 *
 * The copy button is the only piece of client JavaScript on this page, and it
 * is the only thing here a screenshot cannot check: the clipboard write, the
 * label/icon/colour morph, and the 2s revert. Everything else guarded below is
 * structurally easy to break and equally invisible in a screenshot -- the three
 * channel targets, the résumé `download` filename (which must stay
 * byte-identical to Home's and About's), and the heading outline.
 *
 * BOTH THEMES. Task B6 flipped dark from `data-theme="dark"` to
 * `prefers-color-scheme`, so the theme is now set with `emulateMedia` BEFORE
 * navigation -- the page is parsed and painted under the theme, exactly as a
 * viewer whose OS is in that mode would get it.
 */

const EMAIL = 'omar@hendaseh.com'
const H1 = 'Say hello.'
const SUB = 'Email is the fastest way to reach me. Everything below works too.'
const HINT = "One tap and it's in your clipboard."
const SIGN_OFF = 'SUNNYVALE, CA · I READ EVERYTHING'

const RESUME_HREF = '/omar_younis_resume_2026.pdf'
const RESUME_DOWNLOAD = 'Omar_Younis_Resume.pdf'

type Theme = 'light' | 'dark'

/** The approved pill colours, per theme: resting `--pill-primary-bg` and the
 *  `Copied` state's `--copy-ok-bg`. */
const PILL: Record<Theme, { resting: string; copied: string }> = {
  light: { resting: 'rgb(0, 113, 227)', copied: 'rgb(32, 128, 58)' },
  dark: { resting: 'rgb(0, 147, 255)', copied: 'rgb(74, 222, 128)' },
}

/** Collapses the whitespace a JSX-formatted paragraph renders with. */
const squash = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()

/**
 * Polls rather than reads once: `.pill` transitions `background-color` over
 * 200ms, so a single read taken the instant the label flips returns the colour
 * the pill is leaving, not the one it is arriving at. (The same 200ms is why
 * the theme switch below has to settle before it can be measured.)
 */
function pillBackground(page: Page) {
  return expect
    .poll(() =>
      page
        .getByRole('button', { name: 'Copy email address' })
        .evaluate((el) => getComputedStyle(el).backgroundColor)
    )
}

async function gotoContact(page: Page, theme: Theme = 'light') {
  await page.emulateMedia({ colorScheme: theme })
  await page.goto('/contact')
  // The button is client-rendered furniture on an otherwise static page; wait
  // for hydration so a click is not swallowed.
  await expect(page.getByRole('button', { name: 'Copy email address' })).toBeEnabled()
}

test.describe('Contact', () => {
  test('renders the approved copy, with the email address as the hero', async ({ page }) => {
    await gotoContact(page)

    await expect(page.getByRole('heading', { name: H1, level: 1 })).toBeVisible()
    await expect(page.locator('.section-eyebrow')).toHaveText('CONTACT')
    expect(squash(await page.locator('.contact-sub').textContent())).toBe(SUB)
    expect(squash(await page.locator('.contact-hint').textContent())).toBe(HINT)
    expect(squash(await page.locator('.contact-sign').textContent())).toBe(SIGN_OFF)

    // The address is one string with the `@` tinted, not two runs with a gap.
    expect(squash(await page.locator('.contact-addr').textContent())).toBe(EMAIL)
  })

  test('the address is a mailto: link that keeps its display treatment', async ({ page }) => {
    await gotoContact(page)

    const addr = page.locator('a.contact-addr')
    await expect(addr).toHaveAttribute('href', 'mailto:omar@hendaseh.com')

    // The glyph exemption (contact/APPROVED.md, amended 2026-08-28): grammar
    // v2 governs links and pills, not display type. Also guarded from the
    // grammar's own side in tests/e2e/link-affordance.spec.ts.
    await expect(addr.locator('svg')).toHaveCount(0)

    // No default link dress: body-coloured, and no underline at rest. The
    // underline exists but is transparent until hover, so that it can fade in
    // without shifting the line.
    const rest = await addr.evaluate((el) => {
      const cs = getComputedStyle(el)
      return { color: cs.color, decorationColor: cs.textDecorationColor }
    })
    expect(rest.color).toBe(
      await page.locator('.contact-title').evaluate((el) => getComputedStyle(el).color)
    )
    expect(rest.decorationColor).toBe('rgba(0, 0, 0, 0)')

    // Copy is RETAINED beside it, not replaced by it, and is its own control
    // rather than something nested inside the link.
    await expect(page.getByRole('button', { name: 'Copy email address' })).toBeVisible()
    expect(await addr.locator('button').count()).toBe(0)
  })

  test('the address is keyboard reachable and shows the sitewide focus ring', async ({ page }) => {
    await gotoContact(page)

    // The REAL tab order, not `.focus()`: a programmatic focus proves only
    // that an element can hold focus, and never matches `:focus-visible`,
    // which is where the ring actually comes from.
    let hit = null
    for (let i = 0; i < 20 && hit === null; i++) {
      await page.keyboard.press('Tab')
      hit = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || !el.classList.contains('contact-addr')) return null
        const cs = getComputedStyle(el)
        return {
          focusVisible: el.matches(':focus-visible'),
          outlineWidth: parseFloat(cs.outlineWidth),
          outlineStyle: cs.outlineStyle,
        }
      })
    }

    expect(hit, 'the address was never reached by tabbing').not.toBeNull()
    expect(hit!.focusVisible).toBe(true)
    expect(hit!.outlineWidth).toBeGreaterThan(0)
    expect(hit!.outlineStyle).not.toBe('none')
  })

  test('the three channel cards are shared tiles pointing at the right places', async ({
    page,
  }) => {
    await gotoContact(page)

    const cards = page.locator('.contact-card')
    await expect(cards).toHaveCount(3)

    // Hover, focus ring and `:active` press are SHARED code (`.home-tile` in
    // shared.css), never re-implemented per page -- and the press response
    // comes from `a.home-tile:active`, so each card has to BE the link.
    expect(
      await cards.evaluateAll((els) =>
        els.map((el) => ({ tag: el.tagName, tile: el.classList.contains('home-tile') }))
      )
    ).toEqual([
      { tag: 'A', tile: true },
      { tag: 'A', tile: true },
      { tag: 'A', tile: true },
    ])

    const linkedin = cards.nth(0)
    await expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/omar-younis/')
    await expect(linkedin).toHaveAttribute('target', '_blank')
    expect(await linkedin.getAttribute('rel')).toContain('noopener')

    const github = cards.nth(1)
    await expect(github).toHaveAttribute('href', 'https://github.com/osyounis')
    await expect(github).toHaveAttribute('target', '_blank')
    expect(await github.getAttribute('rel')).toContain('noopener')

    // The résumé downloads in place: no new tab, and the filename is the
    // sitewide one (identical to HomeHero, AboutHero and AboutCTA).
    const resume = cards.nth(2)
    await expect(resume).toHaveAttribute('href', RESUME_HREF)
    await expect(resume).toHaveAttribute('download', RESUME_DOWNLOAD)
    await expect(resume).not.toHaveAttribute('target', '_blank')
  })

  test('each card carries the grammar-v2 glyph for what it actually does', async ({ page }) => {
    await gotoContact(page)

    // arrow-up-right on the two externals, arrow-down-in-circle on the
    // download. Both are `aria-hidden` and welded to the label's last word.
    const expected: [string, string][] = [
      ['LinkedIn', 'link-glyph-arrow'],
      ['GitHub', 'link-glyph-arrow'],
      ['Résumé', 'link-glyph-circle'],
    ]

    for (const [label, sizeClass] of expected) {
      const glyph = page.locator('.contact-card', { hasText: label }).locator('svg.link-glyph')
      await expect(glyph).toHaveCount(1)

      const read = await glyph.evaluate((svg) => {
        const parent = svg.parentElement!
        return {
          ariaHidden: svg.getAttribute('aria-hidden'),
          classes: svg.getAttribute('class'),
          parentNowrap: getComputedStyle(parent).whiteSpace,
          parentHasSpace: (parent.textContent ?? '').includes(' '),
        }
      })

      expect(read.ariaHidden).toBe('true')
      expect(read.classes).toContain(sizeClass)
      expect(read.parentNowrap).toBe('nowrap')
      expect(read.parentHasSpace).toBe(false)
    }

    // The visual arrow says nothing to a screen reader, so both externals also
    // carry the shared "(opens in a new tab)" hint.
    const hints = page.locator('.contact-card .sr-only')
    await expect(hints).toHaveCount(2)
  })

  test('the heading outline is a single h1 and nothing below it', async ({ page }) => {
    await gotoContact(page)

    const levels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((els) =>
        els.map((el) => ({ level: Number(el.tagName[1]), text: el.textContent?.trim() ?? '' }))
      )

    // The eyebrow is not a heading and the card labels are not headings: this
    // page is one statement plus a list of links.
    expect(levels).toEqual([{ level: 1, text: H1 }])

    // The card list still has to be announceable as a group.
    await expect(page.locator('.contact-grid')).toHaveAttribute('aria-label', /reach/i)
  })

  for (const theme of ['light', 'dark'] as Theme[]) {
    test.describe(`${theme} theme`, () => {
      // The morph is a 350ms blur-swap and the revert is a 2s timer; this block
      // is about that state machine, so pin the motion preference rather than
      // inheriting the host's Reduce Motion setting.
      test.use({ contextOptions: { reducedMotion: 'no-preference' } })

      test('Copy writes the address to the clipboard and morphs, then reverts', async ({
        page,
        context,
      }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write'])
        await gotoContact(page, theme)

        const button = page.getByRole('button', { name: 'Copy email address' })
        const label = page.locator('.contact-copy-label')
        const status = page.locator('.contact-copy-status')

        await expect(label).toHaveText('Copy')
        await expect(status).toHaveText('')
        await pillBackground(page).toBe(PILL[theme].resting)

        await button.click()

        // The real clipboard, not a stubbed one.
        expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL)

        await expect(label).toHaveText('Copied')
        await pillBackground(page).toBe(PILL[theme].copied)
        // The accessible name is stable (the contract pins `aria-label="Copy
        // email address"`), so the state change is announced by a live region
        // instead of by a renamed button.
        await expect(status).toHaveText(/copied/i)
        await expect(button).toHaveAttribute('aria-label', 'Copy email address')

        // ...and reverts on its own after 2s.
        await expect(label).toHaveText('Copy', { timeout: 4000 })
        await expect(status).toHaveText('')
        await pillBackground(page).toBe(PILL[theme].resting)
      })

      test('the page renders on its own ground with AA-legible quiet text', async ({ page }) => {
        await gotoContact(page, theme)

        // Guards the token wiring rather than a hex: the sky, the tinted `@`
        // and the quiet lines must all resolve to a real value in this theme,
        // and the quiet lines must not silently fall back to the body colour.
        const read = await page.evaluate(() => {
          const cs = (sel: string, prop: string) =>
            getComputedStyle(document.querySelector(sel)!).getPropertyValue(prop)
          return {
            sky: cs('.contact-sky', 'background-image') + cs('.contact-sky', 'background-color'),
            at: cs('.contact-at', 'color'),
            addr: cs('.contact-addr', 'color'),
            hint: cs('.contact-hint', 'color'),
            body: cs('body', 'color'),
            // The eyebrow is `--accent` unmodified, so it is the theme's own
            // accent value without this test hardcoding two hexes.
            accent: cs('.contact-eyebrow', 'color'),
            strong: cs('.contact-title', 'color'),
          }
        })

        expect(read.sky).not.toBe('nonergba(0, 0, 0, 0)')
        expect(read.hint).not.toBe(read.body)

        // The address is a link now, and the treatment has to survive that in
        // BOTH themes: the `@` keeps the accent, the rest of the address stays
        // the heading colour, and the two are never the same value.
        expect(read.at).toBe(read.accent)
        expect(read.addr).toBe(read.strong)
        expect(read.at).not.toBe(read.addr)
      })
    })
  }

  test('under prefers-reduced-motion the entrance is a correct static frame', async ({
    browser,
  }) => {
    // An explicit context, not test.use() -- see the header of
    // tests/e2e/reduced-motion-hydration.spec.ts for why.
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/contact')

    expect(
      await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ).toBe(true)
    await page.waitForFunction(() => document.readyState === 'complete')

    const frames = await page.locator('.contact-enter').evaluateAll((els) =>
      els.map((el) => {
        const cs = getComputedStyle(el)
        return {
          label: el.className,
          animationName: cs.animationName,
          opacity: cs.opacity,
          translate: cs.translate,
        }
      })
    )

    expect(frames.length, 'nothing carries the entrance -- the assertions below are vacuous')
      .toBeGreaterThanOrEqual(6)
    for (const f of frames) {
      expect(f.animationName, `${f.label} is still animating under reduced motion`).toBe('none')
      expect(f.opacity, `${f.label} rests hidden under reduced motion`).toBe('1')
      expect(['none', '0px'], `${f.label} rests offset under reduced motion`).toContain(f.translate)
    }

    // The aurora is parked, not left drifting behind the copy.
    expect(
      await page.locator('.home-aurora').evaluate((el) => getComputedStyle(el).animationName)
    ).toBe('none')

    await context.close()
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('every channel is still reachable and the entrance rests visible', async ({ page }) => {
      await page.goto('/contact')

      await expect(page.getByRole('heading', { name: H1, level: 1 })).toBeVisible()
      await expect(page.locator('.contact-card')).toHaveCount(3)

      // The entrance is a pure CSS animation, so it runs and SETTLES with no
      // JavaScript at all -- the point being that nothing here is gated on a
      // script that never arrives. Polled because the last step of the cascade
      // starts 0.6s in; a single read taken on `load` would catch the first
      // frame, where every element is legitimately still at opacity 0.
      await expect
        .poll(
          () =>
            page
              .locator('.contact-enter')
              .evaluateAll(
                (els) => els.filter((el) => getComputedStyle(el).opacity === '0').length
              ),
          { message: 'the entrance cascade never settles without JavaScript' }
        )
        .toBe(0)

      // The copy button is the page's only JavaScript. It renders, and it does
      // nothing without a clipboard -- it must never be the only route to the
      // address, which is why the address itself is on the page as text.
      await expect(page.locator('.contact-addr')).toHaveText(EMAIL)
    })
  })
})
