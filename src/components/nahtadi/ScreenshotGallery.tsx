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

  const syncEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft <= 8);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    syncEdges();
    rail.addEventListener('scroll', syncEdges, { passive: true });
    // The step below is derived from the laid-out item and gap, both of which
    // change at the 880px breakpoint, so the edge state has to be re-read when
    // the rail is resized as well as when it is scrolled.
    const observer = new ResizeObserver(syncEdges);
    observer.observe(rail);
    return () => {
      rail.removeEventListener('scroll', syncEdges);
      observer.disconnect();
    };
  }, [syncEdges]);

  /**
   * One item plus one gap. MEASURED from the rendered rail rather than
   * hard-coded: the item is 250px with a 28px gap at desktop and 210px with an
   * 18px gap below 880, and a constant here would step by the wrong amount on
   * one side of the breakpoint — landing between two snap positions, which the
   * mandatory snap then corrects by yanking the rail somewhere the user did
   * not ask for.
   */
  const step = () => {
    const rail = railRef.current;
    if (!rail) return 0;
    const item = rail.querySelector<HTMLElement>('.nh-shot');
    if (!item) return 0;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    return item.offsetWidth + gap;
  };

  const scrollBy = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * step(), behavior: 'smooth' });
  };

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
