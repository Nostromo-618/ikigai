import { test as base, expect } from '@playwright/test'
import { DISCLAIMER_VERSION } from '../../src/data/site'

type Fixtures = {
  acceptDisclaimer: () => Promise<void>
}

/** Clears map/quiz keys once per tab; sets acceptance when requested. */
export const test = base.extend<Fixtures>({
  acceptDisclaimer: async ({ page }, use) => {
    await use(async () => {
      await page.addInitScript(
        ({ version, key }) => {
          const marker = 'ikigai-e2e-storage-ready'
          if (!sessionStorage.getItem(marker)) {
            sessionStorage.setItem(marker, '1')
            try {
              localStorage.removeItem('ikigai-flowchart-document')
              localStorage.removeItem('ikigai-onboarding-done')
              localStorage.removeItem('ikigai-quiz-score')
              localStorage.removeItem('ikigai-map-fullscreen')
              localStorage.removeItem('ikigai-disclaimer-dismissed')
            } catch {
              /* ignore */
            }
          }
          localStorage.setItem(
            key,
            JSON.stringify({ version, acceptedAt: new Date().toISOString() }),
          )
        },
        { version: DISCLAIMER_VERSION, key: 'ikigai-disclaimer-accepted' },
      )
    })
  },
})

export { expect }

export async function dismissOnboarding(page: import('@playwright/test').Page) {
  if (await page.getByTestId('onboarding').isVisible().catch(() => false)) {
    await page.getByTestId('onboarding').getByRole('button', { name: /Skip/i }).click()
  }
}

/** Once-per-tab clear without pre-accepting (for gate tests). */
export async function clearStorageOnce(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    const marker = 'ikigai-e2e-storage-ready'
    if (!sessionStorage.getItem(marker)) {
      sessionStorage.setItem(marker, '1')
      try {
        localStorage.removeItem('ikigai-flowchart-document')
        localStorage.removeItem('ikigai-onboarding-done')
        localStorage.removeItem('ikigai-quiz-score')
        localStorage.removeItem('ikigai-map-fullscreen')
        localStorage.removeItem('ikigai-disclaimer-dismissed')
        localStorage.removeItem('ikigai-disclaimer-accepted')
        sessionStorage.removeItem('ikigai-disclaimer-declined')
      } catch {
        /* ignore */
      }
    }
  })
}
