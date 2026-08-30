'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export interface Screenshot {
  title: string;
  description: string;
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
}

/** The rail's own chevrons: stroked, sized by `.nh-scroll svg`. */
function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 10.9 15.8" aria-hidden="true">
      <path d={direction === 'left' ? 'M7.9 3 3 7.9 7.9 12.8' : 'M3 3 7.9 7.9 3 12.8'} />
    </svg>
  );
}

/**
 * The App Preview rail — six device-framed screenshots, scrolled horizontally.
 *
 * THE RAIL IS LEFT-ALIGNED, and two separate bugs were fixed to make it so.
 * Both are recorded in `src/app/styles/nahtadi.css` at `.nh-rail`, because
 * both are CSS; what matters HERE is that neither is re-introduced from the
 * JavaScript side:
 *
 *   - The leading and trailing insets are the card's normal inner inset, a
 *     CONSTANT. Nothing in this component may compute a centring offset.
 *   - `scroll-padding-inline` must track `padding-inline` at every breakpoint,
 *     or `scroll-snap-align: start` snaps to the padding box and scrolls the
 *     leading inset away on load.
 *
 * `tests/e2e/nahtadi.spec.ts` asserts the first screenshot's left edge equals
 * the card's content edge across eight widths, which is the one check that
 * catches both.
 *
 * THE SCROLL BUTTONS ARE PRESENT AT EVERY WIDTH, with no breakpoint gating.
 * That is what made the old `Scroll to see more →` hint redundant and is the
 * verified reason COPY-LOCKED row E1 deletes it outright rather than swapping
 * its Unicode arrow for an affordance glyph.
 */
