/**
 * Deterministic asset compositor — the non-AI half of the asset engine.
 *
 * Consumes generated artwork and composites it over a per-project gradient
 * into the icon / squircle / card shapes the site and GitHub need. Per
 * assets/anchors/STYLE.md v2, artwork is normally a **transparent floating
 * subject** — the compositor insets it, trimmed, onto the gradient. One
 * surviving v1 anchor (coast-guard-pilot-tracker.png) is an opaque
 * full-bleed image with its own baked background instead; it is detected by
 * alpha statistics, not hardcoded by project id (see isOpaqueFullBleed).
 * Exported so scripts/generate-assets.tsx can apply the same branch to the
 * GitHub banner's artwork treatment instead of re-deriving the heuristic.
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

/**
 * `palette: false` is load-bearing on every png() call in this file.
 *
 * sharp treats `effort` as a palette-only option, so passing it implicitly sets
 * `palette: true` and every buffer written here is 8-bit quantised. That is
 * lossy and, worse, CONTENT-DEPENDENT: the palette is recomputed from whatever
 * artwork is being composited, so a change to one corner of a project's artwork
 * can shift flat dark regions anywhere else in the frame. It surfaced as a
 * banded wedge on the squircle's mask boundary that moved when unrelated pixels
 * changed. It also applies to the INTERMEDIATE resized subject below, not just
 * the final files, so the loss compounds through the pipeline.
 *
 * Keep `palette: false` on all of them. Dropping it re-quantises the catalog.
 *
 * `adaptiveFiltering: true` is a pure win alongside it: PNG's per-scanline
 * filters suit these gradient-and-glow images, and it makes the lossless
 * catalog 25% smaller (20.57 -> 15.38 MiB) with pixel-identical output.
 */
const SIZE = 1024;
const SUBJECT = 650; // artwork box, centered — generous margins per STYLE.md

/**
 * Mean alpha (sharp's stats scale is 0–255) at or above which artwork is
 * treated as opaque full-bleed rather than a transparent floating subject.
 * STYLE.md v2's transparent subjects run 11–118 in the approved set — this
 * threshold sits far above that range, with headroom, so it only catches
 * artwork that is genuinely all (or almost all) opaque. It's the mechanism
 * for STYLE.md's one exception, coast-guard-pilot-tracker.png: a surviving
 * v1 anchor whose sky-and-water scene *is* the artwork, not a subject to
 * lift off a background. Kept below 255 (not exactly 255) so a handful of
 * fully-opaque anti-aliased edge pixels on an otherwise transparent subject
 * can't flip it into this branch by accident.
 */
export const OPAQUE_ALPHA_MEAN = 250;

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

/** Square linear gradient, optionally clipped to a corner shape. */
function gradientSvg(size: number, g: Gradient, opts: { maskPath?: string; rx?: number } = {}): Buffer {
  const clip = opts.maskPath ? `<clipPath id="m"><path d="${opts.maskPath}"/></clipPath>` : '';
  const shapeAttr = opts.maskPath ? 'clip-path="url(#m)"' : opts.rx ? `rx="${opts.rx}"` : '';
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${g.from}"/><stop offset="1" stop-color="${g.to}"/>
      </linearGradient>${clip}</defs>
      <rect width="${size}" height="${size}" fill="url(#g)" ${shapeAttr}/>
    </svg>`
  );
}

/** Opaque shape (rounded rect or squircle) on transparent ground — used as a
 * `dest-in` mask applied to a finished full-bleed composite, never to the
 * background alone (a full-bleed artwork painted on top would otherwise
 * cover the corners a background-only mask clipped). */
function maskShapeSvg(size: number, shape: 'rounded' | 'squircle', rx = 180): Buffer {
  const shapeEl =
    shape === 'squircle'
      ? `<path d="${squirclePath(size)}" fill="#fff"/>`
      : `<rect width="${size}" height="${size}" rx="${rx}" fill="#fff"/>`;
  return Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${shapeEl}</svg>`);
}

