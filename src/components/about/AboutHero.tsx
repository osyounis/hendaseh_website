import type { CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AffordanceLabel, ArrowDownCircle, ChevronRight } from '@/components/LinkAffordance';

/**
 * About hero: statement headline and lede on the left, portrait on the right,
 * on the tinted `--about-sky` band that reaches up under the transparent nav.
 *
 * The entrance is a staggered rise driven by `--enter-delay` per element (see
 * `.about-enter` in about.css). It is a CSS animation with `both` fill, not a
 * hidden-until-JS state: nothing here renders at `opacity: 0` from the server,
 * and with animations disabled every element rests at its end state.
 *
 * The mockup draws the two CTAs as bare pills. Link-affordance grammar v2
 * (docs/superpowers/mockups/contact/APPROVED.md) is sitewide law and outranks
 * it: a download takes `ArrowDownCircle`, internal navigation takes
 * `ChevronRight`. The resume link is byte-identical to the one on Home
 * (`HomeHero.tsx`) and Contact -- same href, same `download` filename.
 */

const ENTER = (delay: string) => ({ '--enter-delay': delay }) as CSSProperties;

export default function AboutHero() {
  return (
    <section
      className="about-sky mt-[calc(var(--nav-h)*-1)] pt-[var(--nav-h)] pb-[72px]"
      aria-labelledby="about-title"
    >
      <div className="page-wrap">
        <div className="about-hero-grid">
          <div>
            <span className="section-eyebrow about-hero-eyebrow about-enter" style={ENTER('0.05s')}>
              ABOUT
            </span>

            <h1 id="about-title" className="about-hero-title about-enter" style={ENTER('0.15s')}>
              I build software people rely on.
            </h1>

            <p className="about-intro about-enter" style={ENTER('0.28s')}>
              I&apos;m Omar Younis, a software engineer in Sunnyvale, California. I&apos;ve shipped
              an iOS app to the <strong>App Store</strong>, written the{' '}
              <strong>first CUDA implementation</strong> of Brent&apos;s method, put ML models into
              production, and built software the{' '}
              <strong>Coast Guard runs at every air station</strong>. Before that, I spent seven
              years as a mechanical engineer. Now I&apos;m pointed at{' '}
              <strong>AI and autonomous systems</strong>.
            </p>

            <div className="about-ctas about-enter" style={ENTER('0.4s')}>
              <a
                href="/omar_younis_resume_2026.pdf"
                download="Omar_Younis_Resume.pdf"
                className="pill pill-primary"
              >
                <AffordanceLabel label="Résumé (PDF)" glyph={<ArrowDownCircle />} />
              </a>
              <Link href="/contact" className="pill pill-secondary">
                <AffordanceLabel label="Get in touch" glyph={<ChevronRight />} />
              </Link>
            </div>
          </div>

          {/* No location chip: Sunnyvale is stated once, in the lede above. */}
          <div className="about-pic about-enter-pic" style={ENTER('0.3s')}>
            <Image
              src="/profile.jpg"
              alt="Omar Younis"
              width={300}
              height={302}
              className="about-photo"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
