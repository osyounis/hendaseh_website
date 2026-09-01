/**
 * Low-friction project intake. CI-TIME ONLY, and a local convenience.
 *
 * Takes a repo name, drafts a schema-v2 catalog entry from the repo's own
 * metadata, and leaves it for Omar to finish. The machine writes boilerplate;
 * the human writes judgement.
 *
 * WHAT IT DELIBERATELY WILL NOT DO:
 *
 *  - Invent a gradient. Colour is chosen per project, never defaulted; a
 *    defaulted palette is what made the first full-catalog art pass read
 *    monotonous. `brand.gradient` comes out as TODO-OMAR.
 *  - Write a tagline. That is positioning, and positioning is Omar's.
 *  - Touch artwork. The PR body links the recipe; generation stays manual.
 *  - Guess a tier. Everything lands as `card`, the floor. Promotion needs a
 *    real story AND real visuals, which is a human call.
 *
 * TODO-OMAR placeholders are ALLOWED ONLY ON A DRAFT BRANCH. `--check` rejects
 * them, and CI runs `--check` on any branch that could merge, so a half-filled
 * entry cannot reach main.
 *
 * Usage:
 *   npm run intake -- <repo>          draft an entry, print it
 *   npm run intake -- <repo> --write  also write it into projects.json
 *   node scripts/intake.mjs --check   fail if any TODO-OMAR is in the catalog
 */
import { readFile, writeFile } from 'node:fs/promises';

const PROJECTS = 'src/data/projects.json';
const TODO = 'TODO-OMAR';
const OWNER = 'osyounis';

const argv = process.argv.slice(2);
const CHECK = argv.includes('--check');
const WRITE = argv.includes('--write');
const repoArg = argv.find((a) => !a.startsWith('--'));

function die(message) {
  console.error(`\n✖ INTAKE FAILED\n\n${message}\n`);
  process.exit(1);
}

// ------------------------------------------------------------------ --check
if (CHECK) {
  const raw = await readFile(PROJECTS, 'utf8');
  if (raw.includes(TODO)) {
    const lines = raw
      .split('\n')
      .map((l, i) => [i + 1, l])
      .filter(([, l]) => l.includes(TODO));
    die(
      `${lines.length} unfilled ${TODO} placeholder(s) in ${PROJECTS}:\n\n` +
        lines.map(([n, l]) => `  ${n}: ${l.trim()}`).join('\n') +
        `\n\nAn intake draft is not finishable by a machine. Fill the tagline and the\n` +
        `gradient by hand before this branch merges.`
    );
  }
  console.log(`No ${TODO} placeholders in ${PROJECTS}.`);
  process.exit(0);
}

if (!repoArg) die('usage: npm run intake -- <repo> [--write]');

const token = process.env.GITHUB_TOKEN;
async function gh(path, what) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'hendaseh-intake',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).catch((cause) => die(`${what}: request failed.\n  ${cause.message}`));
  if (res.status === 404) die(`${what}: not found.\n  https://github.com/${OWNER}/${repoArg}`);
  if (!res.ok) die(`${what}: HTTP ${res.status}.${res.status === 403 ? '\n  Rate limited. Set GITHUB_TOKEN.' : ''}`);
  return res.json();
}

const meta = await gh(`/repos/${OWNER}/${repoArg}`, 'repo metadata');
const languages = await gh(`/repos/${OWNER}/${repoArg}/languages`, 'languages');

/** `some_repo_name` -> `some-repo-name`; the catalog's ids are kebab-case. */
const id = meta.name.toLowerCase().replace(/[_\s]+/g, '-');
/** `some_repo_name` -> `Some Repo Name`. A starting point, not a title. */
const title = meta.name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const tech = Object.keys(languages).slice(0, 6);
if (tech.length === 0) tech.push(TODO);

const stats = [
  meta.stargazers_count ? `${meta.stargazers_count} stars` : null,
  meta.license?.spdx_id && meta.license.spdx_id !== 'NOASSERTION' ? meta.license.spdx_id : null,
].filter(Boolean).join(' • ') || TODO;

const entry = {
  id,
  title,
  tagline: `${TODO}: one line, under 120 characters, what it does and why it is interesting.`,
  cardStat: TODO,
  description: meta.description || `${TODO}: the repo has no description to draft from.`,
  technologies: tech,
  keywords: meta.topics?.length ? meta.topics.slice(0, 5) : [TODO],
  tier: 'card',
  featured: false,
  private: meta.private,
  stats,
  category: TODO,
  image: `/images/projects/${id}/card.png`,
  imageAlt: `${TODO}: describe the artwork once it exists.`,
  links: meta.private ? {} : { github: meta.html_url },
  brand: { gradient: { from: TODO, to: TODO } },
};

console.log(`\ndrafted from ${meta.full_name}${meta.private ? '  (private)' : ''}`);
console.log(`  language(s): ${tech.join(', ')}`);
console.log(`  stars: ${meta.stargazers_count}   license: ${meta.license?.spdx_id ?? 'none'}\n`);
console.log(JSON.stringify(entry, null, 2));

const unfilled = JSON.stringify(entry).split(TODO).length - 1;
/**
 * SHAPE IS VALIDATED AGAINST THE REAL SCHEMA; VALUES ARE DELIBERATELY NOT.
 *
 * `ProjectSchema` is strict and requires `brand.gradient` to be 6-digit hex, so
 * a draft carrying TODO-OMAR cannot satisfy it — by design, because inventing a
 * gradient is exactly what this script must not do. Colour is chosen per project
 * against the artwork, never defaulted.
 *
 * So the draft is validated with sentinels substituted for the placeholders.
 * That still catches everything a machine can catch — a stray field, a missing
 * required one, a wrong type — while leaving the judgement calls empty. The
 * sentinels are never written; the file keeps TODO-OMAR, and `--check` refuses
 * to let that reach a mergeable branch.
 */
const { ProjectSchema } = await import('../src/lib/projectSchema.ts');
const probe = JSON.parse(JSON.stringify(entry).replaceAll(TODO, 'PLACEHOLDER'));
probe.brand.gradient = { from: '#000000', to: '#000000' };
const shape = ProjectSchema.safeParse(probe);
if (!shape.success) {
  die(
    'the drafted entry does not fit schema v2:\n\n' +
      shape.error.issues.map((i) => `  ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
  );
}
console.log('Shape validates against ProjectSchema (placeholders substituted for the check only).');

console.log(`\n${unfilled} field(s) marked ${TODO}. This draft is NOT mergeable until they are filled.`);
console.log('Colour is chosen per project, never defaulted: pick the gradient against the artwork.');

if (!WRITE) {
  console.log('\n(no --write, so nothing was changed)');
  process.exit(0);
}

const doc = JSON.parse(await readFile(PROJECTS, 'utf8'));
if (doc.projects.some((p) => p.id === id)) die(`projects.json already has an entry with id "${id}".`);
doc.projects.push(entry);
await writeFile(PROJECTS, JSON.stringify(doc, null, 2) + '\n');
console.log(`\nAppended to ${PROJECTS}. The workflow opens a PR; nothing is pushed to dev or main.`);
