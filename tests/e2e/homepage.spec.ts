import { test, expect } from '@playwright/test'

const TAGLINE = 'Software Engineer · iOS, ML & Autonomous Systems'
const MOBILE_VIEWPORT = { width: 390, height: 844 }

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
    await expect(page.getByRole('link', { name: 'The story →' })).toHaveAttribute('href', '/nahtadi')
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

    await expect(page.getByRole('link', { name: 'All projects →' })).toHaveAttribute(
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
    test.use({ viewport: MOBILE_VIEWPORT, isMobile: true, hasTouch: true })

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

      await expect(menu).toHaveCount(0)
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
        await expect(menu).toHaveCount(0)
        await page.touchscreen.tap(box.x + dx, box.y + dy)
        await expect(
          menu,
          `a tap at (+${dx}, +${dy}) inside the hamburger did not open the menu`
        ).toBeVisible()
      }
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
