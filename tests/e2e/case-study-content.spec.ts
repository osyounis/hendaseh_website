import { test, expect } from '@playwright/test'
import { getCaseStudyProjects } from '@/lib/projects'
import {
  getCaseStudy,
  clipScenarios,
  mediaCaptions,
  type CaseStudyClip,
  type CaseStudyClipScenario,
} from '@/lib/caseStudies'

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
          // the choice, so only its (default scenario's) caption reaches the
          // caption element.
          b.kind === 'clips'
            ? clipScenarios(b)[0]!.caption
            : [b.title, b.caption].filter(Boolean).join('\n')
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
            clipScenarios(block)[0]!.clips[0].src
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
      for (const caption of mediaCaptions(block)) {
        expect(caption, `${slug} caption lost its synthetic marker`).toContain(sentence)
      }
    }

    await page.goto(`/projects/${slug}`)
    const captions = page.locator('.case-media-stack .case-caption')
    await expect(captions).toHaveCount(blocks.length)
    for (let i = 0; i < blocks.length; i++) {
      await expect(captions.nth(i)).toContainText(sentence)
    }

    // A scenario's caption only reaches the page once it is chosen, so choose
    // each one and read it there too.
    const tabs = page.getByRole('tablist').getByRole('tab')
    for (let t = 1; t < (await tabs.count()); t++) {
      await tabs.nth(t).click()
      await expect(page.locator('.case-media-stack .case-caption').filter({ hasText: sentence }))
        .toHaveCount(blocks.length)
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
 * The clip blocks. Derived from the data, and written for the shape radar-moboard
 * ships: two scenarios (a tablist) of two views (a group of pressed buttons), in
 * ONE player with ONE <video>.
 */
const CLIP_BLOCKS = CASE_STUDIES.flatMap((p) =>
  (getCaseStudy(p.id)!.media ?? []).flatMap((b, index) =>
    b.kind === 'clips' ? [{ slug: p.id, index, block: b, scenarios: clipScenarios(b) }] : []
  )
)

test('only radar-moboard ships clips: two scenarios of two views, in one block', async () => {
  expect(
    CLIP_BLOCKS.map(
      (c) =>
        `${c.slug}:` +
        c.scenarios.map((s) => `${s.id}(${s.clips.map((clip) => clip.id).join('+')})`).join('+')
    )
  ).toEqual(['radar-moboard:avoid(board+seaview)+intercept(board+seaview)'])
})

type Page = import('@playwright/test').Page

for (const { slug, index: blockIndex, block, scenarios } of CLIP_BLOCKS) {
  const [S0, S1] = scenarios as readonly CaseStudyClipScenario[] as [
    CaseStudyClipScenario,
    CaseStudyClipScenario,
  ]
  const [V0, V1] = S0.clips as readonly CaseStudyClip[] as [CaseStudyClip, CaseStudyClip]
  const clipAt = (s: CaseStudyClipScenario, viewId: string) => s.clips.find((c) => c.id === viewId)!
  /** The transport's subject, after its verb: "avoid, board view". */
  const named = (s: CaseStudyClipScenario, v: CaseStudyClip) => `${s.label}, ${v.label}`

  const stage = (page: Page) => page.locator('.case-clip-stage')
  const clip = (page: Page) => page.locator('.case-video')
  const transport = (page: Page) => page.locator('.case-video-toggle')
  const scenarioTabs = (page: Page) => page.getByRole('tablist').getByRole('tab')
  const viewButtons = (page: Page) => page.getByRole('group', { name: 'View' }).getByRole('button')
  const caption = (page: Page) => page.locator('.case-media-stack .case-caption').nth(blockIndex)
  const isFocused = (l: import('@playwright/test').Locator) =>
    l.evaluate((el) => el === document.activeElement)

  test.describe(`/projects/${slug} clips`, () => {
    test('offers one video area: a scenario tablist and a view toggle, never two players', async ({
      page,
    }) => {
      await page.goto(`/projects/${slug}`)

      await expect(clip(page)).toHaveCount(1)
      await expect(clip(page)).toHaveAttribute('src', V0.src)
      await expect(clip(page)).toHaveAttribute('poster', V0.poster)

      await expect(page.getByRole('tablist')).toHaveCount(1)
      expect(await scenarioTabs(page).allInnerTexts()).toEqual(scenarios.map((s) => s.label))
      await expect(scenarioTabs(page).nth(0)).toHaveAttribute('aria-selected', 'true')
      await expect(scenarioTabs(page).nth(1)).toHaveAttribute('aria-selected', 'false')

      // The view is NOT a second tablist: two tablists pointing at one panel is
      // a broken tabs pattern. It is a pair of pressed / unpressed buttons.
      expect(await viewButtons(page).allInnerTexts()).toEqual(S0.clips.map((c) => c.label))
      await expect(viewButtons(page).nth(0)).toHaveAttribute('aria-pressed', 'true')
      await expect(viewButtons(page).nth(1)).toHaveAttribute('aria-pressed', 'false')

      const panel = page.getByRole('tabpanel')
      await expect(panel).toHaveCount(1)
      expect(await panel.getAttribute('aria-labelledby')).toBe(
        await scenarioTabs(page).nth(0).getAttribute('id')
      )
    })

    test('names the scenario choice by the sentence above it', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      const heading = page.locator('.case-clip-title')
      await expect(heading).toHaveCount(1)
      await expect(heading).toHaveText(block.title!)
      const list = page.getByRole('tablist')
      expect(await list.getAttribute('aria-labelledby')).toBe(await heading.getAttribute('id'))
      await expect(list).not.toHaveAttribute('aria-label', /./)
      await expect(list).toHaveAccessibleName(block.title!)
    })

    test('sets the switches side by side when wide, stacks them when narrow, never overflows', async ({
      page,
    }) => {
      for (const width of [1440, 768, 600, 390]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/projects/${slug}`)
        const switches = page.locator('.case-clip-switch')
        await switches.first().scrollIntoViewIfNeeded()
        // Both rects in ONE evaluation: the tile is still riding its scroll
        // reveal, and two awaited boundingBox() calls sample it a frame apart.
        const [a, b] = await switches.evaluateAll((els) =>
          els.slice(0, 2).map((el) => {
            const r = el.getBoundingClientRect()
            return { x: r.x, y: r.y, width: r.width, height: r.height }
          })
        )
        const tile = (await page.locator('.case-media-stack .case-figure').nth(blockIndex).boundingBox())!

        for (const box of [a, b]) {
          expect(box.x, `a switch overflows left at ${width}px`).toBeGreaterThanOrEqual(tile.x - 0.5)
          expect(box.x + box.width, `a switch overflows right at ${width}px`).toBeLessThanOrEqual(
            tile.x + tile.width + 0.5
          )
        }
        // The touch floor holds on every option at every width: neither switch
        // is shrunk to make room for the other.
        const heights = await page
          .locator('.case-clip-tab')
          .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height))
        for (const h of heights) expect(h, `an option is under 44px at ${width}px`).toBeGreaterThanOrEqual(44)

        // Scenario first, in both layouts.
        expect(b.y + b.x, `view switch is not after the scenario at ${width}px`).toBeGreaterThan(a.y + a.x)
        if (width === 1440) {
          expect(Math.abs(a.y - b.y), 'switches are not on one row at 1440').toBeLessThan(1)
          expect(b.x, 'view switch is not right of the scenario at 1440').toBeGreaterThan(a.x + a.width)
        }
        if (width === 390) {
          expect(b.y, 'view switch is not stacked under the scenario at 390').toBeGreaterThanOrEqual(
            a.y + a.height
          )
          expect(Math.abs(a.width - b.width), 'stacked switches differ in width at 390').toBeLessThan(1)
        }
      }
    })

    test("keeps each switch's columns equal and its labels inside the pill, down to 390px", async ({
      page,
    }) => {
      for (const width of [1440, 768, 390]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/projects/${slug}`)
        const switches = page.locator('.case-clip-switch')
        await switches.first().scrollIntoViewIfNeeded()
        for (let i = 0; i < 2; i++) {
          const options = switches.nth(i).locator('.case-clip-tab')
          // EQUAL COLUMNS ARE THE INDICATOR'S WHOLE PREMISE: it is one column
          // wide and travels by 100% of itself.
          const boxes = await options.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width))
          expect(Math.abs(boxes[0] - boxes[1]), `switch ${i} columns disagree at ${width}px`).toBeLessThan(1)
          const indicator = (await switches.nth(i).locator('.case-clip-indicator').boundingBox())!
          expect(Math.abs(indicator.width - boxes[0]), `switch ${i} indicator misfits at ${width}px`).toBeLessThan(1)
          const slack = await options.evaluateAll((els) =>
            els.map((el) => {
              const range = document.createRange()
              range.selectNodeContents(el)
              return el.getBoundingClientRect().width - range.getBoundingClientRect().width
            })
          )
          for (const [j, s] of slack.entries()) {
            expect(s, `switch ${i} label ${j} has ${s}px of slack at ${width}px`).toBeGreaterThan(24)
          }
        }
      }
    })

    test('carries selection on a moving indicator, not by recolouring the label', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      for (let i = 0; i < 2; i++) {
        const sw = page.locator('.case-clip-switch').nth(i)
        const options = sw.locator('.case-clip-tab')
        await options.first().scrollIntoViewIfNeeded()
        const colours = await options.evaluateAll((els) => els.map((el) => getComputedStyle(el).color))
        expect(new Set(colours).size, `switch ${i} labels are not one colour`).toBe(1)
        const indicator = sw.locator('.case-clip-indicator')
        const at = () =>
          indicator.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)
        const home = await at()
        await options.nth(1).click()
        await expect.poll(at, { timeout: 3000 }).toBeGreaterThan(home + 1)
      }
    })

    test('the scenario indicator retargets mid-flight instead of snapping or queueing', async ({
      page,
    }) => {
      await page.goto(`/projects/${slug}`)
      const tabs = scenarioTabs(page)
      const indicator = page.locator('.case-clip-switch').nth(0).locator('.case-clip-indicator')
      await tabs.first().scrollIntoViewIfNeeded()
      const at = () =>
        indicator.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)

      const home = await at()
      await tabs.nth(1).click()
      await page.waitForTimeout(110)
      const midway = await at()
      expect(midway, 'the indicator never left its first tab').toBeGreaterThan(home + 1)
      const target = await indicator.evaluate((el) => el.getBoundingClientRect().width)
      expect(midway, 'the indicator had already arrived; catch it earlier').toBeLessThan(home + target - 1)

      await tabs.nth(0).click()
      // Snapped, queued or restarted would each visit an anchor; retargeting
      // from the presentation value visits neither.
      const justAfter = await at()
      expect(justAfter, 'the indicator snapped home on reversal').toBeGreaterThan(home + 1)
      expect(justAfter, 'the indicator snapped to the far tab on reversal').toBeLessThan(home + target - 2)
      const samples: number[] = []
      for (let i = 0; i < 8; i++) {
        samples.push(await at())
        await page.waitForTimeout(20)
      }
      expect(Math.max(...samples), 'the indicator queued or restarted').toBeLessThan(home + target - 2)

      await expect.poll(at, { timeout: 3000 }).toBeLessThan(home + 1)
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
      await expect(clip(page)).toHaveAttribute('src', V0.src)
      await expect(clip(page)).toHaveAttribute('poster', V0.poster)
      await expect(caption(page)).toHaveText(S0.caption)
    })

    test('swaps the clip while it is invisible, and never empties the frame', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      await stage(page).scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)

      const frames = await page.evaluate(async (target) => {
        const stage = document.querySelector('.case-clip-stage')!
        const button = [...document.querySelectorAll('[role=group] .case-clip-tab')][1] as HTMLElement
        const out: { t: number; opacity: number; src: string; panelH: number }[] = []
        const t0 = performance.now()
        button.click()
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
        return out.map((f) => ({ ...f, swapped: f.src === target }))
      }, V1.src)

      const swap = frames.findIndex((f) => f.swapped)
      expect(swap, 'the clip never swapped').toBeGreaterThan(0)
      expect(frames[swap].opacity, 'the clip was swapped in plain sight').toBeLessThan(0.05)
      const after = frames.slice(swap).map((f) => f.opacity)
      expect(Math.max(...after)).toBeGreaterThan(0.95)
      expect(after.filter((o) => o > 0.1 && o < 0.9).length, 'the clip popped in').toBeGreaterThan(1)
      expect([...new Set(frames.map((f) => f.panelH))], 'the panel changed size').toHaveLength(1)
    })

    test('never requests a clip the reader did not land on', async ({ page }) => {
      const requested: string[] = []
      page.on('request', (r) => {
        if (/\.mp4(\?|$)/.test(r.url())) requested.push(new URL(r.url()).pathname)
      })

      await page.goto(`/projects/${slug}`)
      await stage(page).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1200)
      expect(
        requested.filter((src) => src !== V0.src),
        'more than the default clip was fetched on load'
      ).toEqual([])

      // Two choices inside ONE fade, on two different switches: Intercept, then
      // Sea view. The pair passed through on the way (intercept + board) must
      // never mount, so it must never be fetched.
      // The second click is spaced INSIDE the 200ms fade (in the same evaluate,
      // so Playwright round-trips cannot push it past the fade), so the
      // intermediate pair exists in state and must still never mount.
      await page.evaluate(async () => {
        ;(document.querySelectorAll('[role=tablist] [role=tab]')[1] as HTMLElement).click()
        await new Promise((r) => setTimeout(r, 60))
        ;(document.querySelectorAll('[role=group] .case-clip-tab')[1] as HTMLElement).click()
      })
      await expect(clip(page)).toHaveAttribute('src', clipAt(S1, V1.id).src)
      await expect(clip(page)).toHaveAttribute('poster', clipAt(S1, V1.id).poster)
      await expect(caption(page)).toHaveText(S1.caption)
      await expect(clip(page)).toHaveCount(1)
      await page.waitForTimeout(1200)
      expect(requested, 'a pair passed through mid-fade was fetched').not.toContain(clipAt(S1, V0.id).src)
      expect(requested, 'the unchosen avoid view was fetched').not.toContain(V1.src)
    })

    test('keeps the chosen view across a scenario switch', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      await stage(page).scrollIntoViewIfNeeded()

      await viewButtons(page).nth(1).click()
      await expect(clip(page)).toHaveAttribute('src', V1.src)

      await scenarioTabs(page).nth(1).click()
      await expect(clip(page)).toHaveAttribute('src', clipAt(S1, V1.id).src)
      await expect(viewButtons(page).nth(1)).toHaveAttribute('aria-pressed', 'true')

      await scenarioTabs(page).nth(0).click()
      await expect(clip(page)).toHaveAttribute('src', V1.src)
      await expect(clip(page)).toHaveCount(1)
    })

    test('swaps the caption with the scenario, and keeps the title fixed', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      await expect(caption(page)).toHaveText(S0.caption)

      await scenarioTabs(page).nth(1).click()
      await expect(caption(page)).toHaveText(S1.caption)
      await expect(page.locator('.case-clip-title')).toHaveText(block.title!)

      // The view does not change what the run is, so it does not change the caption.
      await viewButtons(page).nth(1).click()
      await expect(clip(page)).toHaveAttribute('src', clipAt(S1, V1.id).src)
      await expect(caption(page)).toHaveText(S1.caption)
    })

    test('switching swaps the clip, resets to its own poster, and leaves nothing running', async ({
      page,
    }) => {
      await page.goto(`/projects/${slug}`)
      await stage(page).scrollIntoViewIfNeeded()
      await expect(transport(page)).toHaveText(new RegExp(`Pause ${named(S0, V0)}`, 'i'), {
        timeout: 10_000,
      })
      await expect
        .poll(async () => clip(page).evaluate((v: HTMLVideoElement) => v.currentTime), {
          timeout: 10_000,
        })
        .toBeGreaterThan(0.3)

      await scenarioTabs(page).nth(1).click()

      const landed = clipAt(S1, V0.id)
      await expect(clip(page)).toHaveAttribute('src', landed.src)
      await expect(clip(page)).toHaveAttribute('poster', landed.poster)
      await expect(clip(page)).toHaveCount(1)
      expect(await clip(page).evaluate((v: HTMLVideoElement) => v.currentTime)).toBeLessThan(0.3)
    })

    test('scenario is one tab stop with manual activation, then the view, then the transport', async ({
      page,
    }) => {
      await page.goto(`/projects/${slug}`)
      const tabs = scenarioTabs(page)
      await tabs.nth(0).scrollIntoViewIfNeeded()

      expect(await tabs.nth(0).getAttribute('tabindex')).toBe('0')
      expect(await tabs.nth(1).getAttribute('tabindex')).toBe('-1')

      await tabs.nth(0).focus()
      await page.keyboard.press('ArrowRight')
      expect(await isFocused(tabs.nth(1)), 'ArrowRight did not move focus').toBe(true)
      // MANUAL activation: focus alone must not start a download.
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')

      await page.keyboard.press('Enter')
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
      await expect(clip(page)).toHaveAttribute('src', clipAt(S1, V0.id).src)
      expect(
        await tabs.nth(1).evaluate(
          (el) => el.matches(':focus-visible') && getComputedStyle(el).outlineStyle !== 'none'
        )
      ).toBe(true)

      // Reading order: scenario, then view, then the transport.
      await page.keyboard.press('Tab')
      expect(await isFocused(viewButtons(page).nth(0)), 'Tab did not reach the view').toBe(true)
      await page.keyboard.press('Tab')
      expect(await isFocused(viewButtons(page).nth(1))).toBe(true)
      await page.keyboard.press('Space')
      await expect(viewButtons(page).nth(1)).toHaveAttribute('aria-pressed', 'true')
      await expect(clip(page)).toHaveAttribute('src', clipAt(S1, V1.id).src)
      await page.keyboard.press('Tab')
      expect(await isFocused(transport(page)), 'Tab did not reach the transport').toBe(true)
    })

    test('does not loop, and the transport names the scenario and the view it acts on', async ({
      page,
    }) => {
      await page.goto(`/projects/${slug}`)
      const el = clip(page)
      expect(
        await el.evaluate((v: HTMLVideoElement) => ({
          muted: v.muted,
          loop: v.loop,
          playsInline: v.hasAttribute('playsinline'),
          autoplayAttribute: v.hasAttribute('autoplay'),
        }))
      ).toEqual({ muted: true, loop: false, playsInline: true, autoplayAttribute: false })
      expect(await el.evaluate((v) => getComputedStyle(v).objectFit)).toBe('contain')

      const button = transport(page)
      await button.scrollIntoViewIfNeeded()
      const box = (await button.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
      // "Board view" is offered in both scenarios, so the name must say which.
      await expect(button).toHaveText(new RegExp(named(S0, V0), 'i'))
      await scenarioTabs(page).nth(1).click()
      await expect(button).toHaveText(new RegExp(named(S1, V0), 'i'))
    })

    test('plays once, then offers replay rather than pretending it can be played', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      const el = clip(page)
      const button = transport(page)
      await el.scrollIntoViewIfNeeded()
      await expect(button).toHaveText(new RegExp(`Pause ${named(S0, V0)}`, 'i'), { timeout: 10_000 })
      await el.evaluate((v: HTMLVideoElement) => {
        v.currentTime = v.duration - 0.05
      })
      await expect(button).toHaveText(new RegExp(`Replay ${named(S0, V0)}`, 'i'), { timeout: 10_000 })
      expect(
        await el.evaluate((v: HTMLVideoElement) => ({ ended: v.ended, near: v.currentTime > 1 }))
      ).toEqual({ ended: true, near: true })
      await button.click()
      await expect(button).not.toHaveText(new RegExp(`Replay ${named(S0, V0)}`, 'i'))
      expect(await el.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeLessThan(2)
    })

    test('under prefers-reduced-motion it shows the poster, never plays, and switches instantly', async ({
      browser,
    }) => {
      const context = await browser.newContext({ reducedMotion: 'reduce' })
      const page = await context.newPage()
      const HYDRATION_ERROR = /hydrat|did not match|Minified React error #(418|423|425)/i
      const errors: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error' && HYDRATION_ERROR.test(m.text())) errors.push(m.text())
      })

      await page.goto(`/projects/${slug}`)
      const el = clip(page)
      await el.scrollIntoViewIfNeeded()
      await page.waitForTimeout(1500)
      const state = await el.evaluate((v: HTMLVideoElement) => ({ paused: v.paused, t: v.currentTime }))
      expect(state.paused, 'the clip autoplayed under reduced motion').toBe(true)
      expect(state.t).toBeLessThan(0.5)
      await expect(transport(page)).toHaveText(new RegExp(`Play ${named(S0, V0)}`, 'i'))

      // Both axes switch instantly: no fade, no slide.
      await viewButtons(page).nth(1).click()
      await expect(el).toHaveAttribute('poster', V1.poster, { timeout: 200 })
      await scenarioTabs(page).nth(1).click()
      await expect(el).toHaveAttribute('poster', clipAt(S1, V1.id).poster, { timeout: 200 })
      expect(
        await page.locator('.case-clip-stage').evaluate((s) => ({
          swapping: s.getAttribute('data-swapping'),
          clip: getComputedStyle(s.querySelector('.case-clip-media')!).opacity,
          clipEase: getComputedStyle(s.querySelector('.case-clip-media')!).transitionDuration,
          indicators: [...s.parentElement!.querySelectorAll('.case-clip-indicator')].map(
            (i) => getComputedStyle(i).transitionDuration
          ),
        }))
      ).toEqual({ swapping: null, clip: '1', clipEase: '0s', indicators: ['0s', '0s'] })

      // A scenario switch under reduce must not autoplay the new clip either.
      await page.waitForTimeout(800)
      expect(await el.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
      expect(errors, 'hydration or runtime errors under reduced motion').toEqual([])
      await context.close()
    })
  })
}
