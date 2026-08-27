import Link from 'next/link';
import Image from 'next/image';
import { getProjectById, getProjectHref, type Project } from '@/lib/projects';

/**
 * Tier-semantic sizes: showcase projects get a wide tile with a full uncropped
 * square icon and a one-line story; card-tier projects get a compact tile that
 * links straight out to GitHub. Stats are the approved M1 wording and live
 * here. Titles and descriptions (`body`) are NOT independent copy — per the
 * Home contract's copy-sync rule (APPROVED.md, added 2026-08-26), wherever
 * Home shows a project its description is copied verbatim from the
 * projects-page approved copy for that project (`docs/superpowers/mockups/
 * projects/v5.html`'s `P` array / its APPROVED.md). Resync `title` and `body`
 * from there, not from memory or from this file's history.
 */
const FEATURES = [
  {
    id: 'brent-cuda',
    title: "Brent's Method on CUDA",
    stat: '35.31× kernel speedup · RTX 3080',
    body: "The first CUDA implementation of Brent's root-finding method. One solver per GPU thread with bit-identical fp64 results.",
  },
  {
    id: 'collision-avoidance-radar',
    title: 'Maritime Collision Avoidance',
    stat: 'Live demo · CPA radar training',
    body: 'A radar-plotting trainer for Coast Guard navigators. Computes CPA with course and speed solutions.',
  },
] as const;

const COMPACT = [
  { id: 'islamic-prayer-time', title: 'Prayer-Time Algorithm Library', stat: '105 tests · pure Python' },
  { id: 'cycloidal-drive-creator', title: 'Cycloidal Drive Creator', stat: '28★ · parametric CAD' },
  { id: 'image-watermark-remover', title: 'Image Watermark Remover', stat: 'Pix2Pix GAN · PyTorch' },
] as const;

function requireProject(id: string): Project {
  const project = getProjectById(id);
  if (!project) {
    throw new Error(`HomeWork: project "${id}" is missing from projects.json.`);
  }
  return project;
}

export default function HomeWork() {
  const features = FEATURES.map((feature) => {
    const project = requireProject(feature.id);
    const href = getProjectHref(project);
    if (!href) {
      throw new Error(`HomeWork: "${feature.id}" has no case-study page (tier "${project.tier}").`);
    }
    return { ...feature, href };
  });

  // getProjectHref returns null for card tier by design — these link out.
  const compact = COMPACT.map((tile) => {
    const project = requireProject(tile.id);
    const href = project.links.github;
    if (!href) {
      throw new Error(`HomeWork: "${tile.id}" has no GitHub link to fall back to.`);
    }
    return { ...tile, href };
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
                Case study →
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
              <h3 className="text-primary text-[15px] font-bold">{title}</h3>
              <p className="text-accent mt-[5px] text-[12px] font-bold">{stat}</p>
            </div>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ))}
      </div>

      <div className="mt-[30px] text-center">
        <Link href="/projects" className="pill pill-secondary">
          All projects →
        </Link>
      </div>
    </section>
  );
}
