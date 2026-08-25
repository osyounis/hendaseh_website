import { afterEach, describe, expect, it, vi } from 'vitest'
import imagekitLoader from '../imagekitLoader'

// The loader branches on process.env.NODE_ENV, which vitest normally pins to
// 'test'. vi.stubEnv is the supported way to override it per-test; restore it
// in afterEach so other test files aren't affected.
afterEach(() => {
  vi.unstubAllEnvs()
})

describe('imagekitLoader — production mode', () => {
  it('builds the tr: transform URL with the default quality', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const result = imagekitLoader({ src: '/images/nahtadi/icon.png', width: 640, quality: undefined })
    expect(result).toBe('https://ik.imagekit.io/osyounis/tr:w-640,q-75,f-auto/images/nahtadi/icon.png')
  })

  it('honors an explicit quality', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const result = imagekitLoader({ src: '/images/nahtadi/icon.png', width: 640, quality: 90 })
    expect(result).toBe('https://ik.imagekit.io/osyounis/tr:w-640,q-90,f-auto/images/nahtadi/icon.png')
  })

  // Load-bearing: Next's default loader has a built-in bypass that skips
  // optimization for SVGs, but that bypass is gated on `isDefaultLoader` and is
  // lost once a custom loader (this one) is configured. Without replicating it
  // here, the App Store badge (an SVG) would be sent through ImageKit's `tr:`
  // transform, which rasterizes SVGs to PNG on the fly — silently swapping
  // Apple's trademarked vector badge for a raster image. This test must fail
  // if the guard is ever removed.
  it('returns SVG sources unchanged, without any tr: transform', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const result = imagekitLoader({ src: '/images/app-store-badge.svg', width: 200, quality: undefined })
    expect(result).toBe('/images/app-store-badge.svg')
  })

  it('strips the query string before checking the extension, so a querystring SVG still passes through', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const result = imagekitLoader({ src: '/images/app-store-badge.svg?v=2', width: 200, quality: undefined })
    expect(result).toBe('/images/app-store-badge.svg?v=2')
  })

  it('matches the extension case-insensitively', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const result = imagekitLoader({ src: '/images/app-store-badge.SVG', width: 200, quality: undefined })
    expect(result).toBe('/images/app-store-badge.SVG')
  })
})

describe('imagekitLoader — development mode', () => {
  it('returns src unchanged (ImageKit cannot reach localhost)', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const result = imagekitLoader({ src: '/images/nahtadi/icon.png', width: 640, quality: undefined })
    expect(result).toBe('/images/nahtadi/icon.png')
  })
})
