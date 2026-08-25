// @vitest-environment node
import { describe, it, expect } from 'vitest'
import satori from 'satori'
import { readFile } from 'node:fs/promises'
import { BannerTemplate } from '../assetTemplates'

describe('BannerTemplate', () => {
  it('renders a 1280x640 SVG with title and footer', async () => {
    const medium = await readFile('src/fonts/roboto/Roboto-Medium.ttf')
    const regular = await readFile('src/fonts/roboto/Roboto-Regular.ttf')
    const onePx = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    const svg = await satori(
      BannerTemplate({ title: 'Test Project', tagline: 'A tagline', iconPng: onePx, gradient: { from: '#0A1A2F', to: '#04294A' } }),
      { width: 1280, height: 640, embedFont: false, fonts: [
        { name: 'Roboto', data: regular, weight: 400, style: 'normal' },
        { name: 'Roboto', data: medium, weight: 500, style: 'normal' },
      ] }
    )
    expect(svg).toContain('width="1280"')
    // Satori (embedFont: false) emits one <text> per word, so a two-word title
    // never appears as one contiguous "Test Project" substring — assert both words.
    expect(svg).toContain('>Test<')
    expect(svg).toContain('>Project<')
    expect(svg).toContain('hendaseh.com')
  })

  it('keeps the tagline below a wrapping two-line title, with no overlap', async () => {
    const medium = await readFile('src/fonts/roboto/Roboto-Medium.ttf')
    const regular = await readFile('src/fonts/roboto/Roboto-Regular.ttf')
    const onePx = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    // A real catalog title long enough to wrap to two lines at the banner's
    // title width (see wildfire-predictor in src/data/projects.json).
    const svg = await satori(
      BannerTemplate({
        title: 'California Wildfire Likelihood Predictor',
        tagline: 'Wildfire likelihood from weather data',
        iconPng: onePx,
        gradient: { from: '#0A1A2F', to: '#04294A' },
      }),
      { width: 1280, height: 640, embedFont: false, fonts: [
        { name: 'Roboto', data: regular, weight: 400, style: 'normal' },
        { name: 'Roboto', data: medium, weight: 500, style: 'normal' },
      ] }
    )

    // With embedFont: false, Satori emits one <text x="…" y="…" font-size="…">
    // element per word/space, where y is that line's baseline. Pull every
    // (y, font-size) pair out of the raw SVG — no DOM parser needed for this.
    const nodes = [...svg.matchAll(/<text[^>]*\sy="([\d.]+)"[^>]*\sfont-size="(\d+)"[^>]*>/g)].map((m) => ({
      y: Number(m[1]),
      size: Number(m[2]),
    }))
    expect(nodes.length).toBeGreaterThan(0)

    // The banner has exactly three type sizes, largest to smallest: title,
    // tagline, footer. Classify by relative size rather than a hardcoded
    // pixel value so the test survives future size tuning.
    const sizes = [...new Set(nodes.map((n) => n.size))].sort((a, b) => b - a)
    expect(sizes.length).toBe(3)
    const [titleSize, taglineSize] = sizes

    const titleYs = nodes.filter((n) => n.size === titleSize).map((n) => n.y)
    const taglineYs = nodes.filter((n) => n.size === taglineSize).map((n) => n.y)

    // Sanity check that this title actually wrapped (i.e. the test exercises
    // the bug's precondition) rather than trivially passing on one line.
    expect(new Set(titleYs).size).toBeGreaterThanOrEqual(2)

    const lastTitleLineY = Math.max(...titleYs)
    const taglineY = Math.min(...taglineYs)

    // No overlap: the tagline's own ascent must clear the last title line's
    // descent. Roboto's real ascent/descent run close to 0.93/0.24 of the em
    // box; use generous (safe-upper-bound) fractions of 0.9/0.3 so this only
    // fails on genuine visual overlap, not font-metric rounding.
    const titleLineBottom = lastTitleLineY + titleSize * 0.3
    const taglineTop = taglineY - taglineSize * 0.9
    expect(taglineTop).toBeGreaterThan(titleLineBottom)

    // Nothing renders outside the 1280x640 frame.
    for (const n of nodes) {
      expect(n.y - n.size * 0.9).toBeGreaterThan(-1)
      expect(n.y + n.size * 0.3).toBeLessThan(640)
    }
  })
})
