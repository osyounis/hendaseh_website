/**
 * Pre-renders every OG card to a static PNG in `public/og/`.
 *
 * Run manually (`npm run generate:og`) whenever a card's copy, gradient, or mark
 * changes; the PNGs are deterministic outputs and are committed to the repo.
 * The site deploys to Cloudflare Workers, where neither `sharp` nor `node:fs`
 * is available — so nothing here may ever be imported by app code.
 */
import satori from 'satori';
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getOgCard } from '../src/lib/ogCards';
import { getShowcaseProjects } from '../src/lib/projects';
import { CardTemplate, loadMarks, loadProjectArtwork, type Mark } from '../src/lib/assetTemplates';

const FONT_DIR = 'src/fonts/roboto';
const OUT = 'public/og';

async function main() {
  const [regular, medium] = await Promise.all([
    readFile(path.join(FONT_DIR, 'Roboto-Regular.ttf')),
    readFile(path.join(FONT_DIR, 'Roboto-Medium.ttf')),
  ]);
  const marks = await loadMarks();
  await mkdir(OUT, { recursive: true });

  const ids = ['site', 'nahtadi', ...getShowcaseProjects().map((p) => p.id)];
  for (const id of ids) {
    const card = getOgCard(id);
    let mark: Mark | null = null;
    if (card.icon) {
      if (card.icon.src === 'nahtadi') mark = marks.nahtadi;
      else if (card.icon.src === 'hendaseh-mark') mark = marks.hendaseh;
      else mark = await loadProjectArtwork(card.icon.src.project);
    }
    const svg = await satori(<CardTemplate card={card} mark={mark} />, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Roboto', data: regular, weight: 400, style: 'normal' },
        { name: 'Roboto', data: medium, weight: 500, style: 'normal' },
      ],
    });
    await writeFile(
      path.join(OUT, `${id}.png`),
      await sharp(Buffer.from(svg)).png({ compressionLevel: 9, effort: 10, palette: false, adaptiveFiltering: true }).toBuffer()
    );
    console.log(`og: ${id}.png`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
