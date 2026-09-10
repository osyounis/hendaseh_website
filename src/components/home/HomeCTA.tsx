import NewTabHint from '@/components/NewTabHint';
import { AffordanceLabel, ArrowUpRight } from '@/components/LinkAffordance';
import { GitHubMark, LinkedInMark } from '@/components/BrandMarks';

export default function HomeCTA() {
  return (
    <section className="page-wrap py-20">
      <div className="home-cta-card rounded-[22px] px-10 py-16 text-center">
        <h2 className="text-primary text-[clamp(26px,3.4vw,38px)] font-black">
          Have a role in mind?
        </h2>
        <p className="text-muted mt-3 mb-7">Sunnyvale, CA · omar@hendaseh.com</p>
        {/* `.home-cta-actions` carries no styling of its own at desktop -- the
            Tailwind utilities beside it are still the whole row. It exists so
            home.css can stack the row below the width where three pills stop
            fitting; see the block comment there. */}
        <div className="home-cta-actions flex flex-wrap justify-center gap-[14px]">
          <a href="mailto:omar@hendaseh.com" className="pill pill-primary">
            Email me
          </a>
          <a
            href="https://www.linkedin.com/in/omar-younis/"
            target="_blank"
            rel="noopener noreferrer"
            className="pill pill-secondary"
          >
            <LinkedInMark />
            <AffordanceLabel label="LinkedIn" glyph={<ArrowUpRight />} />
            <NewTabHint />
          </a>
          {/* GitHub is LinkedIn's PEER, not a third lesser thing: same
              secondary pill, same destination mark treatment, same
              arrow-up-right, same new-tab hint.

              BOTH externals carry their mark or NEITHER does. The pair is the
              unit here -- a row where only one of two sibling destinations is
              badged reads as an oversight rather than as a distinction. The
              marks are ink-matched rather than box-matched, which is the whole
              reason `BrandMarks.tsx` exists; read that file before changing a
              size.

              `Email me` above stays bare on purpose: it is a verb, not a
              destination, so there is no brand to identify and no site to
              leave. It is the one pill with no arrow-up-right either, so the
              row reads as one action plus two destinations. */}
          <a
            href="https://github.com/osyounis"
            target="_blank"
            rel="noopener noreferrer"
            className="pill pill-secondary"
          >
            <GitHubMark />
            <AffordanceLabel label="GitHub" glyph={<ArrowUpRight />} />
            <NewTabHint />
          </a>
        </div>
      </div>
    </section>
  );
}
