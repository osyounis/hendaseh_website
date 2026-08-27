import Link from 'next/link';
import Image from 'next/image';
import { getProjectById, getProjectHref } from '@/lib/projects';
import { AffordanceLabel, ChevronRight } from '@/components/LinkAffordance';

export default function HomeFlagship() {
  const nahtadi = getProjectById('nahtadi');
  const href = nahtadi ? getProjectHref(nahtadi) : null;

  // A build-time invariant: Nahtadi is the flagship and its page is a frozen
  // URL. Failing loudly here beats silently shipping a dead flagship band.
  if (!nahtadi || !href) {
    throw new Error('HomeFlagship: no detail page resolved for the "nahtadi" project.');
  }
  if (!nahtadi.tagline) {
    throw new Error('HomeFlagship: "nahtadi" has no tagline in projects.json.');
  }

  return (
    <section className="page-wrap py-20">
      <div className="mb-9">
        <span className="section-eyebrow">FLAGSHIP</span>
        <h2 className="section-heading">Shipped, and live today.</h2>
      </div>

      {/* Sub-880 (APPROVED.md "Mobile rules"): contents center-aligned and the
          icon capped at 120px, so the band reads as one centred stack instead
          of a left-hugging 200px tile above ragged text. */}
      <div className="home-flagship grid grid-cols-[200px_1fr_auto] items-center gap-10 rounded-[22px] p-[42px] max-[880px]:grid-cols-1 max-[880px]:gap-7 max-[880px]:p-8 max-[880px]:text-center">
        <Image
          src="/images/nahtadi/icon.png"
          alt="Nahtadi app icon"
          width={200}
          height={200}
          className="home-nahtadi-tile rounded-[36px] max-[880px]:mx-auto max-[880px]:h-auto max-[880px]:w-[120px] max-[880px]:rounded-[24px]"
        />

        <div>
          <h3 className="text-[32px] font-black text-[color:var(--flagship-fg)]">{nahtadi.title}</h3>
          <p className="mt-[10px] mb-3 text-[14px] font-bold text-[color:var(--flagship-meta)]">
            LIVE ON THE APP STORE · 5.0★ · PRIVACY-FIRST
          </p>
          <p className="max-w-[52ch] leading-[1.65] text-[color:var(--flagship-body)] max-[880px]:mx-auto">
            {nahtadi.tagline}
          </p>
        </div>

        {/* Lifted above the card's ::after glow so the white pill stays white. */}
        <div className="relative z-[1]">
          <Link href={href} className="pill pill-on-flagship">
            <AffordanceLabel label="The story" glyph={<ChevronRight />} />
          </Link>
        </div>
      </div>
    </section>
  );
}