export default function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  /** The item the last chevron press asked for, or null when the rail is at
   *  rest. See the note on `scrollBy` for why intent is tracked separately
   *  from position. */
  const pendingIndex = useRef<number | null>(null);

  const syncEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft <= 8);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8);
  }, []);

  /* The user has taken the rail over -- a swipe, a wheel, or arrow keys now
     that the rail is focusable. Whatever the chevrons last asked for is stale,
     so the next press works from where the rail actually is. */
  const releasePending = useCallback(() => {
    pendingIndex.current = null;
  }, []);

  /** The item currently parked at the snapport's leading edge. */
  const currentIndex = useCallback((rail: HTMLDivElement) => {
    const railLeft = rail.getBoundingClientRect().left;
    const padInline = parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0;
    const snapportLeft = railLeft + padInline;

    let index = 0;
    let closest = Infinity;
    [...rail.querySelectorAll<HTMLElement>('.nh-shot')].forEach((el, i) => {
      const distance = Math.abs(el.getBoundingClientRect().left - snapportLeft);
      if (distance < closest) {
        closest = distance;
        index = i;
      }
    });
    return index;
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    syncEdges();
    rail.addEventListener('scroll', syncEdges, { passive: true });
    /* Clear the pending target once the scroll has actually arrived, so a
       later press advances from the real position rather than from a target
       that is already satisfied. `scrollend` is not universally available, so
       arrival is detected from the position itself. */
    const clearWhenArrived = () => {
      if (pendingIndex.current !== null && currentIndex(rail) === pendingIndex.current) {
        pendingIndex.current = null;
      }
    };
    rail.addEventListener('scroll', clearWhenArrived, { passive: true });
    for (const type of ['pointerdown', 'touchstart', 'wheel', 'keydown'] as const) {
      rail.addEventListener(type, releasePending, { passive: true });
    }
    // Item width, gap and the inset all change at the 880px breakpoint, so the
    // edge state has to be re-read when the rail is resized as well as when it
    // is scrolled -- otherwise the chevrons keep the enabled/disabled state of
    // the previous layout.
    const observer = new ResizeObserver(syncEdges);
    observer.observe(rail);
    return () => {
      rail.removeEventListener('scroll', syncEdges);
      rail.removeEventListener('scroll', clearWhenArrived);
      for (const type of ['pointerdown', 'touchstart', 'wheel', 'keydown'] as const) {
        rail.removeEventListener(type, releasePending);
      }
      observer.disconnect();
    };
  }, [syncEdges, currentIndex, releasePending]);

  /**
   * Scroll to the NEXT ITEM, never by a pixel delta.
   *
   * Two separate defects live here, and the second one is why this is more
   * than a one-line change.
   *
   * (1) A DELTA DOES NOT KNOW WHERE THE SNAP POINTS ARE. This was
   *     `scrollBy({ left: direction * step() })`, where `step()` measured one
   *     item plus one gap from `offsetWidth` -- an integer-rounded read of a
   *     fractional width. Nothing tied that arithmetic to the rail's snap
   *     positions or to its trailing inset. `scrollIntoView({ inline: 'start' })`
   *     targets the ELEMENT, and aligns to the snapport -- honouring the same
   *     `scroll-padding-inline` that `scroll-snap-align: start` uses -- so the
   *     script and the snap agree by definition rather than by arithmetic, and
   *     the browser clamps at the last item instead of overshooting.
   *
   * (2) RAPID PRESSES MUST NOT COMPOUND AGAINST A MOVING TARGET, and this is
   *     the one that bites in practice, because pressing a chevron repeatedly
   *     is how anyone gets to the end of a six-item rail.
   *
   *     `scrollBy` is relative to the CURRENT scroll position, and during a
   *     smooth scroll that position is mid-flight. Presses issued before the
   *     previous one settled therefore lost distance: measured at a 390px
   *     viewport, pressing through the rail as fast as the events land left it
   *     818px short of the end in BOTH Chromium and WebKit.
   *
   *     Reading the index back off the live scroll position instead does not
   *     fix that -- it makes it worse. Mid-animation the "current" item is
   *     still the one being left, so every press in a burst targets the same
   *     neighbour and the burst collapses to a single step (measured: 1046px
   *     short in WebKit, worse than the delta it replaced).
   *
   *     So the intent is tracked separately from the position. `pendingIndex`
   *     is the item the LAST press asked for; a press advances from there, not
   *     from wherever the animation currently is, so a burst of five presses
   *     moves five items. It is cleared the moment the scroll arrives, or the
   *     moment the user takes over by touch, wheel or keyboard -- which is what
   *     keeps the chevrons in step with a rail that was swiped by hand.
   *
   * `block: 'nearest'` is load-bearing: without it, scrolling a horizontal rail
   * would also scroll the PAGE vertically to bring the item into view.
   */
  const scrollBy = useCallback(
    (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const items = [...rail.querySelectorAll<HTMLElement>('.nh-shot')];
    if (!items.length) return;

    // Advance from the last REQUESTED item when one is still in flight, so a
    // burst of presses covers a burst of items.
    const base = pendingIndex.current ?? currentIndex(rail);
    const target = Math.min(Math.max(base + direction, 0), items.length - 1);
    pendingIndex.current = target;

    items[target].scrollIntoView({
      inline: 'start',
      block: 'nearest',
      behavior: 'smooth',
    });
    },
    [currentIndex]
  );

  return (
    <div className="nh-gallery">
      <button
        type="button"
        className="nh-scroll nh-scroll-l"
        onClick={() => scrollBy(-1)}
        disabled={atStart}
        aria-label="Scroll left"
      >
        <Chevron direction="left" />
      </button>

      {/*
        A horizontally scrolling container needs its own keyboard route to the
        content. The chevrons beside it are focusable and do scroll the rail,
        but a keyboard user cannot reach the rail itself to use the arrow keys,
        and a screen-reader user gets no signal that the region scrolls at all
        — axe flags it as `scrollable-region-focusable`, serious, and it is
        right. `tabIndex={0}` makes the rail a tab stop (which is what gives it
        arrow-key scrolling for free); `role="group"` + `aria-label` stop it
        from being an unnamed focusable div when it gets there.

        `role="group"` rather than `role="region"` on purpose: `region` is a
        landmark and would put a sixth entry in the page's landmark list for
        what is one figure rail inside an already-labelled section.
      */}
      <div
        className="nh-rail"
        ref={railRef}
        tabIndex={0}
        role="group"
        aria-label="App screenshots"
      >
        {screenshots.map((shot, index) => (
          <figure className="nh-shot" key={shot.title}>
            <div className="nh-device">
              <Image
                src={`/images/nahtadi/screenshot-${index + 1}.png`}
                alt={shot.title}
                // The captures' own pixel dimensions (iPhone 17 Pro), so the
                // loader is asked for a sensibly sized variant; `.nh-device img`
                // owns the rendered box and its aspect ratio.
                width={1206}
                height={2622}
                sizes="250px"
                // The first two are visible without scrolling on a desktop
                // viewport and sit directly under the hero, so they are the
                // page's largest contentful candidates after the icon.
                priority={index < 2}
              />
            </div>
            <figcaption className="nh-shot-cap">
              <h3>{shot.title}</h3>
              <p>{shot.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <button
        type="button"
        className="nh-scroll nh-scroll-r"
        onClick={() => scrollBy(1)}
        disabled={atEnd}
        aria-label="Scroll right"
      >
        <Chevron direction="right" />
      </button>
    </div>
  );
}
