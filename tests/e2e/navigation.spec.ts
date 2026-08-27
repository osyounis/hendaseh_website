import { test, expect } from '@playwright/test'

test.describe('Site Navigation', () => {
  test('should navigate through all main pages', async ({ page }) => {
    // Start at homepage
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Omar Younis', level: 1 })).toBeVisible()

    // Navigate to About using navigation bar
    await page.getByRole('navigation').getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL('/about')
    await expect(page.getByRole('heading', { name: 'Omar Younis', level: 1 })).toBeVisible()

    // Navigate to Projects using navigation bar
    await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click()
    await expect(page).toHaveURL('/projects')
    // The Projects h1 is the approved contract's statement heading, not the
    // word "Projects" (that is the eyebrow above it, and eyebrows are not
    // headings). Task B2.3.
    await expect(
      page.getByRole('heading', { name: "Everything I've built.", level: 1 })
    ).toBeVisible()

    // Navigate to Contact using navigation bar
    await page.getByRole('navigation').getByRole('link', { name: 'Contact' }).click()
    await expect(page).toHaveURL('/contact')
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible()

    // Navigate back to Home using logo
    await page.getByRole('navigation').getByRole('link', { name: 'Hendaseh' }).click()
    await expect(page).toHaveURL('/')
  })

  test('should have a Home link that navigates to /', async ({ page }) => {
    await page.goto('/about')
    await page.getByRole('navigation').getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL('/')
  })

  test('should mark the active nav item with aria-current="page"', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page'
    )

    await page.goto('/projects')
    await expect(
      page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true })
    ).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  test('should have contact page link', async ({ page }) => {
    await page.goto('/')

    // The home page's own contact CTA is now a mailto:, so the nav is where a
    // link to /contact has to hold.
    const contactLink = page.getByRole('navigation').getByRole('link', { name: 'Contact' })
    await expect(contactLink).toBeVisible()
    await expect(contactLink).toHaveAttribute('href', '/contact')
  })

  test('should have safe external GitHub links on Projects page', async ({ page }) => {
    await page.goto('/projects')

    // The redesigned page has no "View GitHub Profile" button — the approved
    // contract replaced it with a per-card octocat pill that goes to that
    // project's own repository (Task B2.3). The property worth guarding is
    // unchanged: every GitHub link here opens in a new tab and carries
    // `rel="noopener"`.
    const githubLinks = page.locator('[data-testid="project-card"] a[href^="https://github.com/osyounis/"]')
    const total = await githubLinks.count()
    expect(total).toBeGreaterThan(0)

    for (let i = 0; i < total; i++) {
      await expect(githubLinks.nth(i)).toHaveAttribute('target', '_blank')
      await expect(githubLinks.nth(i)).toHaveAttribute('rel', /noopener/)
    }
  })
})
