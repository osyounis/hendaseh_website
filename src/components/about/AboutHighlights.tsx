import type { CSSProperties } from 'react';

/**
 * Career highlights: a plain-headed list section (statement headlines belong to
 * the narrative beats above it), six cards in a two-up grid.
 *
 * Every card wears the shared `.home-tile` -- ground, hairline, shadow, hover
 * and focus all come from there and are never re-implemented here. `.about-card`
 * adds shape and padding only.
 *
 * The VOLUNTEER badge on the Coast Guard card is MANDATORY (M3 contract). Both
 * Coast Guard roles are unpaid; nothing on this page may read as employment.
 *
 * Org names render as `<h3>`, not the mockup's `<h4>`: the section heading above
 * them is an `<h2>`, and skipping a level is a real accessibility defect. The
 * `<h4>` visual style is carried verbatim by `.about-org-name`.
 */

type Highlight = {
  org: string;
  when: string;
  role: string;
  volunteer?: true;
  body: string;
};

const HIGHLIGHTS: Highlight[] = [
  {
    org: 'U.S. Coast Guard Auxiliary',
    when: 'SEP 2022 – PRESENT',
    role: 'Software Engineer',
    volunteer: true,
    body: 'Cut pilot training qualification tracking from six weeks to two days with a reporting tool now used at every U.S. Coast Guard air station. Awarded the Auxiliary Achievement Medal by the Commandant of the Coast Guard. Sole maintainer since 2022.',
  },
  {
    org: 'Qualcomm',
    when: 'MAY – AUG 2024',
    role: 'Software Engineer Intern',
    body: 'Built and industrialized AWS ETL pipelines processing over one million data points per minute for machine learning teams, and cut feature development and testing time by 40 percent with logging, monitoring, and alerting across the stack.',
  },
  {
    org: 'Elemeno AI',
    when: 'AUG – NOV 2022',
    role: 'Machine Learning Engineer',
    body: "Improved delivery time prediction accuracy by 25 percent for Brazil's largest package delivery company by designing and training a feed-forward neural network in PyTorch.",
  },
  {
    org: 'General Assembly',
    when: '2021',
    role: 'Data Science Immersive, 500+ hours',
    body: 'Built an ASL letter detector with a retrained YOLOv5, an NLP classifier for Reddit posts, and a team model estimating California wildfire likelihood from weather and historical data.',
  },
  {
    org: 'D&K Engineering',
    when: 'FEB 2019 – MAY 2021',
    role: 'Lead Mechanical Engineer, R&D',
    body: 'Led a 20-person team on next-generation ecoATM kiosks and helped secure a $1M contract extension. Built Python tooling that raised engineering efficiency by roughly 50 percent, plus embedded control software for a Stanford genome-mapping prototype.',
  },
  {
    org: 'Independent Projects',
    when: '2023 – PRESENT',
    role: 'Software Engineer',
    body: "Shipped Nahtadi to the App Store with a 5.0 rating average. Wrote the first CUDA implementation of Brent's method. Fine-tuned a 1.5B-parameter LLM and ran it entirely on an iPhone 14 Pro's A16 chip.",
  },
];

/**
 * The mockup's cascade, verbatim: the two cards in a row are 60ms apart and
 * each row is 50ms behind the one above it, so the reveal reads left-to-right
 * and top-to-bottom rather than as one block. Expressed through
 * `--reveal-delay`, which `[data-reveal="in"]` (shared.css) applies as its
 * transition-delay.
 */
const revealDelay = (index: number) => `${(index % 2) * 0.06 + Math.floor(index / 2) * 0.05}s`;

export default function AboutHighlights() {
  return (
    <section className="page-wrap about-highlights" aria-labelledby="about-highlights-title">
      <div className="about-tblock" data-reveal="">
        <span className="section-eyebrow">EXPERIENCE</span>
        <h2 id="about-highlights-title" className="about-section-title">
          Career highlights
        </h2>
      </div>

      <div className="about-grid">
        {HIGHLIGHTS.map((item, index) => (
          <article
            key={item.org}
            className="home-tile about-card"
            data-reveal=""
            style={{ '--reveal-delay': revealDelay(index) } as CSSProperties}
          >
            <div className="about-org">
              <h3 className="about-org-name">{item.org}</h3>
              <span className="about-when">{item.when}</span>
            </div>
            <p className="about-role">
              {item.role}
              {item.volunteer && <span className="about-volunteer">VOLUNTEER</span>}
            </p>
            <p className="about-card-p">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
