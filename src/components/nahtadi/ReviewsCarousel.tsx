'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiStar } from 'react-icons/hi';
import type { NahtadiReview } from '@/lib/projects';

interface ReviewsCarouselProps {
  reviews: NahtadiReview[];
  rating?: { value: string; count: number };
}

const AUTO_ADVANCE_MS = 6000;

// Tracks the user's prefers-reduced-motion setting, updating if it changes.
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export default function ReviewsCarousel({ reviews, rating }: ReviewsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  const total = reviews.length;
  const goTo = useCallback((index: number) => setCurrent(index), []);
  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);

  // Auto-advance is disabled entirely under reduced-motion (manual only),
  // and pauses while the carousel is hovered or focused.
  const autoPlaying = !reducedMotion && !paused && total > 1;

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

  const review = reviews[current];

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="App Store reviews"
      className="max-w-3xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {rating && (
        <p className="flex items-center justify-center gap-1.5 mb-6 text-sm font-semibold text-gray-500">
          <HiStar className="text-yellow-400 text-base" aria-hidden="true" />
          <span>
            {rating.value}★ · {rating.count} Ratings on the App Store
          </span>
        </p>
      )}

      {/* Slide — one review card at a time. aria-live announces on manual
          navigation but stays silent during auto-advance to avoid spamming
          screen readers. */}
      <div aria-live={autoPlaying ? 'off' : 'polite'} aria-atomic="true">
        <div
          aria-roledescription="slide"
          aria-label={`${current + 1} of ${total}`}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-10 sm:px-12 sm:py-12 text-center min-h-[300px] flex flex-col justify-center"
        >
          <div className="flex justify-center mb-5 text-yellow-400 text-xl" aria-hidden="true">
            <HiStar /><HiStar /><HiStar /><HiStar /><HiStar />
          </div>
          <h3 className="text-lg font-semibold text-[#0A1A2F] mb-4">
            {review.title}
          </h3>
          <blockquote className="text-xl sm:text-2xl font-medium text-gray-900 leading-snug">
            &ldquo;{review.text}&rdquo;
          </blockquote>
          <p className="mt-6 text-gray-500 text-sm">
            — {review.author} · {review.date}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous review"
          className="text-white p-3 rounded-full shadow-md bg-[#0093FF] hover:bg-[#0080E0] transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0093FF]"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Choose review">
          {reviews.map((r, index) => (
            <button
              key={r.author}
              type="button"
              role="tab"
              onClick={() => goTo(index)}
              aria-label={`Go to review ${index + 1}: ${r.title}`}
              aria-selected={index === current}
              aria-current={index === current ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0093FF] ${
                index === current
                  ? 'w-6 bg-[#0093FF]'
                  : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next review"
          className="text-white p-3 rounded-full shadow-md bg-[#0093FF] hover:bg-[#0080E0] transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0093FF]"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
