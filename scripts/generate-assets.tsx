/**
 * Composites the deterministic asset set for one or more projects: icon,
 * squircle icon, square card, and GitHub social banner in
 * `public/images/projects/<id>/`.
 *
 * Consumes AI-generated artwork committed at `assets/artwork/<id>.png` (see
 * assets/anchors/STYLE.md for what that artwork looks like) — Nahtadi is the
 * one exception, using its real shipped App Store icon instead of generated
 * artwork. Projects with no artwork yet are skipped with a warning, not an
 * error, so the script is safe to run against a partially-filled catalog.
 *
 * Run manually: `npm run assets -- <id> [<id>…]` or `npm run assets -- --all`.
 * Outputs are deterministic PNGs committed to the repo, not runtime assets —
 * neither sharp nor satori ships to the Cloudflare Workers runtime this site
 * deploys to.
 */
import sharp from 'sharp';
import satori from 'satori';
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { getAllProjects, getProjectById, type Project } from '../src/lib/projects';
import { BannerTemplate } from '../src/lib/assetTemplates';
import { composeIcon, composeCard } from './lib/compose';

const OUT = (id: string) => `public/images/projects/${id}`;
const ARTWORK = (id: string) => `assets/artwork/${id}.png`;

async function fonts() {
  const [regular, medium] = await Promise.all([
    readFile('src/fonts/roboto/Roboto-Regular.ttf'),
    readFile('src/fonts/roboto/Roboto-Medium.ttf'),
  ]);
  return [
    { name: 'Roboto', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Roboto', data: medium, weight: 500 as const, style: 'normal' as const },
  ];
}

async function compose(p: Project) {
  if (!p.brand) throw new Error(`${p.id}: missing brand.gradient`);
  // Nahtadi's artwork IS its shipped icon; everyone else uses approved artwork.
  const artPath = p.id === 'nahtadi' ? 'public/images/nahtadi/icon.png' : ARTWORK(p.id);
  const artwork = await readFile(artPath);
  await mkdir(OUT(p.id), { recursive: true });

  const icon = await composeIcon(artwork, p.brand.gradient, 'rounded');
  const squircle = await composeIcon(artwork, p.brand.gradient, 'squircle');
  const card = await composeCard(artwork, p.brand.gradient);
  await writeFile(path.join(OUT(p.id), 'icon.png'), icon);
  await writeFile(path.join(OUT(p.id), 'icon-squircle.png'), squircle);
  await writeFile(path.join(OUT(p.id), 'card.png'), card);

  const iconDataUri = `data:image/png;base64,${icon.toString('base64')}`;
  const svg = await satori(
    BannerTemplate({ title: p.title, tagline: p.tagline, iconPng: iconDataUri, gradient: p.brand.gradient }),
    { width: 1280, height: 640, fonts: await fonts() }
  );
  await writeFile(path.join(OUT(p.id), 'github-banner.png'), await sharp(Buffer.from(svg)).png().toBuffer());
  console.log(`assets: ${p.id} ✓`);
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--compose-only');
  const all = args.includes('--all');
  const projects = all
    ? getAllProjects()
    : args.map((id) => {
        const p = getProjectById(id);
        if (!p) throw new Error(`unknown project id: ${id}`);
        return p;
      });
  if (projects.length === 0) throw new Error('usage: npm run assets -- <id> [<id>…] | --all [--compose-only]');
  for (const p of projects) {
    try {
      await access(p.id === 'nahtadi' ? 'public/images/nahtadi/icon.png' : ARTWORK(p.id));
    } catch {
      console.warn(`assets: ${p.id} skipped — no artwork at ${ARTWORK(p.id)}`);
      continue;
    }
    await compose(p);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
