import { test, expect } from './helpers'

test.describe('quiz', () => {
  test.beforeEach(async ({ acceptDisclaimer }) => {
    await acceptDisclaimer()
  })

  test('scores after answering all items', async ({ page }) => {
    await page.goto('./quiz/')
    for (let i = 1; i <= 9; i += 1) {
      await page.locator(`input[name="q${i}"][value="4"]`).check()
    }
    await page.getByTestId('quiz-submit').click()
    await expect(page.getByTestId('quiz-result')).toBeVisible()
    await expect(page.getByTestId('quiz-result')).toContainText('36 / 45')
  })
})
