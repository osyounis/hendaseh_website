'use client';

import { useEffect, useRef, useState } from 'react';
import { PauseGlyph, PlayGlyph } from '@/components/home/TransportGlyphs';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CaseStudyVideoProps {
  src: string;
  poster: string;
  /** What the clip shows, for anyone who cannot watch it. */
  description: string;
  caption: string;
}

/**
 * A looping clip in the same tile the figure uses, so the two read as one family.
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
export default function CaseStudyVideo({ src, poster, description, caption }: CaseStudyVideoProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduced) {
      video.pause();
      return;
    }
    // Autoplay can still be refused — Low Power Mode, a data saver, a browser
    // policy. Catching it leaves the control saying "Play", which is true.
    video.play().catch(() => setPlaying(false));
  }, [reduced]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  return (
    <figure className="case-figure">
      <div className="case-video-frame">
        <video
          ref={ref}
          className="case-video"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          // The element is not a control: the button below is. Keeping native
          // controls off means one pause affordance, not two that disagree.
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {description}
        </video>
        <button type="button" className="case-video-toggle" onClick={toggle}>
          {/* Exactly one of these is rendered, so the accessible name always
              matches the icon and always states what the button will DO. */}
          {playing ? <PauseGlyph className="case-video-icon" /> : <PlayGlyph className="case-video-icon" />}
          <span className="case-video-word">
            {playing ? 'Pause the animation' : 'Play the animation'}
          </span>
        </button>
      </div>
      <figcaption className="case-caption">{caption}</figcaption>
    </figure>
  );
}
