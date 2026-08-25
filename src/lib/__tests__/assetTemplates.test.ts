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
})
