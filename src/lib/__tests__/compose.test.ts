// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'
import sharp from 'sharp'
import { composeIcon, squirclePath } from '../../../scripts/lib/compose'

const gradient = { from: '#166534', to: '#111827' }
const SIZE = 1024

async function rawPixels(png: Buffer) {
  return sharp(png).raw().toBuffer({ resolveWithObject: true })
}

/** RGBA at (x, y) from a raw() buffer, given its own reported width/channels. */
function pixelAt(data: Buffer, info: { width: number; channels: number }, x: number, y: number) {
  const i = (y * info.width + x) * info.channels
  return [data[i], data[i + 1], data[i + 2], data[i + 3]] as const
}

/** A single-color opaque square centered on a transparent canvas of `canvasSize`,
 * with `margin` of transparent padding baked in on every side. */
async function transparentSubjectFixture(subjectSize: number, canvasSize: number) {
  const subject = await sharp({
    create: { width: subjectSize, height: subjectSize, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 1 } },
  })
    .png()
    .toBuffer()
  const offset = Math.round((canvasSize - subjectSize) / 2)
  return sharp({ create: { width: canvasSize, height: canvasSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: subject, left: offset, top: offset }])
    .png()
    .toBuffer()
}

describe('compose', () => {
  // This fixture is a fully opaque white square (alpha channel present, but
  // uniformly 255 — no meaningful transparency). Task 4 shipped it when
  // *all* artwork was assumed full-bleed; under the amended detection logic
  // it now specifically exercises the opaque/full-bleed branch (STYLE.md's
  // coast-guard-pilot-tracker exception), not the default inset-subject path
  // covered by the "transparent floating subject" describe block below.
  describe('opaque full-bleed artwork (no meaningful transparency)', () => {
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
  })

  describe('squirclePath', () => {
    it('is a closed path', () => {
      const p = squirclePath(1024)
      expect(p.startsWith('M')).toBe(true); expect(p.trim().endsWith('Z')).toBe(true)
    })
  })

  // STYLE.md v2's default: artwork is a transparent floating subject the
  // compositor insets onto the gradient, not a full-bleed tile.
  describe('transparent floating subject (inset on the gradient)', () => {
    it('insets the subject inside the gradient instead of covering the frame', async () => {
      // Subject occupies all but a 12px margin of the source canvas — large
      // enough that, without trim-then-inset, a naive `fit: cover` full-bleed
      // would paint red at (50, 512) too. This is what makes the assertion
      // below a real discriminator between the two branches, not something
      // any full-bleed implementation would satisfy by accident.
      const artwork = await transparentSubjectFixture(1000, SIZE)
      const out = await composeIcon(artwork, gradient, 'rounded')
      const { data, info } = await rawPixels(out)
      expect(info.width).toBe(1024); expect(info.height).toBe(1024)

      // Center of the icon: the fitted subject (opaque red) should be here.
      const [r, g, b] = pixelAt(data, info, 512, 512)
      expect(r).toBeGreaterThan(200)
      expect(g).toBeLessThan(50)
      expect(b).toBeLessThan(50)

      // (50, 512): well outside the centered SUBJECT box, and far enough from
      // the actual rounded corners (rx=180) not to be clipped by the mask —
      // this must be gradient, not the red subject, proving the subject is
      // inset rather than covering the full 1024x1024 frame.
      const edge = pixelAt(data, info, 50, 512)
      expect(edge[3]).toBe(255) // fully opaque background, not mask-clipped
      expect(edge[0] < 200 || edge[1] > 30).toBe(true) // not the saturated red subject
    })

    it('is deterministic', async () => {
      const artwork = await transparentSubjectFixture(1000, SIZE)
      const a = await composeIcon(artwork, gradient, 'rounded')
      const b = await composeIcon(artwork, gradient, 'rounded')
      expect(Buffer.compare(a, b)).toBe(0)
    })

    it('trims the baked-in transparent margin so the same subject renders the same size regardless of source padding', async () => {
      // Same 200x200 subject, two very different amounts of transparent
      // margin baked into the source canvas (600 vs 1600). Without trimming
      // first, `fit: inside` would size the subject to how much of the
      // canvas it occupies, not its own dimensions — the same subject would
      // render smaller when the source canvas carries more padding, which is
      // exactly the inconsistent-family-sizing failure this guards against.
      const tightMargin = await transparentSubjectFixture(200, 600)
      const looseMargin = await transparentSubjectFixture(200, 1600)
      const outTight = await composeIcon(tightMargin, gradient, 'rounded')
      const outLoose = await composeIcon(looseMargin, gradient, 'rounded')
      expect(Buffer.compare(outTight, outLoose)).toBe(0)
    })
  })
})
