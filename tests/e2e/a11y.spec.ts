import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { KEY_ROUTES, THEMES } from './routes'

/*
 * axe-core across the six key routes, in BOTH themes (Task B6).
 *
 * BOTH THEMES IS THE POINT. Until B6 the dark theme was opt-in behind
 * `[data-theme="dark"]`, so no production visitor ever saw it and its contrast
 * was never audited against real rendering — only the light theme's ratios
 * were measured, by hand, in the mockup audits. The flip to
 * `prefers-color-scheme` makes dark a surface real people land on, so it has
 * to clear the same bar. The theme is emulated before navigation so axe reads
 * the page as painted, not as restyled after load.
 *
 * WCAG 2.1 A + AA. `color-contrast` is deliberately IN scope: it is the rule
 * most likely to break when a colour token moves, and the light theme's ratios
 * were retuned specifically to clear it (see the `--accent` / `--fg-muted`
 * notes in globals.css).
 *
 * Runs against `npm run dev`, which is the right target for axe — it audits
 * the rendered accessibility tree, and dev and the Worker build serve
 * identical markup and CSS. The preview build is required for PERFORMANCE
 * measurement (Lighthouse), not for this.
 */

/* ------------------------------------------------------------------------ *
 * WHY THIS AUDITS THE REDUCED-MOTION FRAME
 *
 * Every one of these routes plays an entrance animation on load, and axe
 * computes contrast against the colour a pixel ACTUALLY HAS at the moment it
 * looks. Sampled mid-entrance it sees blended colour, not the design's, and
 * reports a contrast violation that does not exist in the resting page.
 *
 * That is not hypothetical: this spec was written without the guard and failed
 * intermittently on `/contact` and `/projects` — only when the run was under
 * enough parallel load to be slow. Measured at the moment of the audit,
 * `.contact-copy-label`'s ancestor `.contact-mailrow` was at opacity 0.074,
 * mid-`contact-enter`, so axe blended the white label into the page ground and
 * called it 1.2:1. Fast runs sampled after the animation finished and passed.
 * A flaky accessibility gate is worse than none — it trains people to re-run.
 *
 * Reduced motion is the correct fix rather than a workaround: the resting
 * frame is what the contrast tokens were designed for, and this site's
 * contract is that reduced motion renders that frame exactly (guarded by
 * projects-entrance.spec.ts and reduced-motion-hydration.spec.ts). It also
 * settles the page for real — the Home aurora and the ticker loop FOREVER, so
 * a plain "wait until nothing is animating" poll on the animated page would
 * never resolve.
 *
 * That last point is the trap this codebase already paid for once, recorded in
 * DECISIONS.md: DO NOT reach for a fixed `waitForTimeout` to let the entrance
 * finish. Poll for the condition. `expect.poll` on `getAnimations()` below is
 * the condition, and under reduced motion it is reachable.
 * ------------------------------------------------------------------------ */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

/** Blocks until the page is visually at rest, or fails — never hangs silently. */
async function settled(page: Page) {
  await expect
    .poll(
      () => page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length),
      { message: 'the page never stopped animating — is a looping animation missing its reduced-motion override?' }
    )
    .toBe(0)
  await page.evaluate(() => document.fonts.ready)
}

for (const route of KEY_ROUTES) {
  for (const theme of THEMES) {
    test(`${route} has no axe violations in the ${theme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      await page.goto(route)
      await settled(page)

      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()

      /*
       * Report the whole violation, not just the count. A bare `toBe(0)` on a
       * failure prints "expected 0, got 3" and sends the next reader back to
       * the browser to find out which three; this puts the rule, its impact
       * and the offending selectors straight in the failure output.
       */
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map((n) => n.target.join(' ')),
      }))

      expect(summary, `${route} (${theme})`).toEqual([])
    })
  }
}
