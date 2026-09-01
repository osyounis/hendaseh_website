import { test, expect, type Page } from '@playwright/test'
import projectsData from '../../src/data/projects.json'

/**
 * Case-study hero entrance cascade (added 2026-08-28).
 *
 * The hero was the last static one on the site -- the same consistency defect
 * Omar caught on /projects. Scope is the HERO ONLY: the body below keeps its
 * `[data-reveal]` scroll reveals, which are a separate system and are covered
 * by tests/e2e/projects-no-js.spec.ts.
 *
 * THE ASSERTION THAT MATTERS IS `presses still work after the entrance`.
 * An animation's filled end state beats every normal declaration in the
 * cascade, so a `transform`-based entrance ending at `transform: none`, left
 * on an element that also hovers or presses with a transform, kills that
 * response forever -- silently. This codebase has been bitten by it twice
 * (B3's `.home-tile` hover, and the note in contact.css), and the hero's
 * action buttons are `.pill`s whose `:active` IS `transform: scale(0.97)`.
 *
 * The implementation defends twice over: the entrance rides on `translate`
 * (independent of `transform`), and it is applied to `.case-actions`, the
 * wrapper, never to a pill. This file asserts the OBSERVABLE consequence
 * rather than either mechanism, so it stays honest if someone reworks how the
 * entrance is built.
 */

const projects = (projectsData as { projects: { id: string; private?: boolean }[] }).projects

const SLUGS = ['brent-cuda', 'radar-moboard', 'a16-summarizer', 'coast-guard-pilot-tracker'] as const

const BEATS: [string, string][] = [
  ['.case-crumb', '0s'],
  ['.case-icon', '0.1s'],
  ['.case-hero-copy', '0.2s'],
  ['.case-actions', '0.3s'],
  ['.case-stats', '0.4s'],
]

/** Resolves once every hero entrance animation has run to completion. */
async function settle(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const els = Array.from(document.querySelectorAll('.case-enter'))
          if (els.length === 0) return false
          return els.every((el) => el.getAnimations().every((a) => a.playState === 'finished'))
        }),
      { message: 'the hero entrance never settled' }
    )
    .toBe(true)
}

