/**
 * Favicon and Apple touch icon rendering, from the canonical UI mark
 * `public/logos/hendaseh-mark.svg`. Build-time only (sharp, node:fs) -- never
 * import from app code. Driven by `scripts/generate-icons.tsx`.
 *
 * `palette: false` + `adaptiveFiltering: true` on every png() call, same
 * load-bearing rule as compose.ts and generate-og.tsx.
 */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const MARK = path.join(process.cwd(), 'public', 'logos', 'hendaseh-mark.svg');

/** Rasterise the mark at a generous density so every downscale is a true
 *  supersample. The SVG's intrinsic box is 922x1000 at 72dpi. */
const RASTER_DENSITY = 72 * 2;

/** The Apple icon's mark height as a fraction of the tile. ~19% clear space
 *  top and bottom -- the same proportion as the white tile in the home hero,
 *  and inside the region iOS's squircle mask never clips. */
const APPLE_MARK_RATIO = 0.62;

export async function loadMarkSvg(): Promise<Buffer> {
  return readFile(MARK);
}

/** Transparent square favicon, the mark fitted edge to edge. At 16-64px any
 *  padding is lost detail; the browser draws its own spacing around tab icons. */
export async function renderFavicon(svg: Buffer, size: number): Promise<Buffer> {
  return sharp(svg, { density: RASTER_DENSITY })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
    .png({ compressionLevel: 9, effort: 10, palette: false, adaptiveFiltering: true })
    .toBuffer();
}

/** 180x180 home-screen icon: fully opaque white, the mark centred, square
 *  corners (iOS applies its own mask). No alpha channel at all -- iOS paints
 *  any transparent pixel black. */
export async function renderAppleIcon(svg: Buffer): Promise<Buffer> {
  const SIZE = 180;
  const markHeight = Math.round(SIZE * APPLE_MARK_RATIO);
  const mark = await sharp(svg, { density: RASTER_DENSITY })
    .resize({ height: markHeight, kernel: 'lanczos3' })
    .png({ compressionLevel: 9, effort: 10, palette: false, adaptiveFiltering: true })
    .toBuffer();
  return sharp({ create: { width: SIZE, height: SIZE, channels: 3, background: '#ffffff' } })
    .composite([{ input: mark, gravity: 'centre' }])
    .flatten({ background: '#ffffff' })
    .removeAlpha()
    .png({ compressionLevel: 9, effort: 10, palette: false, adaptiveFiltering: true })
    .toBuffer();
}

/** PNG-in-ICO container (supported by every browser since IE Vista-era).
 *  Header: reserved(2) type(2)=1 count(2); then per frame a 16-byte entry:
 *  width(1) height(1) colours(1) reserved(1) planes(2) bpp(2) bytes(4) offset(4).
 *  A 256px frame is written as 0 in the one-byte size fields, per the spec. */
export function encodeIco(frames: { size: number; png: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + frames.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);

  let offset = header.length;
  frames.forEach(({ size, png }, i) => {
    const at = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, at);
    header.writeUInt8(size >= 256 ? 0 : size, at + 1);
    header.writeUInt8(0, at + 2);
    header.writeUInt8(0, at + 3);
    header.writeUInt16LE(1, at + 4);
    header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(png.length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...frames.map((f) => f.png)]);
}
