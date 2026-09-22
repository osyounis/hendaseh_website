/**
 * Renders the favicon set and the Apple touch icon into `public/` from
 * `public/logos/hendaseh-mark.svg`.
 *
 * Run manually (`npm run generate:icons`) when the mark changes; the outputs
 * are deterministic and committed. `favicon-512x512.png` is NOT written here:
 * it is the source `src/lib/assetTemplates.tsx` reads for the OG cards, not a
 * page icon, and stays as it is.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { encodeIco, loadMarkSvg, renderAppleIcon, renderFavicon } from './lib/icons';

const OUT = 'public';

async function main() {
  const svg = await loadMarkSvg();

  for (const size of [16, 32, 64]) {
    await writeFile(path.join(OUT, `favicon-${size}x${size}.png`), await renderFavicon(svg, size));
    console.log(`icons: favicon-${size}x${size}.png`);
  }

  const frames = await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await renderFavicon(svg, size) })));
  await writeFile(path.join(OUT, 'favicon.ico'), encodeIco(frames));
  console.log('icons: favicon.ico');

  await writeFile(path.join(OUT, 'apple-touch-icon.png'), await renderAppleIcon(svg));
  console.log('icons: apple-touch-icon.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
