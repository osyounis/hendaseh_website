import { test, expect, type Page } from '@playwright/test'

/**
 * Projects entrance cascade (added 2026-08-28).
 *
 * The page had no entrance while Home, About and Contact all had one, which
 * Omar caught unprompted -- Apple's Familiarity principle makes an
 * inconsistency like that a defect rather than a preference.
 *
 * Two things here are structural rather than decorative, and both are the
 * reason this file exists:
 *
 *  1. THE CASCADE MUST NEVER REPLAY ON FILTER. The contract mandates live,
 *     unanimated filtering ("instant reflow, no card animations on filter").
 *     An entrance on an element React remounts as the filtered set changes --
 *     a card, or any container carrying a query-dependent `key` -- would
 *     restart on every keystroke, which is the forbidden behaviour reached
 *     from the other direction. So beat 4 animates the filter bar and the grid
 *     CONTAINER, whose identities never change, and the cards carry nothing.
 *
 *  2. `.projects-bar` IS `position: sticky`. A `transform` or a `translate` on
 *     an ANCESTOR creates a containing block that can break sticky. The
 *     implementation animates the bar and the grid as SIBLINGS rather than
 *     wrapping them in one animated element, so the bar has no animated
 *     ancestor at all. That is asserted below, as is the bar's behaviour both
 *     DURING the animation and after it.
 */

const BEAT_COUNT = 5 // eyebrow, heading, lede, filter bar, grid container

/** Resolves once every entrance animation has run to completion. */
async function settle(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const els = Array.from(document.querySelectorAll('.projects-enter'))
          if (els.length === 0) return false
          return els.every((el) =>
            el.getAnimations().every((a) => a.playState === 'finished')
          )
        }),
      { message: 'the entrance cascade never settled' }
    )
    .toBe(true)
}

