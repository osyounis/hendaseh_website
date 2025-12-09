import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load correctly', async ({ page }) => {
    await page.goto('/')

    // Check hero section - use heading role for specificity
    await expect(page.getByRole('heading', { name: 'Hendaseh', level: 1 })).toBeVisible()
    await expect(page.getByText('Software Engineering & Product Development')).toBeVisible()

    // Check capabilities section
    await expect(page.getByRole('heading', { name: 'What I Can Do' })).toBeVisible()

    // Check featured projects section
    await expect(page.getByRole('heading', { name: 'Featured Projects' })).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')

    // Click About link in navigation
    await page.getByRole('navigation').getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL('/about')
    await expect(page.getByRole('heading', { name: 'Omar Younis', level: 1 })).toBeVisible()

    // Navigate back to home
    await page.goto('/')

    // Click Capabilities link in navigation
    await page.getByRole('navigation').getByRole('link', { name: 'Capabilities' }).click()
    await expect(page).toHaveURL('/capabilities')

    // Navigate back to home
    await page.goto('/')

    // Click Projects link in navigation
    await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click()
    await expect(page).toHaveURL('/projects')
  })

  test('should have functional CTA buttons', async ({ page }) => {
    await page.goto('/')

    // Test "View My Work" button
    await page.getByRole('link', { name: 'View My Work' }).click()
    await expect(page).toHaveURL('/projects')
  })
})
