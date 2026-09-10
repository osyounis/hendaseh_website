import { test, expect, type Page, type Locator } from '@playwright/test'
import projectsData from '../../src/data/projects.json'

/**
 * Coverage for Task B2.5: the rebuilt /projects page's live search and
 * category filter. Neither had any Playwright coverage before this file (32
 * existing tests enumerated, none touched search or chips) -- the 404 for
 * card-tier slugs is already covered by tests/e2e/redirects.spec.ts.
 *
 * WHAT THIS FILE DERIVES INDEPENDENTLY, AND WHY
 * ----------------------------------------------
 * Every expected count below is computed from src/data/projects.json by a
 * haystack() function written IN THIS FILE, deliberately NOT imported from
 * FilterableProjectList.tsx. Importing the implementation under test would
 * make "expected" track whatever the app does, including a broken app: if a
 * future change drops `technologies` from the real search index, an
 * imported helper would drop it too, and this suite would keep passing
 * while the search visibly got worse. haystack() mirrors the CURRENT
 * documented contract -- title + tagline + description + technologies +
 * keywords, from FilterableProjectList.tsx's own header comment and
 * docs/superpowers/mockups/projects/APPROVED.md's "Search" line -- so a
 * narrowing of the real implementation shows up here as a count mismatch,
 * not as a test that quietly still passes.
 *
 * KEYWORDS FIELD -- KNOWN GAP, NOT SILENTLY SKIPPED
 * ----------------------------------------------
 * The match set's fifth field, `keywords`, is empty on every project in the
 * live catalog today (`grep keywords src/data/projects.json` has no hits
 * inside any project object). There is no live query that can prove
 * `keywords` is consulted without fabricating catalog data this suite does
 * not own, and a query that can never match anything is not a test. When a
 * project's `keywords` array is first populated, add a query here that
 * matches only through that field.
 *
 * THE EMBED COVERAGE IS GONE, DELIBERATELY
 * ----------------------------------------------
 * Sub-project 5 retired the Streamlit demo along with `links.embed`. The test
 * that asserted the iframe is deleted rather than skipped, and it was costing
 * more than it proved: `page.goto` waits for `load`, `load` waited for a
 * third-party iframe, and that route took 22.2s against a 30s cap, so
 * whichever test happened to hit it failed on any given run.
 */

interface CatalogProject {
  id: string
  title: string
  tagline?: string
  description: string
  technologies: string[]
  keywords?: string[]
  category: string
  tier: string
  private?: boolean
  org?: string
  links: { appStore?: string; github?: string }
}

const projects = (projectsData as { projects: CatalogProject[] }).projects
const TOTAL = projects.length

function haystack(p: CatalogProject): string {
  return [p.title, p.tagline ?? '', p.description, ...p.technologies, ...(p.keywords ?? [])]
    .join(' ')
    .toLowerCase()
}

function matchCount(term: string): number {
  const needle = term.toLowerCase()
  return projects.filter((p) => haystack(p).includes(needle)).length
}

function categoryCount(category: string): number {
  return projects.filter((p) => p.category === category).length
}

const statusText = (n: number) => `${n} of ${TOTAL} projects`

function cardFor(page: Page, id: string): Locator {
  return page.locator(`[data-testid="project-card"][aria-labelledby="project-card-${id}"]`)
}

/**
 * Resolves once the page's entrance cascade has finished.
 *
 * MEASURE AFTER THIS, ALWAYS, for anything that spans the boundary of
 * `.projects-enter-body`. That container animates `translate: 0 18px -> 0`,
 * and the grid and the footnote ride inside it while the footer does not -- so
 * a distance measured from the link to the footer's hairline mid-flight is
 * short by whatever translate is left, while a distance measured entirely
 * inside the container looks perfectly correct. That asymmetry is what makes
 * it convincing: it reads as a real 18px layout defect rather than as a timing
 * artifact, and chasing it into the CSS changes a stylesheet that was right.
 *
 * The neighbouring `projects-entrance.spec.ts` carries the same helper for the
 * same reason, and `docs/DECISIONS.md` records the rule this follows: never
 * paper over one of these with a fixed wait.
 */
