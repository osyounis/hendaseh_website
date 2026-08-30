import { test, expect, type Page } from '@playwright/test'

/**
 * About page (Task B3).
 *
 * The copy on this page went through a workshop with Omar and is locked
 * word-for-word, so the two strings a reader meets first are pinned here. The
 * rest of this file guards the three things that are structurally easy to break
 * and invisible in a screenshot: the resume link's `download` filename, the
 * heading outline, and the reveal's resting state.
 */

const H1 = 'I build software people rely on.'

// The locked lede, with its bold runs flattened the way `textContent` reads
// them. A reworded sentence, a dropped fact, or a stray em dash all fail here.
const LEDE =
  "I'm Omar Younis, a software engineer in Sunnyvale, California. I've shipped an iOS app to " +
  "the App Store, written the first CUDA implementation of Brent's method, put ML models into " +
  'production, and built software the Coast Guard runs at every air station. Before that, I ' +
  "spent seven years as a mechanical engineer. Now I'm pointed at AI and autonomous systems."

const RESUME_HREF = '/omar_younis_resume_2026.pdf'
const RESUME_DOWNLOAD = 'Omar_Younis_Resume.pdf'

/** Collapses the whitespace a JSX-formatted paragraph renders with. */
const squash = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()

/**
 * Reads the resting state of every `[data-reveal]` block: EFFECTIVE opacity
 * (the element's own multiplied by every ancestor's, because a block can be
 * `opacity: 1` inside a zeroed wrapper) and its vertical offset.
 *
 * The offset is read from BOTH `translate` and `transform`. The reveal rides on
 * `translate` (see the header comment in src/app/styles/shared.css: About's
 * cards hover on `transform`, and one property cannot carry both), so a
 * transform-only reading would be silently vacuous here.
 */
async function measureRevealBlocks(page: Page) {
  return page.locator('[data-reveal]').evaluateAll((els) =>
    els.map((el) => {
      let effectiveOpacity = 1
      for (
        let node: Element | null = el;
        node && node !== document.documentElement;
        node = node.parentElement
      ) {
        effectiveOpacity *= parseFloat(getComputedStyle(node).opacity)
      }
      const cs = getComputedStyle(el)
      // `matrix(a, b, c, d, tx, ty)` -- ty is the last component.
      const fromTransform =
        cs.transform === 'none' ? 0 : parseFloat(cs.transform.split(',').pop() ?? '0')
      // `none` | `<x>` | `<x> <y>`; a single value means y is 0.
      const fromTranslate =
        cs.translate === 'none' ? 0 : parseFloat(cs.translate.split(/\s+/)[1] ?? '0')
      return {
        label:
          el.querySelector('h2, h3')?.textContent?.trim() ||
          el.className ||
          el.tagName.toLowerCase(),
        state: el.getAttribute('data-reveal'),
        effectiveOpacity,
        offsetY: fromTransform + fromTranslate,
      }
    })
  )
}

