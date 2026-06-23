import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import ReviewsCarousel from '../ReviewsCarousel'
import type { NahtadiReview } from '@/lib/projects'

const reviews: NahtadiReview[] = [
  { title: 'First review', author: 'Alpha', date: 'Jan 1, 2026', text: 'First body text.' },
  { title: 'Second review', author: 'Beta', date: 'Jan 2, 2026', text: 'Second body text.' },
  { title: 'Third review', author: 'Gamma', date: 'Jan 3, 2026', text: 'Third body text.' },
]

// jsdom has no matchMedia; install a controllable stub.
function mockMatchMedia(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('ReviewsCarousel', () => {
  beforeEach(() => mockMatchMedia(false))

  it('renders the first review by default', () => {
    render(<ReviewsCarousel reviews={reviews} />)
    expect(screen.getByText('First review')).toBeInTheDocument()
    expect(screen.queryByText('Second review')).not.toBeInTheDocument()
  })

  it('renders the rating header when provided', () => {
    render(<ReviewsCarousel reviews={reviews} rating={{ value: '5.0', count: 8 }} />)
    expect(screen.getByText(/5\.0★ · 8 Ratings on the App Store/)).toBeInTheDocument()
  })

  it('advances to the next review with the Next control', () => {
    render(<ReviewsCarousel reviews={reviews} />)
    fireEvent.click(screen.getByLabelText('Next review'))
    expect(screen.getByText('Second review')).toBeInTheDocument()
  })

  it('wraps to the last review with the Previous control', () => {
    render(<ReviewsCarousel reviews={reviews} />)
    fireEvent.click(screen.getByLabelText('Previous review'))
    expect(screen.getByText('Third review')).toBeInTheDocument()
  })

  it('jumps to a specific review via the position dots', () => {
    render(<ReviewsCarousel reviews={reviews} />)
    fireEvent.click(screen.getByLabelText(/Go to review 3/))
    expect(screen.getByText('Third review')).toBeInTheDocument()
  })

  it('auto-advances when motion is allowed', () => {
    vi.useFakeTimers()
    render(<ReviewsCarousel reviews={reviews} />)
    expect(screen.getByText('First review')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(6000)
    })
    expect(screen.getByText('Second review')).toBeInTheDocument()
  })

  it('does not auto-advance under prefers-reduced-motion', () => {
    mockMatchMedia(true)
    vi.useFakeTimers()
    render(<ReviewsCarousel reviews={reviews} />)
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    // Still on the first review — auto-advance is disabled, manual only.
    expect(screen.getByText('First review')).toBeInTheDocument()
  })
})
