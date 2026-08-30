import type { CSSProperties } from 'react';
// The two transport glyphs moved to their own module when /nahtadi's reviews
// carousel became their second consumer (Task N3); the drawings are unchanged.
import { PauseGlyph, PlayGlyph } from './TransportGlyphs';

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
  /*
   * Both added 2026-08-27 and confirmed interview-defensible by Omar, per the
   * skills-defensibility rule in .claude/CLAUDE.md. Each is verbatim-grounded in
   * the locked About copy.
   *
   * `1.5B LLM / ON A16` is an ACCOMPLISHMENT WITH A NUMBER, deliberately not a
   * competency label: CLAUDE.md holds that on-device ML is "a direction and
   * interest ... never list it as a claimed competency", so this must never be
   * restyled to CORE ML or ON-DEVICE ML.
   *
   * `AWS / 1M+ DATA POINT/MIN` keeps the unit in words on purpose. The
   * abbreviation-only form `1M+/MIN` was tested on Omar and he could not parse
   * it; naming the thing being counted is what makes the rate readable at
   * ticker speed, so the words stay even though the number is abbreviated.
   */
  { symbol: '1.5B LLM', stat: 'ON A16' },
  { symbol: 'APP STORE', stat: '5.0★' },
  { symbol: 'AWS', stat: '1M+ DATA POINT/MIN' },
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
 * WHY THE SEQUENCE IS AS WIDE AS IT IS. A viewport wider than one sequence shows
 * the same item twice at once, once at each end. Repeating the sequence does not
 * help -- it only adds more duplicates. Two real fixes exist: contain the strip,
 * or widen the sequence. Contained variants (a hairline band and an Apple-style
 * rounded tile, both in the page-wrap column) were built and REJECTED: they give
 * up the full-bleed seam without gaining a surface, and full-bleed is the only
 * non-card rhythm on Home. So the sequence widens instead -- mostly with content
 * (two more items), finished with air (30px -> 50px of inline padding), since
 * spacing alone would have had to grow absurdly to clear a wide display.
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

/** MEASURED width of one sequence: 8 items at 50px inline padding each side,
 *  2064.64px on 2026-08-27. Re-measure whenever the items or their padding
 *  change -- both move it, and it feeds BOTH the copy count and the duration.
 *  (Item text is part of that: this figure moved 0.84px when the AWS stat was
 *  reworded, which rounds to the same constant but was measured, not assumed.) */
const SEQUENCE_PX = 2065;

/** Derived, never hardcoded -- see TARGET_TAPE_PX above. Currently 2. */
const COPIES_PER_TAPE = Math.ceil(TARGET_TAPE_PX / SEQUENCE_PX);

/**
 * The approved scroll speed, and the constant everything else bends to.
 * 43.009px/s is what the original design measured: 2580.54px of travel over 60s.
 */
const TARGET_PX_PER_SECOND = 43.009;

/*
 * Seconds per copy, DERIVED from the speed and the measured sequence -- this is
 * the fix for a trap that a hardcoded duration walked straight into.
 *
 * Travel is 2x the tape width and the tape is SEQUENCE_PX * copies, so
 *
 *     px/s = 2 * SEQUENCE_PX * copies / (secondsPerCopy * copies)
 *          = 2 * SEQUENCE_PX / secondsPerCopy
 *
 * The copy count CANCELS. That is why the old hardcoded `60s` per copy survived
 * every change to the copy count and still held 43px/s -- and why widening the
 * SEQUENCE broke it invisibly: at 2065px the same 60s yields 68.8px/s, a 60%
 * speed-up that no copy-count guard could see. Inverting the equation makes the
 * speed a constant of the design and the duration the thing that follows.
 */
const SECONDS_PER_COPY = Math.round(((2 * SEQUENCE_PX) / TARGET_PX_PER_SECOND) * 1000) / 1000;

const TAPES = ['a', 'b'] as const;

/** Ties the visually-hidden checkbox to its label. */
const PAUSE_INPUT_ID = 'home-ticker-pause';


export default function HomeTicker() {
  return (
    /*
     * `aria-hidden` is NOT on this wrapper any more. It moved down onto the
     * tapes: the tape is decorative, but the pause control inside this strip
     * must reach assistive technology, and anything inside an aria-hidden
     * subtree is invisible to it no matter what else it does.
     */
    <div className="home-ticker">
      {/*
       * A real checkbox, visually hidden, with the label as its visible control.
       * Pause/play IS a persistent two-state setting the user makes and that
       * stays made, which is what a checkbox is -- so this borrows native
       * keyboard handling and native state announcement rather than
       * reimplementing them with aria-*, and the component stays server-rendered
       * with no hydration. It must precede the tape and the label: the pause
       * itself is `:checked ~ .home-ticker-viewport .home-tape`.
       */}
      <input type="checkbox" id={PAUSE_INPUT_ID} className="home-ticker-check" />
      {/*
       * Clips and fades the tape. Separate from `.home-ticker` because the strip
       * owns the background and the two hairlines, which must run edge to edge:
       * masking the strip itself would fade them out, and its `overflow: hidden`
       * would have clipped the control's focus ring.
       */}
      <div className="home-ticker-viewport">
      {/* The stylesheet derives the duration and tape B's delay from these two,
          so neither the copy count NOR the sequence width can move the scroll
          speed -- both are already accounted for in `--tape-seconds-per-copy`. */}
      <div
        className="home-tape-track"
        style={
          {
            '--tape-copies': COPIES_PER_TAPE,
            '--tape-seconds-per-copy': `${SECONDS_PER_COPY}s`,
          } as CSSProperties
        }
      >
        {TAPES.map((tape) => (
          <div
            key={tape}
            aria-hidden="true"
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
      {/*
       * Two icons and two words, one pair shown per state. `display: none`
       * removes a node from the accessible name computation as well as from the
       * page, so exactly one word is ever both visible-to-AT and current -- the
       * name says "Play" at the same moment the icon does. The words are
       * clipped rather than hidden so they name the control without adding text
       * to a deliberately quiet strip.
       */}
      <label className="home-ticker-toggle" htmlFor={PAUSE_INPUT_ID}>
        <PauseGlyph className="home-ticker-icon home-ticker-icon-pause" />
        <PlayGlyph className="home-ticker-icon home-ticker-icon-play" />
        <span className="home-ticker-word home-ticker-word-pause">Pause the ticker</span>
        <span className="home-ticker-word home-ticker-word-play">Play the ticker</span>
      </label>
    </div>
  );
}
