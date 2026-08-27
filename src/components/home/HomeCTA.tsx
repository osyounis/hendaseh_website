import NewTabHint from '@/components/NewTabHint';
import { AffordanceLabel, ArrowUpRight } from '@/components/LinkAffordance';

export default function HomeCTA() {
  return (
    <section className="page-wrap py-20">
      <div className="home-cta-card rounded-[22px] px-10 py-16 text-center">
        <h2 className="text-primary text-[clamp(26px,3.4vw,38px)] font-black">
          Have a role in mind?
        </h2>
        <p className="text-muted mt-3 mb-7">Sunnyvale, CA · omar@hendaseh.com</p>
        <div className="flex flex-wrap justify-center gap-[14px]">
          <a href="mailto:omar@hendaseh.com" className="pill pill-primary">
            Email me
          </a>
          <a
            href="https://www.linkedin.com/in/omar-younis/"
            target="_blank"
            rel="noopener noreferrer"
            className="pill pill-secondary"
          >
            <AffordanceLabel label="LinkedIn" glyph={<ArrowUpRight />} />
            <NewTabHint />
          </a>
        </div>
      </div>
    </section>
  );
}
