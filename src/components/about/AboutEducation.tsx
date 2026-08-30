import AboutQuietCard, { type QuietCard } from './AboutQuietCard';

/**
 * Education. A plain heading with no eyebrow: an eyebrow that only restates its
 * own heading is banned sitewide (M3 contract), and "EDUCATION / Education" is
 * exactly that.
 *
 * No GPA anywhere, on this page or any other.
 */

const CARDS: QuietCard[] = [
  {
    title: 'M.S., Computer Science',
    sub: 'California State University, Fullerton · May 2026',
    body: "Graduate project: Parallelizing Brent's Method with CUDA. Coursework spanning algorithms, operating systems, compilers, neural networks, and mobile development.",
  },
  {
    title: 'B.S., Mechanical Engineering',
    sub: 'Worcester Polytechnic Institute · minor in Aerospace',
    body: 'The foundation years: statics, dynamics, materials, and the habit of checking work against physical reality.',
  },
];

export default function AboutEducation() {
  return (
    <section aria-labelledby="about-education-title">
      <div className="about-tblock" data-reveal="">
        <h2 id="about-education-title" className="about-section-title">
          Education
        </h2>
      </div>

      <div className="about-grid">
        {CARDS.map((card, index) => (
          <AboutQuietCard key={card.title} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}
