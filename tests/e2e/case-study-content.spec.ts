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
      // SCOPED, because the video block deliberately reuses `.case-figure` so
      // the two read as one family -- radar-moboard legitimately has two. This
      // is the one holding the still.
      const figure = page.locator('.case-figure', { has: page.locator('.case-figure-media') })

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
    await expect(
      page.locator('.case-figure', { has: page.locator('.case-figure-media') }).locator('.case-caption')
    ).toContainText(sentence)
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

/**
 * The video block, added by B-E. Only radar-moboard has one, so this is derived
 * from the data rather than hardcoded: if a second case study gains a clip, it
 * is covered without editing this file.
 */
const WITH_VIDEO = CASE_STUDIES.filter((p) => getCaseStudy(p.id)!.video)

test('exactly one case study ships a clip, and it is radar-moboard', async () => {
  expect(WITH_VIDEO.map((p) => p.id)).toEqual(['radar-moboard'])
})

for (const project of WITH_VIDEO) {
  const video = getCaseStudy(project.id)!.video!

  test.describe(`/projects/${project.id} video`, () => {
    test('renders after the figure, not instead of it, and contains rather than crops', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)

      // The comparison is the argument; the clip is what it cannot show.
      await expect(page.locator('.case-figure-media')).toHaveCount(1)
      const el = page.locator('.case-video')
      await expect(el).toHaveCount(1)
      await expect(el).toHaveAttribute('src', video.src)
      await expect(el).toHaveAttribute('poster', video.poster)

      // `.case-figure-media` is object-fit: cover on 16:9 and this source is
      // 1:1 -- cover would crop the board's top and bottom rings away.
      expect(await el.evaluate((v) => getComputedStyle(v).objectFit)).toBe('contain')

      // muted and playsinline are both load-bearing on iOS Safari.
      expect(
        await el.evaluate((v: HTMLVideoElement) => ({
          muted: v.muted,
          loop: v.loop,
          playsInline: v.hasAttribute('playsinline'),
          // No autoplay ATTRIBUTE: playback starts from an effect so reduced
          // motion can be honoured without a hydration mismatch.
          autoplayAttribute: v.hasAttribute('autoplay'),
        }))
      ).toEqual({ muted: true, loop: true, playsInline: true, autoplayAttribute: false })
    })

    test('has a pause control that is keyboard reachable and names its own action', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      const button = page.locator('.case-video-toggle')
      await button.scrollIntoViewIfNeeded()

      // WCAG 2.2.2: the clip loops past five seconds, so a pause mechanism is
      // required. 2.5.5-sized target while we are here.
      const box = (await button.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)

      let reached = false
      for (let i = 0; i < 60 && !reached; i++) {
        await page.keyboard.press('Tab')
        reached = await page.evaluate(() =>
          document.activeElement?.classList.contains('case-video-toggle') ?? false
        )
      }
      expect(reached, 'the pause control is not reachable by keyboard').toBe(true)

      // A focus ring a keyboard user can actually see.
      expect(
        await button.evaluate((el) => {
          const cs = getComputedStyle(el)
          return el.matches(':focus-visible') && cs.outlineStyle !== 'none'
        })
      ).toBe(true)

      // The name states what pressing it will DO, and changes with state.
      await expect(button).toHaveText(/Pause the animation|Play the animation/)
      const before = await button.textContent()
      await button.press('Enter')
      await expect(button).not.toHaveText(before!)
    })

    test('under prefers-reduced-motion it shows the poster and never plays', async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: 'reduce' })
      const page = await context.newPage()
      // The same predicate reduced-motion-hydration.spec.ts uses. A blocklist of
      // known noise is the wrong shape: `npm run preview` on localhost also logs
      // a bare "Failed to load resource" for the Cloudflare RUM beacon, which
      // says nothing about hydration.
      const HYDRATION_ERROR = /hydrat|did not match|Minified React error #(418|423|425)/i
      const errors: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error' && HYDRATION_ERROR.test(m.text())) errors.push(m.text())
      })

      await page.goto(`/projects/${project.id}`)
      await page.locator('.case-video').scrollIntoViewIfNeeded()
      await page.waitForTimeout(1500)

      const state = await page
        .locator('.case-video')
        .evaluate((v: HTMLVideoElement) => ({ paused: v.paused, t: v.currentTime }))
      expect(state.paused, 'the clip autoplayed under reduced motion').toBe(true)
      // Not merely paused after the fact: it never advanced.
      expect(state.t).toBeLessThan(0.5)
      await expect(page.locator('.case-video-toggle')).toHaveText('Play the animation')

      // The whole reason playback starts from an effect rather than an attribute.
      expect(errors, 'hydration or runtime errors under reduced motion').toEqual([])
      await context.close()
    })
  })
}
