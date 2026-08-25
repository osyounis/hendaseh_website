/**
 * Deterministic asset compositor — the non-AI half of the asset engine.
 *
 * Consumes generated artwork (a full-bleed 1024² square PNG with its own baked
 * background — see assets/anchors/STYLE.md) and composites it over a per-project
 * gradient into the icon / squircle / card shapes the site and GitHub need.
 *
 * Script-only code: uses sharp and node-only APIs. Never import this from
 * src/app/** or src/components/** — sharp doesn't run on the Cloudflare
 * Workers runtime this site deploys to.
 */
import sharp from 'sharp';

export interface Gradient {
  from: string;
  to: string;
}

const SIZE = 1024;

/** Apple-style superellipse |x/a|^n + |y/a|^n = 1, n≈4.6 */
export function squirclePath(size: number, n = 4.6): string {
  const a = size / 2;
  const pts: string[] = [];
  const STEPS = 720;
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * 2 * Math.PI;
    const c = Math.cos(t), s = Math.sin(t);
    const x = a + Math.sign(c) * a * Math.abs(c) ** (2 / n);
    const y = a + Math.sign(s) * a * Math.abs(s) ** (2 / n);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `${pts.join(' ')} Z`;
}

/** Square linear gradient — the ground beneath the full-bleed artwork. */
function gradientSvg(size: number, g: Gradient): Buffer {
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${g.from}"/><stop offset="1" stop-color="${g.to}"/>
      </linearGradient></defs>
      <rect width="${size}" height="${size}" fill="url(#g)"/>
    </svg>`
  );
}

/** Opaque shape (rounded rect or squircle) on transparent ground — used as a
 * `dest-in` mask applied to a finished composite, never to the background alone. */
function maskShapeSvg(size: number, shape: 'rounded' | 'squircle', rx = 180): Buffer {
  const shapeEl =
    shape === 'squircle'
      ? `<path d="${squirclePath(size)}" fill="#fff"/>`
      : `<rect width="${size}" height="${size}" rx="${rx}" fill="#fff"/>`;
  return Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${shapeEl}</svg>`);
}

/**
 * Gradient base + full-bleed artwork, flattened to a single opaque 1024² PNG.
 * `fit: 'cover'` means the artwork always fills the frame completely, so the
 * gradient never actually shows through once composited — it's kept as the
 * base layer anyway: it's free when covered, and is the correct fallback
 * ground should a non-square artwork ever need `cover`'s crop-to-fill instead
 * of leaving a gap.
 */
async function baseComposite(artwork: Buffer, g: Gradient): Promise<Buffer> {
  const bg = gradientSvg(SIZE, g);
  const art = await sharp(artwork).resize(SIZE, SIZE, { fit: 'cover' }).png().toBuffer();
  return sharp(bg).composite([{ input: art }]).png().toBuffer();
}

/**
 * 1024² icon: gradient + full-bleed artwork, corners masked last so the mask
 * clips the finished composite rather than a background rect the artwork
 * would otherwise paint straight over.
 */
export async function composeIcon(artwork: Buffer, g: Gradient, shape: 'rounded' | 'squircle'): Promise<Buffer> {
  const composite = await baseComposite(artwork, g);
  const mask = maskShapeSvg(SIZE, shape);
  return sharp(composite)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

/** Square card image: same full-bleed composition as the icon, no corner mask. */
export async function composeCard(artwork: Buffer, g: Gradient): Promise<Buffer> {
  return baseComposite(artwork, g);
}
