import { test, expect } from '@playwright/test'

test.describe('Site Navigation', () => {
  test('should navigate through all main pages', async ({ page }) => {
    // Start at homepage
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Hendaseh', level: 1 })).toBeVisible()

    // Navigate to About using navigation bar
    await page.getByRole('navigation').getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL('/about')
    await expect(page.getByRole('heading', { name: 'Omar Younis', level: 1 })).toBeVisible()

    // Navigate to Capabilities using navigation bar
    await page.getByRole('navigation').getByRole('link', { name: 'Capabilities' }).click()
    await expect(page).toHaveURL('/capabilities')
    await expect(page.getByRole('heading', { name: 'My Capabilities' })).toBeVisible()

    // Navigate to Projects using navigation bar
    await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click()
    await expect(page).toHaveURL('/projects')
    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible()

    // Navigate to Contact using navigation bar
    await page.getByRole('navigation').getByRole('link', { name: 'Contact' }).click()
    await expect(page).toHaveURL('/contact')
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible()

    // Navigate back to Home using navigation bar
    await page.getByRole('navigation').getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL('/')
  })

  test('should have contact page link', async ({ page }) => {
    await page.goto('/')

    // Check "Let's Talk" button links to contact page
    const contactLink = page.getByRole('link', { name: "Let's Talk" })
    await expect(contactLink).toBeVisible()
    await expect(contactLink).toHaveAttribute('href', '/contact')
  })

  test('should have external GitHub link on Projects page', async ({ page }) => {
    await page.goto('/projects')

    // Check GitHub link exists and has correct attributes
    const githubLink = page.locator('a[href="https://github.com/osyounis"]').first()
    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveAttribute('target', '_blank')
  })
})
