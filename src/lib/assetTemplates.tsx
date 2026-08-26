// Shared Satori templates + asset loaders for the static asset generators
// (OG cards and GitHub banners).
//
// Imported only by scripts/ — uses sharp and node:fs; never import from app code.
// Neither `sharp` nor `node:fs` is available on the Cloudflare Workers runtime the
// site deploys to.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { OgCard } from '@/lib/ogCards';

const publicPath = (p: string) => path.join(process.cwd(), 'public', p);

export interface Mark {
  src: string;
  width: number;
  height: number;
}

function toDataUri(buf: Buffer) {
  return `data:image/png;base64,${buf.toString('base64')}`;
}

// Rasterize the CorelDRAW SVG and trim its empty canvas down to the visible blue
// mark (the viewBox has wide whitespace around a ~square mark). Falls back to the
// 512² favicon if sharp/librsvg can't render the SVG.
async function loadHendasehMark(): Promise<Mark> {
  try {
    const { data, info } = await sharp(publicPath('logos/Hendaseh_icon.svg'), {
      density: 256,
      limitInputPixels: false,
    })
      .trim()
      .png()
      .toBuffer({ resolveWithObject: true });
    return { src: toDataUri(data), width: info.width, height: info.height };
  } catch {
    const fav = await readFile(publicPath('favicon-512x512.png'));
    return { src: toDataUri(fav), width: 512, height: 512 };
  }
}

// The Nahtadi mark is a green arch on full transparency — trim to its bounds so it
// fills the white tile cleanly (instead of floating small in its 1024² canvas).
async function loadNahtadiMark(): Promise<Mark> {
  const { data, info } = await sharp(publicPath('images/nahtadi/icon.png'))
    .trim()
    .png()
    .toBuffer({ resolveWithObject: true });
  return { src: toDataUri(data), width: info.width, height: info.height };
}

/** Load both fixed marks once. Every card in the set is rendered in a single process. */
export async function loadMarks(): Promise<{ hendaseh: Mark; nahtadi: Mark }> {
  const [hendaseh, nahtadi] = await Promise.all([loadHendasehMark(), loadNahtadiMark()]);
  return { hendaseh, nahtadi };
}

/**
 * Trim a transparent subject's baked-in margin and wrap it as a `Mark`.
 * Shared by every caller that renders raw engine artwork (assets/artwork/<id>.png,
 * or Nahtadi's shipped icon) directly on a gradient — the artwork carries large,
 * inconsistent transparent margins, so an untrimmed subject renders at
 * unpredictable sizes from project to project. Mirrors the trim step
 * scripts/lib/compose.ts uses before compositing.
 */
export async function trimArtworkToMark(artwork: Buffer): Promise<Mark> {
  const { data, info } = await sharp(artwork).trim().png().toBuffer({ resolveWithObject: true });
  return { src: toDataUri(data), width: info.width, height: info.height };
}

/**
 * A project's OG card icon is its transparent engine artwork
 * (assets/artwork/<id>.png) — the subject on full transparency, same source
 * the compositor (scripts/lib/compose.ts) uses.
 */
export async function loadProjectArtwork(projectId: string): Promise<Mark> {
  const artworkPath = path.join(process.cwd(), 'assets', 'artwork', `${projectId}.png`);
  return trimArtworkToMark(await readFile(artworkPath));
}

/** Scale a mark's intrinsic size to a target box, preserving aspect ratio. */
function fitWithin(mark: Mark, maxW: number, maxH: number) {
  const scale = Math.min(maxW / mark.width, maxH / mark.height);
  return { width: Math.round(mark.width * scale), height: Math.round(mark.height * scale) };
}

/**
 * Vertical budget note (same failure mode `BannerTemplate` was hardened
 * against in commit `3026f78`): the outer container is `flexDirection:
 * column` with `justifyContent: center`. Every direct child below is
 * `flexShrink: 0` — without it, a flex child's default `flexShrink: 1` lets
 * the box get squeezed *below* its own text's rendered height whenever total
 * content exceeds the 630px frame, and the glyphs (rendered at full size
 * regardless) spill out of the shrunk box into whatever comes next, which is
 * exactly how a wrapping title once overlapped the tagline. This template
 * added an icon (~258px of vertical budget) after that fix shipped, so it
 * carries the same latent bug until hardened the same way. The name is
 * additionally clamped to 2 lines (`WebkitLineClamp` + `textOverflow:
 * 'ellipsis'`, which Satori honors only together with `display:
 * '-webkit-box'` / `WebkitBoxOrient: 'vertical'`) so a future name longer
 * than any in the catalog degrades to an ellipsis instead of reintroducing
 * overlap.
 */