async function settle(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const els = Array.from(document.querySelectorAll('.projects-enter'))
          if (els.length === 0) return false
          return els.every((el) => el.getAnimations().every((a) => a.playState === 'finished'))
        }),
      { message: 'the entrance cascade never settled' }
    )
    .toBe(true)
}

function chipGroup(page: Page): Locator {
  return page.getByRole('group', { name: 'Filter projects by category' })
}

test.describe('projects search', () => {
  test('renders the full catalog with no filter applied', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.getByRole('status')).toHaveText(statusText(TOTAL))
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(TOTAL)
  })

  test('matches on the title field', async ({ page }) => {
    // "creator" is present ONLY in cycloidal-drive-creator's title, not in its
    // own tagline or description (checked against the live catalog). If a
    // future change stops matching titles, this card disappears and the
    // count line stops agreeing with matchCount('creator') -- this is the
    // regression a bare "count went down" assertion would miss but this one
    // catches, because the expectation is derived, not hardcoded.
    await page.goto('/projects')
    await page.getByLabel('Search projects').fill('creator')

    await expect(page.getByRole('status')).toHaveText(statusText(matchCount('creator')))
    await expect(cardFor(page, 'cycloidal-drive-creator')).toBeVisible()
    await expect(cardFor(page, 'nahtadi')).toHaveCount(0)
  })

  test('matches on the tagline field', async ({ page }) => {
    // "recommender" is in new-game-plus's tagline only -- its title
    // ("NewGame+") and description don't contain the word.
    await page.goto('/projects')
    await page.getByLabel('Search projects').fill('recommender')

    await expect(page.getByRole('status')).toHaveText(statusText(matchCount('recommender')))
    await expect(cardFor(page, 'new-game-plus')).toBeVisible()
  })

  test('matches on the description field', async ({ page }) => {
    // "76.82" is the exact figure in reddit-nlp's DESCRIPTION ("achieving
    // 76.82% test accuracy"); the tagline rounds the same number differently
    // ("76.8 percent"), so this string only lives in description.
    await page.goto('/projects')
    await page.getByLabel('Search projects').fill('76.82')

    await expect(page.getByRole('status')).toHaveText(statusText(matchCount('76.82')))
    await expect(cardFor(page, 'reddit-nlp')).toBeVisible()
  })

  test('matches on the technologies field', async ({ page }) => {
    // "SwiftData" is one of nahtadi's technologies but appears in neither its
    // tagline nor its description.
    await page.goto('/projects')
    await page.getByLabel('Search projects').fill('swiftdata')

    await expect(page.getByRole('status')).toHaveText(statusText(matchCount('swiftdata')))
    await expect(cardFor(page, 'nahtadi')).toBeVisible()
  })

  test('matches on the search-only keywords field', async ({ page }) => {
    /*
     * The two searches Omar reported as broken in production review, and the
     * reason the `keywords` field exists at all.
     *
     * `keywords` was in the schema and in the search haystack from the start,
     * and was NULL on all 13 projects -- so it contributed nothing and no test
     * noticed, because a field that is empty everywhere still "works".
     *
     * WHY THESE TWO MISSED. `islamic-prayer-time` says "Muslim prayer times"
     * in its description and carries no form of "Islam" in its title, tagline,
     * description or technologies -- only in its `id`, which is not searched.
     * `image-watermark-remover` had no "vision" anywhere, while `asl-detector`
     * lists "Computer Vision" in its technologies; a Pix2Pix GAN doing
     * image-to-image translation is computer vision too, so that was an
     * inconsistency in the DATA, not in the search.
     *
     * THE FIX BELONGS IN `keywords`, NOT IN `technologies`, and that boundary
     * is the thing this test protects. `technologies` is RENDERED on the card
     * and is governed by the skills-defensibility rule in CLAUDE.md: every
     * entry is a claim Omar has to be able to defend in an interview. Padding
     * it to improve search would quietly turn a search-engine problem into a
     * résumé problem. `keywords` is search-only and never displayed.
     */
    await page.goto('/projects')

    await page.getByLabel('Search projects').fill('islam')
    await expect(page.getByRole('status')).toHaveText(statusText(matchCount('islam')))
    await expect(cardFor(page, 'islamic-prayer-time')).toBeVisible()
    await expect(cardFor(page, 'nahtadi')).toBeVisible()

    await page.getByLabel('Search projects').fill('vision')
    await expect(page.getByRole('status')).toHaveText(statusText(matchCount('vision')))
    await expect(cardFor(page, 'image-watermark-remover')).toBeVisible()
    await expect(cardFor(page, 'asl-detector')).toBeVisible()
    /*
     * And it did NOT become a catch-all. `wildfire-predictor` is a TensorFlow
     * model over weather and historical data -- not computer vision -- so it
     * must stay out of this result. Keywords that make everything match are
     * the failure mode on the other side of this fix.
     */
    await expect(cardFor(page, 'wildfire-predictor')).toHaveCount(0)
  })

  test('filtering runs with no animation on the grid', async ({ page }) => {
    // The contract is explicit (Emil frequency rule, APPROVED.md "Search"):
    // filtering is a per-keystroke interaction and must reflow instantly with
    // no card animation. This would catch a regression like wrapping the
    // filtered map in a Framer Motion AnimatePresence / layout transition.
    await page.goto('/projects')
    await expect(page.getByRole('status')).toHaveText(statusText(TOTAL))

    // Baseline: nothing should be animating even before we touch the input.
    const baseline = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-testid="project-card"]')).reduce(
        (total, el) => total + (el as HTMLElement).getAnimations({ subtree: true }).length,
        0
      )
    )
    expect(baseline).toBe(0)

    await page.getByLabel('Search projects').fill('creator')
    await expect(page.getByRole('status')).toHaveText(statusText(matchCount('creator')))

    const midFilter = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-testid="project-card"]')).reduce(
        (total, el) => total + (el as HTMLElement).getAnimations({ subtree: true }).length,
        0
      )
    )
    expect(midFilter).toBe(0)
  })
})

