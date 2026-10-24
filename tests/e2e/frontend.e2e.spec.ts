import { test, expect } from '@playwright/test'

test.describe('Smoke', () => {
  test('health endpoint reports the database is reachable', async ({ request }) => {
    const res = await request.get('/api/health')
    expect(res.status()).toBe(200)
    expect(await res.json()).toMatchObject({ status: 'ok', db: 'ok' })
  })

  for (const path of ['/en', '/en/gallery', '/en/contact', '/en/login']) {
    test(`${path} renders`, async ({ page }) => {
      const res = await page.goto(path)
      expect(res?.status()).toBe(200)
      await expect(page).toHaveTitle(/Simon/i)
    })
  }

  test('root redirects to a locale', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/(en|ro|de|fr|nl|ja|ko|el)$/)
  })

  test('admin login page loads', async ({ page }) => {
    const res = await page.goto('/admin')
    expect(res?.status()).toBeLessThan(400)
  })
})
