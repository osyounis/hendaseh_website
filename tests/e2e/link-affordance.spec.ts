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
 * `←` is deliberately NOT in the banned set. Grammar v2 names exactly four
 * glyphs and none of them is a left arrow, and the Projects contract specifies
 * the case-study breadcrumb string `← All projects` verbatim. Those two
 * breadcrumbs are the one place a Unicode arrow legitimately survives.
 */

const PAGES = [
  '/',
  '/projects',
  '/projects/brent-cuda',
  '/projects/collision-avoidance-radar',
  '/nahtadi',
]

const BANNED = ['→', '↗', '↓'] // → ↗ ↓

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
        emHeight: svg.getBoundingClientRect().height / fontSize,
      }
    })
  })

  expect(report.length).toBeGreaterThan(0)
  for (const g of report) {
    expect(g.ariaHidden).toBe('true')
    expect(g.parentNowrap).toBe('nowrap')
    expect(g.parentHasSpace).toBe(false)
    expect(g.emHeight).toBeGreaterThan(0.6)
    expect(g.emHeight).toBeLessThan(0.7)
  }
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
