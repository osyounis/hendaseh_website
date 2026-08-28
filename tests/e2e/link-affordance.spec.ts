import { test, expect } from '@playwright/test'

/**
 * Link-affordance grammar v2 (docs/superpowers/mockups/contact/APPROVED.md).
 *
 * The regression this guards is a text arrow creeping back into a link label.
 * The contract bans them for concrete reasons -- iOS renders U+2197 as a
 * colour emoji, every font draws them at a different length, and being real
 * text they orphan-wrap onto a line of their own -- and none of those failures
 * shows up in any other assertion in the suite. `→` and `↓` are also announced
 * verbatim by screen readers, so this is an accessibility guard too.
 *
 * `←` IS now in the banned set. Grammar v2 originally named four glyphs and
 * none of them was a left arrow, so the case-study breadcrumbs kept a literal
 * `← All projects`. Grammar v2 has since gained a fifth glyph -- a drawn
 * chevron-left, Apple's own back affordance -- and both breadcrumbs plus
 * `/nahtadi/support`'s back link now use it, so no Unicode arrow of any
 * direction is left in a link label anywhere on the site.
 */

const PAGES = [
  '/',
  '/projects',
  '/projects/brent-cuda',
  '/projects/collision-avoidance-radar',
  '/nahtadi',
  '/nahtadi/support',
]

const BANNED = ['→', '↗', '↓', '←'] // → ↗ ↓ ←

for (const path of PAGES) {
  test(`no Unicode arrow survives in a link label on ${path}`, async ({ page }) => {
    await page.goto(path)

    const offenders = await page.evaluate((banned) => {
      const bad: string[] = []
      for (const a of Array.from(document.querySelectorAll('a'))) {
        const text = a.textContent ?? ''
        if (banned.some((ch) => text.includes(ch))) bad.push(text.trim())
      }
      return bad
    }, BANNED)

    expect(offenders).toEqual([])
  })
}

/**
 * Sizes are PER GLYPH, not one shared value -- Apple sizes these by role and
 * apple.com measures out at three distinct steps. A single shared height is
 * the exact defect this replaced: at chevron height a circle-enclosed mark
 * spends its whole size budget on the ring and its interior arrow collapses.
 *
 * These are BOX heights, and the box is a derived number, not the target. The
 * target is INK -- 0.533em / 0.599em / 1.009em, measured off apple.com as a
 * ratio of cap height. Because every viewBox carries one stroke-width of
 * anti-clip padding on each side, ink is a fixed fraction of the box
 * (11.8/15.8, 13.3/17.3, 17.8/21), and these three heights are what that
 * fraction demands. Change a viewBox and these have to be re-derived.
 *
 * These are deliberately tight (+/- 0.01em, i.e. +/- 0.15px at 15px text).
 * A loose range would pass for the uniform sizing that was wrong.
 */
const EM_HEIGHT: Record<string, number> = {
  'link-glyph-chevron': 0.714,
  'link-glyph-arrow': 0.78,
  'link-glyph-circle': 1.19,
}

test('every affordance glyph is a hidden inline SVG welded to the last word', async ({ page }) => {
  await page.goto('/')

  const glyphs = page.locator('svg.link-glyph')
  await expect(glyphs.first()).toBeAttached()

  const report = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('svg.link-glyph')).map((svg) => {
      const parent = svg.parentElement!
      const fontSize = parseFloat(getComputedStyle(parent).fontSize)
      return {
        ariaHidden: svg.getAttribute('aria-hidden'),
        // The glyph's only sibling content inside the nowrap span is the
        // label's LAST word -- that span is what stops it orphan-wrapping.
        parentNowrap: getComputedStyle(parent).whiteSpace,
        parentHasSpace: (parent.textContent ?? '').includes(' '),
        sizeClass: ['link-glyph-chevron', 'link-glyph-arrow', 'link-glyph-circle'].find((c) =>
          svg.classList.contains(c)
        ),
        emHeight: svg.getBoundingClientRect().height / fontSize,
      }
    })
  })

  expect(report.length).toBeGreaterThan(0)
  // All three size roles must actually be exercised on Home, or the per-glyph
  // assertion below would be vacuous for the ones that are missing.
  expect(new Set(report.map((g) => g.sizeClass))).toEqual(
    new Set(['link-glyph-chevron', 'link-glyph-arrow', 'link-glyph-circle'])
  )

  for (const g of report) {
    expect(g.ariaHidden).toBe('true')
    expect(g.parentNowrap).toBe('nowrap')
    expect(g.parentHasSpace).toBe(false)
    expect(g.sizeClass, 'every glyph carries exactly one size class').toBeDefined()
    expect(g.emHeight).toBeCloseTo(EM_HEIGHT[g.sizeClass!], 2)
  }
})

/**
 * Every glyph's ink -- the drawn coordinate plus half a stroke-width, because
 * round caps and joins are discs of radius sw/2 -- must clear the viewBox edge
 * by at least one full stroke-width. SVG's default `overflow: hidden` clips
 * anything past the edge, and the circle glyphs previously sat 0.15 user units
 * (0.1 device px) from it, which antialiasing made visible.
 *
 * This is arithmetic, so it is asserted as arithmetic rather than by eye: a
 * glyph that merely looks unclipped at 15px will still clip at 24px.
 */
