// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'
import sharp from 'sharp'
import { composeIcon, squirclePath } from '../../../scripts/lib/compose'

describe('compose', () => {
  const gradient = { from: '#166534', to: '#111827' }
  let artwork: Buffer
  beforeAll(async () => {
    artwork = await sharp({ create: { width: 600, height: 600, channels: 4, background: '#ffffff' } }).png().toBuffer()
  })

  it('composeIcon emits 1024x1024 png on the gradient', async () => {
    const out = await composeIcon(artwork, gradient, 'rounded')
    const meta = await sharp(out).metadata()
    expect(meta.width).toBe(1024); expect(meta.height).toBe(1024); expect(meta.format).toBe('png')
  })

  it('squircle mask corners are transparent', async () => {
    const out = await composeIcon(artwork, gradient, 'squircle')
    const { data, info } = await sharp(out).raw().toBuffer({ resolveWithObject: true })
    expect(data[3]).toBe(0) // top-left pixel alpha
    expect(info.width).toBe(1024)
  })

  it('is deterministic', async () => {
    const a = await composeIcon(artwork, gradient, 'rounded')
    const b = await composeIcon(artwork, gradient, 'rounded')
    expect(Buffer.compare(a, b)).toBe(0)
  })

  it('squirclePath is a closed path', () => {
    const p = squirclePath(1024)
    expect(p.startsWith('M')).toBe(true); expect(p.trim().endsWith('Z')).toBe(true)
  })
})
