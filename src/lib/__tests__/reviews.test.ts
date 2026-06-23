import { describe, it, expect } from 'vitest'
import { getNahtadiReviews, getProjectById } from '../projects'

describe('getNahtadiReviews', () => {
  it('should return all six curated reviews', () => {
    const reviews = getNahtadiReviews()
    expect(Array.isArray(reviews)).toBe(true)
    expect(reviews.length).toBe(6)
  })

  it('should return reviews with required fields', () => {
    const reviews = getNahtadiReviews()
    reviews.forEach(review => {
      expect(review).toHaveProperty('title')
      expect(review).toHaveProperty('author')
      expect(review).toHaveProperty('date')
      expect(review).toHaveProperty('text')
      expect(typeof review.text).toBe('string')
      expect(review.text.length).toBeGreaterThan(0)
    })
  })
})

describe('nahtadi appStoreRating (single source of truth)', () => {
  it('should report 5.0 from 8 ratings, independent of review count', () => {
    const project = getProjectById('nahtadi')
    expect(project?.appStoreRating).toEqual({ value: '5.0', count: 8 })
    // Ratings (8) deliberately differ from written reviews (6).
    expect(project?.appStoreRating?.count).not.toBe(getNahtadiReviews().length)
  })
})
