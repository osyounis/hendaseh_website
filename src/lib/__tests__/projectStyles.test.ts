import { describe, it, expect } from 'vitest'
import { getAllProjects } from '../projects'
import { getProjectGradientStops } from '../projectStyles'

describe('brand.gradient stays in sync with projectStyles', () => {
  it('every project brand.gradient matches getProjectGradientStops', () => {
    getAllProjects().forEach((p) => {
      if (!p.brand) return
      const stops = getProjectGradientStops(p.id)
      expect(p.brand.gradient.from.toLowerCase(), p.id).toBe(stops.from.toLowerCase())
      expect(p.brand.gradient.to.toLowerCase(), p.id).toBe(stops.to.toLowerCase())
    })
  })

  it('every project has brand.gradient defined', () => {
    getAllProjects().forEach((p) => expect(p.brand, `${p.id} missing brand.gradient`).toBeDefined())
  })
})
