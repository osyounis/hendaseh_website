import { test, expect, type Page } from '@playwright/test'

const TAGLINE = 'Software Engineer · iOS, ML & Autonomous Systems'
const MOBILE_VIEWPORT = { width: 390, height: 844 }
const MOBILE_CONTEXT = { viewport: MOBILE_VIEWPORT, isMobile: true, hasTouch: true }

// Mirrors tests/e2e/reduced-motion-hydration.spec.ts — see that file's header for
// why the pattern is written this way and what it does and does not catch.
const HYDRATION_ERROR_PATTERN = /hydrat|did not match|Minified React error #(418|423|425)/i

// Reads the computed animation-name of every moving part of the hero set-piece
// plus the ticker tape. 'MISSING' rather than a throw so a renamed class fails
// the assertion loudly instead of erroring out ambiguously.
const readAnimationNames = () => {
  const pick = (selector: string) => {
    const el = document.querySelector(selector)
    return el ? getComputedStyle(el).animationName : 'MISSING'
  }
  return {
    aurora: pick('.home-aurora'),
    core: pick('.home-core'),
    swarm: pick('.home-swarm'),
    satellite: pick('[data-testid="hero-satellite"]'),
    satelliteIcon: pick('[data-testid="hero-satellite"] img'),
    tape: pick('.home-tape'),
  }
}

/*
 * The mobile menu panel scales 0.97 -> 1 on the way in, so a
 * getBoundingClientRect() taken mid-transition reports every row ~3% short and
 * would fail the 44px tap-target floor for reasons that have nothing to do with
 * the layout. This waits on the real end condition: the open rule sets
 * `transform: none`, so the computed transform resolves to the string 'none'
 * only once the transition has actually landed. Never a bare timeout.
 */
const settleMenu = async (page: Page) => {
  await expect
    .poll(
      () =>
        page
          .locator('#site-nav-mobile-menu .nav-menu-panel')
          .evaluate((el) => getComputedStyle(el).transform),
      { message: 'the mobile menu never finished its enter transition' }
    )
    .toBe('none')
}

