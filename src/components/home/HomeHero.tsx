import type { CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AffordanceLabel, ArrowDownCircle } from '@/components/LinkAffordance';

/**
 * The swarm: seven project icons revolving clockwise as one group around the
 * Hendaseh mark, each counter-rotated so it stays upright. Angle, radius and
 * size are the authored values from the approved mockup — the arrangement is
 * hand-composed, not generated, so it stays a literal table.
 */
type Satellite = {
  src: string;
  angle: string;
  radius: string;
  size: number;
  z: number;
  /** The shipped Nahtadi icon is a transparent glyph and needs its green tile. */
  tile?: boolean;
};

const SATELLITES: Satellite[] = [
  { src: '/images/nahtadi/icon.png', angle: '210deg', radius: '118px', size: 92, z: 5, tile: true },
  { src: '/images/projects/brent-cuda/icon-squircle.png', angle: '330deg', radius: '142px', size: 78, z: 4 },
  { src: '/images/projects/islamic-prayer-time/icon-squircle.png', angle: '90deg', radius: '122px', size: 72, z: 4 },
  { src: '/images/projects/radar-moboard/icon-squircle.png', angle: '30deg', radius: '168px', size: 60, z: 3 },
  { src: '/images/projects/cycloidal-drive-creator/icon-squircle.png', angle: '150deg', radius: '158px', size: 56, z: 3 },
  { src: '/images/projects/a16-summarizer/icon-squircle.png', angle: '270deg', radius: '186px', size: 62, z: 2 },
  { src: '/images/projects/asl-detector/icon-squircle.png', angle: '12deg', radius: '104px', size: 50, z: 2 },
];

// Centre tile first, then the satellites at a 50ms stagger.
const CORE_POP_DELAY = '0s';
const satellitePopDelay = (index: number) => `${0.08 + index * 0.05}s`;

export default function HomeHero() {
  return (
    <section
      className="home-sky mt-[calc(var(--nav-h)*-1)] pt-[var(--nav-h)] pb-[120px]"
      aria-labelledby="hero-name"
    >
      <div className="home-aurora" aria-hidden="true" />
      <div className="home-stars" aria-hidden="true" />

      <div className="page-wrap relative z-10">
        {/* Decorative: every icon here is repeated as real content further down
            the page, so the set-piece carries no information of its own. */}
        <div className="home-cluster" aria-hidden="true">
          <div className="home-stage">
            <div className="home-core" style={{ '--pop-delay': CORE_POP_DELAY } as CSSProperties}>
              <Image
                src="/logos/hendaseh-mark.svg"
                alt=""
                width={66}
                height={72}
                className="h-[58%] w-auto"
                priority
              />
            </div>

            <div className="home-swarm">
              {SATELLITES.map(({ src, angle, radius, size, z, tile }, index) => (
                <span
                  key={src}
                  data-testid="hero-satellite"
                  className="home-sat"
                  style={
                    {
                      '--sat-angle': angle,
                      '--sat-radius': radius,
                      '--sat-size': `${size}px`,
                      '--pop-delay': satellitePopDelay(index),
                      zIndex: z,
                    } as CSSProperties
                  }
                >
                  <Image
                    src={src}
                    alt=""
                    width={size}
                    height={size}
                    className={
                      tile ? 'home-sat-img home-sat-img-nahtadi' : 'home-sat-img'
                    }
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <h1
          id="hero-name"
          className="text-primary text-[clamp(56px,9vw,104px)] leading-none font-black tracking-[-0.02em]"
        >
          Omar Younis
        </h1>

        <p
          data-testid="hero-tagline"
          className="text-secondary mt-[22px] text-[clamp(16px,2vw,21px)] font-medium"
        >
          Software Engineer · <span className="text-accent">iOS, ML &amp; Autonomous Systems</span>
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-[14px]">
          <Link href="/projects" className="pill pill-primary">
            View projects
          </Link>
          <a
            href="/omar_younis_resume_2026.pdf"
            download="Omar_Younis_Resume.pdf"
            className="pill pill-secondary"
          >
            <AffordanceLabel label="Résumé (PDF)" glyph={<ArrowDownCircle />} />
          </a>
        </div>
      </div>
    </section>
  );
}
