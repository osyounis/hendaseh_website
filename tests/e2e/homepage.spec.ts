import { test, expect, type Page } from '@playwright/test'

const TAGLINE = 'Software Engineer · iOS, ML & Autonomous Systems'
/*
 * Ticker geometry. Kept in step with src/components/home/HomeTicker.tsx, which
 * derives its copy count from the same 4K target; the assertions below measure
 * the rendered result rather than trusting either number.
 */
const TARGET_TAPE_PX = 3840
const ITEMS_PER_SEQUENCE = 8
const COPIES_PER_TAPE = 2
/* 2580.54px of travel over 60s in the original one-copy design. Invariant.
 * The full-precision figure, matching TARGET_PX_PER_SECOND in HomeTicker.tsx --
 * the old rounded `43` here was fine against a +/-0.5 window and is not against
 * a relative one. */
const APPROVED_PX_PER_SECOND = 43.009
/*
 * Mirrors SEQUENCE_PX in HomeTicker.tsx, for the failure message only -- the
 * assertion is on speed, and these are the same statement (see the note at the
 * assertion). Kept in step by hand, which is exactly the pattern the note below
 * is about.
 */
const SEQUENCE_PX = 2065
/*
 * Relative window on the rendered sequence width. 3%, because this is text and
 * text measures differently per platform; see the assertion for the measured
 * 1.4% macOS-to-Linux delta and why tightening it re-breaks CI.
 *
 * THIS IS THE FOURTH HAND-MEASURED CONSTANT IN THIS PROGRAM, after the Nahtadi
 * App Version row, the App Store ratings count, and the projects stat line. All
 * four are a number copied out of a rendered artifact into source, where
 * nothing recomputes it and nothing notices when the artifact moves. The other
 * three drifted silently and were caught by hand, late. This one had a guard --
 * and the guard worked: it failed the moment the assumption stopped holding.
 * That is the argument for guarding the next one, not for trusting the pattern.
 */
