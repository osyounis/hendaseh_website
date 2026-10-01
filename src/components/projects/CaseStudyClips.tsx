'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { PauseGlyph, PlayGlyph, ReplayGlyph } from '@/components/home/TransportGlyphs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import CaseStudyCaption from '@/components/projects/CaseStudyCaption';
import ClipSwitch from '@/components/projects/ClipSwitch';
import type { CaseStudyClipScenario } from '@/lib/caseStudies';

/** Must match the outgoing half of the fade in case-study.css. The swap lands
 *  at the bottom of it, while the clip is invisible. */
const FADE_OUT_MS = 200;

interface CaseStudyClipsProps {
  /** From `clipScenarios()`. One entry for a single-axis block. */
  scenarios: readonly CaseStudyClipScenario[];
  title?: string;
}

/** What the reader has chosen: a scenario and a view. */
interface Choice {
  scenario: string;
  view: string;
}

/** The single <video> is keyed on this, so it changes on EITHER axis. */
const keyOf = (choice: Choice) => `${choice.scenario}:${choice.view}`;

/**
 * ONE VIDEO AREA IN THE TILE, WITH THE CLIPS AS CHOICES.
 *
 * B-F gave each clip its own tile and that read as repetition: two identical
 * grey containers in a row, saying "another video" rather than "the same run,
 * differently". Side by side was rejected before this -- at about 460px each the
 * board's ring labels and vector triangle stop being readable, and autoplaying
 * one of a pair privileges it arbitrarily. One area, one clip playing, and a
 * segmented control to pick.
 *
 * THERE IS ONLY EVER ONE <video> IN THE DOM. The element is keyed by the
 * selected clip, so switching UNMOUNTS the previous one and mounts a fresh
 * element on its own poster. That is stronger than `preload="none"` on a hidden
 * second element: the clip you did not choose is not requested at all, not even
 * for metadata, and the previous clip cannot keep playing because it no longer
 * exists. It is also why the swap always resets to the new clip's own poster
 * rather than inheriting a frame or a playhead.
 *
 * TWO AXES, STILL ONE ELEMENT. A block may offer scenarios (radar-moboard: avoid
 * or intercept) as well as views (board or sea). The element is keyed on the
 * pair, so a change on EITHER axis replaces it, and the view the reader chose is
 * kept when the scenario changes. Scenario is the tablist -- it changes what the
 * panel is, and its caption -- and view becomes a pair of pressed buttons, since
 * two tablists pointing at one panel is a broken tabs pattern.
 *
 * The chooser (manual activation, the interruptible indicator) is ClipSwitch.
 *
 * THE STAGE FADES THROUGH RATHER THAN CROSS-FADING. A true cross-fade needs the
 * outgoing and incoming clips on screen together, and only one <video> is ever
 * in the DOM -- that is load-bearing, not incidental. So: fade out, swap, fade
 * in. The swap is driven off a pending ref rather than state, so a reader who
 * picks the other tab mid-fade retargets the same sequence instead of starting
 * a second one.
 *
 * 200ms each way, not 150. Apple's measured 300ms is a CROSS-fade, where both
 * images are present the whole way; a fade-through has to be given more time
 * because the reader registers the moment in between. What fades is the clip
 * and its control -- the panel behind them keeps its ground throughout, so the
 * swap never opens a hole in the tile.
 *
 * Everything B-E and B-F established is preserved:
 *   - plays once and holds its final frame; it does not loop, because the clip
 *     opens before the second observation and ends past CPA, so its first and
 *     last frames are different pictures and a loop can only cut between them
 *   - three control states, with `ReplayGlyph` for the third: "Play" on a clip
 *     already showing its final frame says the wrong thing
 *   - playback starts from an IntersectionObserver, not on mount, so a clip is
 *     not finishing while the reader is still somewhere else on the page
 *   - NO `autoPlay` attribute: playback starts from an effect, which is what
 *     keeps the server render and the first client render identical and lets
 *     reduced motion be honoured without a hydration mismatch. Under `reduce`
 *     the observer is never attached and the poster simply stays, with the
 *     control as the opt-in.
 *
 * `muted` and `playsInline` are both load-bearing on iOS Safari: without either
 * it refuses to play inline and takes the video fullscreen instead.
 */
