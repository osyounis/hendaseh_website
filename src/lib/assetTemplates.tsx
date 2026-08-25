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
 * A project's OG card icon is its transparent engine artwork
 * (assets/artwork/<id>.png) — the subject on full transparency, same source
 * the compositor (scripts/lib/compose.ts) uses. Trim it the same way: the
 * artwork carries large, inconsistent transparent margins, so an untrimmed
 * subject renders at unpredictable sizes on the card.
 */
export async function loadProjectArtwork(projectId: string): Promise<Mark> {
  const artworkPath = path.join(process.cwd(), 'assets', 'artwork', `${projectId}.png`);
  const { data, info } = await sharp(artworkPath).trim().png().toBuffer({ resolveWithObject: true });
  return { src: toDataUri(data), width: info.width, height: info.height };
}

/** Scale a mark's intrinsic size to a target box, preserving aspect ratio. */
function fitWithin(mark: Mark, maxW: number, maxH: number) {
  const scale = Math.min(maxW / mark.width, maxH / mark.height);
  return { width: Math.round(mark.width * scale), height: Math.round(mark.height * scale) };
}

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
          return <img src={mark.src} width={width} height={height} alt="" style={{ marginBottom: '48px' }} />;
        })()
      ))}

      <div
        style={{
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
 * above: gradient background, white rounded icon tile, Roboto Medium title,
 * muted footer. `iconPng` is a full-bleed square image (already trimmed by
 * the caller), so it's rendered directly at a fixed size, not fitted.
 */
export function BannerTemplate({
  title,
  tagline,
  iconPng,
  gradient,
}: {
  title: string;
  tagline?: string;
  iconPng: string;
  gradient: { from: string; to: string };
}) {
  return (
    <div
      style={{
        width: '1280px',
        height: '640px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'Roboto',
        backgroundImage: GRADIENT_CSS(gradient),
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '220px',
          height: '220px',
          backgroundColor: '#FFFFFF',
          borderRadius: '40px',
          marginBottom: '40px',
        }}
      >
        <img src={iconPng} width={156} height={156} alt="" />
      </div>

      <div
        style={{
          maxWidth: '1080px',
          fontSize: '72px',
          fontWeight: 500,
          color: '#FFFFFF',
          lineHeight: 1.06,
          textAlign: 'center',
        }}
      >
        {title}
      </div>

      {tagline && (
        <div
          style={{
            marginTop: '26px',
            fontSize: '36px',
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
          marginTop: '40px',
          fontSize: '28px',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        hendaseh.com
      </div>
    </div>
  );
}