test.describe('Homepage', () => {
  test('hero renders the name, tagline and both CTAs', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Omar Younis', level: 1 })).toBeVisible()
    await expect(page.getByTestId('hero-tagline')).toHaveText(TAGLINE)

    await expect(page.getByRole('link', { name: 'View projects' })).toHaveAttribute(
      'href',
      '/projects'
    )

    const resume = page.getByRole('link', { name: 'Résumé (PDF)' })
    await expect(resume).toBeVisible()
    await expect(resume).toHaveAttribute('href', '/omar_younis_resume_2026.pdf')
    await expect(resume).toHaveAttribute('download', 'Omar_Younis_Resume.pdf')
  })

  test('the hero set-piece is a decorative subtree with all seven satellites', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('[data-testid="hero-satellite"]')).toHaveCount(7)
    await expect(page.locator('.home-cluster')).toHaveAttribute('aria-hidden', 'true')
    await expect(page.locator('.home-ticker')).toHaveAttribute('aria-hidden', 'true')
  })

  test('flagship band links to the frozen /nahtadi URL', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Shipped, and live today.' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'The story' })).toHaveAttribute('href', '/nahtadi')
  })

  test('work-grid tiles link per tier', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Proof, not promises.' })).toBeVisible()

    // showcase tier -> the case-study route
    await expect(page.getByRole('link', { name: /Brent's Method on CUDA/ })).toHaveAttribute(
      'href',
      '/projects/brent-cuda'
    )
    await expect(page.getByRole('link', { name: /Maritime Collision Avoidance/ })).toHaveAttribute(
      'href',
      '/projects/collision-avoidance-radar'
    )

    // card tier -> getProjectHref returns null, so these fall back to GitHub
    const cardTier: [RegExp, string][] = [
      [/Prayer-Time Algorithm Library/, 'https://github.com/osyounis/islamic_prayer_time_app'],
      [/Cycloidal Drive Creator/, 'https://github.com/osyounis/cycloidal_drive_creator'],
      [/Image Watermark Remover/, 'https://github.com/osyounis/image_watermark_remover'],
    ]
    for (const [name, href] of cardTier) {
      const link = page.getByRole('link', { name })
      await expect(link).toHaveAttribute('href', href)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }

    await expect(page.getByRole('link', { name: 'All projects' })).toHaveAttribute(
      'href',
      '/projects'
    )
  })

  test('CTA card offers email and LinkedIn', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Have a role in mind?' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Email me' })).toHaveAttribute(
      'href',
      'mailto:omar@hendaseh.com'
    )
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/omar-younis/'
    )
  })

  test('desktop nav resolves all four links', async ({ page }) => {
    await page.goto('/')

    const nav = page.getByRole('navigation')
    for (const [label, href] of [
      ['Home', '/'],
      ['About', '/about'],
      ['Projects', '/projects'],
      ['Contact', '/contact'],
    ] as const) {
      const link = nav.getByRole('link', { name: label, exact: true })
      await expect(link).toBeVisible()
      await expect(link).toHaveAttribute('href', href)
    }

    await nav.getByRole('link', { name: 'About', exact: true }).click()
    await expect(page).toHaveURL('/about')
  })

  /*
   * A touch context, not a resized desktop one: the phone review reported the
   * hamburger as dead while the old version of this test (a synthetic `click()`
   * at each element's exact centre) stayed green. A centre-of-element click
   * hits a 1x1 target, so it can never catch the thing that actually fails a
   * thumb: a target too small to hit, or an overlay sitting on top of it.
   */
  test.describe('mobile nav (touch)', () => {
    test.use({ ...MOBILE_CONTEXT })

    // Apple HIG's 44x44pt minimum. WCAG 2.5.5 (AAA) uses the same number;
    // 2.5.8 (AA) allows 24x24 only when targets are spaced 24px apart, which
    // these are not.
    const MIN_TAP = 44

    // iOS Safari reserves roughly the outer ~20px of the screen for its own
    // back/forward edge-swipe gesture. A first fix grew the toggle to 44x44
    // with symmetric padding, which halved its right-edge clearance from 20px
    // to 10px -- moving the target INTO the gesture strip instead of away
    // from it. This floor (with a little slack for sub-pixel layout) is what
    // catches that regression if it ever comes back.
    const MIN_EDGE_CLEARANCE = 18

    test('the hamburger and every menu link are real, hittable tap targets', async ({ page }) => {
      await page.goto('/')

      const menu = page.locator('#site-nav-mobile-menu')
      const toggle = page.getByRole('button', { name: 'Toggle mobile menu' })

      // The panel is always mounted now -- it has to survive its own exit
      // transition -- so "closed" means inert, not absent.
      await expect(menu).toHaveCount(1)
      await expect(menu).toBeHidden()
      await expect(toggle).toHaveAttribute('aria-expanded', 'false')

      // 1. The toggle itself must be big enough to hit with a thumb, and must
      //    be the topmost element at its own centre. It must also keep clear
      //    of iOS's edge-swipe-gesture strip -- see MIN_EDGE_CLEARANCE above.
      const toggleBox = await toggle.evaluate((el) => {
        const r = el.getBoundingClientRect()
        const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
        return {
          w: r.width,
          h: r.height,
          rightEdgeClearance: window.innerWidth - r.right,
          coveredBy: hit && !el.contains(hit) && hit !== el ? hit.tagName + '.' + hit.className : null,
        }
      })
      expect(toggleBox.coveredBy, 'something is covering the hamburger').toBeNull()
      expect(
        toggleBox.w,
        `hamburger tap target is ${toggleBox.w}x${toggleBox.h}, below the ${MIN_TAP}x${MIN_TAP} minimum`
      ).toBeGreaterThanOrEqual(MIN_TAP)
      expect(
        toggleBox.h,
        `hamburger tap target is ${toggleBox.w}x${toggleBox.h}, below the ${MIN_TAP}x${MIN_TAP} minimum`
      ).toBeGreaterThanOrEqual(MIN_TAP)
      expect(
        toggleBox.rightEdgeClearance,
        `hamburger tap target has only ${toggleBox.rightEdgeClearance}px of clearance from the ` +
          `right screen edge, below the ${MIN_EDGE_CLEARANCE}px floor -- it is reaching into ` +
          `iOS's edge-swipe-gesture strip`
      ).toBeGreaterThanOrEqual(MIN_EDGE_CLEARANCE)

      // 2. A real touch, not a mouse click.
      await toggle.tap()
      await expect(menu).toBeVisible()
      await expect(toggle).toHaveAttribute('aria-expanded', 'true')

      // The panel is mid-scale for the first 220ms; measuring now would read
      // every row 3% short. Wait on the transition's real end condition.
      await settleMenu(page)

      // 3. Every link must be visible, have a non-zero box, meet the tap-target
      //    minimum, and be the TOPMOST element at its own centre. The last
      //    check is what catches an overlay covering an otherwise "visible"
      //    menu -- the exact failure toBeVisible() cannot see.
      const links = menu.getByRole('link')
      await expect(links).toHaveCount(4)

      const measured = await links.evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect()
          const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
          return {
            label: el.textContent?.trim() ?? '',
            w: Math.round(r.width),
            h: Math.round(r.height),
            hitsSelf: !!hit && (hit === el || el.contains(hit)),
            topmost: hit ? hit.tagName + (hit.className ? '.' + hit.className : '') : 'none',
          }
        })
      )

      for (const link of measured) {
        await expect(menu.getByRole('link', { name: link.label, exact: true })).toBeVisible()
        expect(link.w, `"${link.label}" has zero width`).toBeGreaterThan(0)
        expect(link.h, `"${link.label}" has zero height`).toBeGreaterThan(0)
        expect(
          link.hitsSelf,
          `a tap at the centre of "${link.label}" lands on ${link.topmost}, not the link`
        ).toBe(true)
        expect(
          link.w,
          `"${link.label}" tap target is ${link.w}x${link.h}, below ${MIN_TAP}x${MIN_TAP}`
        ).toBeGreaterThanOrEqual(MIN_TAP)
        expect(
          link.h,
          `"${link.label}" tap target is ${link.w}x${link.h}, below ${MIN_TAP}x${MIN_TAP}`
        ).toBeGreaterThanOrEqual(MIN_TAP)
      }

      // 4. A real tap on a real link actually navigates.
      await menu.getByRole('link', { name: 'Projects', exact: true }).tap()
      await expect(page).toHaveURL('/projects')
    })

    test('a tap 8px inside each edge of the hamburger still opens the menu', async ({ page }) => {
      // A thumb does not land on the exact centre. This is the check the old
      // centre-only click could never make.
      await page.goto('/')
      const box = await page
        .getByRole('button', { name: 'Toggle mobile menu' })
        .evaluate((el) => {
          const r = el.getBoundingClientRect()
          return { x: r.x, y: r.y, w: r.width, h: r.height }
        })

      const corners = [
        { dx: 8, dy: 8 },
        { dx: box.w - 8, dy: 8 },
        { dx: 8, dy: box.h - 8 },
        { dx: box.w - 8, dy: box.h - 8 },
      ]

      for (const { dx, dy } of corners) {
        await page.goto('/')
        const menu = page.locator('#site-nav-mobile-menu')
        await expect(menu).toBeHidden()
        await page.touchscreen.tap(box.x + dx, box.y + dy)
        await expect(
          menu,
          `a tap at (+${dx}, +${dy}) inside the hamburger did not open the menu`
        ).toBeVisible()
      }
    })

    /*
     * The panel used to be conditionally rendered, so it popped in and out with
     * no transition at all. These two tests read the motion that is ACTUALLY
     * applied in each state rather than trusting the stylesheet, and they are
     * what stops the spec -- 220ms in / 160ms out, transitions and not
     * keyframes, scale from 0.97 and never 0, origin at the hamburger, a 35ms
     * row stagger, opacity-only under reduced motion -- from quietly rotting.
     */
    const readPanelMotion = (page: Page) =>
      page.locator('#site-nav-mobile-menu .nav-menu-panel').evaluate((el) => {
        const cs = getComputedStyle(el)
        return {
          properties: cs.transitionProperty.split(',').map((p) => p.trim()),
          durations: cs.transitionDuration.split(',').map((d) => parseFloat(d)),
          animationName: cs.animationName,
          transform: cs.transform,
          transformOrigin: cs.transformOrigin,
          // offsetWidth, not the client rect: transform-origin resolves in the
          // element's own untransformed box, and the closed panel is scaled.
          width: (el as HTMLElement).offsetWidth,
        }
      })

    test('the menu transitions open in 220ms and closed in 160ms', async ({ page }) => {
      await page.goto('/')

      const menu = page.locator('#site-nav-mobile-menu')
      const toggle = page.getByRole('button', { name: 'Toggle mobile menu' })

      // Closed: mounted, fully inert, and already carrying its exit transition.
      expect(
        await menu.evaluate((el) => getComputedStyle(el).pointerEvents),
        'a closed menu must not be hit-testable'
      ).toBe('none')
      expect(
        await menu.evaluate((el) => getComputedStyle(el).visibility),
        'a closed menu must be out of the tab order and out of the a11y tree'
      ).toBe('hidden')

      const closed = await readPanelMotion(page)
      expect(closed.animationName, 'must be a transition, not a keyframe animation').toBe('none')
      expect(closed.properties).toEqual(['opacity', 'transform'])
      expect(closed.durations, 'the exit must be faster than the enter').toEqual([0.16, 0.16])
      // Never from scale(0) -- 0.97, so the panel already has a shape.
      expect(closed.transform).toBe('matrix(0.97, 0, 0, 0.97, 0, 0)')
      // Anchored at the hamburger, i.e. the panel's own top-right corner.
      expect(closed.transformOrigin).toBe(`${closed.width}px 0px`)

      await toggle.tap()
      const open = await readPanelMotion(page)
      expect(open.properties).toEqual(['opacity', 'transform'])
      expect(open.durations).toEqual([0.22, 0.22])
      expect(open.animationName).toBe('none')

      await settleMenu(page)

      // Rows land 35ms apart, and the stagger rides on transform only so the
      // row's opacity press feedback is never delayed behind it.
      const rows = await menu.locator('.nav-menu-item').evaluateAll((els) =>
        els.map((el) => {
          const cs = getComputedStyle(el)
          return {
            properties: cs.transitionProperty.split(',').map((p) => p.trim()),
            delays: cs.transitionDelay.split(',').map((d) => parseFloat(d)),
          }
        })
      )
      expect(rows.map((r) => r.properties)).toEqual([
        ['opacity', 'transform'],
        ['opacity', 'transform'],
        ['opacity', 'transform'],
        ['opacity', 'transform'],
      ])
      expect(rows.map((r) => r.delays)).toEqual([
        [0, 0],
        [0, 0.035],
        [0, 0.07],
        [0, 0.105],
      ])

      // Close it again, and prove the exit is not just a visual fade: mid-exit
      // (well inside the 160ms transition), the panel must already be out of
      // the tab order. `visibility` alone does not do this -- it only flips
      // once the 160ms exit transition finishes -- so this is the assertion
      // that catches a missing `inert`. Mirrors the real measurement: 60ms
      // into the exit, a programmatic `.focus()` on a menu link still took.
      await toggle.tap()
      await page.waitForTimeout(60)
      const firstLink = menu.getByRole('link').first()
      await firstLink.evaluate((el) => (el as HTMLElement).focus())
      expect(
        await firstLink.evaluate((el) => document.activeElement === el),
        'a menu link took focus 60ms into the close transition -- the panel is not yet out of the tab order'
      ).toBe(false)
    })

    test('under reduced motion the menu is a 150ms opacity fade with no transform', async ({
      browser,
    }) => {
      // test.use() options do not reach a hand-built context, so the mobile
      // context is spread in explicitly.
      const context = await browser.newContext({ ...MOBILE_CONTEXT, reducedMotion: 'reduce' })
      const page = await context.newPage()
      await page.goto('/')

      expect(
        await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      ).toBe(true)

      const closed = await readPanelMotion(page)
      expect(closed.properties).toEqual(['opacity'])
      expect(closed.durations).toEqual([0.15])
      expect(closed.transform, 'no transform under reduced motion').toBe('none')

      await page.getByRole('button', { name: 'Toggle mobile menu' }).tap()
      const open = await readPanelMotion(page)
      expect(open.properties).toEqual(['opacity'])
      expect(open.durations).toEqual([0.15])
      expect(open.transform, 'no transform under reduced motion').toBe('none')

      const rowTransforms = await page
        .locator('#site-nav-mobile-menu .nav-menu-item')
        .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform))
      expect(rowTransforms).toEqual(['none', 'none', 'none', 'none'])

      await context.close()
    })
  })

  test.describe('with no OS motion preference', () => {
    // Scoped so this positive control is deterministic regardless of the host's
    // Reduce Motion setting — playwright.config.ts sets no reducedMotion, so
    // without this the test would inherit the host/CI preference and could go
    // red on a machine with Reduce Motion enabled even though the code is
    // correct. `reducedMotion` isn't a top-level PlaywrightTestOptions field in
    // this Playwright version, so it's routed through `contextOptions` (the
    // documented escape hatch for BrowserContextOptions not otherwise exposed).
    // The reduced-motion test below is deliberately excluded: its explicit
    // browser.newContext({ reducedMotion: 'reduce' }) is correct as-is (see the
    // header comment in tests/e2e/reduced-motion-hydration.spec.ts).
    test.use({ contextOptions: { reducedMotion: 'no-preference' } })

    test('the hero set-piece and the ticker animate by default', async ({ page }) => {
      // Positive control for the reduced-motion test below: without it, that test
      // would still pass if the animations were simply never wired up.
      await page.goto('/')

      expect(await page.evaluate(readAnimationNames)).toEqual({
        aurora: 'home-drift',
        core: 'home-pop',
        swarm: 'home-orbit',
        satellite: 'home-pop',
        satelliteIcon: 'home-counter-orbit',
        tape: 'home-tape',
      })
    })

    /*
     * The ticker tape is split into two independently-composited halves so no
     * single animated layer exceeds iOS's ~4096px GPU texture limit (see the
     * header comment in src/components/home/HomeTicker.tsx). That only holds if
     * there really are two of them, they are the same width, and each one
     * translates by its OWN full width -- if any of that drifts the seam breaks
     * or the oversized layer comes back.
     *
     * Engine caveat: playwright.config.ts defines only a `chromium` project, so
     * the `width * 3 <= 4096` guard below (and the menu timing assertions
     * elsewhere in this file) are evaluated against Chromium's font metrics --
     * while the bug this guards against, and every measurement in the fix
     * report behind it, were taken in WebKit (iOS Safari is WebKit). The two
     * engines currently agree (WebKit measures 1290.27px per half, i.e.
     * 3870.8 device px at DPR 3, matching what Chromium reports here), and that
     * agreement was verified by hand on 2026-08-27 -- it is not assumed to hold
     * forever. A future font or metrics change could drift the two engines
     * apart and leave this guard silently watching the wrong number.
     */
    test('the ticker tape is two equal, independently-animated halves', async ({ page }) => {
      await page.goto('/')

      const halves = page.locator('.home-tape')
      await expect(halves).toHaveCount(2)

      // Layout metrics, not client rects: the tape is mid-animation, so a
      // client rect would report wherever the translate happens to have
      // carried it. offsetLeft/offsetWidth are the untransformed positions.
      const measured = await page.evaluate(() => {
        const track = document.querySelector('.home-tape-track') as HTMLElement
        return {
          trackAnimation: getComputedStyle(track).animationName,
          halves: [...document.querySelectorAll('.home-tape')].map((el) => {
            const cs = getComputedStyle(el)
            return {
              left: (el as HTMLElement).offsetLeft,
              width: (el as HTMLElement).offsetWidth,
              animationName: cs.animationName,
              duration: cs.animationDuration,
              delay: cs.animationDelay,
            }
          }),
          items: document.querySelectorAll('.home-tk').length,
        }
      })

      // Nothing may animate the full-width track -- that is the oversized layer.
      expect(measured.trackAnimation).toBe('none')
      expect(measured.items).toBe(12)

      const [a, b] = measured.halves
      expect(a.width).toBe(b.width)
      expect(a.animationName).toBe('home-tape')
      expect(b.animationName).toBe('home-tape')
      expect(a.duration).toBe(b.duration)
      // The two halves stay in sync only because both start with the same
      // animation-delay (0s). A delay on just one half is the exact edit that
      // would reopen the seam, and nothing else in this test would catch it.
      expect(a.delay).toBe(b.delay)
      // Half B starts exactly one half-width along, so -100% on each half puts
      // the tape back where it began and the restart is invisible.
      expect(b.left - a.left).toBe(a.width)

      // The number the whole fix hinges on. Every current iPhone is DPR 3, so
      // each half's backing store is width x 3 device px and has to stay inside
      // iOS's ~4096px GPU texture limit. 1290 x 3 = 3870 leaves only ~5.5%, so
      // it is asserted rather than assumed: if the tape ever grows past
      // 1365 CSS px the flicker comes straight back.
      const IOS_MAX_TEXTURE_PX = 4096
      expect(
        a.width * 3,
        `each ticker half rasterises to ${a.width * 3} device px at DPR 3, past iOS's ` +
          `~${IOS_MAX_TEXTURE_PX}px GPU texture limit -- the tape has grown and the tile ` +
          `eviction that caused the flicker is back`
      ).toBeLessThanOrEqual(IOS_MAX_TEXTURE_PX)
    })
  })

  test('/ is fully static and hydrates cleanly under prefers-reduced-motion: reduce', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message)
    })

    await page.goto('/')

    // Sanity-check that the emulated media feature actually reached the page —
    // without this the assertions below could pass simply because reduced
    // motion was never applied, which is how this guard would silently rot.
    expect(
      await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ).toBe(true)

    // Nothing moves: swarm frozen in its authored pose, aurora parked, tape at 0.
    expect(await page.evaluate(readAnimationNames)).toEqual({
      aurora: 'none',
      core: 'none',
      swarm: 'none',
      satellite: 'none',
      satelliteIcon: 'none',
      tape: 'none',
    })

    // Both halves of the tape, not just the first one the selector finds.
    expect(
      await page.evaluate(() =>
        [...document.querySelectorAll('.home-tape')].map((el) => getComputedStyle(el).animationName)
      )
    ).toEqual(['none', 'none'])

    // ...and the pop-in has resolved to its end state rather than leaving the
    // set-piece invisible.
    const restingStyles = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="hero-satellite"]')!
      const styles = getComputedStyle(el)
      return { opacity: styles.opacity, scale: styles.scale }
    })
    expect(restingStyles.opacity).toBe('1')
    expect(['none', '1']).toContain(restingStyles.scale)

    // Give React a moment to finish hydration and flush any warnings.
    await page.waitForTimeout(500)
    await context.close()

    const hydrationErrors = consoleErrors.filter((text) => HYDRATION_ERROR_PATTERN.test(text))
    expect(
      hydrationErrors,
      `Unexpected hydration-related console errors: ${JSON.stringify(hydrationErrors, null, 2)}`
    ).toEqual([])
  })
})