test.describe('About', () => {
  test('the hero renders the locked headline and lede verbatim', async ({ page }) => {
    await page.goto('/about')

    await expect(page.getByRole('heading', { name: H1, level: 1 })).toBeVisible()

    const lede = page.locator('.about-intro')
    await expect(lede).toBeVisible()
    expect(squash(await lede.textContent())).toBe(LEDE)

    // Both Coast Guard roles are unpaid. The badge is mandatory, not decorative.
    await expect(page.getByText('VOLUNTEER', { exact: true })).toBeVisible()
  })

  test('every resume link carries the exact href and download filename', async ({ page }) => {
    await page.goto('/about')

    const links = page.getByRole('link', { name: 'Résumé (PDF)' })
    // Hero and closing card. If the page ever renders none, the loop below
    // would pass vacuously.
    await expect(links).toHaveCount(2)

    const count = await links.count()
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toHaveAttribute('href', RESUME_HREF)
      await expect(links.nth(i)).toHaveAttribute('download', RESUME_DOWNLOAD)
    }
  })

  test('the heading outline has one h1 and skips no level', async ({ page }) => {
    await page.goto('/about')

    const levels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((els) =>
        els.map((el) => ({ level: Number(el.tagName[1]), text: el.textContent?.trim() ?? '' }))
      )

    expect(levels.length, 'no headings found -- the assertions below would be vacuous')
      .toBeGreaterThan(5)
    expect(levels.filter((h) => h.level === 1).map((h) => h.text)).toEqual([H1])

    for (let i = 1; i < levels.length; i++) {
      expect(
        levels[i].level,
        `heading order jumps from h${levels[i - 1].level} ("${levels[i - 1].text}") to ` +
          `h${levels[i].level} ("${levels[i].text}")`
      ).toBeLessThanOrEqual(levels[i - 1].level + 1)
    }
  })

  test('both hero CTAs carry an aria-hidden affordance glyph welded to their last word', async ({
    page,
  }) => {
    await page.goto('/about')

    // Grammar v2: a download takes arrow-down-in-circle, internal navigation
    // takes chevron-right. The mockup drew neither; the sitewide law wins.
    const expected: [string, string][] = [
      ['Résumé (PDF)', 'link-glyph-circle'],
      ['Get in touch', 'link-glyph-chevron'],
    ]

    for (const [label, sizeClass] of expected) {
      const link = page.locator('.about-ctas a', { hasText: label })
      await expect(link).toHaveCount(1)

      const glyph = await link.locator('svg.link-glyph').evaluate((svg) => {
        const parent = svg.parentElement!
        return {
          ariaHidden: svg.getAttribute('aria-hidden'),
          classes: svg.getAttribute('class'),
          // The glyph's only sibling inside the nowrap span is the label's
          // LAST word -- that span is what stops it orphan-wrapping.
          parentNowrap: getComputedStyle(parent).whiteSpace,
          parentHasSpace: (parent.textContent ?? '').includes(' '),
        }
      })

      expect(glyph.ariaHidden).toBe('true')
      expect(glyph.classes).toContain(sizeClass)
      expect(glyph.parentNowrap).toBe('nowrap')
      expect(glyph.parentHasSpace).toBe(false)
    }

    await expect(page.locator('.about-ctas a', { hasText: 'Get in touch' })).toHaveAttribute(
      'href',
      '/contact'
    )
  })

  test('cards are non-interactive shared tiles; all four pills are keyboard-reachable', async ({
    page,
  }) => {
    await page.goto('/about')

    // Card hover/focus is shared code (`.home-tile`), never re-implemented per
    // page. Six career highlights plus four quiet cards.
    const cards = page.locator('.about-card')
    await expect(cards).toHaveCount(10)
    expect(await cards.evaluateAll((els) => els.every((el) => el.classList.contains('home-tile'))))
      .toBe(true)

    // Every card here is a NON-INTERACTIVE `<article>`: this page's actions
    // live in its pills, not in its cards. Asserted as a count and a tag list,
    // not as a loop over a set that is currently empty -- if a card ever
    // becomes a link, this goes red and whoever made that change has to extend
    // the keyboard walk below to cover it.
    await expect(
      page.locator('a.about-card, .about-card a'),
      'a card became interactive -- extend the keyboard-order assertion below'
    ).toHaveCount(0)
    expect(await cards.evaluateAll((els) => els.map((el) => el.tagName))).toEqual(
      new Array(10).fill('ARTICLE')
    )

    // The four pills are the page's whole interactive surface. Walk the REAL
    // tab order rather than calling .focus(): that covers keyboard
    // REACHABILITY and the visible focus ring, where a programmatic focus
    // proves only that an element can hold focus at all and never matches
    // `:focus-visible`, which is where the ring actually comes from.
    const seen: string[] = []
    for (let i = 0; i < 60 && seen.length < 4; i++) {
      await page.keyboard.press('Tab')
      const hit = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || !el.classList.contains('pill')) return null
        const cs = getComputedStyle(el)
        return {
          label: el.textContent?.trim() ?? '',
          focusVisible: el.matches(':focus-visible'),
          outlineWidth: parseFloat(cs.outlineWidth),
          outlineStyle: cs.outlineStyle,
        }
      })
      if (!hit) continue
      expect(hit.focusVisible, `"${hit.label}" does not match :focus-visible when tabbed to`)
        .toBe(true)
      expect(hit.outlineWidth, `"${hit.label}" has no visible focus ring`).toBeGreaterThan(0)
      expect(hit.outlineStyle, `"${hit.label}" has no visible focus ring`).not.toBe('none')
      seen.push(hit.label)
    }

    expect(seen).toEqual([
      'Résumé (PDF)',
      'Get in touch',
      'Résumé (PDF)',
      'Get in touch',
    ])
  })

  test.describe('with no OS motion preference', () => {
    // Scoped so this is deterministic regardless of the host's Reduce Motion
    // setting -- see the same note in tests/e2e/homepage.spec.ts.
    test.use({ contextOptions: { reducedMotion: 'no-preference' } })

    test('a below-the-fold section reveals once it is scrolled to', async ({ page }) => {
      await page.goto('/about')

      // page.goto() resolves on `load`, which can precede hydration. Anchor on
      // the armed state: `data-reveal` only ever leaves "" once ScrollReveal's
      // effect has mounted and started observing a below-the-fold block.
      await page.waitForFunction(
        () => document.querySelector('[data-reveal="pending"], [data-reveal="in"]') !== null
      )

      // Guard the guard: something must actually be hidden right now, or the
      // assertion after scrolling proves nothing.
      const armed = await measureRevealBlocks(page)
      expect(
        armed.filter((b) => b.effectiveOpacity === 0).length,
        'expected at least one block hidden pre-scroll -- otherwise no real reveal is exercised'
      ).toBeGreaterThan(0)

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

      // Poll on the real end condition rather than sleeping through the 600ms
      // transition plus its per-card stagger.
      await expect
        .poll(
          async () => (await measureRevealBlocks(page)).filter((b) => b.effectiveOpacity === 0),
          { message: 'blocks still hidden after scrolling to the bottom of /about' }
        )
        .toEqual([])

      const settled = await measureRevealBlocks(page)
      expect(settled.length).toBeGreaterThanOrEqual(10)
      expect(settled.every((b) => b.state === 'in' || b.state === '')).toBe(true)
    })

    /*
     * `transition` is one shorthand and a revealed card needs two motions from
     * it: the 600ms reveal and `.home-tile`'s 280ms hover. The reveal rule
     * replaced the tile's list wholesale until `.home-tile[data-reveal="in"]`
     * was added to shared.css -- a revealed card's hover snapped, with nothing
     * else in the suite noticing. This pins both lists on one element.
     */
    test('a revealed card keeps the shared tile hover as well as its reveal', async ({ page }) => {
      await page.goto('/about')
      const card = page.locator('.about-highlights .about-card').first()

      // Same anchor as the test above: scrolling before ScrollReveal's effect
      // mounts leaves every block above the fold, so nothing is ever armed and
      // the card never reaches "in".
      await expect.poll(() => card.getAttribute('data-reveal')).toBe('pending')

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await expect.poll(() => card.getAttribute('data-reveal')).toBe('in')

      const motion = await card.evaluate((el) => {
        const cs = getComputedStyle(el)
        return {
          properties: cs.transitionProperty.split(',').map((p) => p.trim()),
          durations: cs.transitionDuration.split(',').map((d) => parseFloat(d)),
        }
      })

      // The reveal's two properties first, then the tile's three.
      expect(motion.properties).toEqual([
        'opacity',
        'translate',
        'transform',
        'border-color',
        'box-shadow',
      ])
      expect(motion.durations).toEqual([0.6, 0.6, 0.28, 0.28, 0.28])

      // The hover really does lift, and the reveal has settled to 0 rather
      // than being overwritten by it -- the whole reason the reveal rides on
      // `translate` and the hover on `transform`.
      await card.hover()
      await expect
        .poll(() => card.evaluate((el) => getComputedStyle(el).transform))
        .toBe('matrix(1, 0, 0, 1, 0, -6)')
      expect(await card.evaluate((el) => getComputedStyle(el).translate)).toBe('0px')
    })
  })

  test('under prefers-reduced-motion nothing is ever armed and every block rests visible', async ({
    browser,
  }) => {
    // An explicit context, not test.use() -- see the header of
    // tests/e2e/reduced-motion-hydration.spec.ts for why.
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/about')

    expect(
      await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ).toBe(true)

    // Let hydration finish, so this is not passing simply because ScrollReveal
    // has not mounted yet.
    await page.waitForFunction(() => document.readyState === 'complete')
    await expect(page.locator('.about-cta')).toBeVisible()

    const blocks = await measureRevealBlocks(page)
    expect(blocks.length).toBeGreaterThanOrEqual(10)

    expect(
      blocks.filter((b) => b.state === 'pending' || b.state === 'in').map((b) => b.label),
      'ScrollReveal armed a block under reduced motion'
    ).toEqual([])
    expect(blocks.filter((b) => b.effectiveOpacity !== 1).map((b) => b.label)).toEqual([])
    expect(blocks.filter((b) => b.offsetY !== 0).map((b) => b.label)).toEqual([])

    // The hero's entrance and the timeline blip must resolve to a correct
    // static frame, not a paused mid-animation one.
    const statics = await page.evaluate(() => {
      const read = (sel: string) => {
        const el = document.querySelector(sel)
        if (!el) return { animationName: 'MISSING', opacity: '', transform: '', scale: '' }
        const cs = getComputedStyle(el)
        return {
          animationName: cs.animationName,
          opacity: cs.opacity,
          transform: cs.transform,
          scale: cs.scale,
        }
      }
      const ring = getComputedStyle(document.querySelector('.about-dot')!, '::after')
      return {
        title: read('.about-hero-title'),
        photo: read('.about-pic'),
        dot: read('.about-dot'),
        ringAnimation: ring.animationName,
        ringOpacity: ring.opacity,
      }
    })

    // Chrome serialises an element's own `transform: none` as the identity
    // matrix and an absent transform as the string 'none'. Both mean "no
    // offset", which is the thing being asserted, so both are accepted --
    // the same way homepage.spec.ts accepts 'none' or '1' for `scale`.
    const IDENTITY = ['none', 'matrix(1, 0, 0, 1, 0, 0)']

    for (const [name, el] of Object.entries({
      title: statics.title,
      photo: statics.photo,
      dot: statics.dot,
    })) {
      expect(el.animationName, `${name} is still animating under reduced motion`).toBe('none')
      expect(el.opacity, `${name} rests hidden under reduced motion`).toBe('1')
      expect(IDENTITY, `${name} rests offset under reduced motion`).toContain(el.transform)
      expect(['none', '1'], `${name} rests scaled under reduced motion`).toContain(el.scale)
    }

    // The blip ring is removed rather than parked: a frozen ring would sit on
    // screen as a permanent halo the design never draws.
    expect(statics.ringAnimation).toBe('none')
    expect(statics.ringOpacity).toBe('0')

    await context.close()
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('every block renders visible, unshifted, and with its timeline node drawn', async ({
      page,
    }) => {
      await page.goto('/about')

      const blocks = await measureRevealBlocks(page)
      // Guard the guard: three chapters, three section headers, ten cards, one
      // closing card.
      expect(blocks.length).toBeGreaterThanOrEqual(10)

      const hidden = blocks.filter((b) => b.effectiveOpacity === 0)
      expect(hidden, `invisible without JavaScript: ${hidden.map((b) => b.label).join(', ')}`)
        .toEqual([])

      const shifted = blocks.filter((b) => b.offsetY !== 0)
      expect(
        shifted,
        `offset without JavaScript: ${shifted.map((b) => `${b.label} (${b.offsetY}px)`).join(', ')}`
      ).toEqual([])

      // The timeline dots key off the reveal state, so they are the one part of
      // this page that could be gated on JavaScript without the block above
      // noticing.
      const dots = await page
        .locator('.about-dot')
        .evaluateAll((els) =>
          els.map((el) => {
            const cs = getComputedStyle(el)
            return { opacity: cs.opacity, scale: cs.scale }
          })
        )
      expect(dots).toHaveLength(3)
      for (const dot of dots) {
        expect(dot.opacity).toBe('1')
        expect(['none', '1']).toContain(dot.scale)
      }

      await expect(page.getByRole('heading', { name: H1, level: 1 })).toBeVisible()
    })
  })
})