export function CardTemplate({ card, mark }: { card: OgCard; mark: Mark | null }) {
  const background =
    card.background.kind === 'solid'
      ? { backgroundColor: card.background.color }
      : { backgroundImage: `linear-gradient(135deg, ${card.background.from}, ${card.background.to})` };

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'Roboto',
        ...background,
      }}
    >
      {card.icon && mark && (card.icon.tile ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '260px',
            height: '260px',
            backgroundColor: '#FFFFFF',
            borderRadius: '40px',
            marginBottom: '40px',
          }}
        >
          {(() => {
            const { width, height } = fitWithin(mark, 196, 196);
            return <img src={mark.src} width={width} height={height} alt="" />;
          })()}
        </div>
      ) : (
        (() => {
          const { width, height } = fitWithin(mark, 230, 210);
          return (
            <img
              src={mark.src}
              width={width}
              height={height}
              alt=""
              style={{ flexShrink: 0, marginBottom: '48px' }}
            />
          );
        })()
      ))}

      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flexShrink: 0,
          maxWidth: '1040px',
          fontSize: `${card.nameSize}px`,
          fontWeight: 500,
          color: card.textColor,
          lineHeight: 1.06,
          textAlign: 'center',
        }}
      >
        {card.name}
      </div>

      {card.tagline && (
        <div
          style={{
            flexShrink: 0,
            marginTop: '26px',
            fontSize: '40px',
            fontWeight: 400,
            color: card.taglineColor ?? card.textColor,
            textAlign: 'center',
          }}
        >
          {card.tagline}
        </div>
      )}

      {card.footer && (
        <div
          style={{
            flexShrink: 0,
            marginTop: '40px',
            fontSize: '30px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {card.footer}
        </div>
      )}
    </div>
  );
}

/** `linear-gradient(135deg, from, to)` — the gradient idiom shared by every card. */
export function GRADIENT_CSS(g: { from: string; to: string }): string {
  return `linear-gradient(135deg, ${g.from}, ${g.to})`;
}

/**
 * 1280x640 GitHub social preview banner. Same visual family as the OG cards
 * above and, for the artwork treatment specifically, the same idea as
 * `CardTemplate`'s untiled branch (commit `53c4970`): the project's
 * transparent artwork renders directly on the banner's own gradient — no
 * white tile behind it. `artwork` is a `Mark` (already trimmed of its baked-in
 * transparent margin by the caller, e.g. via `trimArtworkToMark`/
 * `loadProjectArtwork`) so every project's subject fits the same box at a
 * consistent apparent size regardless of how much margin its source PNG
 * carried.
 *
 * `opaque` is the one exception STYLE.md documents: coast-guard-pilot-tracker
 * is a full-bleed baked scene, not a transparent subject to float. Rendered
 * bare it would look like a pasted rectangle, so the caller instead passes
 * the already-composited, corner-masked `icon` PNG (see
 * scripts/lib/compose.ts's `isOpaqueFullBleed` branch) and this template
 * gives it a smaller, explicitly rounded box so it reads as a deliberate
 * self-contained tile rather than a floating subject.
 *
 * Vertical budget note: the outer container is `flexDirection: column` with
 * `justifyContent: center`. Every direct child below is `flexShrink: 0` —
 * without it, a flex child's default `flexShrink: 1` lets the box get
 * squeezed *below* its own text's rendered height whenever total content
 * exceeds the 640px frame, and the glyphs (rendered at full size regardless)
 * spill out of the shrunk box into whatever comes next. That is what let a
 * two-line title overlap the tagline (see task 7c); the sizes below —
 * including the artwork box's 200px height cap — are chosen so a two-line
 * title + tagline + footer still fit the frame without any shrinking, and
 * `flexShrink: 0` makes that a guarantee rather than an accident of the
 * current copy. The title is additionally clamped to 2 lines
 * (`WebkitLineClamp` + `textOverflow: 'ellipsis'`, which Satori honors only
 * together with `display: '-webkit-box'` / `WebkitBoxOrient: 'vertical'`) so
 * a future title longer than any in the catalog degrades to an ellipsis
 * instead of reintroducing overlap.
 */
export function BannerTemplate({
  title,
  tagline,
  artwork,
  opaque = false,
  gradient,
}: {
  title: string;
  tagline?: string;
  artwork: Mark;
  opaque?: boolean;
  gradient: { from: string; to: string };
}) {
  // Transparent subjects get a wide, generous box (fit is height-capped so
  // subjects stay a consistent size across the catalog regardless of aspect
  // ratio); the opaque full-bleed exception gets a smaller square tile, since
  // it's already a self-contained square composite, not a subject to float.
  const { width, height } = opaque ? fitWithin(artwork, 200, 200) : fitWithin(artwork, 480, 200);

  return (
    <div
      style={{
        width: '1280px',
        height: '640px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px',
        fontFamily: 'Roboto',
        backgroundImage: GRADIENT_CSS(gradient),
      }}
    >
      <img
        src={artwork.src}
        width={width}
        height={height}
        alt=""
        style={{
          flexShrink: 0,
          marginBottom: '32px',
          ...(opaque ? { borderRadius: '28px' } : {}),
        }}
      />

      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flexShrink: 0,
          maxWidth: '1080px',
          fontSize: '64px',
          fontWeight: 500,
          color: '#FFFFFF',
          lineHeight: 1.08,
          textAlign: 'center',
        }}
      >
        {title}
      </div>

      {tagline && (
        <div
          style={{
            flexShrink: 0,
            marginTop: '32px',
            fontSize: '32px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.86)',
            textAlign: 'center',
          }}
        >
          {tagline}
        </div>
      )}

      <div
        style={{
          flexShrink: 0,
          marginTop: '32px',
          fontSize: '26px',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        hendaseh.com
      </div>
    </div>
  );
}
