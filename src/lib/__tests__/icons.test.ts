// @vitest-environment node
import { describe, it, expect } from 'vitest'
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { encodeIco, renderFavicon, renderAppleIcon, loadMarkSvg } from '../../../scripts/lib/icons'

const PUBLIC = path.resolve(__dirname, '../../../public')

describe('encodeIco', () => {
  it('writes a PNG-in-ICO container: header, one directory entry per frame, frames in order', async () => {
    const a = await sharp({ create: { width: 16, height: 16, channels: 4, background: '#f00' } }).png().toBuffer()
    const b = await sharp({ create: { width: 32, height: 32, channels: 4, background: '#00f' } }).png().toBuffer()
    const ico = encodeIco([
      { size: 16, png: a },
      { size: 32, png: b },
    ])

    expect(ico.readUInt16LE(0)).toBe(0) // reserved
    expect(ico.readUInt16LE(2)).toBe(1) // type 1 = icon
    expect(ico.readUInt16LE(4)).toBe(2) // frame count

    const dir = (i: number) => 6 + i * 16
    expect(ico[dir(0)]).toBe(16)
    expect(ico[dir(1)]).toBe(32)
    expect(ico.readUInt16LE(dir(0) + 6)).toBe(32) // bits per pixel
    expect(ico.readUInt32LE(dir(0) + 8)).toBe(a.length)
    expect(ico.readUInt32LE(dir(1) + 8)).toBe(b.length)

    const offA = ico.readUInt32LE(dir(0) + 12)
    const offB = ico.readUInt32LE(dir(1) + 12)
    expect(offA).toBe(6 + 2 * 16)
    expect(offB).toBe(offA + a.length)
    expect(ico.subarray(offA, offA + a.length).equals(a)).toBe(true)
    expect(ico.subarray(offB, offB + b.length).equals(b)).toBe(true)
    expect(ico.length).toBe(offB + b.length)
  })

  it('encodes a 256px frame as 0 in the one-byte size field, per the ICO spec', async () => {
    const big = await sharp({ create: { width: 256, height: 256, channels: 4, background: '#0f0' } }).png().toBuffer()
    const ico = encodeIco([{ size: 256, png: big }])
    expect(ico[6]).toBe(0)
    expect(ico[7]).toBe(0)
  })
})

describe('renderFavicon', () => {
  it('renders an exact square at the requested size with transparency kept', async () => {
    const svg = await loadMarkSvg()
    for (const size of [16, 32, 48, 64]) {
      const meta = await sharp(await renderFavicon(svg, size)).metadata()
      expect([meta.width, meta.height]).toEqual([size, size])
      expect(meta.hasAlpha).toBe(true)
    }
  })
})

describe('renderAppleIcon', () => {
  it('is 180x180, fully opaque, white at the corners, and carries the brand blue', async () => {
    const png = await renderAppleIcon(await loadMarkSvg())
    const img = sharp(png)
    const meta = await img.metadata()
    expect([meta.width, meta.height]).toEqual([180, 180])
    // iOS paints any transparency black, so the file must have no alpha at all.
    expect(meta.hasAlpha).toBe(false)

    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
    const px = (x: number, y: number) => {
      const i = (y * info.width + x) * info.channels
      return [data[i], data[i + 1], data[i + 2]]
    }
    expect(px(0, 0)).toEqual([255, 255, 255])
    expect(px(179, 179)).toEqual([255, 255, 255])

    // Somewhere in the mark there is solid #0093FF.
    let blue = 0
    for (let i = 0; i < data.length; i += info.channels) {
      if (data[i] === 0x00 && data[i + 1] === 0x93 && data[i + 2] === 0xff) blue++
    }
    expect(blue).toBeGreaterThan(500)
  })
})

describe('committed icon files', () => {
  it.each([
    ['favicon-16x16.png', 16],
    ['favicon-32x32.png', 32],
    ['favicon-64x64.png', 64],
    ['apple-touch-icon.png', 180],
  ])('%s is really %ipx square', async (file, size) => {
    const meta = await sharp(await readFile(path.join(PUBLIC, file))).metadata()
    expect([meta.width, meta.height]).toEqual([size, size])
  })

  it('apple-touch-icon.png has no alpha channel', async () => {
    const meta = await sharp(await readFile(path.join(PUBLIC, 'apple-touch-icon.png'))).metadata()
    expect(meta.hasAlpha).toBe(false)
  })

  it('favicon.ico carries 16, 32 and 48px frames', async () => {
    const ico = await readFile(path.join(PUBLIC, 'favicon.ico'))
    expect(ico.readUInt16LE(2)).toBe(1)
    const count = ico.readUInt16LE(4)
    const sizes = Array.from({ length: count }, (_, i) => ico[6 + i * 16])
    expect(sizes).toEqual([16, 32, 48])
  })
})
