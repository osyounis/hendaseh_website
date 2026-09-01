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

    test('renders every media block in the authored order, and nothing else', async ({ page }) => {
      await page.goto(`/projects/${project.id}`)
      const blocks = study.media ?? []

      if (blocks.length === 0) {
        // The sequence renders NOTHING without artwork. A hatched placeholder
        // was a mockup device; the contract forbids serving one to a reader.
        await expect(page.locator('.case-media-stack')).toHaveCount(0)
        await expect(page.locator('.case-figure')).toHaveCount(0)
        return
      }

      // One tile per block and no extras -- both kinds render a `.case-figure`,
      // deliberately, so the stills and the clips read as one family.
      const tiles = page.locator('.case-media-stack .case-figure')
      await expect(tiles).toHaveCount(blocks.length)

      // ORDER IS THE ASSERTION. The sequence is editorial: it is the order the
      // reader meets the evidence in. A stack that rendered the right tiles in
      // the wrong order would pass every per-tile check.
      expect(
        await page.locator('.case-media-stack .case-caption').allInnerTexts()
      ).toEqual(blocks.map((b) => [b.title, b.caption].filter(Boolean).join('\n')))

      for (const [index, block] of blocks.entries()) {
        const tile = tiles.nth(index)
        if (block.kind === 'image') {
          await expect(tile.locator('img.case-figure-media')).toHaveAttribute('alt', block.alt)
        } else {
          await expect(tile.locator('video.case-video')).toHaveAttribute('src', block.src)
        }
      }
    })

    test('a block with no title emits a bare caption, exactly as the single slot did', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      for (const [index, block] of (study.media ?? []).entries()) {
        const caption = page.locator('.case-media-stack .case-caption').nth(index)
        await expect(caption.locator('.case-media-title')).toHaveCount(block.title ? 1 : 0)
      }
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
    const blocks = getCaseStudy(slug)!.media ?? []
    expect(blocks.length, `${slug} has no media to caption`).toBeGreaterThan(0)

    // EVERY block, not just the first. The guardrail is that nothing on either
    // of these pages is real, so a clip or a detail added later without the
    // sentence is exactly the case this must catch.
    for (const block of blocks) {
      expect(block.caption, `${slug} caption lost its synthetic marker`).toContain(sentence)
    }

    await page.goto(`/projects/${slug}`)
    const captions = page.locator('.case-media-stack .case-caption')
    await expect(captions).toHaveCount(blocks.length)
    for (let i = 0; i < blocks.length; i++) {
      await expect(captions.nth(i)).toContainText(sentence)
    }
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
 * The clips. Derived from the data rather than hardcoded, and iterated per CLIP
 * rather than per project: radar-moboard ships two, and a test that only ever
 * looked at the first would have covered the board and missed the sea view.
 */
const CLIPS = CASE_STUDIES.flatMap((p) =>
  (getCaseStudy(p.id)!.media ?? [])
    .filter((b) => b.kind === 'video')
    .map((b) => ({ slug: p.id, clip: b }))
)

test('only radar-moboard ships clips, and it ships both of them', async () => {
  expect(CLIPS.map((c) => `${c.slug}:${c.clip.src}`)).toEqual([
    'radar-moboard:/video/radar-moboard-board.mp4',
    'radar-moboard:/video/radar-moboard-seaview.mp4',
  ])
})

for (const { slug: projectId, clip: video } of CLIPS) {
  const project = { id: projectId }

  test.describe(`/projects/${project.id} ${video.src.split('-').pop()}`, () => {
    test('renders alongside the stills, contains rather than crops, and does not loop', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)

      // The comparison is the argument; the clips are what it cannot show.
      await expect(page.locator('.case-figure-media').first()).toBeVisible()
      const el = page.locator(`.case-video[src="${video.src}"]`)
      await expect(el).toHaveCount(1)
      await expect(el).toHaveAttribute('poster', video.poster)

      // `.case-figure-media` is object-fit: cover on 16:9 and this source is
      // 1:1 -- cover would crop the board's top and bottom rings away.
      expect(await el.evaluate((v) => getComputedStyle(v).objectFit)).toBe('contain')

      // muted and playsinline are both load-bearing on iOS Safari.
      expect(
        await el.evaluate((v: HTMLVideoElement) => ({
          muted: v.muted,
          // NOT looping, and this assertion is the point of the change. The
          // clip opens before the second observation and ends past CPA, so its
          // first and last frames are different pictures and a loop can only
          // cut between them.
          loop: v.loop,
          playsInline: v.hasAttribute('playsinline'),
          // No autoplay ATTRIBUTE: playback starts from an effect so reduced
          // motion can be honoured without a hydration mismatch.
          autoplayAttribute: v.hasAttribute('autoplay'),
        }))
      ).toEqual({ muted: true, loop: false, playsInline: true, autoplayAttribute: false })
    })

    test('plays once, then offers replay rather than pretending it can be played', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      const el = page.locator(`.case-video[src="${video.src}"]`)
      const button = el.locator('xpath=following-sibling::button')

      await el.scrollIntoViewIfNeeded()
      // Started by the reader arriving at it, not by mounting: two clips
      // starting at mount would both finish before the reader scrolled down.
      await expect(button).toHaveText('Pause the animation', { timeout: 10_000 })

      // Jump to the end rather than waiting out eight seconds of real time.
      await el.evaluate((v: HTMLVideoElement) => {
        v.currentTime = v.duration - 0.05
      })
      await expect(button).toHaveText('Replay the animation', { timeout: 10_000 })

      // It holds the final frame. A poster reappearing here, or a rewind to the
      // first frame, would both be wrong.
      expect(
        await el.evaluate((v: HTMLVideoElement) => ({ ended: v.ended, near: v.currentTime > 1 }))
      ).toEqual({ ended: true, near: true })

      // Replay restarts from the beginning. `paused` is not asserted: the
      // press begins playback, and by the time this reads back it may already
      // have advanced -- currentTime returning to the start is the signal.
      await button.click()
      await expect(button).not.toHaveText('Replay the animation')
      expect(await el.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeLessThan(2)
    })

    test('has a pause control that is keyboard reachable and names its own action', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      const button = page
        .locator(`.case-video[src="${video.src}"]`)
        .locator('xpath=following-sibling::button')
      await button.scrollIntoViewIfNeeded()

      // WCAG 2.2.2: the clip loops past five seconds, so a pause mechanism is
      // required. 2.5.5-sized target while we are here.
      const box = (await button.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)

      // Asked of THIS clip's button, not of any `.case-video-toggle`. With two
      // clips on the page the class test stopped on the board's control while
      // asserting against the sea view's, and passed for the wrong reason.
      let reached = false
      for (let i = 0; i < 60 && !reached; i++) {
        await page.keyboard.press('Tab')
        reached = await button.evaluate((el) => el === document.activeElement)
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
      await expect(button).toHaveText(
        /Pause the animation|Play the animation|Replay the animation/
      )
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
      const clip = page.locator(`.case-video[src="${video.src}"]`)
      await clip.scrollIntoViewIfNeeded()
      await page.waitForTimeout(1500)

      const state = await clip.evaluate((v: HTMLVideoElement) => ({
        paused: v.paused,
        t: v.currentTime,
      }))
      expect(state.paused, 'the clip autoplayed under reduced motion').toBe(true)
      // Not merely paused after the fact: it never advanced.
      expect(state.t).toBeLessThan(0.5)
      await expect(clip.locator('xpath=following-sibling::button')).toHaveText(
        'Play the animation'
      )

      // The whole reason playback starts from an effect rather than an attribute.
      expect(errors, 'hydration or runtime errors under reduced motion').toEqual([])
      await context.close()
    })
  })
}
