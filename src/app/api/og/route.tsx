import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { getOgCard, type OgCard } from '@/lib/ogCards';

// Needs Node APIs (fs for fonts/marks, sharp for SVG rasterization).
export const runtime = 'nodejs';

const publicPath = (p: string) => path.join(process.cwd(), 'public', p);
const FONT_DIR = path.join(process.cwd(), 'src/app/api/og/fonts/Roboto/static');

interface Mark {
  src: string;
  width: number;
  height: number;
}

// ---- module-scoped caches (loaded once per server instance) ----

let fontsPromise: Promise<{ regular: Buffer; medium: Buffer }> | null = null;
function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFile(path.join(FONT_DIR, 'Roboto-Regular.ttf')),
      readFile(path.join(FONT_DIR, 'Roboto-Medium.ttf')),
    ]).then(([regular, medium]) => ({ regular, medium }));
  }
  return fontsPromise;
}

function toDataUri(buf: Buffer) {
  return `data:image/png;base64,${buf.toString('base64')}`;
}

// Rasterize the CorelDRAW SVG and trim its empty canvas down to the visible blue
// mark (the viewBox has wide whitespace around a ~square mark). Falls back to the
// 512² favicon if sharp/librsvg can't render the SVG.
let hendasehMarkPromise: Promise<Mark> | null = null;
function loadHendasehMark() {
  if (!hendasehMarkPromise) {
    hendasehMarkPromise = (async () => {
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
    })();
  }
  return hendasehMarkPromise;
}

// The Nahtadi mark is a green arch on full transparency — trim to its bounds so it
// fills the white tile cleanly (instead of floating small in its 1024² canvas).
let nahtadiMarkPromise: Promise<Mark> | null = null;
function loadNahtadiMark() {
  if (!nahtadiMarkPromise) {
    nahtadiMarkPromise = sharp(publicPath('images/nahtadi/icon.png'))
      .trim()
      .png()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => ({ src: toDataUri(data), width: info.width, height: info.height }));
  }
  return nahtadiMarkPromise;
}

/** Scale a mark's intrinsic size to a target box, preserving aspect ratio. */
function fitWithin(mark: Mark, maxW: number, maxH: number) {
  const scale = Math.min(maxW / mark.width, maxH / mark.height);
  return { width: Math.round(mark.width * scale), height: Math.round(mark.height * scale) };
}

function CardTemplate({ card, mark }: { card: OgCard; mark: Mark | null }) {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const card = getOgCard(searchParams.get('card') ?? 'site');

  const { regular, medium } = await loadFonts();

  let mark: Mark | null = null;
  if (card.icon?.src === 'hendaseh-mark') mark = await loadHendasehMark();
  else if (card.icon?.src === 'nahtadi') mark = await loadNahtadiMark();

  return new ImageResponse(<CardTemplate card={card} mark={mark} />, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Roboto', data: regular, weight: 400, style: 'normal' },
      { name: 'Roboto', data: medium, weight: 500, style: 'normal' },
    ],
    headers: {
      'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
