'use client';

import { useEffect } from 'react';

/**
 * Scroll reveal for the case-study template and the About page: blocks rise
 * 20px and fade in once as they enter the viewport.
 *
 * The CODE here is unchanged since Task B2.4 -- Task B3 reused it verbatim and
 * changed only the CSS, which now lives in `src/app/styles/shared.css` and
 * rides on the `translate` property rather than `transform` (About's cards
 * hover on `transform`; read that file's header for why the two cannot share
 * one property).
 *
 * THE POINT OF THIS COMPONENT IS WHAT IT DOES NOT DO.
 *
 * This project has already shipped the other version of this feature. The old
 * `/projects` grid server-rendered every card at `opacity: 0` and waited for an
 * IntersectionObserver to raise it, which made the reveal a GATE on content
 * rather than an enhancement: with JavaScript off, or on any device where the
 * observer callback did not fire, the page was blank.
 * `tests/e2e/projects-no-js.spec.ts` exists because of that, and now covers the
 * case-study routes too; `tests/e2e/about.spec.ts` makes the same assertions
 * for About.
 *
 * So the hidden state is never rendered on the server and never lives in the
 * base stylesheet. `[data-reveal]` with no value is fully visible; only
 * `[data-reveal="pending"]` is hidden, and this effect is the only thing that
 * can ever write that value. Everything that can go wrong -- no JS, no
 * IntersectionObserver, reduced motion, this component failing to mount --
 * leaves every section on screen, because the resting state IS the visible
 * state.
 *
 * Three further details:
 *
 *  - Only elements BELOW the fold are armed. Anything already on screen at
 *    mount is left alone, so hydration never flashes visible content out and
 *    back in, and the elements a first-time visitor is actually looking at are
 *    never hidden by a frame of JavaScript.
 *  - `pending` is written in the same pass that starts observing, so an element
 *    can never be hidden without an observer already watching it.
 *  - Under `prefers-reduced-motion: reduce` the effect returns before arming
 *    anything, which is a fully static page rather than an instant reveal. The
 *    stylesheet repeats the guarantee for a user who flips the setting after
 *    load.
 *
 * It renders `null` and reads the DOM in an effect on purpose: every section
 * stays server-rendered markup in a server component, with no wrapper element
 * and no client-side render of the content. Server and client render the same
 * empty output, so it cannot cause a hydration mismatch (see
 * `tests/e2e/reduced-motion-hydration.spec.ts` for why that matters here).
 */

/**
 * The contract's trigger line: an element reveals once it is 80px inside the
 * bottom of the viewport. That is the `-80px` bottom margin.
 *
 * The huge TOP margin is a fix for a real bug this file shipped for one round.
 * An IntersectionObserver only calls back when a target crosses a threshold. A
 * jump that carries an element from below the fold to above the viewport in a
 * single frame -- which is what any deep link or Home/End keypress does, and
 * what this page's own in-page jump button used to do -- crosses no
 * threshold at all: the element reads as "not intersecting" before and after.
 * The callback never ran, and the section the reader had skipped past stayed
 * invisible for the rest of the visit, which is the same class of failure as
 * the original `/projects` bug.
 *
 * Extending the root far above the viewport makes "already scrolled past" an
 * INTERSECTING state, so the jump does cross a threshold and the section is
 * revealed. The downward trigger point is unchanged.
 */
const ROOT_MARGIN = '9999px 0px -80px 0px';

export default function ScrollReveal({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    // `-80px` on the observer means an element has to be 80px inside the
    // viewport to count as visible, so the same 80px is subtracted here. An
    // element that straddles that line would otherwise be armed at mount and
    // then immediately revealed, which reads as a flicker.
    const foldline = window.innerHeight - 80;
    const armed = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
      (el) => el.getBoundingClientRect().top > foldline
    );
    if (armed.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = 'in';
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: ROOT_MARGIN }
    );

    for (const el of armed) {
      el.dataset.reveal = 'pending';
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
      // Back to the visible resting state. Without this, a Fast Refresh or a
      // client navigation that unmounts mid-reveal would strand a section at
      // `pending`, i.e. invisible with nothing left to reveal it.
      for (const el of armed) el.dataset.reveal = '';
    };
  }, [rootId]);

  return null;
}
