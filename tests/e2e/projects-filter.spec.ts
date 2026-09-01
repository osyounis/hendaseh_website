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

