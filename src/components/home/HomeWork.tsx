import Link from 'next/link';
import Image from 'next/image';
import NewTabHint from '@/components/NewTabHint';
import { AffordanceLabel, ArrowUpRight, ChevronRight } from '@/components/LinkAffordance';
import { getProjectById, getProjectHref, type Project } from '@/lib/projects';

/**
 * Tier-semantic sizes: showcase projects get a wide tile with a full uncropped
 * square icon and a one-line story; card-tier projects get a compact tile that
 * links straight out to GitHub. Title and description come from `projects.json`
 * (`project.title` / `project.tagline`) via the `src/lib/projects.ts` helpers —
 * one source of truth, per the Home contract's copy-sync rule (APPROVED.md,
 * added 2026-08-26). Stats render from `project.cardStat`, Home-only copy with
 * no equivalent elsewhere in the data. Only `id` lives here; it fixes the
 * ordering and tier grouping, which is layout, not copy, and contract-locked.
 */
const FEATURES = ['brent-cuda', 'collision-avoidance-radar'] as const;

const COMPACT = ['islamic-prayer-time', 'cycloidal-drive-creator', 'image-watermark-remover'] as const;

function requireProject(id: string): Project {
  const project = getProjectById(id);
  if (!project) {
    throw new Error(`HomeWork: project "${id}" is missing from projects.json.`);
  }
  if (!project.cardStat) {
    throw new Error(`HomeWork: project "${id}" has no cardStat in projects.json.`);
  }
  if (!project.tagline) {
    throw new Error(`HomeWork: project "${id}" has no tagline in projects.json.`);
  }
  return project;
}

export default function HomeWork() {
  const features = FEATURES.map((id) => {
    const project = requireProject(id);
    const href = getProjectHref(project);
    if (!href) {
      throw new Error(`HomeWork: "${id}" has no case-study page (tier "${project.tier}").`);
    }
    return { id, title: project.title, stat: project.cardStat!, body: project.tagline!, href };
  });

  // getProjectHref returns null for card tier by design — these link out.
  const compact = COMPACT.map((id) => {
    const project = requireProject(id);
    const href = project.links.github;
    if (!href) {
      throw new Error(`HomeWork: "${id}" has no GitHub link to fall back to.`);
    }
    return { id, title: project.title, stat: project.cardStat!, href };
  });

  return (
    <section className="page-wrap py-20">
      <div className="mb-9">
        <span className="section-eyebrow">WORK</span>
        <h2 className="section-heading">Proof, not promises.</h2>
      </div>

      <div className="grid grid-cols-6 gap-[18px]">
        {features.map(({ id, title, stat, body, href }) => (
          <Link
            key={id}
            href={href}
            className="home-tile col-span-3 grid grid-cols-[172px_1fr] items-center gap-6 rounded-[18px] p-[26px] max-[880px]:col-span-6 max-[880px]:grid-cols-[84px_1fr] max-[880px]:gap-4 max-[880px]:p-[18px]"
          >
            <Image
              src={`/images/projects/${id}/card.png`}
              alt=""
              width={172}
              height={172}
              className="h-auto w-[172px] rounded-[22px] max-[880px]:w-[84px] max-[880px]:rounded-[16px]"
            />
            <div>
              <h3 className="text-primary text-[19px] font-black">{title}</h3>
              <p className="text-accent mt-[7px] mb-[9px] text-[13px] font-bold">{stat}</p>
              <p className="text-muted text-[14px] leading-[1.55]">{body}</p>
              <span className="text-primary mt-3 inline-block text-[13px] font-bold">
                <AffordanceLabel label="Case study" glyph={<ChevronRight />} />
              </span>
            </div>
          </Link>
        ))}

        {compact.map(({ id, title, stat, href }) => (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="home-tile col-span-2 flex items-center gap-4 rounded-2xl p-[18px] max-[880px]:col-span-6"
          >
            <Image
              src={`/images/projects/${id}/card.png`}
              alt=""
              width={72}
              height={72}
              className="h-auto w-[72px] rounded-2xl"
            />
            <div>
              <h3 className="text-primary text-[15px] font-bold">
                <AffordanceLabel label={title} glyph={<ArrowUpRight />} />
              </h3>
              <p className="text-accent mt-[5px] text-[12px] font-bold">{stat}</p>
            </div>
            <NewTabHint />
          </a>
        ))}
      </div>

      <div className="mt-[30px] text-center">
        <Link href="/projects" className="pill pill-secondary">
          <AffordanceLabel label="All projects" glyph={<ChevronRight />} />
        </Link>
      </div>
    </section>
  );
}