/**
 * True when `artwork` carries no meaningful transparency and should be
 * treated as an opaque full-bleed tile rather than a subject to inset.
 * PNGs with no alpha channel at all report `hasAlpha === false` outright;
 * PNGs that do carry an alpha channel but whose pixels are essentially all
 * opaque (mean alpha >= OPAQUE_ALPHA_MEAN) are treated the same way.
 */
export async function isOpaqueFullBleed(artwork: Buffer): Promise<boolean> {
  const meta = await sharp(artwork).metadata();
  if (!meta.hasAlpha) return true;
  const { channels } = await sharp(artwork).stats();
  const alpha = channels[3];
  return alpha !== undefined && alpha.mean >= OPAQUE_ALPHA_MEAN;
}

/**
 * Gradient base + full-bleed artwork, flattened to a single opaque 1024²
 * PNG. Only used for opaque source artwork (see isOpaqueFullBleed) — the
 * STYLE.md exception, not the default path. `fit: 'cover'` means the
 * artwork always fills the frame completely, so the gradient never actually
 * shows through once composited — it's kept as the base layer anyway: it's
 * free when covered, and is the correct fallback ground should a non-square
 * exception image ever need `cover`'s crop-to-fill instead of leaving a gap.
 */
async function fullBleedComposite(artwork: Buffer, g: Gradient): Promise<Buffer> {
  const bg = gradientSvg(SIZE, g);
  const art = await sharp(artwork).resize(SIZE, SIZE, { fit: 'cover' }).png({ compressionLevel: 9, effort: 10, palette: false, adaptiveFiltering: true }).toBuffer();
  return sharp(bg).composite([{ input: art }]).png({ compressionLevel: 9, effort: 10, palette: false, adaptiveFiltering: true }).toBuffer();
}

/**
 * Gradient base + a transparent subject, trimmed of its baked-in margin and
 * inset centered inside the SUBJECT-sized box — STYLE.md v2's default path.
 * Trimming first is what keeps the subject a consistent size across the
 * catalog: Omar's originals carry different amounts of baked-in transparent
 * margin, and fitting the untrimmed canvas would render the same subject at
 * wildly different apparent sizes from project to project. The corner
 * treatment (rx or squircle clip) applies to this background layer, not to
 * the finished composite — unlike the full-bleed branch, nothing is ever
 * painted over the clipped corners here.
 */
async function insetComposite(artwork: Buffer, g: Gradient, opts: { maskPath?: string; rx?: number } = {}): Promise<Buffer> {
  const bg = gradientSvg(SIZE, g, opts);
  const trimmed = await sharp(artwork).trim().toBuffer();
  const subject = await sharp(trimmed)
    .resize(SUBJECT, SUBJECT, { fit: 'inside', withoutEnlargement: false })
    .png({ compressionLevel: 9, effort: 10, palette: false, adaptiveFiltering: true })
    .toBuffer();
  const meta = await sharp(subject).metadata();
  return sharp(bg)
    .composite([{ input: subject, left: Math.round((SIZE - meta.width!) / 2), top: Math.round((SIZE - meta.height!) / 2) }])
    .png({ compressionLevel: 9, effort: 10, palette: false, adaptiveFiltering: true })
    .toBuffer();
}

export async function composeIcon(artwork: Buffer, g: Gradient, shape: 'rounded' | 'squircle'): Promise<Buffer> {
  if (await isOpaqueFullBleed(artwork)) {
    const composite = await fullBleedComposite(artwork, g);
    const mask = maskShapeSvg(SIZE, shape);
    return sharp(composite)
      .composite([{ input: mask, blend: 'dest-in' }])
      .png({ compressionLevel: 9, effort: 10, palette: false, adaptiveFiltering: true })
      .toBuffer();
  }
  const maskOpts = shape === 'squircle' ? { maskPath: squirclePath(SIZE) } : { rx: 180 };
  return insetComposite(artwork, g, maskOpts);
}

/** Square card image: same composition rules as the icon, no corner treatment. */
export async function composeCard(artwork: Buffer, g: Gradient): Promise<Buffer> {
  if (await isOpaqueFullBleed(artwork)) {
    return fullBleedComposite(artwork, g);
  }
  return insetComposite(artwork, g);
}