test.describe('category chips', () => {
  test('the iOS chip maps to the mobile category via its label, not a title-cased raw value', async ({
    page,
  }) => {
    // ALL_CATEGORIES value is 'mobile'; the contract's label is 'iOS', not
    // 'Mobile'. Asserting BOTH the visible chip text and the resulting
    // category-filtered count means a regression to naive title-casing fails
    // here two ways: getByRole('iOS') stops finding a chip, or (if someone
    // relabels a chip 'iOS' but points it at the wrong category value) the
    // count/visible-card assertions disagree with categoryCount('mobile').
    await page.goto('/projects')
    const iosChip = chipGroup(page).getByRole('button', { name: 'iOS', exact: true })
    await iosChip.click()

    const expected = categoryCount('mobile')
    await expect(page.getByRole('status')).toHaveText(statusText(expected))
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(expected)
    await expect(cardFor(page, 'nahtadi')).toBeVisible()
    await expect(iosChip).toHaveAttribute('aria-pressed', 'true')
    await expect(chipGroup(page).getByRole('button', { name: 'All', exact: true })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  test('chips are single-select: choosing a new one deselects the previous', async ({ page }) => {
    await page.goto('/projects')
    const iosChip = chipGroup(page).getByRole('button', { name: 'iOS', exact: true })
    const mlChip = chipGroup(page).getByRole('button', { name: 'Machine Learning', exact: true })

    await iosChip.click()
    await expect(iosChip).toHaveAttribute('aria-pressed', 'true')

    await mlChip.click()
    await expect(mlChip).toHaveAttribute('aria-pressed', 'true')
    await expect(iosChip).toHaveAttribute('aria-pressed', 'false')

    const expected = categoryCount('machine-learning')
    await expect(page.getByRole('status')).toHaveText(statusText(expected))
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(expected)
  })
})

test.describe('empty state', () => {
  test('a no-match query shows the designed empty state, and clearing restores the full set', async ({
    page,
  }) => {
    await page.goto('/projects')

    // Narrow with a chip AND a query together, so "clear" has to reset both
    // pieces of state, not just whichever one a narrower fix might target.
    await chipGroup(page).getByRole('button', { name: 'iOS', exact: true }).click()
    await expect(page.getByRole('status')).toHaveText(statusText(categoryCount('mobile')))

    const noise = 'zzznomatch000'
    // Guard the guard: confirm this term really matches nothing in the live
    // catalog, so a future project titled e.g. "Zzznomatch" wouldn't turn
    // this into an accidental non-empty-state test that still happens to
    // pass.
    expect(matchCount(noise)).toBe(0)
    await page.getByLabel('Search projects').fill(noise)

    await expect(page.getByRole('status')).toHaveText(statusText(0))
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(0)
    await expect(page.getByText(`Nothing matches “${noise}”`)).toBeVisible()

    await page.getByRole('button', { name: 'clear the filter' }).click()

    await expect(page.getByRole('status')).toHaveText(statusText(TOTAL))
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(TOTAL)
    await expect(page.getByLabel('Search projects')).toHaveValue('')
    await expect(
      chipGroup(page).getByRole('button', { name: 'All', exact: true })
    ).toHaveAttribute('aria-pressed', 'true')
  })
})

test.describe('tier-action grammar', () => {
  test('flagship, showcase, card tier, and private cards render the documented actions', async ({
    page,
  }) => {
    await page.goto('/projects')

    // Flagship (nahtadi): "The story" to /nahtadi plus an App Store pill.
    // No GitHub pill (nahtadi has none in the catalog) and no private badge.
    const nahtadi = cardFor(page, 'nahtadi')
    const nahtadiData = projects.find((p) => p.id === 'nahtadi')!
    await expect(nahtadi.getByRole('link', { name: /the story/i })).toHaveAttribute(
      'href',
      '/nahtadi'
    )
    await expect(nahtadi.getByRole('link', { name: /app store/i })).toHaveAttribute(
      'href',
      nahtadiData.links.appStore!
    )
    await expect(nahtadi.getByRole('link', { name: /github/i })).toHaveCount(0)
    await expect(nahtadi.locator('.projects-badge-private')).toHaveCount(0)

    // Showcase with a public repo (brent-cuda): blue "Case study" pill plus
    // GitHub -- and per the contract, NO separate live-demo pill on the card,
    // so exactly two links total.
    const brent = cardFor(page, 'brent-cuda')
    const brentData = projects.find((p) => p.id === 'brent-cuda')!
    await expect(brent.getByRole('link', { name: /case study/i })).toHaveAttribute(
      'href',
      '/projects/brent-cuda'
    )
    await expect(brent.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      brentData.links.github!
    )
    await expect(brent.getByRole('link')).toHaveCount(2)

    // Showcase AND private (radar-moboard): the combination sub-project 5
    // introduced. The repository stays private, so there is no GitHub pill and
    // no dead link -- the private badge plus a single "Case study" action.
    const radar = cardFor(page, 'radar-moboard')
    await expect(radar.getByRole('link', { name: /case study/i })).toHaveAttribute(
      'href',
      '/projects/radar-moboard'
    )
    await expect(radar.getByRole('link', { name: /github/i })).toHaveCount(0)
    await expect(radar.getByRole('link')).toHaveCount(1)

    // The badge says PRIVATE and nothing else. radar-moboard is Omar's own
    // project, closed pending a meeting; it has no Coast Guard association and
    // must not appear to claim one. The badge used to hardcode the org, which
    // was right only while every private project happened to be USCG work.
    const radarBadge = radar.locator('.projects-badge-private')
    await expect(radarBadge).toHaveText('PRIVATE')
    await expect(radarBadge).not.toContainText('USCG')

    // Card tier with a public repo (new-game-plus): GitHub pill only.
    // getProjectHref returns null for card tier, so there is no case-study
    // link to click even though the card has a story-shaped GitHub pill.
    const newGamePlus = cardFor(page, 'new-game-plus')
    const newGamePlusData = projects.find((p) => p.id === 'new-game-plus')!
    await expect(newGamePlus.getByRole('link', { name: /case study/i })).toHaveCount(0)
    await expect(newGamePlus.getByRole('link', { name: /the story/i })).toHaveCount(0)
    await expect(newGamePlus.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      newGamePlusData.links.github!
    )

    // Private, card tier, no repository at all (coast-guard-inventory): the gold
    // badge and ZERO anchors -- no dead link, ever. The organisation is read from
    // the catalog rather than written as a literal, so the badge is asserted to
    // follow `org` instead of following `private`.
    const inventory = cardFor(page, 'coast-guard-inventory')
    const inventoryOrg = projects.find((p) => p.id === 'coast-guard-inventory')!.org
    expect(inventoryOrg, 'coast-guard-inventory should declare an org').toBe('USCG')
    await expect(inventory.locator('.projects-badge-private')).toHaveText(
      `${inventoryOrg} · PRIVATE`
    )
    await expect(inventory.getByRole('link')).toHaveCount(0)

    // Private AND showcase (coast-guard-pilot-tracker): B-B flipped it, so the
    // contract's "private, plus a Case study pill where a sanitized story
    // exists" case is now exercised by a project that actually has one. Still no
    // GitHub pill, because there is still no public repository.
    const tracker = cardFor(page, 'coast-guard-pilot-tracker')
    const trackerOrg = projects.find((p) => p.id === 'coast-guard-pilot-tracker')!.org
    await expect(tracker.locator('.projects-badge-private')).toHaveText(`${trackerOrg} · PRIVATE`)
    await expect(tracker.getByRole('link', { name: /case study/i })).toHaveAttribute(
      'href',
      '/projects/coast-guard-pilot-tracker'
    )
    await expect(tracker.getByRole('link', { name: /github/i })).toHaveCount(0)
    await expect(tracker.getByRole('link')).toHaveCount(1)
  })

  test('no anchor in the grid has an empty, "#", or missing href', async ({ page }) => {
    await page.goto('/projects')
    const hrefs = await page
      .locator('[data-testid="project-card"] a')
      .evaluateAll((els) => els.map((a) => a.getAttribute('href')))

    // Guard the guard: the grid has plenty of real links, so this can't pass
    // by finding an empty anchor list.
    expect(hrefs.length).toBeGreaterThan(10)

    const bad = hrefs.filter((href) => !href || href === '#')
    expect(bad).toEqual([])
  })
})


/**
 * The grid's closing footnote.
 *
 * `/projects` is the catalog, not the whole of the work, so the grid ends with
 * one quiet pointer at the rest of it. It is deliberately TERTIARY: a text
 * link, never a filled pill, so it cannot compete with the `Case study` pills
 * inside the cards above it. Its treatment is `.link-quiet` (shared.css), the
 * same 13px/600/`--fg-muted` construction the case-study back link wears --
 * shared code, not a second quiet-link style.
 *
 * It also mirrors the `{n} of {m} projects` count that OPENS the same grid, at
 * the same size, weight, colour and left edge. The count opens the grid and
 * this closes it, which is why the alignment is asserted rather than left to
 * drift.
 */
test.describe('the grid footnote', () => {
  const footnote = (page: Page) => page.getByRole('link', { name: /More on GitHub/ })

  test('points at the GitHub profile, in a new tab, with the drawn arrow', async ({ page }) => {
    await page.goto('/projects')

    const link = footnote(page)
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', 'https://github.com/osyounis')
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(link).toHaveAccessibleName(/\(opens in a new tab\)$/)
    // Grammar v2: a drawn arrow-up-right, never a Unicode character. The
    // banned-character guard lives in link-affordance.spec.ts; this asserts the
    // positive half -- that the glyph is actually there.
    await expect(link.locator('svg.link-glyph-arrow')).toHaveCount(1)
  })

  test('is a quiet text link, not a pill', async ({ page }) => {
    await page.goto('/projects')

    const link = footnote(page)
    await expect(link).toHaveClass(/link-quiet/)
    // No pill class, and no pill ground: a filled background here is the
    // regression this guards. It has to stay a text link -- the brief was
    // "not a filled button" and that has not changed.
    await expect(link).not.toHaveClass(/\bpill\b/)

    const paint = await link.evaluate((el) => {
      const cs = getComputedStyle(el)
      return { background: cs.backgroundColor, fontSize: cs.fontSize, fontWeight: cs.fontWeight }
    })
    expect(paint.background).toBe('rgba(0, 0, 0, 0)')
    // 15px, not the 13px it shipped at first. At 13px in the muted step, under
    // a dense grid, it was genuinely easy to scroll past -- reported from a
    // real read of the page, not theorised. Quiet is the brief; invisible is a
    // defect, and those are not the same thing.
    expect(paint.fontSize).toBe('15px')
    expect(paint.fontWeight).toBe('600')
  })

  /**
   * The octocat is what actually makes it findable. A mark is a far stronger
   * visual anchor than any amount of extra type weight, and it costs none of
   * the emphasis a filled ground would spend -- which is how this gets easier
   * to see while staying a footnote rather than becoming a second CTA.
   *
   * Same construction as everywhere else the site names GitHub: a filled path
   * on `currentColor`, sized by ink through `.brand-mark-github`, with the
   * arrow-up-right beside it still doing the "leaves the site" work.
   */
  test('carries the GitHub mark, ink-matched to the rest of the family', async ({ page }) => {
    await page.goto('/projects')

    const link = footnote(page)
    const mark = link.locator('svg:not(.link-glyph)')
    await expect(mark).toHaveCount(1)
    await expect(mark).toHaveAttribute('aria-hidden', 'true')

    const measured = await link.evaluate((el) => {
      const svg = el.querySelector<SVGSVGElement>('svg:not(.link-glyph)')!
      const vh = Number(svg.getAttribute('viewBox')!.split(/[\s,]+/)[3])
      const bb = svg.querySelector('path')!.getBBox()
      const box = svg.getBoundingClientRect().height
      return {
        ink: +((bb.height / vh) * box).toFixed(2),
        fill: getComputedStyle(svg).fill,
        colour: getComputedStyle(el).color,
      }
    })

    // Inherits the link's own colour rather than a literal, so it tracks both
    // themes and the hover.
    expect(measured.fill).toBe(measured.colour)
    // The same ~16.1px ink the CTA pills' marks carry.
    expect(measured.ink).toBeGreaterThan(15.5)
    expect(measured.ink).toBeLessThan(16.7)
  })

  /**
   * THE MARK SITS INSIDE THE PHRASE, not ahead of it: "More on [octocat]GitHub[arrow]".
   *
   * A logo identifies the noun it belongs to, and here that noun is the last
   * word rather than the whole line -- leading the phrase with it made the
   * mark modify "More", which is not a thing that has a logo.
   *
   * That puts three things on one word that must never be split across a line
   * break: the mark, "GitHub", and the arrow. `AffordanceLabel` already owned
   * half of that rule (it welds a trailing glyph to the last word); it now
   * takes an optional leading `mark` into the same `nowrap` span, so the whole
   * unit is atomic by construction rather than by hoping the line is wide
   * enough.
   */
  test('the mark, the word and the arrow are one unbreakable unit', async ({ page }) => {
    await page.goto('/projects')

    const weld = await page.evaluate(() => {
      const link = Array.from(document.querySelectorAll('a')).find((a) =>
        (a.textContent ?? '').includes('More on GitHub')
      )!
      const nowrap = link.querySelector<HTMLElement>('.whitespace-nowrap')!
      return {
        text: nowrap.textContent!.trim(),
        rects: nowrap.getClientRects().length,
        whiteSpace: getComputedStyle(nowrap).whiteSpace,
        // Mark first, arrow last, with the word between them.
        firstChildIsMark: nowrap.firstElementChild?.classList.contains('brand-mark') ?? false,
        lastChildIsGlyph: nowrap.lastElementChild?.classList.contains('link-glyph') ?? false,
        // The head of the phrase stays OUTSIDE the welded span.
        head: (link.childNodes[0].textContent ?? '').trim(),
      }
    })

    expect(weld.whiteSpace).toBe('nowrap')
    expect(weld.text).toBe('GitHub')
    expect(weld.rects, 'the welded unit spans one line box').toBe(1)
    expect(weld.firstChildIsMark).toBe(true)
    expect(weld.lastChildIsGlyph).toBe(true)
  })

  /**
   * The narrow case that proves the weld. At 320px the phrase has to break,
   * and it must break at the space -- "More on" above, the whole
   * mark-word-arrow unit below -- never between the mark and its word.
   */
  test('breaks at the space, never inside the welded unit', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await page.goto('/projects')

    const measured = await page.evaluate(() => {
      const link = Array.from(document.querySelectorAll('a')).find((a) =>
        (a.textContent ?? '').includes('More on GitHub')
      )!
      const nowrap = link.querySelector<HTMLElement>('.whitespace-nowrap')!
      const mark = nowrap.querySelector('.brand-mark')!
      const glyph = nowrap.querySelector('.link-glyph')!
      return {
        rects: nowrap.getClientRects().length,
        // Mark and arrow share a line box whatever the width.
        sameLine:
          Math.abs(
            mark.getBoundingClientRect().top - glyph.getBoundingClientRect().top
          ) < 6,
      }
    })

    expect(measured.rects).toBe(1)
    expect(measured.sameLine).toBe(true)
  })

  /**
   * CENTRED UNDER THE GRID, not aligned to the count that opens it.
   *
   * It was left-aligned first, on the argument that sharing the count's left
   * edge made the two read as one column. On the page it did not: the last
   * grid row is often half empty, so a link under the bottom-left card read as
   * belonging to that card rather than to the list. Centred, it is an
   * end-of-list marker -- the same thing `HomeWork` does to close its own
   * grid.
   *
   * Asserted against the GRID's centre rather than the viewport's, so the test
   * still means something if the page ever gains a gutter.
   */
  test('reads as a footnote to the grid: centred under it, below the last card', async ({
    page,
  }) => {
    await page.goto('/projects')

    const geometry = await page.evaluate(() => {
      const count = document.querySelector('[role="status"]')!
      const link = Array.from(document.querySelectorAll('a')).find((a) =>
        (a.textContent ?? '').includes('More on GitHub')
      )!
      const cs = getComputedStyle(count)
      const ls = getComputedStyle(link)
      const grid = document.querySelector('[data-testid="project-card"]')!.parentElement!
      const gridBox = grid.getBoundingClientRect()
      const linkBox = link.getBoundingClientRect()
      return {
        gridCentre: gridBox.left + gridBox.width / 2,
        linkCentre: linkBox.left + linkBox.width / 2,
        wrapperBorderTop: getComputedStyle(link.parentElement!).borderTopWidth,
        countLeft: Math.round(count.getBoundingClientRect().left),
        linkLeft: Math.round(link.getBoundingClientRect().left),
        countSize: cs.fontSize,
        linkSize: ls.fontSize,
        countWeight: cs.fontWeight,
        linkWeight: ls.fontWeight,
        // The footnote closes the grid, so it sits BELOW the last card.
        linkTop: link.getBoundingClientRect().top,
        lastCardBottom: Math.max(
          ...Array.from(document.querySelectorAll('[data-testid="project-card"]')).map(
            (c) => c.getBoundingClientRect().bottom
          )
        ),
      }
    })

    // Centred on the grid, within a pixel of rounding.
    expect(Math.abs(geometry.linkCentre - geometry.gridCentre)).toBeLessThanOrEqual(1)
    // Deliberately LOUDER than the count, not equal to it.
    expect(parseFloat(geometry.linkSize)).toBeGreaterThan(parseFloat(geometry.countSize))
    expect(geometry.linkWeight).toBe(geometry.countWeight)
    expect(geometry.linkTop).toBeGreaterThan(geometry.lastCardBottom)
    // No hairline above it: the footer's own rule is close enough below that a
    // second one reads as a boxed-in strip. Rejected on the page, kept out by
    // this assertion.
    expect(geometry.wrapperBorderTop).toBe('0px')
  })

  /**
   * CENTRED VERTICALLY TOO, in the band between the last card and the footer's
   * hairline -- not just horizontally.
   *
   * It shipped sitting 34px below the grid and 80px above the rule, a 2.4x
   * asymmetry that reads as the link having drifted up rather than as a
   * deliberate position. Reported off a real look at the page, then measured.
   *
   * The usual objection to centring a closing link is proximity: it should sit
   * nearer what it closes than what follows, or it stops belonging to the
   * grid. That does not apply here, and the reason is worth writing down --
   * THE HAIRLINE IS A DIVIDER, NOT CONTENT. The footer's actual copy sits
   * another 56px below it, so at 57/57 the link is 57px from the grid and
   * ~113px from the nearest footer text: still twice as close to the thing it
   * belongs to.
   *
   * The two gaps are asserted EQUAL rather than against literal pixel values,
   * so the intent survives a change to the spacing without this test having to
   * be retuned to match it.
   */
  test('sits centred in the band between the grid and the footer rule', async ({ page }) => {
    await page.goto('/projects')
    // The link is inside the animated container and the footer is not, so this
    // measurement is only meaningful once the cascade has stopped moving.
    await settle(page)

    const band = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="project-card"]'))
      const cardBottom = Math.max(...cards.map((c) => c.getBoundingClientRect().bottom))
      const link = document
        .querySelector('a.projects-more')!
        .getBoundingClientRect()
      // The footer's hairline is the `border-top` of its inner row.
      const rule = document.querySelector('footer > div')!.getBoundingClientRect()
      return {
        above: +(link.top - cardBottom).toFixed(1),
        below: +(rule.top - link.bottom).toFixed(1),
      }
    })

    expect(
      Math.abs(band.above - band.below),
      `link sits ${band.above}px below the grid and ${band.below}px above the footer rule`
    ).toBeLessThanOrEqual(1)
  })

  /**
   * The footnote is page furniture, not a search result. It survives a filter
   * that empties the grid -- which is the moment a reader most needs somewhere
   * else to go.
   */
  test('survives a filter that empties the grid', async ({ page }) => {
    await page.goto('/projects')
    await page.getByLabel('Search projects').fill('zzzznotathing')
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(0)
    await expect(footnote(page)).toBeVisible()
  })

  /**
   * It rides the entrance cascade's beat 4 rather than adding a beat of its
   * own. `tests/e2e/projects-entrance.spec.ts` asserts the cascade is exactly
   * five `.projects-enter` elements; a footnote that carried the class would
   * make it six and turn a layout addition into a broken cascade.
   */
  test('adds no beat to the entrance cascade', async ({ page }) => {
    await page.goto('/projects')
    const link = footnote(page)
    await expect(link).not.toHaveClass(/projects-enter/)
    await expect(link.locator('..')).not.toHaveClass(/projects-enter\b/)
  })
})
