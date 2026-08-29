import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act, within } from '@testing-library/react'
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

/** The slide whose `data-current` is "true" — the one the CSS makes visible. */
function currentSlideTitle() {
  const current = document.querySelector('[data-current="true"]')
  if (!current) throw new Error('no slide is marked current')
  return within(current as HTMLElement).getByRole('heading').textContent
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('ReviewsCarousel', () => {
  beforeEach(() => mockMatchMedia(false))

  /* --------------------------------------------------------------------- *
   * Contract behaviour 1 — THE STACK
   *
   * Every review is in ONE grid cell, so the container sizes to the tallest
   * permanently and never changes height as they rotate. The old component
   * rendered `reviews[current]` alone, so the container's height tracked
   * whichever review was showing and everything below the carousel jumped;
   * `min-h-[300px]` was a FLOOR against that, not a ceiling, and the taller
   * reviews pushed straight past it.
   *
   * These two tests are what distinguish the stack from the old
   * one-at-a-time render: all slides present, exactly one current.
   * --------------------------------------------------------------------- */

  it('renders every review at once, so the container sizes to the tallest', () => {
    render(<ReviewsCarousel reviews={reviews} />)
    for (const review of reviews) {
      expect(screen.getByText(review.title)).toBeInTheDocument()
    }
  })

  it('marks exactly one slide current at a time', () => {
    render(<ReviewsCarousel reviews={reviews} />)
    expect(document.querySelectorAll('[data-current="true"]')).toHaveLength(1)
    expect(currentSlideTitle()).toBe('First review')
  })

  it('advances to the next review with the Next control', () => {
    render(<ReviewsCarousel reviews={reviews} />)
    fireEvent.click(screen.getByLabelText('Next review'))
    expect(currentSlideTitle()).toBe('Second review')
    expect(document.querySelectorAll('[data-current="true"]')).toHaveLength(1)
  })

  it('wraps to the last review with the Previous control', () => {
    render(<ReviewsCarousel reviews={reviews} />)
    fireEvent.click(screen.getByLabelText('Previous review'))
    expect(currentSlideTitle()).toBe('Third review')
  })

  it('jumps to a specific review via the position dots', () => {
    render(<ReviewsCarousel reviews={reviews} />)
    fireEvent.click(screen.getByLabelText(/Review 3/))
    expect(currentSlideTitle()).toBe('Third review')
  })

  it('auto-advances when motion is allowed', () => {
    vi.useFakeTimers()
    render(<ReviewsCarousel reviews={reviews} />)
    expect(currentSlideTitle()).toBe('First review')
    act(() => {
      vi.advanceTimersByTime(6000)
    })
    expect(currentSlideTitle()).toBe('Second review')
  })

  it('does not auto-advance under prefers-reduced-motion', () => {
    mockMatchMedia(true)
    vi.useFakeTimers()
    render(<ReviewsCarousel reviews={reviews} />)
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    // Still on the first review — auto-advance is disabled, manual only.
    expect(currentSlideTitle()).toBe('First review')
  })

  /* --------------------------------------------------------------------- *
   * Contract behaviour 2 — THE PAUSE CONTROL
   *
   * A real `<button aria-pressed>`, NOT the Home ticker's CSS checkbox. The
   * ticker's checkbox works because it pauses a CSS animation from a server
   * component; this carousel's auto-advance is a `setInterval`, which NO
   * checkbox can stop.
   *
   * Why it exists at all: the carousel auto-advances, never stops, and had no
   * touch-reachable pause — the identical WCAG 2.2.2 (Pause, Stop, Hide,
   * Level A) gap closed on the Home ticker, here on the page the App Store
   * links to.
   * --------------------------------------------------------------------- */

  /*
   * WHERE THE PAUSE ASSERTIONS LIVE, AND WHY THEY ARE SPLIT.
   *
   * The button's STATE is React's (`aria-pressed`, and whether the interval
   * runs), so it is asserted here. Its accessible NAME is CSS's: two clipped
   * words, one of which `display: none` removes from the accessible name
   * computation as well as from the page. jsdom loads no stylesheet, so under
   * vitest BOTH words are in the name and a name-based query would be
   * asserting the absence of a stylesheet rather than the presence of a
   * behaviour. The name flip is therefore checked in
   * tests/e2e/nahtadi.spec.ts, where real CSS runs — as is the fact that the
   * control disappears entirely under prefers-reduced-motion.
   *
   * These queries use the `pressed` option rather than a label, which is the
   * ARIA contract the CSS mechanism hangs off and is stable either way.
   */
  const pauseControl = () => screen.getByRole('button', { pressed: false })
  const playControl = () => screen.getByRole('button', { pressed: true })

  it('exposes the pause control as a real toggle button', () => {
    render(<ReviewsCarousel reviews={reviews} />)
    expect(pauseControl()).toHaveAttribute('aria-pressed', 'false')
    // Both words ship; CSS shows exactly one. If either disappears from the
    // markup the name can no longer flip with the icon.
    expect(screen.getByText('Pause the reviews')).toBeInTheDocument()
    expect(screen.getByText('Play the reviews')).toBeInTheDocument()
  })

  it('stops auto-advance when the pause control is pressed', () => {
    vi.useFakeTimers()
    render(<ReviewsCarousel reviews={reviews} />)
    fireEvent.click(pauseControl())
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    expect(currentSlideTitle()).toBe('First review')
  })

  it('reports the pressed state so the icon and name can follow it', () => {
    render(<ReviewsCarousel reviews={reviews} />)
    fireEvent.click(pauseControl())
    expect(playControl()).toHaveAttribute('aria-pressed', 'true')
  })

  it('resumes auto-advance when the pause control is pressed again', () => {
    vi.useFakeTimers()
    render(<ReviewsCarousel reviews={reviews} />)
    fireEvent.click(pauseControl())
    fireEvent.click(playControl())
    act(() => {
      vi.advanceTimersByTime(6000)
    })
    expect(currentSlideTitle()).toBe('Second review')
  })

  /* --------------------------------------------------------------------- *
   * HOVER-PAUSE IS DELETED; FOCUS-PAUSE IS KEPT.
   *
   * Hover went for the reason the Home ticker's did: on touch, a tap applies
   * `:hover` and the content freezes until the user taps somewhere else —
   * a control the user never asked for and cannot find.
   *
   * Focus stays, as state SEPARATE from user intent, so that focus and blur
   * can never resume a carousel the user deliberately paused. Auto-advancing
   * content out from under a keyboard user who is operating the controls is a
   * real defect, and focus cannot misfire on touch the way hover does.
   * --------------------------------------------------------------------- */

  it('does not pause on hover', () => {
    vi.useFakeTimers()
    render(<ReviewsCarousel reviews={reviews} />)
    const carousel = screen.getByRole('group', { name: 'App Store reviews' })
    fireEvent.mouseEnter(carousel)
    act(() => {
      vi.advanceTimersByTime(6000)
    })
    expect(currentSlideTitle()).toBe('Second review')
  })

  it('pauses while focus is inside the carousel', () => {
    vi.useFakeTimers()
    render(<ReviewsCarousel reviews={reviews} />)
    fireEvent.focus(screen.getByLabelText('Next review'))
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    expect(currentSlideTitle()).toBe('First review')
  })

  it('keeps a user-pressed pause when focus leaves', () => {
    vi.useFakeTimers()
    render(<ReviewsCarousel reviews={reviews} />)
    const next = screen.getByLabelText('Next review')
    fireEvent.focus(next)
    fireEvent.click(screen.getByRole('button', { pressed: false }))
    fireEvent.blur(next)
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    // Blur must not resume what the user stopped on purpose.
    expect(currentSlideTitle()).toBe('First review')
  })
})
