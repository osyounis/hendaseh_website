import { test, expect } from '@playwright/test'

/**
 * Content visibility must not depend on JavaScript.
 *
 * `AnimatedProjectCard` server-renders every card except the first at
 * `opacity: 0` and relies on Framer Motion's `whileInView` (an
 * IntersectionObserver callback) to raise it to 1. That makes the reveal a
 * GATE rather than an enhancement: with JS disabled, or on any device where
 * the observer callback never fires, twelve of the thirteen cards are blank —
 * which is exactly the "only Nahtadi's image renders" report from the phone
 * review.
 *
 * This test pins the resting state. It measures EFFECTIVE opacity (the product
 * of the element's own opacity and every ancestor's), because a card can be
 * `opacity: 1` itself and still be invisible inside a zeroed wrapper.
 *
 * Cards are located by `[data-testid="project-card"]` (the root of
 * `AnimatedProjectCard`), not a bare `h2` locator. A bare `h2` only happened
 * to mean "every card" because `/projects` had no other `h2` on the page; the
 * moment Task B2 adds a section heading to that page, a bare `h2` locator
 * would silently stop meaning "every card" and this test would start
 * asserting opacity on unrelated elements without ever going red. The
 * `data-testid` ties the locator to the card itself regardless of what else
 * the page grows.
 */
test.describe('projects page without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('every project card renders at a non-zero effective opacity', async ({ page }) => {
    await page.goto('/projects')

    const cards = page.locator('[data-testid="project-card"]')
    const count = await cards.count()
    // Guard the guard: if the page ever stops rendering cards server-side, the
    // opacity assertion below would vacuously pass.
    expect(count).toBeGreaterThanOrEqual(13)

    const measured = await cards.evaluateAll((cardEls) =>
      cardEls.map((card) => {
        let effective = 1
        for (
          let node: Element | null = card;
          node && node !== document.documentElement;
          node = node.parentElement
        ) {
          effective *= parseFloat(getComputedStyle(node).opacity)
        }
        const title = card.querySelector('h2')?.textContent?.trim() ?? '(untitled)'
        return { title, effective }
      })
    )

    const invisible = measured.filter((card) => card.effective === 0)
    expect(
      invisible,
      `these cards are invisible without JavaScript: ${invisible.map((c) => c.title).join(', ')}`
    ).toEqual([])
  })
})

/**
 * Same guarantee, extended to the case-study routes (Task B2.4).
 *
 * `/projects/[slug]` now has the scroll reveal the approved contract asks for:
 * sections rise 14px and fade in as they enter the viewport. That is exactly
 * the shape of the bug above, so it is built the other way round -- the
 * server-rendered resting state of every section is fully visible, and
 * `ScrollReveal.tsx` is the only thing that can ever hide one, only after it
 * has confirmed JavaScript, an IntersectionObserver and no reduced-motion
 * preference, and only for elements below the fold.
 *
 * This spec pins that resting state. It was verified RED against the gated
 * implementation (adding `opacity: 0; transform: translateY(14px)` to the base
 * `[data-reveal]` rule in `src/app/styles/case-study.css`): both slugs failed
 * on effective opacity, naming every hidden section. A test that passes either
 * way is how the original bug survived.
 *
 * It measures two things per section:
 *   - EFFECTIVE opacity (the element's own multiplied by every ancestor's),
 *     because a section can be `opacity: 1` inside a zeroed wrapper.
 *   - the vertical translation from its computed transform, because "gated"
 *     could also be spelled as a permanent offset.
 */
const CASE_STUDY_SLUGS = ['brent-cuda', 'collision-avoidance-radar'] as const

/** Reads the resting state of every `[data-reveal]` block on the page. */
async function measureRevealBlocks(page: import('@playwright/test').Page) {
  return page.locator('[data-reveal]').evaluateAll((els) =>
    els.map((el) => {
      let effectiveOpacity = 1
      for (
        let node: Element | null = el;
        node && node !== document.documentElement;
        node = node.parentElement
      ) {
        effectiveOpacity *= parseFloat(getComputedStyle(node).opacity)
      }
      const { transform } = getComputedStyle(el)
      // `matrix(a, b, c, d, tx, ty)` -- ty is the last component.
      const translateY =
        transform === 'none' ? 0 : parseFloat(transform.split(',').pop() ?? '0')
      return {
        heading: el.querySelector('h2')?.textContent?.trim() ?? el.tagName.toLowerCase(),
        state: el.getAttribute('data-reveal'),
        effectiveOpacity,
        translateY,
      }
    })
  )
}

test.describe('case study pages without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  for (const slug of CASE_STUDY_SLUGS) {
    test(`/projects/${slug} renders every section visible and unshifted`, async ({ page }) => {
      await page.goto(`/projects/${slug}`)

      // Guard the guard: if the template ever stops server-rendering its
      // sections, the assertions below would vacuously pass. Every case study
      // has at least PROBLEM, APPROACH and IMPACT.
      const blocks = await measureRevealBlocks(page)
      expect(blocks.length).toBeGreaterThanOrEqual(3)

      const hidden = blocks.filter((b) => b.effectiveOpacity === 0)
      expect(
        hidden,
        `invisible without JavaScript: ${hidden.map((b) => b.heading).join(', ')}`
      ).toEqual([])

      const shifted = blocks.filter((b) => b.translateY !== 0)
      expect(
        shifted,
        `offset without JavaScript: ${shifted.map((b) => `${b.heading} (${b.translateY}px)`).join(', ')}`
      ).toEqual([])

      // The title is the other half of the fix this task shipped: it comes
      // from `project.title` now, so it must agree with the document title.
      const h1 = (await page.locator('h1').textContent())?.trim()
      expect(await page.title()).toContain(h1)
    })
  }
})

test.describe('case study scroll reveal with JavaScript', () => {
  for (const slug of CASE_STUDY_SLUGS) {
    test(`/projects/${slug} leaves nothing stuck hidden after scrolling`, async ({ page }) => {
      await page.goto(`/projects/${slug}`)

      // page.goto() resolves on `load`, which can precede hydration. If
      // ScrollReveal's effect mounts after the jump below, every section is
      // already above the (post-jump) fold and nothing is ever armed, so
      // "nothing stuck hidden" would pass without exercising the anchor-jump
      // path the 9999px root margin exists for. Anchor to the armed state
      // first: `data-reveal` only ever becomes "pending" (then "in") once the
      // effect has mounted and started observing at least one below-the-fold
      // section.
      await page.waitForFunction(
        () => document.querySelector('[data-reveal="pending"], [data-reveal="in"]') !== null
      )

      // Guard the guard: confirm the armed state is genuinely hiding
      // something right now. Without this, the wait above could in principle
      // be satisfied by a page that jumps straight to "in" with nothing ever
      // at effective opacity 0, and the assertion after scrolling would again
      // be proving nothing.
      const armedBlocks = await measureRevealBlocks(page)
      const armedHidden = armedBlocks.filter((b) => b.effectiveOpacity === 0)
      expect(
        armedHidden.length,
        'expected at least one section hidden pre-scroll -- otherwise this test is not exercising a real reveal'
      ).toBeGreaterThan(0)

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      // The reveal is 450ms; give the observer and the transition room.
      await page.waitForTimeout(1200)

      const blocks = await measureRevealBlocks(page)
      expect(blocks.length).toBeGreaterThanOrEqual(3)

      const stuck = blocks.filter((b) => b.effectiveOpacity === 0)
      expect(
        stuck,
        `still hidden after scrolling to the bottom: ${stuck.map((b) => b.heading).join(', ')}`
      ).toEqual([])
    })
  }
})