for (const slug of SLUGS) {
  test.describe(`/projects/${slug} hero entrance`, () => {
    // Deterministic regardless of the host's Reduce Motion setting.
    test.use({ contextOptions: { reducedMotion: 'no-preference' } })

    test('runs as five beats in the hero reading order', async ({ page }) => {
      await page.goto(`/projects/${slug}`)

      const measured = await page.evaluate((beats) => {
        return beats.map(([selector]) => {
          const el = document.querySelector(selector)
          if (!el) return { selector, missing: true }
          const cs = getComputedStyle(el)
          return {
            selector,
            missing: false,
            hasClass: el.classList.contains('case-enter'),
            name: cs.animationName,
            duration: cs.animationDuration,
            delay: cs.animationDelay,
            fill: cs.animationFillMode,
            // Hero elements take entrance classes, never `data-reveal`. The
            // two systems animate different properties for different reasons
            // and are deliberately not mixed on one element.
            reveal: el.getAttribute('data-reveal'),
          }
        })
      }, BEATS)

      expect(measured.filter((m) => m.missing)).toEqual([])
      expect(measured.map((m) => m.delay)).toEqual(BEATS.map(([, delay]) => delay))

      for (const m of measured) {
        expect(m.hasClass, `${m.selector} is not on the shared entrance class`).toBe(true)
        expect(m.name).toBe('case-enter')
        expect(m.duration).toBe('0.6s')
        expect(m.fill).toBe('both')
        expect(m.reveal, `${m.selector} mixes the reveal system into the hero`).toBeNull()
      }

      // ...and the converse: the body's reveal targets never take the
      // entrance class.
      expect(await page.locator('[data-reveal].case-enter').count()).toBe(0)

      await settle(page)
    })

    test('the hero pills press AFTER the entrance has finished', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      await settle(page)

      const pills = page.locator('.case-actions .pill')
      const count = await pills.count()

      // Guard the guard: an empty set would make the loop below pass vacuously.
      // This used to assert every case study has at least the GitHub button,
      // which held until `radar-moboard` arrived with a private repository and
      // so no repo pill and no action at all. An actionless hero is legitimate
      // for exactly that reason and nothing else, so prove the reason rather
      // than lowering the bar: a page may have zero pills only if its project
      // is marked private. Every other slug still runs the full loop, and
      // The non-vacuity test below keeps the suite honest across all slugs.
      if (count === 0) {
        expect(
          projects.find((p) => p.id === slug)?.private,
          `${slug} has no hero action and is not marked private`
        ).toBe(true)
        return
      }

      for (let i = 0; i < count; i++) {
        const pill = pills.nth(i)
        const label = (await pill.textContent())?.trim() ?? `pill ${i}`

        // At rest the button must carry NO transform. A `transform`-based
        // entrance would leave a filled `matrix(1, 0, 0, 1, 0, 0)` here, and
        // that filled value is exactly what would beat `:active` below.
        expect(
          await pill.evaluate((el) => getComputedStyle(el).transform),
          `"${label}" rests with a transform applied -- a filled entrance value will beat :active`
        ).toBe('none')

        // The entrance itself must not be on the button.
        expect(
          await pill.evaluate((el) => el.classList.contains('case-enter')),
          `"${label}" carries the entrance itself; it belongs on the .case-actions wrapper`
        ).toBe(false)

        // Now actually press it and read the live computed value. This is the
        // assertion that catches the whole class of bug: if a filled entrance
        // value were sitting on this element, `:active` would compute to that
        // value instead and never reach the scale.
        //
        // POLLED, not read once. `.pill` transitions `transform` over 100ms,
        // so the read taken the instant the button goes down returns the
        // identity matrix it is easing away FROM, not the scale it is easing
        // to. Held down for the duration of the poll.
        await pill.scrollIntoViewIfNeeded()
        const box = (await pill.boundingBox())!
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        await page.mouse.down()
        try {
          await expect
            .poll(() => pill.evaluate((el) => getComputedStyle(el).transform), {
              message: `"${label}" does not scale on :active after the entrance`,
            })
            .toBe('matrix(0.97, 0, 0, 0.97, 0, 0)')
        } finally {
          // Release the mouse SOMEWHERE ELSE, so the press never completes as
          // a click. An in-page anchor would jump the page on release, and
          // the next pill in this loop then
          // gets a mousedown at coordinates it has already scrolled away from
          // -- which reads as "the press response is broken" when nothing is
          // wrong. Released in `finally` so a failure cannot leave the button
          // held down either.
          await page.mouse.move(0, 0)
          await page.mouse.up()
        }
      }
    })

    test('every beat rests at its end state', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      await settle(page)

      const rested = await page.evaluate((beats) =>
        beats.map(([selector]) => {
          const cs = getComputedStyle(document.querySelector(selector)!)
          return { selector, opacity: cs.opacity, translate: cs.translate }
        }, [])
      , BEATS)

      for (const r of rested) {
        expect(r.opacity, `${r.selector} rests hidden`).toBe('1')
        expect(r.translate, `${r.selector} rests offset`).toBe('0px')
      }
    })
  })

  test(`/projects/${slug} hero is static under prefers-reduced-motion`, async ({ browser }) => {
    // An explicit context, not test.use() -- see the header of
    // tests/e2e/reduced-motion-hydration.spec.ts for why.
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto(`/projects/${slug}`)

    expect(
      await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ).toBe(true)
    await page.waitForFunction(() => document.readyState === 'complete')

    const frames = await page.locator('.case-enter').evaluateAll((els) =>
      els.map((el) => {
        const cs = getComputedStyle(el)
        return {
          what: el.className.split(/\s+/)[0],
          animationName: cs.animationName,
          opacity: cs.opacity,
          translate: cs.translate,
        }
      })
    )

    expect(frames).toHaveLength(BEATS.length)
    for (const f of frames) {
      expect(f.animationName, `${f.what} still animates under reduced motion`).toBe('none')
      expect(f.opacity, `${f.what} rests hidden under reduced motion`).toBe('1')
      expect(['none', '0px'], `${f.what} rests offset under reduced motion`).toContain(f.translate)
    }

    await context.close()
  })

  test.describe(`/projects/${slug} hero without JavaScript`, () => {
    test.use({ javaScriptEnabled: false })

    test('the entrance still runs and settles', async ({ page }) => {
      await page.goto(`/projects/${slug}`)

      // Pure CSS, so it needs no script. Polled because the last beat starts
      // 0.4s in -- a read on `load` would catch a frame where the hero is
      // legitimately still arriving.
      await expect
        .poll(
          () =>
            page
              .locator('.case-enter')
              .evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length),
          { message: 'the hero never settled without JavaScript' }
        )
        .toBe(0)

      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('.case-stats .case-stat')).toHaveCount(3)
    })
  })
}

// Non-vacuity, at the suite level rather than per slug. The per-slug guard above
// lets a private project's hero have no pills; this makes sure that escape hatch
// cannot quietly swallow every slug at once, which would leave the press
// assertions running against nothing.
test('at least one case-study hero actually has pills to press', async ({ page }) => {
  let total = 0
  for (const slug of SLUGS) {
    await page.goto(`/projects/${slug}`)
    total += await page.locator('.case-actions .pill').count()
  }
  expect(total, 'no case study renders a hero action at all').toBeGreaterThan(0)
})
