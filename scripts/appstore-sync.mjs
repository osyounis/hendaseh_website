/**
 * Weekly App Store fact sync. CI-TIME ONLY.
 *
 * Reads Apple's public endpoints, diffs the ledgered fields against the repo,
 * and writes files ONLY when everything it needed came back cleanly. It never
 * pushes: the workflow hands the working tree to peter-evans/create-pull-request
 * and a human merges.
 *
 * THREE RULES, EACH LEARNED THE HARD WAY:
 *
 *  1. ON ANY API FAILURE, FAIL THE RUN. A partial or guessed value written into
 *     projects.json is worse than a stale one, because the next run diffs
 *     against the guess and goes quiet.
 *
 *  2. THE RATING COUNT IS THE US-STOREFRONT FIGURE, DELIBERATELY. App Store
 *     Connect reports 9 worldwide; the lookup API and the US storefront both
 *     report 7. App Store counts are per-storefront and the lookup API cannot
 *     return a worldwide total, so this tracks what it can verify. A narrower
 *     number that is always right beats a truer one that is usually stale. See
 *     src/lib/__tests__/reviews.test.ts. Never widen this to a worldwide total.
 *
 *  3. NEVER DELETE A STORED REVIEW. Apple's RSS returns a rolling window, so a
 *     review that has aged out is absent, not withdrawn. Every stored review is
 *     located BY ID across all configured storefronts; if one cannot be found,
 *     this WARNS naming it and carries on. It never writes the reviews file at
 *     all. A sync that trusted the feed would silently empty it.
 *
 *     A warning, not a failure, since 2026-09-30. The 2026-09-28 run exited 1
 *     because the `jo` feed briefly omitted both Jordanian reviews; they were
 *     back two days later. Failing protected nothing (this file is never
 *     written) and skipped the rating sync, so a flaky feed meant a red run
 *     every few weeks. Each feed's entry count is logged so the next warning
 *     says whether a feed came back empty or partial.
 *
 * Usage: node scripts/appstore-sync.mjs [--dry-run] [--force-diff]
 */
import { readFile, writeFile } from 'node:fs/promises';

/** Storefronts to sweep for reviews. Config, not inline: adding a country is a
 *  one-line edit here, and the sync then protects reviews published there. */
const STOREFRONTS = ['us', 'jo'];

/** The storefront whose rating count `appStoreRating.count` tracks. See rule 2. */
const RATING_STOREFRONT = 'us';

const PROJECTS = 'src/data/projects.json';
const REVIEWS = 'src/data/nahtadiReviews.json';

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const FORCE_DIFF = args.has('--force-diff');

function die(message) {
  console.error(`\n✖ APP STORE SYNC FAILED\n\n${message}\n`);
  process.exit(1);
}

/**
 * Test seam. `src/lib/__tests__/appstore-sync.test.ts` exercises the refusal
 * path by pointing these at local files, because a real network call would make
 * that test flaky AND would go green for the wrong reason on the day a missing
 * review scrolls back into Apple's rolling window. CI-only; the app never reads
 * an environment variable.
 */
const STUB = { lookup: process.env.APPSTORE_SYNC_STUB_LOOKUP, feed: process.env.APPSTORE_SYNC_STUB_FEED };

async function getJson(url, what, stub) {
  if (stub) return JSON.parse(await readFile(stub, 'utf8'));
  let res;
  try {
    res = await fetch(url, { headers: { 'User-Agent': 'hendaseh-appstore-sync' } });
  } catch (cause) {
    die(`${what}: request failed.\n  ${url}\n  ${cause.message}\n\nNothing was written.`);
  }
  if (!res.ok) die(`${what}: HTTP ${res.status}.\n  ${url}\n\nNothing was written.`);
  try {
    return await res.json();
  } catch (cause) {
    die(`${what}: response was not JSON.\n  ${url}\n  ${cause.message}\n\nNothing was written.`);
  }
}

/** The app id lives in the catalog, not here. */
function appIdFrom(project) {
  const url = project?.links?.appStore;
  if (!url) die('nahtadi has no links.appStore in projects.json, so there is no id to sync against.');
  const m = /\/id(\d+)/.exec(url);
  if (!m) die(`could not read an app id out of links.appStore:\n  ${url}`);
  return m[1];
}

const projectsDoc = JSON.parse(await readFile(PROJECTS, 'utf8'));
const nahtadi = projectsDoc.projects.find((p) => p.id === 'nahtadi');
if (!nahtadi) die('projects.json has no nahtadi entry.');
const appId = appIdFrom(nahtadi);

