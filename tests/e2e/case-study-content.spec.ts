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
      ).toEqual(
        blocks.map((b) =>
          // A clip block's title is rendered above its chooser, where it names
          // the choice, so only its caption reaches the caption element.
          b.kind === 'clips' ? b.caption : [b.title, b.caption].filter(Boolean).join('\n')
        )
      )

      for (const [index, block] of blocks.entries()) {
        const tile = tiles.nth(index)
        if (block.kind === 'image') {
          // `img`, not `img.case-figure-media`: a framed block wears the shared
          // `.nh-device` bezel instead of the tile's own media class.
          await expect(tile.locator('img')).toHaveCount(1)
          await expect(tile.locator('img')).toHaveAttribute('alt', block.alt)
        } else {
          // The DEFAULT clip, and only it. See the clip-block tests below for
          // why there is never a second <video> in the DOM.
          await expect(tile.locator('video.case-video')).toHaveCount(1)
          await expect(tile.locator('video.case-video')).toHaveAttribute(
            'src',
            block.clips[0].src
          )
        }
      }
    })

    test('frames a raw capture in real chrome, never in baked pixels', async ({ page }) => {
      const framed = (study.media ?? []).filter((b) => b.kind === 'image' && b.frame === 'device')
      await page.goto(`/projects/${project.id}`)
      const devices = page.locator('.case-media-stack .nh-device')
      await expect(devices).toHaveCount(framed.length)
      if (framed.length === 0) return

      // The bezel is CSS on the theme-aware tile, not a composite. Its gradient
      // is what a baked-in frame cannot be: an object with an edge in both
      // themes. A flat background here means someone re-composited it.
      const chrome = await devices.first().evaluate((el) => {
        const cs = getComputedStyle(el)
        return { image: cs.backgroundImage, radius: cs.borderRadius, shadow: cs.boxShadow }
      })
      expect(chrome.image).toContain('gradient')
      expect(chrome.shadow).not.toBe('none')
      expect(chrome.radius).not.toBe('0px')
    })

    test('sets a beside block alongside its text, and stacks it when narrow', async ({
      page,
    }) => {
      const beside = (study.media ?? []).filter((b) => b.kind === 'image' && b.layout === 'beside')
      await page.goto(`/projects/${project.id}`)
      const tiles = page.locator('.case-figure-beside')
      await expect(tiles).toHaveCount(beside.length)
      if (beside.length === 0) return

      const tile = tiles.first()
      const geometry = async () => {
        const media = (await tile.locator('.case-device-frame, .case-figure-media, picture')
          .first()
          .boundingBox())!
        const text = (await tile.locator('.case-caption').boundingBox())!
        const box = (await tile.boundingBox())!
        return { media, text, height: box.height }
      }

      await tile.scrollIntoViewIfNeeded()
      const wide = await geometry()
      // Beside: the caption starts to the RIGHT of where the media ends.
      expect(wide.text.x).toBeGreaterThanOrEqual(wide.media.x + wide.media.width)

      await page.setViewportSize({ width: 390, height: 900 })
      await tile.scrollIntoViewIfNeeded()
      const narrow = await geometry()
      // Stacked: media above text, which is the order they are read in.
      expect(narrow.text.y).toBeGreaterThanOrEqual(narrow.media.y + narrow.media.height)

      // The whole device stays visible either way -- it is scaled, never cropped.
      const cropped = await tile
        .locator('.nh-device img')
        .evaluate((el) => getComputedStyle(el).objectFit)
      expect(cropped).toBe('cover')
      const ratio = await tile.locator('.nh-device img').evaluate((el) => {
        const b = el.getBoundingClientRect()
        return b.height / b.width
      })
      // 9/19.55 is the bezel's declared aspect; a crop would change it.
      expect(ratio).toBeCloseTo(19.55 / 9, 1)
    })

    test('serves one file per theme for a figure that has both', async ({ page }) => {
      const themed = (study.media ?? []).filter((b) => b.kind === 'image' && b.srcDark)
      await page.goto(`/projects/${project.id}`)
      const pictures = page.locator('.case-media-stack picture')
      await expect(pictures).toHaveCount(themed.length)

      for (const [index, block] of themed.entries()) {
        if (block.kind !== 'image' || !block.srcDark) continue
        const sources = pictures.nth(index).locator('source')
        await expect(sources).toHaveCount(2)
        // The dark source is first and carries the media query; the site's dark
        // variant IS prefers-color-scheme, since the attribute override is gone.
        await expect(sources.nth(0)).toHaveAttribute('media', '(prefers-color-scheme: dark)')
        expect(await sources.nth(0).getAttribute('srcset')).toContain(
          encodeURIComponent(block.srcDark).replace(/%2F/g, '/')
        )
        await expect(sources.nth(1)).not.toHaveAttribute('media', /./)
      }
    })

    test('a block with no title emits a bare caption, exactly as the single slot did', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      for (const [index, block] of (study.media ?? []).entries()) {
        const caption = page.locator('.case-media-stack .case-caption').nth(index)
        const inCaption = block.kind !== 'clips' && block.title ? 1 : 0
        await expect(caption.locator('.case-media-title')).toHaveCount(inCaption)
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
 * The clip blocks. Derived from the data rather than hardcoded, and iterated per
 * BLOCK: radar-moboard's two clips are one block with a chooser, so a test that
 * looked for two video tiles would now be asserting the old design.
 */
const CLIP_BLOCKS = CASE_STUDIES.flatMap((p) =>
  (getCaseStudy(p.id)!.media ?? [])
    .filter((b) => b.kind === 'clips')
    .map((b) => ({ slug: p.id, block: b }))
)

test('only radar-moboard ships clips, and both of them live in one block', async () => {
  expect(
    CLIP_BLOCKS.map((c) => `${c.slug}:${c.block.clips.map((clip) => clip.id).join('+')}`)
  ).toEqual(['radar-moboard:board+seaview'])
})

for (const { slug: projectId, block } of CLIP_BLOCKS) {
  const project = { id: projectId }
  const [first, second] = block.clips

  test.describe(`/projects/${project.id} clips`, () => {
    const stage = (page: import('@playwright/test').Page) => page.locator('.case-clip-stage')
    const clip = (page: import('@playwright/test').Page) => page.locator('.case-video')
    const transport = (page: import('@playwright/test').Page) =>
      page.locator('.case-video-toggle')

    test('offers one video area with the clips as choices, never two players', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)

      // THE WHOLE POINT OF THE CHANGE: one player, not one tile per clip.
      await expect(clip(page)).toHaveCount(1)
      await expect(clip(page)).toHaveAttribute('src', first.src)
      await expect(clip(page)).toHaveAttribute('poster', first.poster)

      const tabs = page.getByRole('tab')
      await expect(tabs).toHaveCount(block.clips.length)
      // Labelled for what they SHOW. A filename or a bare "Video" here is the
      // regression this catches.
      expect(await tabs.allInnerTexts()).toEqual(block.clips.map((c) => c.label))
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'false')

      // The panel is named by whichever tab is selected.
      const panel = page.getByRole('tabpanel')
      await expect(panel).toHaveCount(1)
      expect(await panel.getAttribute('aria-labelledby')).toBe(await tabs.nth(0).getAttribute('id'))
    })

    test('names the choice above the control, and the control by that sentence', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      const heading = page.locator('.case-clip-title')
      await expect(heading).toHaveCount(1)
      await expect(heading).toHaveText(block.title!)

      // A VISIBLE accessible name, not an invisible aria-label: the tablist is
      // named by the sentence the reader can actually see.
      const list = page.getByRole('tablist')
      expect(await list.getAttribute('aria-labelledby')).toBe(await heading.getAttribute('id'))
      await expect(list).not.toHaveAttribute('aria-label', /./)
      await expect(list).toHaveAccessibleName(block.title!)
    })

    test('keeps its columns equal and its labels inside the pill, down to 390px', async ({
      page,
    }) => {
      for (const width of [1440, 768, 390]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/projects/${project.id}`)
        await page.locator('.case-clip-switch').scrollIntoViewIfNeeded()

        // EQUAL COLUMNS ARE THE INDICATOR'S WHOLE PREMISE. It is sized to half
        // the track and travels by 100% of itself, so the moment the columns
        // stop matching it sits under the wrong width and clips a label. `1fr`
        // has a min-content floor, which is exactly how that happened at 390.
        const boxes = await page
          .getByRole('tab')
          .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width))
        expect(Math.abs(boxes[0] - boxes[1]), `tabs disagree at ${width}px`).toBeLessThan(1)

        const indicator = (await page.locator('.case-clip-indicator').boundingBox())!
        expect(Math.abs(indicator.width - boxes[0]), `indicator misfits at ${width}px`).toBeLessThan(1)

        // Every label fits INSIDE the pill with real padding, not just barely.
        const fits = await page.getByRole('tab').evaluateAll((els) =>
          els.map((el) => {
            const range = document.createRange()
            range.selectNodeContents(el)
            return el.getBoundingClientRect().width - range.getBoundingClientRect().width
          })
        )
        for (const [i, slack] of fits.entries()) {
          expect(slack, `label ${i} has ${slack}px of slack at ${width}px`).toBeGreaterThan(24)
        }
      }
    })

    test('carries selection on a moving indicator, not by recolouring the label', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      const tabs = page.getByRole('tab')
      await tabs.first().scrollIntoViewIfNeeded()

      // apple.com/mac's pattern: same colour selected or not.
      const colours = await tabs.evaluateAll((els) =>
        els.map((el) => getComputedStyle(el).color)
      )
      expect(new Set(colours).size, 'the tab labels are not one colour').toBe(1)

      const indicator = page.locator('.case-clip-indicator')
      await expect(indicator).toHaveCount(1)
      const at = () =>
        indicator.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)

      const home = await at()
      await tabs.nth(1).click()
      await expect.poll(at, { timeout: 3000 }).toBeGreaterThan(home + 1)
    })

    test('the indicator retargets mid-flight instead of snapping or queueing', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      const tabs = page.getByRole('tab')
      const indicator = page.locator('.case-clip-indicator')
      await tabs.first().scrollIntoViewIfNeeded()
      const at = () =>
        indicator.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)

      const home = await at()
      await tabs.nth(1).click()
      // Catch it in flight: 280ms of travel, so this lands roughly mid-way.
      await page.waitForTimeout(110)
      const midway = await at()
      expect(midway, 'the indicator never left its first tab').toBeGreaterThan(home + 1)

      const target = await indicator.evaluate((el) => el.getBoundingClientRect().width)
      expect(midway, 'the indicator had already arrived; catch it earlier').toBeLessThan(
        home + target - 1
      )

      // Turn it around while it is still travelling.
      await tabs.nth(0).click()

      // WHAT A FAILURE WOULD LOOK LIKE, stated as positions rather than as a
      // delta from the last reading. Comparing against `midway` measured how
      // long Playwright took to dispatch the click as much as it measured the
      // indicator, and got tighter as the control got narrower.
      //
      //   snapped home      -> it is already at 0 the instant the press lands
      //   snapped to target -> it is already at the far anchor
      //   queued            -> it finishes the outbound leg, reaching the far
      //                        anchor, before it comes back
      //   restarted         -> same tell: it visits the far anchor
      //
      // Retargeting from the presentation value visits neither anchor. It turns
      // round from wherever it is and comes home.
      const justAfter = await at()
      expect(justAfter, 'the indicator snapped home on reversal').toBeGreaterThan(home + 1)
      expect(justAfter, 'the indicator snapped to the far tab on reversal').toBeLessThan(
        home + target - 2
      )

      const samples: number[] = []
      for (let i = 0; i < 8; i++) {
        samples.push(await at())
        await page.waitForTimeout(20)
      }
      expect(
        Math.max(...samples),
        'the indicator reached the far tab after being reversed, so it queued or restarted'
      ).toBeLessThan(home + target - 2)

      await expect.poll(at, { timeout: 3000 }).toBeLessThan(home + 1)
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
      // The clip that was never settled on must still not have been mounted.
      await expect(page.locator('.case-video')).toHaveAttribute('src', first.src)
    })

    test('swaps the clip while it is invisible, and never empties the frame', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      await page.locator('.case-clip-stage').scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)

      // Sample the whole swap frame by frame, in the page, so the readings are
      // the browser's own and not Playwright round-trips.
      const frames = await page.evaluate(async () => {
        const stage = document.querySelector('.case-clip-stage')!
        const tab = [...document.querySelectorAll('[role=tab]')][1] as HTMLElement
        const out: { t: number; opacity: number; src: string; panelH: number }[] = []
        const t0 = performance.now()
        tab.click()
        await new Promise<void>((done) => {
          const tick = () => {
            const media = stage.querySelector('.case-clip-media') as HTMLElement
            const video = stage.querySelector('.case-video') as HTMLVideoElement
            const panel = stage.querySelector('.case-video-frame') as HTMLElement
            out.push({
              t: performance.now() - t0,
              opacity: Number(getComputedStyle(media).opacity),
              src: video?.getAttribute('src') ?? '',
              panelH: Math.round(panel.getBoundingClientRect().height),
            })
            if (performance.now() - t0 < 900) requestAnimationFrame(tick)
            else done()
          }
          requestAnimationFrame(tick)
        })
        return out
      })

      // THE CLIP CHANGES WHILE IT CANNOT BE SEEN. Swapping at partial opacity is
      // a visible cut between two entirely different pictures, and is what a
      // fade on the keyed <video> itself produced: it faded out, then the new
      // element mounted at full opacity because a newly inserted element has no
      // previous value to transition from.
      const swap = frames.findIndex((f) => f.src.includes('seaview'))
      expect(swap, 'the clip never swapped').toBeGreaterThan(0)
      expect(frames[swap].opacity, 'the clip was swapped in plain sight').toBeLessThan(0.05)

      // It fades back IN afterwards rather than popping.
      const after = frames.slice(swap).map((f) => f.opacity)
      expect(Math.max(...after)).toBeGreaterThan(0.95)
      // More than one intermediate frame is the whole claim: a pop produces
      // ZERO. The bar is deliberately not a frame count, which would make this
      // assert the machine's frame rate rather than the animation.
      expect(after.filter((o) => o > 0.1 && o < 0.9).length, 'the clip popped in').toBeGreaterThan(1)

      // THE FRAME IS NEVER EMPTY and never resizes: the panel keeps its ground
      // and its height for the whole swap.
      const heights = new Set(frames.map((f) => f.panelH))
      expect([...heights], 'the panel changed size during the swap').toHaveLength(1)
    })

    test('never requests the clip the reader did not choose', async ({ page }) => {
      const requested: string[] = []
      page.on('request', (r) => {
        if (/\.mp4(\?|$)/.test(r.url())) requested.push(new URL(r.url()).pathname)
      })

      await page.goto(`/projects/${project.id}`)
      await stage(page).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1200)

      // Stronger than preload="none" on a hidden element: the unchosen clip is
      // not in the DOM at all, so nothing about it is fetched, not even metadata.
      expect(requested, 'the unselected clip was fetched').not.toContain(second.src)
    })

    test('switching swaps the clip, resets to its own poster, and leaves nothing running', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      await stage(page).scrollIntoViewIfNeeded()
      await expect(transport(page)).toHaveText(new RegExp(`Pause ${first.label}`, 'i'), {
        timeout: 10_000,
      })
      // Let the first clip get somewhere, so "reset" is a real claim.
      await expect
        .poll(async () => clip(page).evaluate((v: HTMLVideoElement) => v.currentTime), {
          timeout: 10_000,
        })
        .toBeGreaterThan(0.3)

      await page.getByRole('tab', { name: second.label }).click()

      await expect(clip(page)).toHaveAttribute('src', second.src)
      await expect(clip(page)).toHaveAttribute('poster', second.poster)
      // Still exactly one player: the previous element is gone, so it cannot
      // still be running somewhere off screen.
      await expect(clip(page)).toHaveCount(1)
      await expect(page.getByRole('tab', { name: second.label })).toHaveAttribute(
        'aria-selected',
        'true'
      )
      await expect(page.getByRole('tab', { name: first.label })).toHaveAttribute(
        'aria-selected',
        'false'
      )
      // It starts from its own beginning, not from the previous clip's playhead.
      expect(
        await clip(page).evaluate((v: HTMLVideoElement) => v.currentTime)
      ).toBeLessThan(0.3)
    })

    test('the chooser is one tab stop, arrow-navigable, and commits on Enter', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      const tabs = page.getByRole('tab')
      await tabs.nth(0).scrollIntoViewIfNeeded()

      // Roving tabindex: the control is ONE tab stop, not one per option.
      expect(await tabs.nth(0).getAttribute('tabindex')).toBe('0')
      expect(await tabs.nth(1).getAttribute('tabindex')).toBe('-1')

      await tabs.nth(0).focus()
      await page.keyboard.press('ArrowRight')
      expect(
        await tabs.nth(1).evaluate((el) => el === document.activeElement),
        'ArrowRight did not move focus along the control'
      ).toBe(true)

      // MANUAL activation: moving focus must not start a video download on its
      // own. Selection only changes when the reader commits.
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')

      await page.keyboard.press('Enter')
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
      await expect(clip(page)).toHaveAttribute('src', second.src)

      // A focus ring a keyboard user can actually see.
      expect(
        await tabs.nth(1).evaluate((el) => {
          const cs = getComputedStyle(el)
          return el.matches(':focus-visible') && cs.outlineStyle !== 'none'
        })
      ).toBe(true)
    })

    test('does not loop, and the transport names the clip it acts on', async ({ page }) => {
      await page.goto(`/projects/${project.id}`)
      const el = clip(page)

      expect(
        await el.evaluate((v: HTMLVideoElement) => ({
          muted: v.muted,
          // NOT looping. The clip opens before the second observation and ends
          // past CPA, so its first and last frames are different pictures and a
          // loop can only cut between them.
          loop: v.loop,
          playsInline: v.hasAttribute('playsinline'),
          // No autoplay ATTRIBUTE: playback starts from an effect so reduced
          // motion can be honoured without a hydration mismatch.
          autoplayAttribute: v.hasAttribute('autoplay'),
        }))
      ).toEqual({ muted: true, loop: false, playsInline: true, autoplayAttribute: false })

      // `.case-figure-media` is object-fit: cover on a declared ratio and this
      // source is 1:1 -- cover would crop the board's top and bottom rings away.
      expect(await el.evaluate((v) => getComputedStyle(v).objectFit)).toBe('contain')

      // WCAG 2.2.2: the clip runs past five seconds, so a pause mechanism is
      // required. 2.5.5-sized target while we are here.
      const button = transport(page)
      await button.scrollIntoViewIfNeeded()
      const box = (await button.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
      await expect(button).toHaveText(new RegExp(first.label, 'i'))
    })

    test('plays once, then offers replay rather than pretending it can be played', async ({
      page,
    }) => {
      await page.goto(`/projects/${project.id}`)
      const el = clip(page)
      const button = transport(page)

      await el.scrollIntoViewIfNeeded()
      // Started by the reader arriving at it, not by mounting: a clip started at
      // mount would finish before the reader scrolled down to it.
      await expect(button).toHaveText(new RegExp(`Pause ${first.label}`, 'i'), { timeout: 10_000 })

      // Jump to the end rather than waiting out eight seconds of real time.
      await el.evaluate((v: HTMLVideoElement) => {
        v.currentTime = v.duration - 0.05
      })
      await expect(button).toHaveText(new RegExp(`Replay ${first.label}`, 'i'), { timeout: 10_000 })

      // It holds the final frame. A poster reappearing here, or a rewind to the
      // first frame, would both be wrong.
      expect(
        await el.evaluate((v: HTMLVideoElement) => ({ ended: v.ended, near: v.currentTime > 1 }))
      ).toEqual({ ended: true, near: true })

      // Replay restarts from the beginning. `paused` is not asserted: the press
      // begins playback and by the time this reads back it may already have
      // advanced -- currentTime returning to the start is the signal.
      await button.click()
      await expect(button).not.toHaveText(new RegExp(`Replay ${first.label}`, 'i'))
      expect(await el.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeLessThan(2)
    })

    test('under prefers-reduced-motion it shows the poster and never plays', async ({
      browser,
    }) => {
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
      const el = clip(page)
      await el.scrollIntoViewIfNeeded()
      await page.waitForTimeout(1500)

      const state = await el.evaluate((v: HTMLVideoElement) => ({
        paused: v.paused,
        t: v.currentTime,
      }))
      expect(state.paused, 'the clip autoplayed under reduced motion').toBe(true)
      // Not merely paused after the fact: it never advanced.
      expect(state.t).toBeLessThan(0.5)
      await expect(transport(page)).toHaveText(new RegExp(`Play ${first.label}`, 'i'))

      // Switching under reduced motion is INSTANT: no indicator slide and no
      // fade. The clip is already swapped on the next frame, where the animated
      // path would still be at zero opacity waiting out its 150ms fade-out.
      await page.getByRole('tab', { name: second.label }).click()
      await expect(el).toHaveAttribute('poster', second.poster, { timeout: 200 })
      expect(
        await page.locator('.case-clip-stage').evaluate((s) => ({
          swapping: s.getAttribute('data-swapping'),
          // The media layer, not the stage: the fade moved onto an unkeyed
          // wrapper inside the panel, so the panel behind it never disappears.
          clip: getComputedStyle(s.querySelector('.case-clip-media')!).opacity,
          clipEase: getComputedStyle(s.querySelector('.case-clip-media')!).transitionDuration,
          indicator: getComputedStyle(
            s.parentElement!.querySelector('.case-clip-indicator')!
          ).transitionDuration,
        }))
      ).toEqual({ swapping: null, clip: '1', clipEase: '0s', indicator: '0s' })

      await page.waitForTimeout(800)
      expect(await el.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)

      // The whole reason playback starts from an effect rather than an attribute.
      expect(errors, 'hydration or runtime errors under reduced motion').toEqual([])
      await context.close()
    })
  })
}