const SEQUENCE_TOLERANCE = 0.03

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
    // `.home-tape`, not the track: the tapes are the animated elements and the
    // track only stacks them in one grid cell. This reads the first tape; the
    // dedicated ticker test below covers both.
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

    /*
     * The ticker's `aria-hidden` sits on the TAPES, not on the strip. It used to
     * be on the strip, and moving it down is what lets the pause control inside
     * the strip reach assistive technology at all -- see the "ticker pause
     * control" tests below. The decorative half of the contract is unchanged:
     * the scrolling content is still hidden from AT, and the same facts are
     * stated as real content in the bands underneath.
     */
    await expect(page.locator('.home-ticker')).not.toHaveAttribute('aria-hidden', 'true')
    expect(
      await page
        .locator('.home-tape')
        .evaluateAll((els) => els.map((el) => el.getAttribute('aria-hidden')))
    ).toEqual(['true', 'true'])
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
    await expect(page.getByRole('link', { name: /Radar Plotting Trainer/ })).toHaveAttribute(
      'href',
      '/projects/radar-moboard'
    )

    // TIER DRIVES THE ACTION, NOT THE ROW SIZE. a16-summarizer sits in the
    // compact row but is showcase tier, so it links inward to its case study
    // like the wide tiles do. It is the first compact row to do so, and the
    // reason this assertion is not grouped with the card-tier loop below.
    await expect(page.getByRole('link', { name: /On-Device LLM Summarizer/ })).toHaveAttribute(
      'href',
      '/projects/a16-summarizer'
    )

    // card tier -> getProjectHref returns null, so these fall back to GitHub
    const cardTier: [RegExp, string][] = [
      [/Prayer-Time Algorithm Library/, 'https://github.com/osyounis/islamic_prayer_time_app'],
      [/Cycloidal Drive Creator/, 'https://github.com/osyounis/cycloidal_drive_creator'],
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
     * keyframes, scale from 0.97 and never 0, origin at the hamburger, rows
     * with no entrance motion of their own, opacity-only under reduced motion
     * -- from quietly rotting.
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

      /*
       * The rows carry NO entrance motion of their own -- the panel scales and
       * fades as one object and the rows ride inside it.
       *
       * This replaces a 35ms per-row stagger that shipped in B2 and read as
       * broken on device. With four rows the last one started 105ms in and
       * finished at 325ms, i.e. 105ms AFTER its own container had settled, and
       * it slid DOWN while the panel scaled OUT: two compounding motions in
       * different directions, with the contents outlasting the container. A
       * four-item nav popover is a single object; staggering the children of an
       * animating container is what makes it feel unglued.
       *
       * All three properties are asserted because any one alone can hold while
       * the bug returns: a delay with nothing to delay animates nothing, and a
       * row transform with no delay is still a second motion inside the panel.
       */
      const rows = await menu.locator('.nav-menu-item').evaluateAll((els) =>
        els.map((el) => {
          const cs = getComputedStyle(el)
          return {
            properties: cs.transitionProperty.split(',').map((p) => p.trim()),
            delays: cs.transitionDelay.split(',').map((d) => parseFloat(d)),
            transform: cs.transform,
          }
        })
      )
      // Opacity only, and it is not entrance motion: it is the row's `:active`
      // press feedback, which must still answer on pointer-down.
      expect(rows.map((r) => r.properties)).toEqual([
        ['opacity'],
        ['opacity'],
        ['opacity'],
        ['opacity'],
      ])
      expect(
        rows.flatMap((r) => r.delays),
        'no menu row may carry a transition-delay -- that is the stagger coming back'
      ).toEqual([0, 0, 0, 0])
      expect(
        rows.map((r) => r.transform),
        'rows must not transform: the panel is the only thing that moves'
      ).toEqual(['none', 'none', 'none', 'none'])

      /*
       * Close it again, and prove the exit is not just a visual fade: DURING
       * the 160ms exit the panel must ALREADY be out of the tab order.
       * `visibility` cannot be what does that -- it only flips once the exit
       * finishes -- so this is the assertion that catches a missing `inert`,
       * which was a real B2 finding.
       *
       * THIS OBSERVER IS ARMED BEFORE THE TAP AND SAMPLES PAGE-SIDE, AND BOTH
       * HALVES OF THAT ARE LOAD-BEARING. The version this replaces slept a
       * fixed `waitForTimeout(60)` after the tap and then resolved
       * `menu.getByRole('link')` from Node, which made it a wall-clock sample
       * of a real animation with only ~100ms of margin. Under parallel-worker
       * contention it flaked roughly one run in seven, and it did not fail --
       * it HUNG for the full 30s test timeout, on
       * `waiting for locator('#site-nav-mobile-menu').getByRole('link').first()`.
       *
       * MEASURED ROOT CAUSE, not inferred: Playwright's role engine honours
       * `visibility: hidden` but IGNORES `inert`. The panel's `visibility`
       * flips at 160ms (`transition: visibility 0s linear 160ms`), so once the
       * real elapsed time from tap to query crossed 160ms -- which is all
       * contention has to do -- `getByRole('link')` matched nothing and
       * retried until the test died. Sampling at 0/30/60/100/140/155/170/200ms
       * showed the locator resolving at every offset up to 170 and never again
       * from 200; a plain CSS `a` locator resolved at all of them. The
       * assertion itself would still have been TRUE at 200ms. The test hung
       * before it could make it, so this was never an application bug.
       *
       * The replacement removes the wall clock entirely. A page-side observer
       * is armed WHILE THE MENU IS STILL OPEN, so it cannot miss the window;
       * it polls `requestAnimationFrame` until React commits `data-state`
       * `closed`, and then reads the state AND attempts the focus IN THE SAME
       * TASK, so no round trip can open a gap between observing the exit and
       * testing it. It also drops `getByRole` for a page-side `querySelector`,
       * because the role engine's `visibility` filtering is the trap and it
       * was never testing anything about the a11y tree here anyway.
       *
       * WHAT THIS STILL GUARANTEES -- strictly more than the version it
       * replaces, which only showed that focus did not take at one arbitrary
       * offset:
       *   1. `inert` is present at the FIRST frame after the closed state is
       *      committed, i.e. at the very start of the exit rather than 60ms
       *      into it.
       *   2. `visibility` is still `visible` at that same instant, which is
       *      what proves `visibility` is not what is keeping focus out. If
       *      someone deleted `inert` and leaned on `visibility`, this stays
       *      true and assertion 3 fails -- loudly, and for the right reason.
       *   3. A programmatic `.focus()` on a real menu link at that instant
       *      does not take.
       * A missing `inert` now fails on an assertion instead of timing out, so
       * the regression it exists to catch reports itself.
       */
      type ExitSample = {
        visibility: string
        inert: boolean
        focusTook: boolean
      }

      await page.evaluate(() => {
        const el = document.getElementById('site-nav-mobile-menu')
        if (!el) throw new Error('the mobile menu is not in the DOM')
        const link = el.querySelector('a')
        if (!link) throw new Error('the mobile menu has no link to focus')

        ;(window as unknown as { __navExit: Promise<ExitSample> }).__navExit = new Promise(
          (resolve, reject) => {
            let frames = 0
            const sample = () => {
              frames += 1
              if (el.dataset.state === 'closed') {
                // Read and act in ONE task: whatever this observes about the
                // panel is true of the same frame the focus is attempted in.
                const visibility = getComputedStyle(el).visibility
                const inert = el.hasAttribute('inert')
                link.focus()
                resolve({ visibility, inert, focusTook: document.activeElement === link })
                return
              }
              // ~10s of frames. Only reachable if the tap never lands, and it
              // reports that rather than hanging.
              if (frames > 600) {
                reject(new Error('the mobile menu never entered its closed state'))
                return
              }
              requestAnimationFrame(sample)
            }
            requestAnimationFrame(sample)
          }
        )
      })

      await toggle.tap()

      const exit = await page.evaluate(
        () => (window as unknown as { __navExit: Promise<ExitSample> }).__navExit
      )

      expect(
        exit.visibility,
        'the sample must land DURING the exit -- if visibility has already flipped, the rest proves nothing'
      ).toBe('visible')
      expect(
        exit.inert,
        'the closing panel must take `inert` immediately, not after the 160ms fade'
      ).toBe(true)
      expect(
        exit.focusTook,
        'a menu link took focus during the close transition -- the panel is not out of the tab order'
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
     * The tape is two identical tapes phase-offset by half a period, so that
     * each one's reset happens while it is entirely off-screen. The invariants
     * that make that true are all asserted here, because every one of them is a
     * silent failure if it drifts: a wrong delay opens a gap or overlaps the
     * tapes, unequal widths misalign the seam, and a tape narrower than the
     * viewport leaves a strip of empty ground before each reset.
     *
     * WHAT THIS REPLACED. Earlier versions asserted exactly ONE animated
     * element and that the halves had `animationName: none`. That was right for
     * the previous design and is wrong for this one, which needs two animated
     * tapes by necessity. It is rewritten rather than relaxed to "one or more":
     * the count is still exact, just exactly two.
     *
     * Before that it asserted `halfWidth * 3 <= 4096`, iOS's GPU texture limit
     * at DPR 3, on the theory that an oversized layer was tiling and evicting
     * tiles. Four designs have since falsified that: the two-half design met the
     * limit with ~5.5% to spare and flickered anyway, and removing the promotion
     * hints changed nothing. It is deliberately not re-expressed in another
     * form -- a guard encoding a disproven cause is worse than no guard, because
     * it reads as protection.
     *
     * Engine caveat, still live: playwright.config.ts defines only a `chromium`
     * project, so these measurements come from Chromium's font metrics while the
     * bug itself is a WebKit one (iOS Safari is WebKit). The two engines agreed
     * by hand on 2026-08-27 (WebKit measures 1290.27px per tape, matching
     * Chromium) -- verified, not assumed.
     */
    test('the ticker is two identical tapes phase-offset by half a period', async ({ page }) => {
      await page.goto('/')

      await expect(page.locator('.home-tape')).toHaveCount(2)

      /*
       * Widths from getComputedStyle, not offsetWidth: `offsetWidth` is
       * integer-rounded (a tape rounds 1290.27 to 1290), and percentages in
       * `translate` resolve against the fractional used value, so the fractional
       * number is the one the geometry actually depends on.
       */
      const measured = await page.evaluate(() => {
        const tapes = [...document.querySelectorAll('.home-tape')] as HTMLElement[]
        return {
          tapes: tapes.map((el) => {
            const cs = getComputedStyle(el)
            return {
              width: parseFloat(cs.width),
              animationName: cs.animationName,
              duration: parseFloat(cs.animationDuration),
              delay: parseFloat(cs.animationDelay),
              timing: cs.animationTimingFunction,
              iteration: cs.animationIterationCount,
            }
          }),
          trackAnimation: getComputedStyle(document.querySelector('.home-tape-track')!)
            .animationName,
          items: document.querySelectorAll('.home-tk').length,
          stripWidth: (document.querySelector('.home-ticker') as HTMLElement).clientWidth,
          /* The two custom properties HomeTicker.tsx sets, read from the element
             that declares them. These are what the CSS `calc` consumes, so
             reading them here is what lets the duration be checked against its
             OWN inputs rather than against a number copied into this file. */
          varsFrom: (() => {
            const track = document.querySelector('.home-tape-track') as HTMLElement
            const cs = getComputedStyle(track)
            return {
              secondsPerCopy: parseFloat(cs.getPropertyValue('--tape-seconds-per-copy')),
              copies: parseFloat(cs.getPropertyValue('--tape-copies')),
            }
          })(),
        }
      })

      // Two tapes x COPIES_PER_TAPE x six items. The count is derived rather
      // than written down, so changing the copy count updates this with it and
      // a DROPPED copy still fails loudly.
      expect(measured.items).toBe(2 * COPIES_PER_TAPE * ITEMS_PER_SEQUENCE)
      // The track only positions them; animating it is the previous design.
      expect(measured.trackAnimation).toBe('none')

      const [a, b] = measured.tapes
      expect(
        measured.tapes.map((t) => t.animationName),
        'both tapes must be animated -- one animated tape is the design this replaced'
      ).toEqual(['home-tape', 'home-tape'])
      expect(a.width).toBe(b.width)
      expect(a.duration).toBe(b.duration)
      expect(measured.tapes.map((t) => t.timing)).toEqual(['linear', 'linear'])
      expect(measured.tapes.map((t) => t.iteration)).toEqual(['infinite', 'infinite'])

      /*
       * THE assertion of this design. The tapes are edge to edge only because B
       * runs exactly half a period ahead of A. Any other delay is a gap or an
       * overlap that would show as a stutter at the seam, and nothing else here
       * would catch it. Expressed as a relationship to the duration rather than
       * as the literal -30s, so changing the period keeps the test honest.
       */
      expect(
        b.delay - a.delay,
        `tape B is offset by ${b.delay - a.delay}s but half a ${a.duration}s period is ` +
          `${-a.duration / 2}s -- the two tapes are no longer edge to edge and the seam will stutter`
      ).toBeCloseTo(-a.duration / 2, 3)

      /*
       * Coverage, and the reason each tape repeats the sequence. The pair spans
       * a contiguous 2W, but that span's right edge falls to W just before each
       * reset, so a viewport wider than ONE tape shows empty ground at the right
       * edge once per cycle. The strip is full-bleed, so this is a real limit on
       * real displays.
       *
       * Now measured against the STRIP ITSELF rather than the viewport or a
       * fixed number, which is the real invariant and the reason containing the
       * ticker settles this permanently: the strip is capped at the page-wrap
       * column (1056px), so it does not grow on a wider display and one ~1290px
       * sequence covers it at every size. The fixed target is asserted too, as
       * the documented design intent.
       *
       * The full-bleed version needed a 3840px tape here and still showed the
       * same item twice on any screen wider than one sequence.
       */
      expect(
        a.width,
        `each tape is ${a.width}px but the strip is ${measured.stripWidth}px -- a strip wider ` +
          `than one tape shows an empty gap at its right edge before each reset`
      ).toBeGreaterThanOrEqual(measured.stripWidth)
      expect(
        a.width,
        `each tape is ${a.width}px, under the ${TARGET_TAPE_PX}px this full-bleed strip has to ` +
          `cover -- a wider display shows an empty strip at the right edge before each reset`
      ).toBeGreaterThanOrEqual(TARGET_TAPE_PX)

      /* ------------------------------------------------------------------ *
       * SPEED. Two invariants, deliberately asserted SEPARATELY, because they
       * hold to different precisions and only one of them is portable.
       *
       * They were a single `toBeCloseTo(43, 0)` on the measured px/s until
       * 2026-08-29, and that assertion FAILED ON CI while passing on every
       * local machine. It was not a flake: it reproduced to 14 decimal places
       * across both retries. Linux lays the same text out ~1.4% wider than
       * macOS, the CI tape rendered ~2094px per copy against the 2065px
       * constant, and the speed read 43.615px/s against a +/-0.5 window. The
       * constant cannot be right on both platforms at once, so the test had to
       * stop pretending it could be.
       *
       * Raising SEQUENCE_PX to 2094 was rejected: it just moves the failure to
       * macOS. Skipping or deleting was rejected outright -- this guard is here
       * because the invariant it protects has ALREADY been violated once (a
       * hardcoded 60s duration silently became 68.8px/s when the sequence
       * widened, a 60% speed-up nothing else caught).
       * ------------------------------------------------------------------ */

      /*
       * (i) THE DERIVATION -- strict, and platform-independent.
       *
       * The duration must be exactly `--tape-seconds-per-copy x --tape-copies`.
       * Both are read off `.home-tape-track`, so this checks the CSS `calc`
       * against its OWN inputs; no text measurement enters, which is why it can
       * be exact on every platform. THIS is the assertion that catches the
       * regression that actually happened: hardcode `animation: home-tape 60s`
       * and it fails here immediately, on any machine.
       */
      const { secondsPerCopy, copies } = measured.varsFrom
      expect(secondsPerCopy, '--tape-seconds-per-copy must be set on .home-tape-track').toBeGreaterThan(0)
      expect(copies, '--tape-copies must be set on .home-tape-track').toBeGreaterThan(0)
      expect(
        a.duration,
        `the tape runs for ${a.duration}s but --tape-seconds-per-copy (${secondsPerCopy}s) x ` +
          `--tape-copies (${copies}) is ${secondsPerCopy * copies}s -- the duration has been ` +
          `hardcoded instead of derived, so the next change to either variable will not reach it`
      ).toBeCloseTo(secondsPerCopy * copies, 3)

      /*
       * (ii) THE MEASURED WIDTH -- tolerant, and unavoidably platform-dependent.
       *
       * Whether SEQUENCE_PX still matches what the browser actually renders.
       * Note the two readings are the SAME assertion: duration is derived from
       * SEQUENCE_PX, the copy count cancels, so
       *
       *     pxPerSecond / target  ===  renderedSequenceWidth / SEQUENCE_PX
       *
       * and a 3% window on the speed IS a 3% window on the width.
       *
       * WHY 3%, AND WHY IT MUST NOT BE TIGHTENED BACK: this is text laid out by
       * a font stack, and font metrics differ per platform. The measured
       * macOS-to-Linux delta is 1.4%; 3% is about twice that, which absorbs the
       * variance plus another engine or font-version shift without going numb.
       * It is still nowhere near loose enough to miss a real regression -- the
       * failure this guards against was a 60% speed-up, and even a doubled
       * speed would read 86px/s against a window of 41.7-44.3. If you are
       * tempted to tighten this to catch something, the thing you want is
       * almost certainly (i), which is already exact.
       */
      const pxPerSecond = (a.width * 2) / a.duration
      const renderedSequencePx = a.width / copies
      const drift = Math.abs(pxPerSecond - APPROVED_PX_PER_SECOND) / APPROVED_PX_PER_SECOND
      expect(
        drift,
        `the tape scrolls at ${pxPerSecond.toFixed(3)}px/s, ${(drift * 100).toFixed(2)}% off the ` +
          `approved ${APPROVED_PX_PER_SECOND}px/s. Equivalently, one sequence renders at ` +
          `${renderedSequencePx.toFixed(2)}px against the SEQUENCE_PX = ${SEQUENCE_PX} constant in ` +
          `HomeTicker.tsx. Past ${(SEQUENCE_TOLERANCE * 100).toFixed(0)}% that is no longer text-metric ` +
          `variance between platforms -- re-measure the sequence and update SEQUENCE_PX`
      ).toBeLessThanOrEqual(SEQUENCE_TOLERANCE)
    })
  })

  /*
   * The ticker's pause control. It exists for WCAG 2.2.2 (Pause, Stop, Hide,
   * Level A): the tape starts automatically, never stops, and sits alongside
   * other content. Hover-pause is gated to fine pointers, so without this a
   * touch user has no mechanism at all -- and `aria-hidden` is not an exemption,
   * because 2.2.2 is about visual distraction rather than screen-reader
   * exposure.
   *
   * It is a real checkbox with a styled label, no JavaScript: pause/play is a
   * persistent two-state setting, which is what a checkbox is.
   */
  test.describe('ticker pause control', () => {
    const tapeStates = (page: Page) =>
      page
        .locator('.home-tape')
        .evaluateAll((els) => els.map((el) => getComputedStyle(el).animationPlayState))

    test('pauses and resumes both tapes, and is operable by keyboard', async ({ page }) => {
      await page.goto('/')

      const control = page.getByRole('checkbox', { name: /ticker/i })
      await expect(control).toHaveCount(1)
      expect(await tapeStates(page)).toEqual(['running', 'running'])

      // Pointer: the label is the visible control; the input itself is clipped.
      await page.locator('.home-ticker-toggle').click()
      await expect(control).toBeChecked()
      expect(await tapeStates(page), 'both tapes must pause, not just the first').toEqual([
        'paused',
        'paused',
      ])

      /*
       * Resumes immediately, with the pointer still sitting on the control.
       * There is no hover-pause any more, so nothing can hold the tape behind
       * the checkbox's back -- if this ever needs a `mouse.move` to pass, a
       * hover rule has come back (see the note in home.css).
       */
      await page.locator('.home-ticker-toggle').click()
      await expect(control).not.toBeChecked()
      expect(await tapeStates(page)).toEqual(['running', 'running'])

      // Keyboard: Space is the native checkbox activation, and getting it for
      // free is the whole reason this is a checkbox rather than a div.
      await control.focus()
      await page.keyboard.press('Space')
      expect(await tapeStates(page)).toEqual(['paused', 'paused'])
      await page.keyboard.press('Space')
      expect(await tapeStates(page)).toEqual(['running', 'running'])
    })

    /*
     * The icon and the accessible name must agree. A control whose name is
     * frozen at "Pause" while it shows a play triangle is a defect, so the name
     * is read in BOTH states rather than assumed from the markup.
     */
    test('the accessible name follows the state', async ({ page }) => {
      await page.goto('/')

      const control = page.getByRole('checkbox', { name: /ticker/i })
      await expect(control).toHaveAccessibleName('Pause the ticker')
      await expect(control).not.toBeChecked()

      await page.locator('.home-ticker-toggle').click()
      await expect(control).toBeChecked()
      await expect(
        control,
        'paused: the icon reads play, so the name must too'
      ).toHaveAccessibleName('Play the ticker')

      // ...and the visible icon agrees with it.
      expect(
        await page
          .locator('.home-ticker-icon-play')
          .evaluate((el) => getComputedStyle(el).display)
      ).not.toBe('none')
      expect(
        await page
          .locator('.home-ticker-icon-pause')
          .evaluate((el) => getComputedStyle(el).display)
      ).toBe('none')
    })

    /*
     * The whole point of moving `aria-hidden` off the strip wrapper. A control
     * inside an aria-hidden subtree is invisible to assistive technology no
     * matter how well it is built, which would defeat the reason it exists.
     */
    test('the control is not inside an aria-hidden subtree', async ({ page }) => {
      await page.goto('/')

      const hiddenAncestors = await page
        .locator('.home-ticker-toggle')
        .evaluate((el) => {
          const named: string[] = []
          for (let n = el as HTMLElement | null; n; n = n.parentElement) {
            if (n.getAttribute('aria-hidden') === 'true') named.push(n.className || n.tagName)
          }
          return named
        })
      expect(
        hiddenAncestors,
        'the pause control has an aria-hidden ancestor, so assistive technology cannot see it'
      ).toEqual([])

      // The tape itself must still be decorative -- that part does not change.
      expect(
        await page.locator('.home-tape').evaluateAll((els) =>
          els.map((el) => el.getAttribute('aria-hidden'))
        )
      ).toEqual(['true', 'true'])
    })

    /*
     * The control is the ONLY pause mechanism. Hover-pause was deleted: the
     * full-bleed strip spans the viewport, so any cursor travel down the page
     * incidentally paused and resumed the tape, and every one of those toggles
     * was a chance to hit the compositor artifact behind the reported jump.
     * This asserts the tape is indifferent to the pointer.
     */
    test('the pointer alone cannot pause the tape', async ({ page }) => {
      await page.goto('/')

      await page.locator('.home-ticker-viewport').hover()
      expect(
        await tapeStates(page),
        'hovering the tape must not pause it -- hover-pause was deleted on purpose'
      ).toEqual(['running', 'running'])

      await page.locator('.home-ticker-toggle').hover()
      expect(
        await tapeStates(page),
        'hovering the control must not pause it either; only activating it may'
      ).toEqual(['running', 'running'])
    })

    test('is hidden under reduced motion, where there is nothing to pause', async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: 'reduce' })
      const page = await context.newPage()
      await page.goto('/')

      await expect(page.locator('.home-ticker-toggle')).toBeHidden()
      // The input goes too: an invisible, purposeless control must not stay in
      // the tab order.
      expect(
        await page.locator('.home-ticker-check').evaluate((el) => getComputedStyle(el).display)
      ).toBe('none')

      await context.close()
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

    /*
     * BOTH tapes, and parked at the START rather than frozen wherever the
     * animation happened to be. `readAnimationNames` above only reads the first
     * tape and only reads its animation-name; neither says the tapes are at
     * offset 0, and a tape stopped mid-scroll renders a half-item at the edge.
     *
     * With the animation off, both tapes resolve to no transform and sit in the
     * same grid cell showing identical content, which is the intended static
     * state: it reads as one tape starting at x=0.
     */
    expect(
      await page.evaluate(() =>
        [...document.querySelectorAll('.home-tape')].map((el) => {
          const cs = getComputedStyle(el)
          return { animationName: cs.animationName, transform: cs.transform, display: cs.display }
        })
      ),
      'under reduced motion tape A must be static and parked at its start offset, and tape B hidden'
    ).toEqual([
      { animationName: 'none', transform: 'none', display: 'flex' },
      /*
       * Tape B is display:none, and that is load-bearing rather than tidiness.
       * Both tapes share one grid cell at `justify-self: start`, so with the
       * animation off they would stack exactly on top of each other at x=0 --
       * a full strip of double-painted content that is invisible only because
       * every ticker colour is currently a solid hex, and becomes a visible
       * double-image the moment one gains alpha. One 3870px tape covers the
       * strip alone.
       */
      { animationName: 'none', transform: 'none', display: 'none' },
    ])

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