test('no glyph draws closer to its viewBox edge than one stroke-width', async ({ page }) => {
  const seen = new Set<string>()

  for (const path of ['/', '/projects/collision-avoidance-radar', '/nahtadi/support']) {
    await page.goto(path)

    const measured = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('svg.link-glyph')).map((svg) => {
        const [, , vbW, vbH] = svg.getAttribute('viewBox')!.split(/[\s,]+/).map(Number)
        const sw = parseFloat(svg.getAttribute('stroke-width')!)
        let minX = Infinity
        let maxX = -Infinity
        let minY = Infinity
        let maxY = -Infinity
        for (const child of Array.from(svg.children)) {
          // Geometry box only -- the stroke is added back below so the
          // half-stroke term is explicit rather than implied by the browser.
          const bb = (child as SVGGraphicsElement).getBBox()
          minX = Math.min(minX, bb.x)
          maxX = Math.max(maxX, bb.x + bb.width)
          minY = Math.min(minY, bb.y)
          maxY = Math.max(maxY, bb.y + bb.height)
        }
        const clearance = Math.min(
          minX - sw / 2,
          vbW - (maxX + sw / 2),
          minY - sw / 2,
          vbH - (maxY + sw / 2)
        )
        return { id: svg.getAttribute('class')!, sw, clearanceInStrokeWidths: clearance / sw }
      })
    })

    expect(measured.length).toBeGreaterThan(0)
    for (const g of measured) {
      seen.add(g.id)
      expect(
        g.clearanceInStrokeWidths,
        `${g.id} clears its viewBox by ${g.clearanceInStrokeWidths.toFixed(3)} stroke-widths`
      ).toBeGreaterThanOrEqual(0.999)
    }
  }

  // Every drawn form must have been measured, not just the ones Home happens
  // to render.
  expect(seen).toEqual(
    new Set([
      'link-glyph link-glyph-chevron',
      'link-glyph link-glyph-arrow',
      'link-glyph link-glyph-circle',
      'link-glyph link-glyph-chevron link-glyph-leading',
    ])
  )
})

test('a glyph stays with its last word when the label wraps', async ({ page }) => {
  // 320px forces the compact work tiles' titles onto two lines; the glyph must
  // ride down with the final word rather than taking a line of its own.
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/')

  const wrapped = await page.evaluate(() => {
    const svg = Array.from(document.querySelectorAll('h3 svg.link-glyph')).find((s) => {
      // A block box always reports one client rect, so line count has to come
      // from the box height against its own line-height.
      const h = s.closest('h3')!
      const lh = parseFloat(getComputedStyle(h).lineHeight)
      return h.getBoundingClientRect().height > lh * 1.5
    })
    if (!svg) return null
    const nowrap = svg.parentElement!
    return {
      label: svg.closest('h3')!.textContent!.trim(),
      // One rect means the last word and the glyph share a single line box --
      // the glyph did not orphan onto a line of its own.
      nowrapRects: nowrap.getClientRects().length,
      wordsInNowrap: nowrap.textContent!.trim().split(/\s+/).length,
      sameLine:
        Math.abs(svg.getBoundingClientRect().bottom - nowrap.getBoundingClientRect().bottom) < 6,
    }
  })

  expect(wrapped, 'expected at least one work-tile title to wrap at 320px').not.toBeNull()
  expect(wrapped!.nowrapRects).toBe(1)
  expect(wrapped!.wordsInNowrap).toBe(1)
  expect(wrapped!.sameLine).toBe(true)
})

/**
 * The mirror of the rule above for the one LEADING glyph. A back chevron sits
 * BEFORE its label, so the word it must never be separated from is the FIRST
 * one -- welding it to the last word would let it orphan onto a line ABOVE its
 * own label. At 320px the case-study bottom nav is narrow enough that
 * `All projects` breaks across two lines, which is the case that proves it.
 */
test('the leading back chevron stays with its FIRST word when the label wraps', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/projects/brent-cuda')

  const measured = await page.evaluate(() => {
    const svg = Array.from(document.querySelectorAll('svg.link-glyph-leading')).find((s) => {
      const link = s.closest('a')!
      const lh = parseFloat(getComputedStyle(link).lineHeight)
      return link.getBoundingClientRect().height > lh * 1.5
    })
    if (!svg) return null
    const link = svg.closest('a')!
    const nowrap = svg.parentElement!
    const lh = parseFloat(getComputedStyle(link).lineHeight)
    return {
      label: link.textContent!.trim(),
      // The nowrap span holds the glyph and exactly one word: the FIRST.
      nowrapText: nowrap.textContent!.trim(),
      nowrapRects: nowrap.getClientRects().length,
      firstWord: link.textContent!.trim().split(/\s+/)[0],
      // The glyph rides on the FIRST line of the wrapped label, not a line of
      // its own above it and not down with the tail.
      onFirstLine:
        Math.abs(svg.getBoundingClientRect().top - link.getBoundingClientRect().top) < lh,
      glyphIsFirstChild: nowrap.firstElementChild === svg,
    }
  })

  expect(measured, 'expected a leading glyph whose label wraps at 320px').not.toBeNull()
  expect(measured!.nowrapRects).toBe(1)
  expect(measured!.nowrapText).toBe(measured!.firstWord)
  expect(measured!.onFirstLine).toBe(true)
  expect(measured!.glyphIsFirstChild).toBe(true)
})
