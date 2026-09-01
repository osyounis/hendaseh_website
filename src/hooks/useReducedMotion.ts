'use client';

import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Pins the hydration render to what the server rendered. Without it, the client
// would read the real preference on its very first render while the server had
// rendered `false`, which is a genuine hydration mismatch.
function getServerSnapshot(): boolean {
  return false;
}

/**
 * The user's prefers-reduced-motion setting, kept live.
 *
 * `useSyncExternalStore` rather than `useState` + an effect, for the reason
 * `ReviewsCarousel` learned the hard way and documented: reading `matchMedia` in
 * a lazy `useState` initializer returns the real value on the client's first
 * render while the server rendered `false`, and that is a real mismatch.
 * `tests/e2e/reduced-motion-hydration.spec.ts` guards it.
 *
 * COROLLARY, and it matters at every call site: do not branch the RENDERED DOM
 * on this during the first paint. Use it to drive effects, or hide things in
 * CSS with the media query. Conditional rendering on it reintroduces exactly the
 * mismatch the hook exists to avoid.
 *
 * Extracted here in B-E so the video block and the reviews carousel share one
 * implementation rather than two copies that can drift apart.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
