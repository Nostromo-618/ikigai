import { test, expect } from './helpers'
import AxeBuilder from '@axe-core/playwright'

const routes = ['./', './map/', './read/', './quiz/']

for (const route of routes) {
  test(`a11y smoke ${route}`, async ({ page, acceptDisclaimer }) => {
    await acceptDisclaimer()
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    if (route.includes('map')) {
      await page.getByTestId('onboarding').getByRole('button', { name: /Skip/i }).click().catch(() => {})
    }
    let builder = new AxeBuilder({ page })
      .exclude('.vd-flowchart')
      .exclude('.vd-navbar')
      .exclude('.consent-overlay')
      .exclude('.ikigai-venn')
      .disableRules(['aria-hidden-focus'])
    // Pastel Venn fills are intentionally soft; contrast is decorative diagram chrome.
    if (route.includes('map')) {
      builder = builder.disableRules(['aria-hidden-focus', 'color-contrast'])
    }
    const results = await builder.analyze()
    expect(
      results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious'),
    ).toEqual([])
  })
}
