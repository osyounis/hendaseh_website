import AboutQuietCard, { type QuietCard } from './AboutQuietCard';

/**
 * Off the clock. Two Coast Guard roles exist and both are UNPAID VOLUNTEER
 * work in one organisation: the Software Engineer role at Sector San Diego
 * (the arc and Career highlights carry that one) and, separately, the elected
 * Flotilla Staff Officer for Operations. This card is the second of the pair,
 * and it says "Volunteer since 2015" for that reason.
 */

const CARDS: QuietCard[] = [
  {
    title: 'U.S. Coast Guard Auxiliary',
    sub: 'Volunteer since 2015',
    body: 'Elected Flotilla Staff Officer for Operations, 2021 to 2026. Search and rescue operations alongside the software work.',
  },
  {
    title: 'Elsewhere',
    sub: 'Languages and places',
    body: 'Fluent in several Arabic dialects. Lived in three countries outside the United States. Certifications from DeepLearning.AI and AWS, Stanford Online, and SolidWorks.',
  },
];

export default function AboutOffTheClock() {
  return (
    <section aria-labelledby="about-off-the-clock-title">
      <div className="about-tblock about-tblock-mid" data-reveal="">
        <span className="section-eyebrow">BEYOND THE CODE</span>
        <h2 id="about-off-the-clock-title" className="about-section-title">
          Off the clock
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