test.describe('Projects entrance', () => {
  // Deterministic regardless of the host's Reduce Motion setting -- see the
  // same note in tests/e2e/homepage.spec.ts.
  test.use({ contextOptions: { reducedMotion: 'no-preference' } })

  test('runs as four beats, with the bar and the grid sharing beat 4', async ({ page }) => {
    await page.goto('/projects')

    const beats = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.projects-enter')).map((el) => {
        const cs = getComputedStyle(el)
        return {
          what: el.tagName.toLowerCase() + '.' + el.className.split(/\s+/)[0],
          name: cs.animationName,
          duration: cs.animationDuration,
          delay: cs.animationDelay,
          fill: cs.animationFillMode,
        }
      })
    )

    expect(beats).toHaveLength(BEAT_COUNT)
    expect(beats.map((b) => b.delay)).toEqual(['0s', '0.12s', '0.24s', '0.36s', '0.36s'])

    // Beat 4 is ONE beat rendered by two components. If the two ever drift
    // apart, the bar and the grid stop arriving together and this goes red.
    expect(beats[3].delay).toBe(beats[4].delay)
    expect(beats[3].what).toBe('div.projects-bar')

    for (const beat of beats) {
      expect(beat.name, `${beat.what} is not on the shared keyframes`).toBe('projects-enter')
      expect(beat.duration).toBe('0.6s')
      // `both`, so the element rests at its end state rather than snapping
      // back to the authored `from`.
      expect(beat.fill).toBe('both')
    }

    await settle(page)
  })

  test('no card is animated, before or during filtering', async ({ page }) => {
    await page.goto('/projects')
    await settle(page)

    const countCardAnimations = () =>
      page.evaluate(() =>
        Array.from(document.querySelectorAll('[data-testid="project-card"]')).reduce(
          (total, el) => total + (el as HTMLElement).getAnimations({ subtree: true }).length,
          0
        )
      )

    expect(await countCardAnimations()).toBe(0)
    await page.getByLabel('Search projects').fill('cuda')
    await expect(page.getByRole('status')).toHaveText(/of 13 projects$/)
    expect(await countCardAnimations()).toBe(0)
  })

  test('the cascade does not replay when the filter changes', async ({ page }) => {
    await page.goto('/projects')
    await settle(page)

    // Stamp an expando on each animated container. An expando survives a
    // re-render and is destroyed by a REMOUNT, so reading it back afterwards
    // is a direct test of element identity -- which is the actual thing that
    // decides whether a CSS animation restarts.
    await page.evaluate(() => {
      document.querySelectorAll('.projects-enter').forEach((el, i) => {
        ;(el as HTMLElement & { __probe?: string }).__probe = `beat-${i}`
      })
    })

    const search = page.getByLabel('Search projects')
    for (const term of ['c', 'cu', 'cud', 'cuda']) {
      await search.fill(term)
      await expect(page.getByRole('status')).toHaveText(/of 13 projects$/)

      const state = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.projects-enter')).map((el) => ({
          probe: (el as HTMLElement & { __probe?: string }).__probe ?? null,
          running: el.getAnimations().filter((a) => a.playState !== 'finished').length,
          opacity: getComputedStyle(el).opacity,
        }))
      )

      expect(
        state.map((s) => s.probe),
        `a container was remounted while typing "${term}" -- the cascade will replay`
      ).toEqual(['beat-0', 'beat-1', 'beat-2', 'beat-3', 'beat-4'])
      expect(
        state.filter((s) => s.running > 0),
        `an entrance restarted while typing "${term}"`
      ).toEqual([])
      expect(state.map((s) => s.opacity)).toEqual(new Array(BEAT_COUNT).fill('1'))
    }

    // Clearing the query brings every card back without restarting anything.
    await search.fill('')
    await expect(page.getByRole('status')).toHaveText('13 of 13 projects')
    expect(
      await page.evaluate(() =>
        Array.from(document.querySelectorAll('.projects-enter')).filter((el) =>
          el.getAnimations().some((a) => a.playState !== 'finished')
        ).length
      )
    ).toBe(0)
  })

  test('the sticky bar has no animated ancestor and sticks during AND after the entrance', async ({
    page,
  }) => {
    await page.goto('/projects')

    // The chosen solution, asserted directly: the bar and the grid are
    // siblings, so nothing above the bar is animated. A wrapper approach would
    // fail here -- which is the point, because a transformed ancestor is what
    // breaks sticky.
    expect(
      await page.evaluate(() => {
        const bar = document.querySelector('.projects-bar')!
        for (let n = bar.parentElement; n; n = n.parentElement) {
          if (n.getAnimations().length > 0) return n.tagName + '.' + n.className
        }
        return null
      }),
      'the sticky bar has an animated ancestor'
    ).toBeNull()

    // DURING: park the bar's own animation mid-flight rather than racing it,
    // so this measures the real transformed state deterministically. 0.36s of
    // delay + 0.6s of duration, so 0.5s is 140ms into the movement.
    await page.evaluate(() => {
      for (const a of document.querySelector('.projects-bar')!.getAnimations()) {
        a.pause()
        a.currentTime = 500
      }
    })

    const mid = await page.evaluate(() => {
      const bar = document.querySelector('.projects-bar')! as HTMLElement
      window.scrollTo(0, 900)
      const cs = getComputedStyle(bar)
      return {
        translate: cs.translate,
        top: bar.getBoundingClientRect().top,
        scrolled: window.scrollY,
      }
    })

    expect(mid.scrolled, 'the page did not scroll -- the sticky check is vacuous')
      .toBeGreaterThan(400)
    // Genuinely mid-animation: a translate is applied right now.
    expect(mid.translate).not.toBe('none')
    // Still stuck. It rides its own remaining offset (<= the 18px it starts
    // from), rather than scrolling away off the top of the viewport.
    expect(mid.top).toBeGreaterThanOrEqual(0)
    expect(mid.top).toBeLessThanOrEqual(18)

    // AFTER: finish the animation and the bar sits exactly on the top edge.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('.projects-enter')) {
        for (const a of el.getAnimations()) a.finish()
      }
    })

    const after = await page.evaluate(() => {
      const bar = document.querySelector('.projects-bar')! as HTMLElement
      return {
        translate: getComputedStyle(bar).translate,
        position: getComputedStyle(bar).position,
        top: bar.getBoundingClientRect().top,
      }
    })

    expect(after.position).toBe('sticky')
    expect(after.translate).toBe('0px')
    expect(after.top).toBeCloseTo(0, 0)

    // And it is still stuck further down the page.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    expect(
      await page.locator('.projects-bar').evaluate((el) => el.getBoundingClientRect().top)
    ).toBeCloseTo(0, 0)
  })
})

test('under prefers-reduced-motion the cascade is a correct static frame', async ({ browser }) => {
  // An explicit context, not test.use() -- see the header of
  // tests/e2e/reduced-motion-hydration.spec.ts for why.
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/projects')

  expect(
    await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  ).toBe(true)
  await page.waitForFunction(() => document.readyState === 'complete')

  const frames = await page.locator('.projects-enter').evaluateAll((els) =>
    els.map((el) => {
      const cs = getComputedStyle(el)
      return {
        what: el.tagName.toLowerCase() + '.' + el.className.split(/\s+/)[0],
        animationName: cs.animationName,
        opacity: cs.opacity,
        translate: cs.translate,
      }
    })
  )

  expect(frames).toHaveLength(BEAT_COUNT)
  for (const f of frames) {
    expect(f.animationName, `${f.what} still animates under reduced motion`).toBe('none')
    expect(f.opacity, `${f.what} rests hidden under reduced motion`).toBe('1')
    expect(['none', '0px'], `${f.what} rests offset under reduced motion`).toContain(f.translate)
  }

  await context.close()
})
