import { test, expect } from '@playwright/test'

// OG cards are pre-rendered to static PNGs (`npm run generate:og` → public/og)
// because the old runtime /api/og route needed sharp + node:fs, neither of which
// runs on Cloudflare Workers. The legacy /api/og URLs stay reachable via redirect.

const CARDS = ['site', 'nahtadi', 'brent-cuda', 'collision-avoidance-radar']

test('every static OG card serves as a PNG', async ({ request }) => {
  for (const id of CARDS) {
    const res = await request.get(`/og/${id}.png`)
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('image/png')
  }
})

test('the runtime /api/og route is gone', async ({ request }) => {
  const res = await request.get('/api/og?card=nahtadi', { maxRedirects: 0 })
  expect(res.status()).not.toBe(200)
})

// Next forwards the original query string onto the destination, so the location
// header reads `/og/nahtadi.png?card=nahtadi`. Assert on the resolved *path*.
test('legacy /api/og?card= URLs redirect to the matching static card', async ({ request }) => {
  for (const id of ['site', 'nahtadi', 'brent-cuda']) {
    const res = await request.get(`/api/og?card=${id}`, { maxRedirects: 0 })
    expect([307, 308]).toContain(res.status())
    const location = res.headers()['location']
    expect(new URL(location, 'http://localhost:3000').pathname).toBe(`/og/${id}.png`)
  }
})

test('a bare /api/og URL redirects to the site card', async ({ request }) => {
  const res = await request.get('/api/og', { maxRedirects: 0 })
  expect([307, 308]).toContain(res.status())
  const location = res.headers()['location']
  expect(new URL(location, 'http://localhost:3000').pathname).toBe('/og/site.png')
})

test('a legacy /api/og URL follows through to a real PNG', async ({ request }) => {
  const res = await request.get('/api/og?card=nahtadi')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('image/png')
})
