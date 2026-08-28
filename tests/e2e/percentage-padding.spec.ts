import { test, expect, type Page } from '@playwright/test'

/*
 * PERCENTAGE PADDING RESOLVES AGAINST THE CONTAINING BLOCK'S WIDTH, never the
 * element's own. That is the whole subject of this file.
 *
 * The defect it was written for: `.home-nahtadi-tile` carried `padding: 9%`
 * while it WAS the grid item, so its containing block was the grid track. At
 * desktop the track is `grid-cols-[200px_1fr_auto]` -- exactly 200px, the same
 * as the tile -- so 9% coincidentally equalled 9% of the tile. Below the 880px
 * breakpoint the grid becomes `grid-cols-1`, the track becomes the full column
 * (~590px on a half-screen laptop) and the tile is capped at 120px, so the
 * inset resolved to ~53px a side inside a 120px box and left a ~14px glyph.
 * The same bug had already been hit and fixed once on /projects
 * (`.projects-nahtadi-tile`, which is why that one is in px).
 *
 * The fix is structural rather than numeric: the ground, radius and shadow sit
 * on a wrapper sized to the tile and the inset sits on the <img> inside it, so
 * the percentage resolves against the tile itself at every width. These tests
 * therefore assert a RATIO across three widths spanning the breakpoint -- a
 * single-width check is exactly what let the defect ship, because it is
 * correct at desktop and wrong everywhere else.
 *
 * The selectors are deliberately written so this file is meaningful against
 * both the broken and the fixed markup: when the tile and the glyph are the
 * same element the ratio is still content-box over border-box.
 */

/** `padding: 9%` a side, so the glyph's content box is 82% of the tile. */
const INSET = 0.09
const CONTENT_RATIO = 1 - 2 * INSET

/**
 * Three widths, chosen for what each one exercises:
 *   1280 - desktop, above the 880 breakpoint, the width the tile was authored at
 *    720 - Omar's half-screen laptop window; below the breakpoint and the case
 *          where a full-column containing block is at its most misleading
 *    390 - iPhone-class, where the column is narrow enough that a
 *          containing-block bug is least visible and so most likely to survive
 */
const WIDTHS = [
  { label: 'desktop (1280)', width: 1280, height: 900 },
  { label: 'half-screen laptop (720)', width: 720, height: 900 },
  { label: 'phone (390)', width: 390, height: 844 },
]

/**
 * Content-box width of `glyph` over border-box width of `tile`. Reads the
 * computed padding rather than assuming it, so this measures what the browser
 * actually laid out and not what the stylesheet says it asked for.
 *
 * `offsetWidth`, NOT `getBoundingClientRect()`. The hero satellites are
 * rotating and pop in with a `scale`, and getBoundingClientRect reports the
 * TRANSFORMED box while computed padding is untransformed -- mixing the two
 * made the satellite ratio read 0.62 at 390px and pass at 1280px, an artifact
 * of the animation phase at the instant of measurement rather than anything
 * about the layout. `offsetWidth` is layout space, so it is stable and it is
 * the number the containing-block rule actually operates on. `clientWidth` is
 * not an option: replaced elements report 0.
 */
async function contentRatio(page: Page, tileSel: string, glyphSel: string) {
  return page.evaluate(
    ([tileSel, glyphSel]) => {
      const tile = document.querySelector(tileSel) as HTMLElement | null
      const glyph = document.querySelector(glyphSel) as HTMLElement | null
      if (!tile || !glyph) return null
      const cs = getComputedStyle(glyph)
      const inset =
        parseFloat(cs.paddingLeft) +
        parseFloat(cs.paddingRight) +
        parseFloat(cs.borderLeftWidth) +
        parseFloat(cs.borderRightWidth)
      const content = glyph.offsetWidth - inset
      return {
        ratio: content / tile.offsetWidth,
        contentPx: content,
        tilePx: tile.offsetWidth,
      }
    },
    [tileSel, glyphSel]
  )
}

test.describe('flagship Nahtadi tile keeps its inset ratio across the 880px breakpoint', () => {
  for (const { label, width, height } of WIDTHS) {
    test(`glyph is ${Math.round(CONTENT_RATIO * 100)}% of the tile at ${label}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')

      const measured = await contentRatio(
        page,
        '.home-nahtadi-tile',
        'img[alt="Nahtadi app icon"]'
      )

      expect(measured, 'flagship tile and glyph both present').not.toBeNull()
      expect(measured!.ratio).toBeCloseTo(CONTENT_RATIO, 2)

      // A ratio alone would still pass if the whole tile collapsed, so pin the
      // tile to the size the layout asks for: 200px above the breakpoint, the
      // `max-[880px]:w-[120px]` cap below it.
      expect(measured!.tilePx).toBeCloseTo(width > 880 ? 200 : 120, 0)
    })
  }
})

/*
 * The only other percentage padding in the codebase (src/app/styles/home.css,
 * `.home-sat-img-nahtadi`). This one is structurally sound and the assertion
 * records why rather than leaving it to a reader's reasoning: the <img> is
 * `width: 100%` of `.home-sat`, whose width IS `--sat-size`, so the containing
 * block and the element's own width are the same number by construction --
 * exactly the property the flagship tile lacked. It is asserted at the same
 * three widths so a future layout change that breaks the identity is caught
 * here rather than by eye.
 */
test.describe('hero satellite tile: percentage inset resolves against its own width', () => {
  for (const { label, width, height } of WIDTHS) {
    test(`satellite glyph is ${Math.round(CONTENT_RATIO * 100)}% of its tile at ${label}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')

      const measured = await contentRatio(
        page,
        '.home-sat-img-nahtadi',
        '.home-sat-img-nahtadi'
      )

      expect(measured, 'hero satellite tile present').not.toBeNull()
      expect(measured!.ratio).toBeCloseTo(CONTENT_RATIO, 2)
    })
  }
})
