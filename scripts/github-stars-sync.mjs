/**
 * Weekly GitHub star-count sync. CI-TIME ONLY.
 *
 * For every project in projects.json that has `githubStars`, reads the repo
 * named by `links.github` from GitHub's REST API and updates the count. It
 * never pushes: the workflow hands the working tree to
 * peter-evans/create-pull-request, which requests Omar's review, and a human
 * merges. Spec: docs/superpowers/specs/2026-10-08-github-stars-sync-design.md
 *
 * THE RULE: VALIDATE EVERYTHING, THEN WRITE, OR WRITE NOTHING. A stale count is
 * acceptable and a missing or guessed one is not. Any doubt about any repo
 * fails the whole run before the file is touched, so a half-applied sync can
 * never land. Doubt includes a count that collapses (to 0, or by more than
 * half): stars do not do that, so it means the API or the link is wrong, and a
 * human should look before the site believes it.
 *
 * Usage: node scripts/github-stars-sync.mjs [--dry-run]
 */
import { readFile, writeFile } from 'node:fs/promises';
import { appendFileSync } from 'node:fs';

const PROJECTS = 'src/data/projects.json';
const DRY_RUN = process.argv.includes('--dry-run');

/** Test seam, as in appstore-sync.mjs: a JSON map of "owner/repo" -> response. */
const STUB = process.env.GITHUB_STARS_SYNC_STUB;

function die(message) {
  console.error(`\n✖ GITHUB STARS SYNC FAILED\n\n${message}\n\nNothing was written.\n`);
  process.exit(1);
}

/** "https://github.com/owner/repo", with or without a trailing slash or .git. */
function slugFrom(project) {
  const url = project.links?.github;
  if (!url) die(`"${project.id}" has githubStars but no links.github, so there is no repo to read.`);
  const m = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/.exec(url);
  if (!m) die(`"${project.id}": could not read owner/repo out of links.github:\n  ${url}`);
  return `${m[1]}/${m[2]}`;
}

let stubMap;
async function getRepo(slug) {
  if (STUB) {
    stubMap ??= JSON.parse(await readFile(STUB, 'utf8'));
    const r = stubMap[slug];
    if (!r) die(`${slug}: no stub entry.`);
    if (r.status && r.status !== 200) die(`${slug}: HTTP ${r.status}.`);
    return r;
  }
  const url = `https://api.github.com/repos/${slug}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'hendaseh-github-stars-sync',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  // Present in Actions; absent on a local run, which then goes unauthenticated.
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  let res;
  try {
    res = await fetch(url, { headers });
  } catch (cause) {
    die(`${slug}: request failed.\n  ${url}\n  ${cause.message}`);
  }
  if (!res.ok) die(`${slug}: HTTP ${res.status}.\n  ${url}`);
  try {
    return await res.json();
  } catch (cause) {
    die(`${slug}: response was not JSON.\n  ${cause.message}`);
  }
}

const doc = JSON.parse(await readFile(PROJECTS, 'utf8'));
const synced = doc.projects.filter((p) => p.githubStars !== undefined);
if (synced.length === 0) die('no project in projects.json has githubStars; nothing to sync.');

// ---------------------------------------------------------- read + validate ALL
const changes = [];
for (const project of synced) {
  const slug = slugFrom(project);
  const repo = await getRepo(slug);
  if (repo.private === true) die(`${slug} is private. A private repo's stars should not be on the site.`);
  if (typeof repo.full_name === 'string' && repo.full_name.toLowerCase() !== slug.toLowerCase()) {
    die(`${slug} was renamed to ${repo.full_name}. Update links.github in projects.json by hand.`);
  }
  const live = repo.stargazers_count;
  if (!Number.isInteger(live) || live < 0) {
    die(`${slug}: stargazers_count is not a whole number (${JSON.stringify(live)}). Refusing to guess.`);
  }
  const stored = project.githubStars;
  if ((stored > 0 && live === 0) || live < stored / 2) {
    die(
      `${slug}: ${stored} -> ${live} is suspicious. Stars do not collapse; check the repo and the\n` +
        `API by hand, and if it is real, edit githubStars in projects.json yourself.`
    );
  }
  console.log(`  ${project.id.padEnd(28)} ${slug.padEnd(40)} repo ${stored}, live ${live}`);
  if (live !== stored) changes.push({ project, from: stored, to: live });
}

if (changes.length === 0) {
  console.log('\nNo change. Nothing to do.');
  process.exit(0);
}

console.log('\nChanged:');
for (const c of changes) console.log(`  ${c.project.id}: ${c.from} -> ${c.to}`);

if (DRY_RUN) {
  console.log('\n--dry-run: no files written.');
  process.exit(0);
}

// ------------------------------------------------------------- write, all at once
for (const c of changes) c.project.githubStars = c.to;
await writeFile(PROJECTS, JSON.stringify(doc, null, 2) + '\n');
console.log(`\nWrote ${PROJECTS}. The workflow opens a PR; nothing is pushed to dev or main.`);

if (process.env.GITHUB_OUTPUT) {
  const summary = changes.map((c) => `- \`${c.project.id}\`: ${c.from} → ${c.to}`).join('\n');
  appendFileSync(process.env.GITHUB_OUTPUT, `drift<<EOF\n${summary}\nEOF\n`);
}