export default function CaseStudyClips({ scenarios, title }: CaseStudyClipsProps) {
  const reduced = useReducedMotion();
  const uid = useId();
  const views = scenarios[0]!.clips;
  const hasScenarios = scenarios.length > 1;
  const hasViews = views.length > 1;
  const showControls = hasScenarios || hasViews;
  const first: Choice = { scenario: scenarios[0]!.id, view: views[0]!.id };

  /**
   * TWO CHOICES, AND THE SPLIT IS DELIBERATE.
   *
   * `selected` updates on the press and drives the switches, so they answer
   * instantly. `mounted` is what is actually in the DOM, and lags by the
   * fade-out so the swap happens while the stage is at zero opacity.
   */
  const [selected, setSelected] = useState<Choice>(first);
  const [mounted, setMounted] = useState<Choice>(first);
  const mountedKey = keyOf(mounted);
  const scenario = scenarios.find((s) => s.id === mounted.scenario) ?? scenarios[0]!;
  const active = scenario.clips.find((c) => c.id === mounted.view) ?? scenario.clips[0]!;

  const ref = useRef<HTMLVideoElement>(null);
  /** The choice that has already auto-started, so scrolling back past a clip the
   *  reader stopped does not restart it, while a NEW choice does start. */
  const autoStartedFor = useRef<string | null>(null);
  /** The newest choice, readable from inside the swap timeout, where state
   *  would be a stale closure. */
  const pending = useRef<Choice>(first);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [swapping, setSwapping] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  const panelId = `${uid}-clip-panel`;
  const titleId = `${uid}-clip-title`;
  const tabId = (id: string) => `${uid}-clip-tab-${id}`;
  const scenarioTabId = (id: string) => `${uid}-scenario-tab-${id}`;

  useEffect(() => () => clearTimeout(swapTimer.current), []);

  // Autoplay can still be refused — Low Power Mode, a data saver, a browser
  // policy. Catching it leaves the control saying "Play", which is true.
  const start = (video: HTMLVideoElement) => video.play().catch(() => setPlaying(false));

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduced) {
      video.pause();
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      // No observer (an old browser, or a harness stubbing it out): fall back to
      // the old behaviour rather than to a clip that never plays.
      if (autoStartedFor.current !== mountedKey) {
        autoStartedFor.current = mountedKey;
        void start(video);
      }
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        // Half of it on screen, so a clip does not start while it is a sliver at
        // the bottom edge and finish before the reader has read the caption.
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if (autoStartedFor.current === mountedKey) return;
        autoStartedFor.current = mountedKey;
        void start(video);
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced, mountedKey]);

  const mount = (choice: Choice) => {
    // Reset the transport here rather than in an effect: the element is about to
    // be replaced, so it will never fire the `pause` that would otherwise clear
    // this, and a stale "Replay" on a fresh poster would be a lie.
    setMounted(choice);
    setPlaying(false);
    setEnded(false);
  };

  const select = (change: Partial<Choice>) => {
    const next = { ...pending.current, ...change };
    if (keyOf(next) === keyOf(pending.current)) return;
    pending.current = next;
    // Immediately, always: the switches answer on the press, not after the fade.
    setSelected(next);

    if (reduced) {
      // No slide, no fade, no wait -- the clip simply changes.
      clearTimeout(swapTimer.current);
      setSwapping(false);
      mount(next);
      return;
    }

    setSwapping(true);
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => {
      // `pending.current`, not `next`: a second choice made during the fade --
      // on either switch -- is the one that lands, and the sequence in flight is
      // retargeted rather than doubled. A pair passed through on the way is
      // never mounted, so never fetched.
      mount(pending.current);
      setSwapping(false);
    }, FADE_OUT_MS);
  };

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    // `ended` first: a finished clip is also a paused one, so testing `paused`
    // first would resume from the last frame and appear to do nothing.
    if (video.ended) {
      video.currentTime = 0;
      void start(video);
    } else if (video.paused) {
      void start(video);
    } else {
      video.pause();
    }
  };

  // Names WHICH clip, and on a scenario block which scenario: "Board view" is
  // offered twice, so the view alone would not say what the button acts on.
  const subject = (hasScenarios ? `${scenario.label}, ${active.label}` : active.label).toLowerCase();
  const control = ended
    ? { Glyph: ReplayGlyph, word: `Replay ${subject}` }
    : playing
      ? { Glyph: PauseGlyph, word: `Pause ${subject}` }
      : { Glyph: PlayGlyph, word: `Play ${subject}` };

  return (
    <figure className="case-figure">
      {showControls && (
        <>
          {title && (
            <p className="case-clip-title" id={titleId}>
              {title}
            </p>
          )}
          {/* The row decides side-by-side or stacked from its OWN width (a
              container query in case-study.css), scenario first in both. */}
          <div className="case-clip-controls">
            <div className="case-clip-row">
              {hasScenarios && (
                <ClipSwitch
                  mode="tabs"
                  options={scenarios}
                  selectedId={selected.scenario}
                  onSelect={(id) => select({ scenario: id })}
                  labelledBy={title ? titleId : undefined}
                  label="Choose a scenario"
                  tabId={scenarioTabId}
                  panelId={panelId}
                />
              )}
              {hasViews && (
                <ClipSwitch
                  mode={hasScenarios ? 'toggle' : 'tabs'}
                  options={views}
                  selectedId={selected.view}
                  onSelect={(id) => select({ view: id })}
                  labelledBy={!hasScenarios && title ? titleId : undefined}
                  label={hasScenarios ? 'View' : 'Choose a viewpoint'}
                  tabId={tabId}
                  panelId={panelId}
                />
              )}
            </div>
          </div>
        </>
      )}

      <div
        className="case-clip-stage"
        data-swapping={swapping ? 'true' : undefined}
        role={showControls ? 'tabpanel' : undefined}
        id={showControls ? panelId : undefined}
        aria-labelledby={
          showControls ? (hasScenarios ? scenarioTabId(selected.scenario) : tabId(selected.view)) : undefined
        }
      >
        <div className="case-video-frame">
          {/* NOT KEYED, and that is the whole reason it exists. The <video>
              below is keyed by the selected clip, so after a swap it is a NEW
              element -- and a newly inserted element has no previous value to
              transition from, so an opacity transition on the video itself
              fades out and then pops straight back to full. The fade lives here
              instead, on a wrapper that survives the swap, while the panel
              around it keeps its ground so the frame is never empty. */}
          <div className="case-clip-media">
            <video
              // Keyed, so a switch replaces the element instead of re-pointing
              // it. See the block comment above: this is what guarantees the
              // unchosen clip is never fetched and the previous one cannot keep
              // running.
              key={mountedKey}
              ref={ref}
              className="case-video"
              src={active.src}
              poster={active.poster}
              muted
              playsInline
              preload="metadata"
              // The element is not a control: the button below is. Keeping
              // native controls off means one pause affordance, not two that
              // disagree.
              onPlay={() => {
                setPlaying(true);
                setEnded(false);
              }}
              onPause={() => setPlaying(false)}
              // Not every browser fires `pause` when playback runs out, so both
              // pieces of state are set here rather than leaned on from
              // `onPause`.
              onEnded={() => {
                setPlaying(false);
                setEnded(true);
              }}
            >
              {active.description}
            </video>
            <button type="button" className="case-video-toggle" onClick={toggle}>
              {/* Exactly one glyph and one word are rendered, so the accessible
                  name always matches the icon and always states what the button
                  will DO -- and names WHICH clip, since there are now two. */}
              <control.Glyph className="case-video-icon" />
              <span className="case-video-word">{control.word}</span>
            </button>
          </div>
        </div>
      </div>

      {/* The scenario's caption: it describes the run on screen, so it follows
          the MOUNTED choice and changes with the picture, not ahead of it. */}
      <CaseStudyCaption title={showControls ? undefined : title} caption={scenario.caption} />
    </figure>
  );
}
