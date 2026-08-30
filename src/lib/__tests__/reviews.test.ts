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
  // 7, not 8 and not 9 (COPY-LOCKED.md row H1). Three sources disagreed: App
  // Store Connect reports 9 worldwide, Apple's public lookup API and the US
  // storefront both report 7 (App Store counts are per-storefront), and this
  // file said 8 -- a stale snapshot matching neither. 7 is stored because
  // sub-project 5's fact sync automates against that lookup API, which is
  // per-country and cannot return a worldwide total: a narrower number that is
  // always right beats a truer number that is usually stale. Re-verified live
  // on 2026-08-29 (userRatingCount = 7, averageUserRating = 5). Do not
  // "correct" this to 9.
  it('should report 5.0 from 7 ratings, independent of review count', () => {
    const project = getProjectById('nahtadi')
    expect(project?.appStoreRating).toEqual({ value: '5.0', count: 7 })
    // Ratings (7) deliberately differ from written reviews (6).
    expect(project?.appStoreRating?.count).not.toBe(getNahtadiReviews().length)
  })
})
