'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { NahtadiReview } from '@/lib/projects';
import { PauseGlyph, PlayGlyph } from '@/components/home/TransportGlyphs';

interface ReviewsCarouselProps {
  reviews: NahtadiReview[];
}

const AUTO_ADVANCE_MS = 6000;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Server (and first client render, before hydration) always assume no preference —
// matches getServerSnapshot below so SSR and hydration output never mismatch.
function getReducedMotionServerSnapshot(): boolean {
  return false;
}

// Tracks the user's prefers-reduced-motion setting, updating if it changes.
// useSyncExternalStore is used rather than useState + effect because
// getServerSnapshot pins the hydration render to the same value the server
// rendered, while getReducedMotionSnapshot supplies the real preference on every
// render after that. The version this replaced read matchMedia in a lazy
// useState initializer, which returned true on the client's first render while
// the server had rendered false — a real hydration mismatch.
// tests/e2e/reduced-motion-hydration.spec.ts guards it, and is the reason the
// pause control below is hidden under this preference in CSS rather than by
// conditional rendering here.
function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

/** Five filled stars. Decorative: the review's own text carries the meaning. */
function Stars() {
  return (
    <div className="nh-rv-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20">
          <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
        </svg>
      ))}
    </div>
  );
}

/** Prev/next, the stroked chevron drawing at transport-control size. */
function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 10.9 15.8"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'left' ? 'M7.9 3 3 7.9 7.9 12.8' : 'M3 3 7.9 7.9 3 12.8'} />
    </svg>
  );
}

/**
 * The App Store reviews carousel.
 *
 * THREE BEHAVIOURS HERE ARE CONTRACTUAL
 * (docs/superpowers/mockups/nahtadi/APPROVED.md, "Component behaviours").
 *
 * 1. EVERY REVIEW IS RENDERED, STACKED IN ONE GRID CELL. The container
 *    therefore sizes to the TALLEST review permanently and never changes
 *    height as they rotate, so nothing below it jumps. The version this
 *    replaced rendered `reviews[current]` alone under a `min-h-[300px]`, which
 *    was a FLOOR rather than a ceiling: the reviews run 122 to 200 characters
 *    and the taller ones pushed straight past it. There is no magic number in
 *    the replacement — add a seventh review and the floor rises on its own.
 *    Same technique the Home ticker's two tapes use.
 *
 *    Inactive slides are `visibility: hidden` in CSS, so they are genuinely
 *    INERT: not focusable, not in the accessibility tree. They are still in
 *    the DOM, which is the whole point — they are what sets the height.
 *
 * 2. THE PAUSE CONTROL IS A REAL `<button aria-pressed>`, not the Home
 *    ticker's CSS checkbox. The ticker's checkbox works because `HomeTicker`
 *    is a server component pausing a CSS animation; this carousel is already a
 *    client component and its auto-advance is a `setInterval`, which NO
 *    checkbox can stop. It exists because the carousel auto-advanced, never
 *    stopped, and had no touch-reachable pause — the identical WCAG 2.2.2
 *    (Pause, Stop, Hide, Level A) gap closed on the Home ticker, here on the
 *    page the App Store links to.
 *
 *    Icon and accessible name flip together via `display: none` in CSS, which
 *    removes a node from the accessible NAME COMPUTATION as well as from the
 *    page — so the name can never say "Pause" while the icon shows a play
 *    triangle. The button is hidden entirely under `prefers-reduced-motion`,
 *    in CSS: auto-advance is already off there, so a pause button would be a
 *    control for something that is not moving, and leaving it focusable would
 *    put a purposeless stop in the tab order.
 *
 * 3. HOVER-PAUSE IS DELETED, focus-pause is KEPT. Hover went for the reason
 *    the ticker's did: on touch a tap applies `:hover` and the content freezes
 *    until the user taps elsewhere. Focus stays, tracked as state SEPARATE
 *    from user intent (`focusHeld` vs `paused`) precisely so focus and blur
 *    can never resume a carousel the user deliberately paused — the bug the
 *    old single `paused` flag had, where a blur silently restarted it.
 */
export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focusHeld, setFocusHeld] = useState(false);
  const reducedMotion = useReducedMotion();

  const total = reviews.length;
  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);

  const autoPlaying = !reducedMotion && !paused && !focusHeld && total > 1;

  // Keep an up-to-date ref so the interval callback never goes stale.
  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  useEffect(() => {
    if (!autoPlaying) return;
    const id = setInterval(() => nextRef.current(), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [autoPlaying]);

  if (total === 0) return null;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="App Store reviews"
      className="nh-rv"
      onFocus={() => setFocusHeld(true)}
      // React's onBlur is the delegated `focusout`, so it fires when focus
      // moves BETWEEN two controls inside the carousel as well as when it
      // leaves. `relatedTarget` is where focus is going: if that is still
      // inside, focus never actually left and the auto-advance must stay held.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusHeld(false);
        }
      }}
    >
      {/* aria-live announces on manual navigation but stays silent during
          auto-advance, so a screen reader is not spammed every six seconds. */}
      <div className="nh-rv-stack" aria-live={autoPlaying ? 'off' : 'polite'} aria-atomic="true">
        {reviews.map((review, index) => (
          <div
            key={review.author}
            className="nh-rv-slide"
            data-current={index === current ? 'true' : 'false'}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${total}`}
          >
            <Stars />
            <h3 className="nh-rv-title">{review.title}</h3>
            <blockquote className="nh-rv-quote">&ldquo;{review.text}&rdquo;</blockquote>
            <p className="nh-rv-who">
              {review.author} &middot; {review.date}
            </p>
          </div>
        ))}
      </div>

      <div className="nh-rv-controls">
        <button type="button" className="nh-rv-btn" onClick={prev} aria-label="Previous review">
          <Chevron direction="left" />
        </button>

        <div className="nh-rv-dots" role="tablist" aria-label="Choose review">
          {reviews.map((review, index) => (
            <button
              key={review.author}
              type="button"
              role="tab"
              className="nh-rv-dot"
              onClick={() => setCurrent(index)}
              aria-label={`Review ${index + 1}: ${review.title}`}
              aria-selected={index === current}
            />
          ))}
        </div>

        <button type="button" className="nh-rv-btn" onClick={next} aria-label="Next review">
          <Chevron direction="right" />
        </button>

        {/* No aria-label: the accessible name comes from whichever clipped
            word is currently displayed, so name and icon are one state rather
            than two that can drift apart. */}
        <button
          type="button"
          className="nh-rv-btn nh-rv-pause"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          <PauseGlyph className="nh-ico-pause" />
          <PlayGlyph className="nh-ico-play" />
          <span className="nh-rv-word nh-ico-pause">Pause the reviews</span>
          <span className="nh-rv-word nh-ico-play">Play the reviews</span>
        </button>
      </div>
    </div>
  );
}
