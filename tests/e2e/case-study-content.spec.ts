import { test, expect } from '@playwright/test'
import { getCaseStudyProjects } from '@/lib/projects'
import { getCaseStudy } from '@/lib/caseStudies'

/**
 * Content coverage for /projects/[slug], added by B-B when the last two case
 * studies landed and the media slot was wired for the first time.
 *
 * DERIVED, NOT LISTED. Every slug comes from `getCaseStudyProjects()`, the same
 * helper `generateStaticParams` and the sitemap use, so a fifth case study is
 * covered the day it is added and a hardcoded list can never drift from the
 * catalog. The count assertion below is the one deliberate exception: it is a
 * tripwire for an accidental tier flip, which is exactly the kind of change that
 * should not pass silently.
 */

const CASE_STUDIES = getCaseStudyProjects()

test('the catalog carries exactly four case studies', async () => {
  expect(CASE_STUDIES.map((p) => p.id).sort()).toEqual([
    'a16-summarizer',
    'brent-cuda',
    'coast-guard-pilot-tracker',
    'radar-moboard',
  ])
})

for (const project of CASE_STUDIES) {
  const study = getCaseStudy(project.id)!

  test.describe(`/projects/${project.id}`, () => {
    test('renders its hero, three stats and three sections', async ({ page }) => {
      await page.goto(`/projects/${project.id}`)

      await expect(page.getByRole('heading', { level: 1, name: project.title })).toBeVisible()
      await expect(page.getByText(study.thesis)).toBeVisible()

      // Exactly three, and each carrying its own real number. A stat row that
      // silently lost a value would still render three boxes.
      const stats = page.locator('.case-stat')
      await expect(stats).toHaveCount(3)
      for (const stat of study.stats) {
        await expect(stats.filter({ hasText: stat.value }).first()).toBeVisible()
      }

      for (const section of [study.problem, study.approach, study.impact]) {
        await expect(page.getByText(section.eyebrow, { exact: true })).toBeVisible()
        await expect(page.getByRole('heading', { name: section.heading })).toBeVisible()
      }
    })

    test('renders its media figure and caption, or neither', async ({ page }) => {
      await page.goto(`/projects/${project.id}`)
      const figure = page.locator('.case-figure')

      if (!study.figure) {
        // The slot renders NOTHING without artwork. A hatched placeholder was a
        // mockup device; the contract forbids serving one to a reader.
        await expect(figure).toHaveCount(0)
        return
      }

      await expect(figure).toHaveCount(1)
      await expect(figure.locator('img')).toHaveAttribute('alt', study.figure.alt)
      // Asserted by TEXT, not by presence: a caption that rendered empty, or
      // rendered the wrong project's, would pass a presence check.
      await expect(figure.locator('.case-caption')).toHaveText(study.figure.caption)
    })
  })
}

/**
 * The synthetic-data guardrail, asserted by the exact sentence rather than by a
 * loose match. Both of these pages show private Coast Guard work, and the whole
 * basis on which they may be published is that nothing on screen is real. If a
 * caption is ever reworded, this fails and the rewording gets a decision.
 */
test('every private-work figure states on the page that its data is synthetic', async ({
  page,
}) => {
  const cases = [
    ['radar-moboard', 'All scenarios synthetic.'],
    ['coast-guard-pilot-tracker', 'All pilots, dates and values are invented.'],
  ] as const

  for (const [slug, sentence] of cases) {
    const study = getCaseStudy(slug)!
    expect(study.figure, `${slug} has no figure to caption`).toBeDefined()
    expect(study.figure!.caption, `${slug} caption lost its synthetic marker`).toContain(sentence)

    await page.goto(`/projects/${slug}`)
    await expect(page.locator('.case-figure .case-caption')).toContainText(sentence)
  }
})

test('the sitemap lists all four case studies and no card-tier slug', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const project of CASE_STUDIES) {
    expect(xml, `${project.id} missing from sitemap`).toContain(`/projects/${project.id}`)
  }
  expect(xml).not.toContain('/projects/reddit-nlp')
  expect(xml).not.toContain('/projects/collision-avoidance-radar')
})
