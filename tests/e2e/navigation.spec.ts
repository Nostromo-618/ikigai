import { test, expect } from './helpers'

test.describe('navigation & read', () => {
  test.beforeEach(async ({ acceptDisclaimer }) => {
    await acceptDisclaimer()
  })

  test('home shows brand and CTA', async ({ page }) => {
    await page.goto('./')
    await expect(page.getByRole('heading', { name: /Ikigai/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Open your map/i })).toBeVisible()
  })

  test('read hub links resolve', async ({ page }) => {
    await page.goto('./read/')
    await expect(page.getByRole('heading', { name: 'Read' })).toBeVisible()
    await page.getByRole('link', { name: /Origins/i }).first().click()
    await expect(page.getByRole('heading', { name: /Origins/i })).toBeVisible()
  })

  test('theme switcher toggles data-theme', async ({ page }) => {
    await page.goto('./')
    const switcher = page.locator('.vd-theme-switcher-toggle').first()
    await expect(switcher).toBeVisible()
    await switcher.click()
    const dark = page.getByRole('menuitem', { name: /dark/i }).or(page.getByText(/^Dark$/i))
    if (await dark.first().isVisible().catch(() => false)) {
      await dark.first().click()
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    }
  })
})
