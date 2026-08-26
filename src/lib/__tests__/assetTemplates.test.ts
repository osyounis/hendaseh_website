// @vitest-environment node
import { describe, it, expect } from 'vitest'
import satori from 'satori'
import { readFile } from 'node:fs/promises'
import { BannerTemplate, CardTemplate } from '../assetTemplates'
import type { OgCard } from '../ogCards'

describe('BannerTemplate', () => {
  it('renders a 1280x640 SVG with title and footer', async () => {
    const medium = await readFile('src/fonts/roboto/Roboto-Medium.ttf')
    const regular = await readFile('src/fonts/roboto/Roboto-Regular.ttf')
    const onePx = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    const svg = await satori(
      BannerTemplate({
        title: 'Test Project',
        tagline: 'A tagline',
        artwork: { src: onePx, width: 1, height: 1 },
        gradient: { from: '#0A1A2F', to: '#04294A' },
      }),
      { width: 1280, height: 640, embedFont: false, fonts: [
        { name: 'Roboto', data: regular, weight: 400, style: 'normal' },
        { name: 'Roboto', data: medium, weight: 500, style: 'normal' },
      ] }
    )
    expect(svg).toContain('width="1280"')
    expect(svg).toContain('height="640"')
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
        artwork: { src: onePx, width: 1, height: 1 },
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

describe('CardTemplate', () => {
  const onePx = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

  it('renders a 1200x630 SVG with name and footer', async () => {
    const medium = await readFile('src/fonts/roboto/Roboto-Medium.ttf')
    const regular = await readFile('src/fonts/roboto/Roboto-Regular.ttf')
    const card: OgCard = {
      background: { kind: 'solid', color: '#0A1A2F' },
      name: 'Test Project',
      nameSize: 64,
      footer: 'hendaseh.com',
      textColor: '#FFFFFF',
    }
    const svg = await satori(CardTemplate({ card, mark: null }), {
      width: 1200,
      height: 630,
      embedFont: false,
      fonts: [
        { name: 'Roboto', data: regular, weight: 400, style: 'normal' },
        { name: 'Roboto', data: medium, weight: 500, style: 'normal' },
      ],
    })
    expect(svg).toContain('width="1200"')
    expect(svg).toContain('height="630"')
    expect(svg).toContain('>Test<')
    expect(svg).toContain('>Project<')
    expect(svg).toContain('hendaseh.com')
  })

  // Same latent bug BannerTemplate was hardened against in commit 3026f78,
  // reproduced here with the vertical budget this branch added: a tiled icon
  // (~258px, per the final-review measurement) plus a wrapping name plus a
  // tagline plus a footer — enough content that, without flexShrink: 0 on
  // every direct child, yoga would shrink the name's box below its rendered
  // text height and let it spill into the tagline below.
  it('keeps the tagline below a wrapping three-line name, with no overlap, even with a tile icon', async () => {
    const medium = await readFile('src/fonts/roboto/Roboto-Medium.ttf')
    const regular = await readFile('src/fonts/roboto/Roboto-Regular.ttf')
    const card: OgCard = {
      background: { kind: 'gradient', from: '#0A1A2F', to: '#04294A' },
      icon: { src: { project: 'test' }, tile: true },
      name: 'An Extremely Long Showcase Project Title That Wraps Across Three Full Lines',
      nameSize: 64,
      tagline: 'A tagline that must not be overlapped',
      footer: 'hendaseh.com',
      textColor: '#FFFFFF',
    }
    const svg = await satori(
      CardTemplate({ card, mark: { src: onePx, width: 1, height: 1 } }),
      {
        width: 1200,
        height: 630,
        embedFont: false,
        fonts: [
          { name: 'Roboto', data: regular, weight: 400, style: 'normal' },
          { name: 'Roboto', data: medium, weight: 500, style: 'normal' },
        ],
      }
    )

    // With embedFont: false, Satori emits one <text x="…" y="…" font-size="…">
    // element per word/space, where y is that line's baseline.
    const nodes = [...svg.matchAll(/<text[^>]*\sy="([\d.]+)"[^>]*\sfont-size="(\d+)"[^>]*>/g)].map((m) => ({
      y: Number(m[1]),
      size: Number(m[2]),
    }))
    expect(nodes.length).toBeGreaterThan(0)

    // The card has exactly two type sizes here: name, tagline (footer has a
    // third, smaller size too — classify by relative size, largest to
    // smallest).
    const sizes = [...new Set(nodes.map((n) => n.size))].sort((a, b) => b - a)
    expect(sizes.length).toBe(3)
    const [nameSize, taglineSize] = sizes

    const nameYs = nodes.filter((n) => n.size === nameSize).map((n) => n.y)
    const taglineYs = nodes.filter((n) => n.size === taglineSize).map((n) => n.y)

    // Sanity check that this name actually wrapped to (at least) two lines —
    // the WebkitLineClamp caps it at 2 — so the test exercises real content
    // pressure rather than trivially passing on one line.
    expect(new Set(nameYs).size).toBeGreaterThanOrEqual(2)

    const lastNameLineY = Math.max(...nameYs)
    const taglineY = Math.min(...taglineYs)

    // No overlap: the tagline's own ascent must clear the last name line's
    // descent. Same generous (safe-upper-bound) fractions as the banner test.
    const nameLineBottom = lastNameLineY + nameSize * 0.3
    const taglineTop = taglineY - taglineSize * 0.9
    expect(taglineTop).toBeGreaterThan(nameLineBottom)

    // Nothing renders outside the 1200x630 frame.
    for (const n of nodes) {
      expect(n.y - n.size * 0.9).toBeGreaterThan(-1)
      expect(n.y + n.size * 0.3).toBeLessThan(630)
    }
  })
})
