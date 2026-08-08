import { test, expect, clearStorageOnce } from './helpers'

test.describe('disclaimer gate', () => {
  test('decline shows farewell and blocks map/quiz', async ({ page }) => {
    await clearStorageOnce(page)
    await page.goto('./', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('disclaimer-gate')).toBeVisible()
    await page.getByTestId('disclaimer-decline').click()
    await expect(page.getByTestId('disclaimer-farewell')).toBeVisible()

    await page.goto('./map/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('disclaimer-farewell')).toBeVisible()
    // Map interactive chrome must not be usable while farewell is showing.
    await expect(page.getByTestId('map-stage')).toHaveCount(0)

    await page.goto('./quiz/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('disclaimer-farewell')).toBeVisible()
    await expect(page.getByTestId('quiz-submit')).toHaveCount(0)
  })

  test('accept unlocks map and quiz', async ({ page }) => {
    await clearStorageOnce(page)
    await page.goto('./', { waitUntil: 'domcontentloaded' })
    await page.getByTestId('disclaimer-accept').click()
    await expect(page.getByTestId('disclaimer-gate')).toHaveCount(0)

    await page.goto('./map/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('map-stage')).toBeVisible({ timeout: 15_000 })

    await page.goto('./quiz/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('quiz-submit')).toBeVisible()
  })

  test('farewell can reopen gate', async ({ page }) => {
    await clearStorageOnce(page)
    await page.goto('./', { waitUntil: 'domcontentloaded' })
    await page.getByTestId('disclaimer-decline').click()
    await page.getByTestId('disclaimer-reread').click()
    await expect(page.getByTestId('disclaimer-gate')).toBeVisible()
  })
})
