import { test, expect, type Page } from '@playwright/test'

const TAGLINE = 'Software Engineer · iOS, ML & Autonomous Systems'
/*
 * Ticker geometry. Kept in step with src/components/home/HomeTicker.tsx, which
 * derives its copy count from the same 4K target; the assertions below measure
 * the rendered result rather than trusting either number.
 */
const TARGET_TAPE_PX = 3840
const COPIES_PER_TAPE = 3
/* 2580.54px of travel over 60s in the original one-copy design. Invariant. */
const APPROVED_PX_PER_SECOND = 43

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
          viewportWidth: document.documentElement.clientWidth,
        }
      })

      // Two tapes x COPIES_PER_TAPE x six items. The count is derived rather
      // than written down, so changing the copy count updates this with it and
      // a DROPPED copy still fails loudly.
      expect(measured.items).toBe(2 * COPIES_PER_TAPE * 6)
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
       * Asserted against a FIXED 4K target, not against the test viewport. The
       * previous version compared a 1290px tape to the 1280px test viewport --
       * 10px of headroom, and a "guard" that only ever tested the window
       * Playwright happened to open. This number is the one that matters: a
       * 1440/1512/1728 Mac, a 3008 Pro Display XDR and a 3440 ultrawide all sit
       * under it.
       */
      expect(
        a.width,
        `each tape is ${a.width}px, under the ${TARGET_TAPE_PX}px this full-bleed strip has ` +
          `to cover -- a viewport wider than one tape shows an empty strip at the right edge ` +
          `before each reset`
      ).toBeGreaterThanOrEqual(TARGET_TAPE_PX)

      /*
       * Speed is the number Omar approved, and it is the thing most easily lost
       * when the tape is resized: travel is 2x the tape width, so a hardcoded
       * duration would make a 3x wider tape scroll 3x faster. Measured here from
       * the real width and the real duration rather than trusted from the CSS
       * `calc`, which is the whole point of asserting it.
       */
      const pxPerSecond = (a.width * 2) / a.duration
      expect(
        pxPerSecond,
        `the tape scrolls at ${pxPerSecond.toFixed(1)}px/s, not the approved ` +
          `~${APPROVED_PX_PER_SECOND}px/s -- resizing the tape changed the speed`
      ).toBeCloseTo(APPROVED_PX_PER_SECOND, 0)
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