// ---------------------------------------------------------------- lookup
const lookup = await getJson(
  `https://itunes.apple.com/lookup?id=${appId}&country=${RATING_STOREFRONT}`,
  'lookup API',
  STUB.lookup
);
if (!Array.isArray(lookup.results) || lookup.results.length === 0) {
  die(`lookup API returned no results for id ${appId}. The app may be unlisted.\n\nNothing was written.`);
}
const app = lookup.results[0];
for (const field of ['price', 'version', 'averageUserRating', 'userRatingCount']) {
  if (app[field] === undefined || app[field] === null) {
    die(`lookup API omitted "${field}". Refusing to guess.\n\nNothing was written.`);
  }
}

const live = {
  price: app.price,
  version: app.version,
  rating: app.averageUserRating.toFixed(1),
  count: app.userRatingCount,
};

// ---------------------------------------------------------------- reviews
const reviewsDoc = JSON.parse(await readFile(REVIEWS, 'utf8'));
const seen = new Map();
const feedSizes = [];
for (const country of STOREFRONTS) {
  const feed = await getJson(
    `https://itunes.apple.com/${country}/rss/customerreviews/id=${appId}/sortBy=mostRecent/json`,
    `reviews feed (${country})`,
    STUB.feed
  );
  let entries = feed?.feed?.entry ?? [];
  if (!Array.isArray(entries)) entries = [entries];
  for (const e of entries) {
    const id = e?.id?.label;
    if (id) seen.set(id, country);
  }
  feedSizes.push(`${country}: ${entries.length} entries`);
}

const lost = reviewsDoc.reviews.filter((r) => !seen.has(r.id));
if (lost.length > 0) {
  const names = lost.map((r) => `${r.id}  ${r.author} — "${r.title}"  [stored as ${r.storefront}]`);
  console.warn(
    `\n⚠ ${lost.length} stored review(s) could not be found by id in any configured storefront ` +
      `(${feedSizes.join(', ')}):\n\n` +
      names.map((n) => `  ${n}`).join('\n') +
      `\n\nApple's feeds are a rolling window and drop entries intermittently. This is NOT a reason\n` +
      `to delete them, and the reviews file is never written. A human decides whether the review stays.\n`
  );
  // Surfaced as an annotation on the run summary, so a green run still shows it.
  if (process.env.GITHUB_ACTIONS) {
    for (const n of names) console.log(`::warning title=Review missing from Apple's feed::${n}`);
  }
}

// ------------------------------------------------------------------ diff
const stored = {
  price: nahtadi.appStorePrice ?? null,
  version: nahtadi.appStoreVersion ?? null,
  rating: nahtadi.appStoreRating?.value ?? null,
  count: nahtadi.appStoreRating?.count ?? null,
};

const drift = [];
if (stored.rating !== null && stored.rating !== live.rating)
  drift.push({ field: 'appStoreRating.value', from: stored.rating, to: live.rating });
if (stored.count !== null && stored.count !== live.count)
  drift.push({ field: 'appStoreRating.count', from: stored.count, to: live.count });
if (FORCE_DIFF)
  drift.push({ field: 'appStoreRating.count', from: stored.count, to: stored.count + 1, forced: true });

console.log(`app id ${appId}, storefronts ${STOREFRONTS.join(' + ')}`);
console.log(`  live : rating ${live.rating}, count ${live.count}, version ${live.version}, price ${live.price}`);
console.log(`  repo : rating ${stored.rating}, count ${stored.count}`);
console.log(`  feeds: ${feedSizes.join(', ')}`);
console.log(
  `  reviews: ${reviewsDoc.reviews.length} stored, ${reviewsDoc.reviews.length - lost.length} found by id`
);

if (drift.length === 0) {
  console.log('\nNo drift. Nothing to do.');
  process.exit(0);
}

console.log('\nDrift:');
for (const d of drift) console.log(`  ${d.field}: ${d.from} -> ${d.to}${d.forced ? '   (FORCED, proof run)' : ''}`);

if (DRY_RUN) {
  console.log('\n--dry-run: no files written.');
  process.exit(0);
}

for (const d of drift) {
  if (d.field === 'appStoreRating.value') nahtadi.appStoreRating.value = d.to;
  if (d.field === 'appStoreRating.count') nahtadi.appStoreRating.count = d.to;
}
await writeFile(PROJECTS, JSON.stringify(projectsDoc, null, 2) + '\n');
console.log(`\nWrote ${PROJECTS}. The workflow opens a PR; nothing is pushed to dev or main.`);

// Surfaced to the workflow so the PR body can state what moved.
const summary = drift.map((d) => `- \`${d.field}\`: ${d.from} → ${d.to}`).join('\n');
if (process.env.GITHUB_OUTPUT) {
  const { appendFileSync } = await import('node:fs');
  appendFileSync(process.env.GITHUB_OUTPUT, `drift<<EOF\n${summary}\nEOF\n`);
}
