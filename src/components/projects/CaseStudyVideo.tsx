'use client';

import { useEffect, useRef, useState } from 'react';
import { PauseGlyph, PlayGlyph, ReplayGlyph } from '@/components/home/TransportGlyphs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import CaseStudyCaption from '@/components/projects/CaseStudyCaption';

interface CaseStudyVideoProps {
  src: string;
  poster: string;
  /** What the clip shows, for anyone who cannot watch it. */
  description: string;
  /** Optional tile label above the caption. See `CaseStudyCaption`. */
  title?: string;
  caption: string;
}

/**
 * A clip in the same tile the figure uses, so the two read as one family.
 *
 * IT PLAYS ONCE AND HOLDS ITS FINAL FRAME. It used to loop, and the loop was the
 * defect: the clip is a narrative. It opens before the second observation and
 * ends past the closest point of approach, so its first and last frames are
 * entirely different pictures -- the contact is up-range before the maneuver in
 * one and down-range past CPA in the other. A loop can only cut hard between
 * them. That flash is inherent to looping a narrative and is not an encoding
 * fault, so the fix is to stop looping rather than to re-encode.
 *
 * That makes THREE control states, not two, and the third is why `ReplayGlyph`
 * exists: "Play" on a clip already showing its final frame says the wrong thing.
 *
 * IT STARTS WHEN THE READER REACHES IT, not on mount. A looping clip could
 * safely start at mount because it was still running whenever you arrived; a
 * play-once clip cannot. Two of these now stack on radar-moboard, and starting
 * both at mount would mean the reader scrolls down to two finished clips holding
 * their last frames, having missed both. The observer disconnects after the
 * first start, so a clip the reader has paused or watched out is never restarted
 * by scrolling past it again -- after the first play, the control is theirs.
 *
 * NOT `.case-figure-media`. That is `object-fit: cover` on a 16:9 box and these
 * sources are 1:1 — cover would silently crop the board's top and bottom rings
 * away, which is most of what the clip exists to show. This contains instead.
 *
 * NO `autoPlay` ATTRIBUTE, DELIBERATELY. Playback starts from an effect, which
 * is what lets reduced motion be honoured without a hydration mismatch: the
 * server and the first client render are identical (a paused video showing its
 * poster), and only afterwards does the effect decide. Branching the rendered
 * DOM on the preference is the mismatch `tests/e2e/reduced-motion-hydration.spec.ts`
 * exists to catch. A reduced-motion visitor therefore never sees a frame of
 * movement, rather than seeing one and having it snatched away.
 *
 * `muted` and `playsInline` are both load-bearing on iOS Safari: without either,
 * it refuses to play inline and takes the video fullscreen instead.
 */
export default function CaseStudyVideo({
  src,
  poster,
  description,
  title,
  caption,
}: CaseStudyVideoProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  /** Whether this clip has ever auto-started. One per element, for the life of
   *  the page: scrolling back up must not restart what the reader stopped. */
  const autoStarted = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

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
      // No observer (an old browser, or a test harness stubbing it out): fall
      // back to the old behaviour rather than to a clip that never plays.
      if (!autoStarted.current) {
        autoStarted.current = true;
        void start(video);
      }
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        // Half of it on screen, so the clip does not start while it is a sliver
        // at the bottom edge and finish before the reader has read the caption.
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if (autoStarted.current) return;
        autoStarted.current = true;
        void start(video);
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

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
    ? { Glyph: ReplayGlyph, word: 'Replay the animation' }
    : playing
      ? { Glyph: PauseGlyph, word: 'Pause the animation' }
      : { Glyph: PlayGlyph, word: 'Play the animation' };

  return (
    <figure className="case-figure">
      <div className="case-video-frame">
        <video
          ref={ref}
          className="case-video"
          src={src}
          poster={poster}
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
          {description}
        </video>
        <button type="button" className="case-video-toggle" onClick={toggle}>
          {/* Exactly one glyph and one word are rendered, so the accessible name
              always matches the icon and always states what the button will DO. */}
          <control.Glyph className="case-video-icon" />
          <span className="case-video-word">{control.word}</span>
        </button>
      </div>
      <CaseStudyCaption title={title} caption={caption} />
    </figure>
  );
}
