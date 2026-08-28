import type { CSSProperties } from 'react';

/**
 * Quiet monochrome pairs and uncostumed real stats. Decorative — the same facts
 * are stated as real content in the bands below — so the whole strip is hidden
 * from assistive technology and carries nothing focusable.
 */
type TickerItem = { symbol: string; rest?: string; stat?: string };

const TICKER_ITEMS: TickerItem[] = [
  { symbol: 'SWIFT', rest: 'SWIFTUI' },
  { symbol: 'PYTORCH', rest: 'TENSORFLOW' },
  { symbol: 'CUDA', rest: 'C++', stat: '35.31×' },
  { symbol: 'PYTHON', rest: 'NUMPY' },
  { symbol: 'APP STORE', stat: '5.0★' },
  { symbol: 'MECHANICAL', stat: '7 YRS' },
];

/*
 * Phase-offset double buffering: the reset still exists, but it is never on
 * screen.
 *
 * Two identical tapes, each carrying a full copy of the six items. Each travels
 * TWICE its own width, +100% -> -100%, over 60s, so the speed is one tape-width
 * per 30s -- unchanged from every design below. Tape B runs the same animation
 * half a period ahead (`animation-delay: -30s`), so the two are always exactly
 * one tape-width apart: as one exits left the other enters right and their
 * edges meet at the seam. Each tape's jump from -100% back to +100% happens
 * while that tape is entirely off-screen.
 *
 * WHY IT LOOKS LIKE THIS. Omar sees a flicker at the loop boundary on device.
 * It cannot reproduce on desktop, where DPR is 1-2 and GPU limits are far
 * larger, so every headless run has been clean and no desktop observation
 * counts as evidence either way. Four designs were tried, read as a 2x2 of
 * (one animated element vs two) x (forced promotion vs none):
 *
 *   1. One track translating -50%, `will-change: transform` +
 *      `backface-visibility: hidden`. Flickered. Hypothesis was an oversized
 *      layer: forced promotion on a 2581 CSS px element is 7742 device px at
 *      DPR 3, past iOS's ~4096px GPU texture limit, so WebKit tiles and can
 *      evict tiles under memory pressure.
 *   2. Two halves, each animated, same promotion hints. Every half was then
 *      3870 device px at DPR 3, inside the limit. STILL flickered -- which
 *      falsified the texture-limit explanation rather than confirming it.
 *   3. Two halves, each animated, promotion hints removed. Unchanged. Cost
 *      nothing and fixed nothing, so the hints are ruled out and stay gone.
 *   4. One animated track again, no hints. Unchanged.
 *
 * All four were reported against the workerd preview build, which is the only
 * valid target -- earlier sightings were against the dev server, where blocked
 * cross-origin assets were restarting CSS animations wholesale.
 *
 * Four cells, four failures, and all four shared an invariant none of them
 * varied: THE RESET HAPPENED WHILE THE ANIMATED ELEMENT WAS COVERING THE
 * VIEWPORT. Element count and layer promotion were varied; where the
 * discontinuity occurs never was. That is what this changes, which is why it is
 * a different technique rather than a fifth variation.
 *
 * WHY EACH TAPE REPEATS THE SEQUENCE. The two tapes cover a contiguous 2W span
 * whose right edge falls to W just before each reset, so a viewport wider than
 * ONE tape shows an empty strip at the right edge once per cycle. The strip is
 * full-bleed, so the constraint is:
 *
 *     TAPE WIDTH >= THE WIDEST VIEWPORT WE SUPPORT
 *
 * One six-item sequence is only ~1290 CSS px, which gaps on any common Mac
 * width (1440, 1512, 1728) and on a Pro Display XDR. So each tape carries
 * however many copies of the sequence it takes to clear TARGET_TAPE_PX. If you
 * change the item list, that is the constraint you are working against -- the
 * copy count is derived from it, and tests/e2e/homepage.spec.ts asserts the
 * MEASURED width against the same target rather than trusting this arithmetic.
 *
 * SPEED IS INVARIANT UNDER THE COPY COUNT, and must stay that way. Travel is
 * 2x tape width, so both scale together: the CSS derives duration as
 * `SECONDS_PER_COPY * --tape-copies` and tape B's delay as half of that, which
 * holds ~43 px/s (the speed Omar approved) at any copy count. Never hardcode
 * the duration -- that is how doubling the tape silently doubles the speed.
 *
 * The repeating unit cannot shrink below this six-item sequence -- the items,
 * their copy and their 30px padding are locked by
 * docs/superpowers/mockups/home/APPROVED.md. Repeating that sequence is
 * contract-neutral: the ticker is a loop, so a viewer sees the same six items
 * in the same order whatever the repeat count.
 */

/** Widest viewport the full-bleed strip must cover without gapping: 4K. */
const TARGET_TAPE_PX = 3840;

/** Measured width of one six-item sequence. Drifts if the items change; the
 *  e2e coverage assertion measures the real thing and is the actual guard. */
const SEQUENCE_PX = 1290;

/** Derived, never hardcoded -- see TARGET_TAPE_PX above. Currently 3. */
const COPIES_PER_TAPE = Math.ceil(TARGET_TAPE_PX / SEQUENCE_PX);

const TAPES = ['a', 'b'] as const;

export default function HomeTicker() {
  return (
    <div className="home-ticker" aria-hidden="true">
      {/* `--tape-copies` is the single source of truth for the tape's size AND
          its timing: the stylesheet derives both duration and tape B's delay
          from it, so the scroll speed cannot drift when the copy count does. */}
      <div
        className="home-tape-track"
        style={{ '--tape-copies': COPIES_PER_TAPE } as CSSProperties}
      >
        {TAPES.map((tape) => (
          <div
            key={tape}
            className={tape === 'b' ? 'home-tape home-tape-b' : 'home-tape'}
          >
            {Array.from({ length: COPIES_PER_TAPE }, (_, copy) =>
              TICKER_ITEMS.map(({ symbol, rest, stat }) => (
                <span key={`${copy}-${symbol}`} className="home-tk">
                  <span className="text-secondary text-[14px] font-black tracking-[0.14em]">
                    {symbol}
                  </span>
                  {rest && (
                    <>
                      <span className="text-faint font-black">/</span>
                      <span className="text-[color:var(--ticker-secondary)] text-[13px] font-bold tracking-[0.1em]">
                        {rest}
                      </span>
                    </>
                  )}
                  {stat && (
                    <span className="text-secondary text-[13px] font-bold tracking-[0.08em]">
                      {stat}
                    </span>
                  )}
                </span>
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
