'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { PauseGlyph, PlayGlyph, ReplayGlyph } from '@/components/home/TransportGlyphs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import CaseStudyCaption from '@/components/projects/CaseStudyCaption';
import type { CaseStudyClip } from '@/lib/caseStudies';

interface CaseStudyClipsProps {
  clips: readonly CaseStudyClip[];
  title?: string;
  caption: string;
}

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
 * MANUAL ACTIVATION, not selection-follows-focus. The WAI-ARIA tabs pattern
 * prefers automatic activation, but explicitly makes an exception where showing
 * a panel is expensive -- and every activation here starts a video download.
 * Arrow keys move focus along the control; Enter or Space (a button's own
 * behaviour) commits.
 *
 * THE INDICATOR IS INTERRUPTIBLE, AND THAT IS THE POINT OF THE MOTION. Its
 * travel is a CSS transition on `transform`, driven by an inline value derived
 * from the selected index. A transition retargets from the value currently on
 * screen, so selecting the other tab while the indicator is still moving turns
 * it around from wherever it is; it cannot snap back, queue behind the first
 * move, or restart. Keyframes restart from zero, which is exactly the failure
 * this avoids. Equal-width tabs are what let the travel be pure `transform`:
 * the indicator is one tab wide and steps by 100% of itself, so nothing
 * animates width and no scaleX distorts the pill's corners.
 *
 * THE STAGE FADES THROUGH RATHER THAN CROSS-FADING. A true cross-fade needs the
 * outgoing and incoming clips on screen together, and only one <video> is ever
 * in the DOM -- that is load-bearing, not incidental. So: fade out, swap, fade
 * in, 150ms each way for Apple's measured 300ms across the change. The swap is
 * driven off a pending ref rather than state, so a reader who picks the other
 * tab mid-fade retargets the same sequence instead of starting a second one.
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
export default function CaseStudyClips({ clips, title, caption }: CaseStudyClipsProps) {
  const reduced = useReducedMotion();
  const uid = useId();
  /**
   * TWO IDS, AND THE SPLIT IS DELIBERATE.
   *
   * `selectedId` is what the reader has chosen and updates on the press. It
   * drives `aria-selected`, the roving tabindex and the indicator, so the
   * control answers instantly and the indicator sets off the moment it is
   * clicked rather than waiting out the fade.
   *
   * `mountedId` is which clip is actually in the DOM, and it lags by the
   * fade-out so the swap happens while the stage is at zero opacity. Driving
   * both from one id would either delay the indicator by 150ms or swap the
   * video in plain sight.
   */
  const [selectedId, setSelectedId] = useState(clips[0]!.id);
  const [mountedId, setMountedId] = useState(clips[0]!.id);
  const active = clips.find((c) => c.id === mountedId) ?? clips[0]!;

  const ref = useRef<HTMLVideoElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  /** The clip id that has already auto-started, so scrolling back past a clip
   *  the reader stopped does not restart it, while a NEW choice does start. */
  const autoStartedFor = useRef<string | null>(null);
  /** The same value as `selectedId`, readable from inside the swap timeout,
   *  where the state variable would be a stale closure. */
  const pending = useRef(clips[0]!.id);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [swapping, setSwapping] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  const panelId = `${uid}-clip-panel`;
  const titleId = `${uid}-clip-title`;
  const tabId = (id: string) => `${uid}-clip-tab-${id}`;
  const selectedIndex = clips.findIndex((c) => c.id === selectedId);

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
      if (autoStartedFor.current !== mountedId) {
        autoStartedFor.current = mountedId;
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
        if (autoStartedFor.current === mountedId) return;
        autoStartedFor.current = mountedId;
        void start(video);
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced, mountedId]);

  const mount = (id: string) => {
    // Reset the transport here rather than in an effect: the element is about to
    // be replaced, so it will never fire the `pause` that would otherwise clear
    // this, and a stale "Replay" on a fresh poster would be a lie.
    setMountedId(id);
    setPlaying(false);
    setEnded(false);
  };

  const select = (id: string) => {
    if (id === pending.current) return;
    pending.current = id;
    // Immediately, always: the indicator sets off and the control reports the
    // new selection on the press, not after the fade.
    setSelectedId(id);

    if (reduced) {
      // No slide, no fade, no wait -- the clip simply changes.
      clearTimeout(swapTimer.current);
      setSwapping(false);
      mount(id);
      return;
    }

    setSwapping(true);
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => {
      // `pending.current`, not the captured `id`: if the reader chose again
      // while this was fading out, the newest choice is the one that lands, and
      // the sequence in flight is retargeted rather than doubled.
      mount(pending.current);
      setSwapping(false);
    }, 150);
  };

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = clips.length - 1;
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? index === last
          ? 0
          : index + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? index === 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    tabs.current[next]?.focus();
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

  const control = ended
    ? { Glyph: ReplayGlyph, word: `Replay ${active.label.toLowerCase()}` }
    : playing
      ? { Glyph: PauseGlyph, word: `Pause ${active.label.toLowerCase()}` }
      : { Glyph: PlayGlyph, word: `Play ${active.label.toLowerCase()}` };

  return (
    <figure className="case-figure">
      {/* Only when there is something to choose. A single-clip block renders the
          same area with no control. */}
      {clips.length > 1 && (
        <>
          {title && (
            <p className="case-clip-title" id={titleId}>
              {title}
            </p>
          )}
          <div
            className="case-clip-switch"
            role="tablist"
            // Named by the visible sentence above it rather than by an invisible
            // aria-label, so the name a screen reader hears is the one on screen.
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : 'Choose a viewpoint'}
            style={{ '--tab-count': clips.length } as CSSProperties}
          >
            {/* Decorative: `aria-selected` on the tabs is what states the
                selection. This only shows it. */}
            <span
              className="case-clip-indicator"
              aria-hidden="true"
              style={{ transform: `translateX(${selectedIndex * 100}%)` }}
            />
            {clips.map((clip, index) => (
              <button
                key={clip.id}
                ref={(el) => {
                  tabs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={tabId(clip.id)}
                aria-selected={clip.id === selectedId}
                aria-controls={panelId}
                // Roving tabindex: the control is one tab stop, not one per option.
                tabIndex={clip.id === selectedId ? 0 : -1}
                className="case-clip-tab"
                onClick={() => select(clip.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                {clip.label}
              </button>
            ))}
          </div>
        </>
      )}

      <div
        className="case-clip-stage"
        data-swapping={swapping ? 'true' : undefined}
        role={clips.length > 1 ? 'tabpanel' : undefined}
        id={clips.length > 1 ? panelId : undefined}
        aria-labelledby={clips.length > 1 ? tabId(selectedId) : undefined}
      >
        <div className="case-video-frame">
          <video
            // Keyed, so a switch replaces the element instead of re-pointing it.
            // See the block comment above: this is what guarantees the unchosen
            // clip is never fetched and the previous one cannot keep running.
            key={active.id}
            ref={ref}
            className="case-video"
            src={active.src}
            poster={active.poster}
            muted
            playsInline
            preload="metadata"
            // The element is not a control: the button below is. Keeping native
            // controls off means one pause affordance, not two that disagree.
            onPlay={() => {
              setPlaying(true);
              setEnded(false);
            }}
            onPause={() => setPlaying(false)}
            // Not every browser fires `pause` when playback runs out, so both
            // pieces of state are set here rather than leaned on from `onPause`.
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

      {/* The title has moved ABOVE the chooser, where it names the choice. A
          single-clip block has no chooser, so it keeps the title on the caption
          exactly as every still block does. */}
      <CaseStudyCaption title={clips.length > 1 ? undefined : title} caption={caption} />
    </figure>
  );
}
