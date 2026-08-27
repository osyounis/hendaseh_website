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
