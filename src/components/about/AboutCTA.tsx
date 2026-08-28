import Link from 'next/link';
import { AffordanceLabel, ArrowDownCircle, ChevronRight } from '@/components/LinkAffordance';

/**
 * Closing card. Same ground/hairline/shadow tokens as Home's CTA card, and the
 * same two actions as the hero, so the resume link is byte-identical to every
 * other instance sitewide.
 *
 * `The résumé has the rest.` is an `<h3>` in the mockup and stays one: it sits
 * under the `<h2>`-headed sections above it and is not a section of its own.
 *
 * This card is NOT on the tinted sky, so `Get in touch` keeps the plain
 * secondary pill fill rather than the sky treatment -- which is what the
 * approved mockup draws.
 */

export default function AboutCTA() {
  return (
    <div className="about-cta" data-reveal="">
      <h3 className="about-cta-title">The résumé has the rest.</h3>
      <p className="about-cta-meta">Sunnyvale, CA · omar@hendaseh.com</p>
      <div className="about-cta-row">
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
  );
}
