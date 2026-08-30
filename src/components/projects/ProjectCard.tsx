import Image from 'next/image';
import Link from 'next/link';
import NewTabHint from '@/components/NewTabHint';
import { AffordanceLabel, ArrowUpRight, ChevronRight } from '@/components/LinkAffordance';
import { getProjectHref, type Project } from '@/lib/projects';

/**
 * One project card.
 *
 * Copy is data: the title is `project.title` and the description is
 * `project.tagline`. Nothing on this card is a literal string from the
 * catalog.
 *
 * The whole card is deliberately NOT a link (approved contract, "Card
 * anatomy"). Every destination is an explicit pill, because a card can carry
 * two different destinations -- a story and an artifact -- and a card-wide
 * link would have to pick one and swallow the other.
 *
 * Tier-action grammar, in the order the checks have to happen:
 *
 *  - `private` is checked BEFORE the tier rule. The two Coast Guard projects
 *    are `card` tier, and the tier rule alone says "octocat GitHub pill only".
 *    They have no repository, so that rule would render a pill pointing
 *    nowhere. They get the gold badge instead, and the artifact pill only
 *    ever renders from a link that actually exists.
 *  - the story pill renders from `getProjectHref`, which returns null for
 *    `card` tier. That is the signal, not a special case: when phase 5 flips
 *    a Coast Guard project to `showcase`, its `Case study` pill appears on
 *    its own, and until then there is no dead link to click.
 *  - `links.embed` is not an action here. The contract removed the separate
 *    Live-demo pill from cards; the demo lives inside the case study.
 */

/* Octocat, 16x16 viewBox. Both icons are inline rather than pulled from
   react-icons so the pill glyphs are the exact paths the approved mockup
   draws. */
const GITHUB_MARK =
  'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z';

/* Apple's  glyph, 17x20 viewBox. The plain glyph is what cards use; the
   official "Download on the App Store" badge is reserved for /nahtadi,
   unmodified, per Apple's marketing guidelines. */
const APPLE_MARK =
  'M14.05 10.54c.03 3.17 2.78 4.22 2.81 4.24-.02.07-.44 1.5-1.45 2.98-.87 1.28-1.78 2.55-3.2 2.58-1.4.03-1.85-.83-3.45-.83-1.6 0-2.1.8-3.42.86-1.38.05-2.42-1.38-3.3-2.65C.24 15.12-1.17 10.4.67 7.15c.91-1.61 2.54-2.63 4.31-2.66 1.35-.03 2.62.91 3.45.91.82 0 2.37-1.12 4-.96.68.03 2.59.28 3.82 2.07-.1.06-2.28 1.33-2.2 4.03ZM11.4 2.71c.73-.88 1.22-2.1 1.08-3.32-1.05.04-2.32.7-3.07 1.58-.67.78-1.26 2.02-1.1 3.21 1.17.09 2.36-.59 3.09-1.47Z';

export default function ProjectCard({ project }: { project: Project }) {
  const storyHref = getProjectHref(project);
  const isFlagship = project.tier === 'flagship';
  const titleId = `project-card-${project.id}`;

  // The flagship's headline number lives in `appStoreRating`, not `cardStat`;
  // every other card's lives in `cardStat`. Both are data, and a project
  // without either simply shows no stat rather than borrowing one.
  const stat = project.appStoreRating
    ? `${project.appStoreRating.value}★ App Store`
    : project.cardStat;

  return (
    <article
      data-testid="project-card"
      aria-labelledby={titleId}
      className={
        isFlagship
          ? 'home-tile projects-flagship col-span-2 flex items-center gap-[18px] rounded-[18px] p-7 max-[880px]:col-span-1 max-[880px]:gap-4 max-[880px]:p-5'
          : 'home-tile flex items-start gap-[18px] rounded-[18px] p-5'
      }
    >
      {isFlagship ? (
        <Image
          src="/images/nahtadi/icon.png"
          alt=""
          width={104}
          height={104}
          className="projects-nahtadi-tile h-[104px] w-[104px] shrink-0 rounded-[24px] max-[880px]:h-[84px] max-[880px]:w-[84px] max-[880px]:rounded-[20px] max-[880px]:p-[7px]"
        />
      ) : (
        /* `icon-squircle.png` carries its squircle mask and its own gradient
           in the pixels, so it is placed whole with no CSS crop or radius. */
        <Image
          src={`/images/projects/${project.id}/icon-squircle.png`}
          alt=""
          width={84}
          height={84}
          className="w-[84px] shrink-0"
        />
      )}

      <div className="min-w-0 flex-1">
        <h2
          id={titleId}
          className={
            isFlagship
              ? 'text-[22px] font-black text-[color:var(--flagship-fg)]'
              : 'text-primary text-[16px] font-bold'
          }
        >
          {project.title}
        </h2>

        <p
          className={
            isFlagship
              ? 'mt-[5px] text-[14px] leading-[1.5] text-[color:var(--flagship-body)]'
              : 'text-muted mt-[5px] text-[13px] leading-[1.5]'
          }
        >
          {project.tagline}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {storyHref && (
            <Link
              href={storyHref}
              className={
                isFlagship ? 'projects-mini' : 'projects-mini projects-mini-primary'
              }
            >
              <AffordanceLabel
                label={isFlagship ? 'The story' : 'Case study'}
                glyph={<ChevronRight />}
              />
            </Link>
          )}

          {project.links.appStore && (
            <a
              href={project.links.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="projects-mini"
            >
              <svg viewBox="0 0 17 20" aria-hidden="true" className="h-[15px] w-[13px]">
                <path d={APPLE_MARK} />
              </svg>
              <AffordanceLabel label="App Store" glyph={<ArrowUpRight />} />
              <NewTabHint />
            </a>
          )}

          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="projects-mini"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d={GITHUB_MARK} />
              </svg>
              <AffordanceLabel label="GitHub" glyph={<ArrowUpRight />} />
              <NewTabHint />
            </a>
          )}

          {project.private && <span className="projects-badge-private">USCG · PRIVATE</span>}

          {stat && (
            <span
              className={
                isFlagship
                  ? 'ml-0.5 text-[12px] font-bold text-[color:var(--flagship-meta)]'
                  : 'text-muted ml-0.5 text-[12px] font-bold'
              }
            >
              {stat}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
