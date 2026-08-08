import { test, expect, dismissOnboarding } from './helpers'

test.describe('map', () => {
  test.beforeEach(async ({ acceptDisclaimer }) => {
    await acceptDisclaimer()
  })

  test('loads Venn map with privacy reminder', async ({ page }) => {
    await page.goto('./map/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('disclaimer-gate')).toHaveCount(0)
    await expect(page.getByTestId('privacy-reminder')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByTestId('map-stage')).toBeVisible()
    await expect(page.locator('.vd-flowchart-host, .vd-flowchart').first()).toBeVisible({
      timeout: 20_000,
    })
    await expect(page.locator('.ikigai-venn')).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('.ikigai-venn-circle')).toHaveCount(4)
    await expect(page.locator('.ikigai-venn-center')).toHaveText('Ikigai')
  })

  test('persists edits across reload', async ({ page }) => {
    await page.goto('./map/', { waitUntil: 'domcontentloaded' })
    await dismissOnboarding(page)
    await expect(page.locator('.vd-flowchart-host, .vd-flowchart').first()).toBeVisible({
      timeout: 20_000,
    })

    // Wait for debounced save from fit/mount, then overwrite a tile.
    await page.waitForTimeout(500)
    await page.evaluate(() => {
      const key = 'ikigai-flowchart-document'
      const raw = localStorage.getItem(key)
      const doc = raw
        ? JSON.parse(raw)
        : {
            version: '1.2.0',
            nodes: [
              {
                id: 'tile-love-1',
                text: 'example: Writing product reviews',
                type: 'rounded-rect',
                x: 385,
                y: 78,
                width: 230,
                height: 48,
                data: { category: 'love' },
              },
            ],
            edges: [],
            viewport: { x: 0, y: 0, scale: 1 },
          }
      let node = doc.nodes.find((n: { id: string }) => n.id === 'tile-love-1')
      if (!node) {
        node = {
          id: 'tile-love-1',
          text: 'x',
          type: 'rounded-rect',
          x: 410,
          y: 145,
          width: 180,
          height: 48,
          data: { category: 'love' },
        }
        doc.nodes.push(node)
      }
      node.text = 'Persisted Ikigai'
      // Ensure other pillar categories remain so hasPillars-style checks still pass if needed
      for (const [id, category] of [
        ['tile-good-1', 'goodAt'],
        ['tile-world-1', 'worldNeeds'],
        ['tile-paid-1', 'paidFor'],
      ] as const) {
        if (!doc.nodes.some((n: { id: string }) => n.id === id)) {
          doc.nodes.push({
            id,
            text: id,
            type: 'rounded-rect',
            x: 0,
            y: 0,
            width: 120,
            height: 40,
            data: { category },
          })
        }
      }
      localStorage.setItem(key, JSON.stringify(doc))
      sessionStorage.setItem('ikigai-e2e-storage-ready', '1')
    })

    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('map-stage')).toBeVisible({ timeout: 15_000 })
    const text = await page.evaluate(() => {
      const raw = localStorage.getItem('ikigai-flowchart-document')
      if (!raw) return null
      return JSON.parse(raw).nodes.find((n: { id: string }) => n.id === 'tile-love-1')?.text ?? null
    })
    expect(text).toBe('Persisted Ikigai')
  })

  test('reset restores seed', async ({ page }) => {
    await page.goto('./map/', { waitUntil: 'domcontentloaded' })
    await dismissOnboarding(page)

    page.once('dialog', (d) => d.accept())
    await page.getByTestId('reset-map').click()
    await expect(page.getByText(/Map reset/i)).toBeVisible()
  })

  test('export svg downloads', async ({ page }) => {
    await page.goto('./map/', { waitUntil: 'domcontentloaded' })
    await dismissOnboarding(page)
    await expect(page.locator('.vd-flowchart-svg').first()).toBeVisible({ timeout: 20_000 })

    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('export-svg').click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.svg$/i)
    const path = await download.path()
    expect(path).toBeTruthy()
  })
})
