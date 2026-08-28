import type { CSSProperties } from 'react';

/**
 * The card shape shared by Education and Off the clock: a title, a subtitle,
 * and one paragraph. One step quieter than a career-highlight card -- a
 * recessed ground in dark, the same white in light (`--about-card-quiet`).
 *
 * Ground, hairline, shadow, hover and focus still come from `.home-tile`; the
 * quiet ground is the only thing overridden, and it is written as a compound
 * selector in about.css so it wins on specificity rather than on import order.
 *
 * The title is an `<h3>` under its section's `<h2>`, carrying the mockup's
 * `<h4>` visual style. No school logos, no third-party marks (M3 contract).
 */

export type QuietCard = {
  title: string;
  sub: string;
  body: string;
};

export default function AboutQuietCard({ card, index }: { card: QuietCard; index: number }) {
  return (
    <article
      className="home-tile about-card about-card-quiet"
      data-reveal=""
      // The mockup's cascade for a two-up quiet grid: 60ms apart.
      style={{ '--reveal-delay': `${index * 0.06}s` } as CSSProperties}
    >
      <h3 className="about-quiet-name">{card.title}</h3>
      <p className="about-sub">{card.sub}</p>
      <p className="about-card-p">{card.body}</p>
    </article>
  );
}
