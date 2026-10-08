# GitHub Star-Count Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the star counts on hendaseh.com current through a weekly GitHub Action. The Action opens a PR that requests Omar's review, and a failure can never blank or corrupt a count on the live site.

**Architecture:**
- **Storage:** a structured `githubStars` number in `projects.json`, read through a `{stars}` token in `cardStat` and filled in by one helper. The helper throws, so the build fails, when the number is missing.
- **Sync:** a zero-dependency Node script, modelled on `scripts/appstore-sync.mjs`. It validates every API response before writing anything.
- **Delivery:** a workflow hands any change to `peter-evans/create-pull-request`, pinned to the same SHA, with `reviewers`/`assignees` set.

**Tech Stack:** Next.js 16, TypeScript, Zod 4, Vitest, Playwright, Node 20+ (`fetch` built in), GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-08-github-stars-sync-design.md`

## Global Constraints

- Production code never reads an environment variable; only `scripts/` may (`GITHUB_TOKEN`, `GITHUB_OUTPUT`, `GITHUB_STARS_SYNC_STUB`).
- The sync never pushes and never merges. PR base is `dev`, branch `automation/github-stars-sync`, label `automation`.
- `peter-evans/create-pull-request@22a9089034f40e5a961c8808d113e2c98fb63676 # v7.0.11`, the exact pin used by `appstore-sync.yml`.
- Any validation failure means nothing is written and the script exits 1.
- Suspicious means the count falls to 0 from above 0, or `new < old / 2`.
- Cron is `47 6 * * 1`.
- No test touches the network.
- `npm run lint`, `npm run test:run`, `npm run build` and `npm run test:e2e` must all pass before each commit. Vitest does not typecheck; only `build` does.
- Work on `dev`.

## Review Focus

- `links.github` with a trailing slash or `.git` suffix should still resolve to `owner/repo`. Pinned in Task 2 (`parses a trailing slash`).
- A project with `githubStars` but no `links.github` must fail loudly and never be skipped silently. Pinned in Task 2.
- A run with no `GITHUB_TOKEN` (a local run) must work unauthenticated rather than crash. The stub path covers the logic, and the header is only added when the token is present (see code).
- A renamed repo: GitHub's API 301-redirects and `fetch` follows it, so the response's `full_name` differs from the link. Refused in Task 2.
- A literal `{stars}` must never reach a visitor. Pinned by the helper's throw in Task 1 and the e2e check in Task 4.

---

### Task 1: `githubStars` field, `getCardStat` helper, data and render sites

**Files:**
- Modify: `src/lib/projectSchema.ts` (add the field after `appStoreRating`)
- Modify: `src/lib/projects.ts` (add `getCardStat`)
- Modify: `src/data/projects.json` (cycloidal, watermark, reddit-nlp)
- Modify: `src/components/projects/ProjectCard.tsx` (the `stat` const)
- Modify: `src/components/home/HomeWork.tsx` (`requireProject` and the two `stat:` sites)
- Test: `src/lib/__tests__/cardStat.test.ts` (new)

**Interfaces:**
- Produces: `getCardStat(p: Project): string | undefined`, exported from `src/lib/projects.ts`. It throws `Error` if `p.cardStat` contains `{stars}` and `p.githubStars` is undefined.
- Produces: `Project.githubStars?: number`, a non-negative integer.

- [ ] **Step 1: Write the failing tests** in `src/lib/__tests__/cardStat.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getAllProjects, getCardStat, type Project } from '@/lib/projects'

const base = getAllProjects().find((p) => p.id === 'cycloidal-drive-creator')!

describe('getCardStat', () => {
  it('substitutes {stars} with githubStars', () => {
    const p = { ...base, cardStat: '{stars}★ · MIT', githubStars: 41 } as Project
    expect(getCardStat(p)).toBe('41★ · MIT')
  })

  it('returns a cardStat without the token unchanged', () => {
    const p = { ...base, cardStat: '207 tests', githubStars: undefined } as Project
    expect(getCardStat(p)).toBe('207 tests')
  })

  it('returns undefined when there is no cardStat', () => {
    const p = { ...base, cardStat: undefined } as Project
    expect(getCardStat(p)).toBeUndefined()
  })

  it('throws, naming the project, when the token has no number to fill it', () => {
    const p = { ...base, cardStat: '{stars}★', githubStars: undefined } as Project
    expect(() => getCardStat(p)).toThrow(/cycloidal-drive-creator/)
  })
})

describe('catalog invariant: githubStars and {stars} travel together', () => {
  it.each(getAllProjects().map((p) => [p.id, p] as const))('%s', (_id, p) => {
    const hasToken = (p.cardStat ?? '').includes('{stars}')
    expect(hasToken, 'a synced count must be displayed, and a token must have a count').toBe(
      p.githubStars !== undefined
    )
    if (p.githubStars !== undefined) expect(p.links.github, 'githubStars needs links.github').toBeTruthy()
  })

  it('opts in exactly the two cards that show stars today', () => {
    const synced = getAllProjects().filter((p) => p.githubStars !== undefined).map((p) => p.id)
    expect(synced.sort()).toEqual(['cycloidal-drive-creator', 'image-watermark-remover'])
  })
})
```

- [ ] **Step 2: Run the tests and confirm they fail.**
  Run: `npx vitest run src/lib/__tests__/cardStat.test.ts`
  Expected: FAIL, `getCardStat` is not exported.

- [ ] **Step 3: Implement.**

In `src/lib/projectSchema.ts`, after the `appStoreRating` line, add:

```ts
    /**
     * Stars on the project's `links.github` repo, written ONLY by
     * scripts/github-stars-sync.mjs (weekly, via a reviewed PR). A project opts
     * into the sync by having this field. It is displayed through a `{stars}`
     * token in `cardStat`, filled in by `getCardStat` in projects.ts, so the
     * script writes a number and never edits prose.
     */
    githubStars: z.number().int().nonnegative().optional(),
```

In `src/lib/projects.ts`, after `getProjectHref`, add:

```ts
/**
 * `cardStat` with its `{stars}` token filled in from `githubStars`.
 *
 * THROWS rather than rendering a blank or literal token: a card that names a
 * star count it does not have fails the build, and Cloudflare keeps the last
 * good deploy live. A stale count is acceptable; a missing one never ships.
 */
export function getCardStat(p: Project): string | undefined {
  if (p.cardStat === undefined) return undefined;
  if (!p.cardStat.includes('{stars}')) return p.cardStat;
  if (p.githubStars === undefined) {
    throw new Error(`projects.json: "${p.id}" uses {stars} in cardStat but has no githubStars.`);
  }
  return p.cardStat.replaceAll('{stars}', String(p.githubStars));
}
```

In `src/data/projects.json`:
- **cycloidal-drive-creator:** `"cardStat": "{stars}★ · MIT"`, `"stats": "29 commits • MIT"`. Add `"githubStars": 32` after `"links"`'s closing brace, before `"brand"`.
- **image-watermark-remover:** `"cardStat": "{stars}★"`, `"stats": "MIT"`. Add `"githubStars": 10` in the same position.
- **reddit-nlp:** `"stats": "77% Accuracy"`.

In `src/components/projects/ProjectCard.tsx`, change the import to include `getCardStat` and the stat line to:

```ts
  const stat = project.appStoreRating
    ? `${project.appStoreRating.value}★ App Store`
    : getCardStat(project);
```

In `src/components/home/HomeWork.tsx`, import `getCardStat`. Replace the two `stat: project.cardStat!` occurrences with `stat: getCardStat(project)!`. The `requireProject` check on `project.cardStat` stays as it is.

- [ ] **Step 4: Run the tests and confirm they pass.**
  Run: `npx vitest run src/lib/__tests__/cardStat.test.ts`, then `npm run test:run`
  Expected: PASS, all files.

- [ ] **Step 5: Run the build, which is the typecheck.**
  Run: `npm run build`
  Expected: compiles. Then check the rendered output:
  `grep -o '32★ · MIT' .next/server/app/projects.html .next/server/app/index.html`
  It should find a match in both files. `grep -c '{stars}' .next/server/app/projects.html` should return 0.

- [ ] **Step 6: Commit**

```bash
git add src/lib/projectSchema.ts src/lib/projects.ts src/data/projects.json src/components/projects/ProjectCard.tsx src/components/home/HomeWork.tsx src/lib/__tests__/cardStat.test.ts
git commit -m "feat: star counts as a structured githubStars field behind a {stars} token"
```

---

### Task 2: `scripts/github-stars-sync.mjs`

**Files:**
- Create: `scripts/github-stars-sync.mjs`
- Test: `src/lib/__tests__/github-stars-sync.test.ts` (new)

**Interfaces:**
- Consumes: `githubStars` and `links.github` in `src/data/projects.json` (Task 1).
- Produces: a CLI, `node scripts/github-stars-sync.mjs [--dry-run]`, with these exit codes:
  - exits 0 with no changes, or after writing changes
  - exits 1 on any refusal, having written nothing
- When `GITHUB_OUTPUT` is set and something changed, it appends `drift<<EOF … EOF`.
- Stub: `GITHUB_STARS_SYNC_STUB=<path to JSON>`. The JSON maps `"owner/repo"` to either a repo object `{ full_name, private, stargazers_count }` or `{ "status": <non-200> }`.

- [ ] **Step 1: Write the failing tests** in `src/lib/__tests__/github-stars-sync.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdtempSync, cpSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * The star sync, exercised without the network. Each run copies src/data into a
 * temp dir and points the script at a stub, so the real projects.json is never
 * written and no test depends on GitHub being up.
 */
const REPO = process.cwd()
const CYCLOIDAL = 'osyounis/cycloidal_drive_creator'
const WATERMARK = 'osyounis/image_watermark_remover'

type Stub = Record<string, unknown>
const repo = (full_name: string, stargazers_count: unknown, priv = false) => ({
  full_name,
  private: priv,
  stargazers_count,
})

function run(stub: Stub, opts: { dryRun?: boolean; edit?: (doc: any) => void } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'stars-'))
  cpSync(join(REPO, 'src/data'), join(dir, 'src/data'), { recursive: true })
  if (opts.edit) {
    const p = join(dir, 'src/data/projects.json')
    const doc = JSON.parse(readFileSync(p, 'utf8'))
    opts.edit(doc)
    writeFileSync(p, JSON.stringify(doc, null, 2) + '\n')
  }
  writeFileSync(join(dir, 'stub.json'), JSON.stringify(stub))
  const before = readFileSync(join(dir, 'src/data/projects.json'), 'utf8')
  const res = spawnSync(
    process.execPath,
    [join(REPO, 'scripts/github-stars-sync.mjs'), ...(opts.dryRun ? ['--dry-run'] : [])],
    {
      cwd: dir,
      encoding: 'utf8',
      env: { ...process.env, GITHUB_OUTPUT: '', GITHUB_STARS_SYNC_STUB: join(dir, 'stub.json') },
    }
  )
  const after = readFileSync(join(dir, 'src/data/projects.json'), 'utf8')
  const stars = (id: string) => JSON.parse(after).projects.find((p: any) => p.id === id).githubStars
  return { code: res.status, out: res.stdout + res.stderr, changed: before !== after, after, stars }
}

const current = () => ({ [CYCLOIDAL]: repo(CYCLOIDAL, 32), [WATERMARK]: repo(WATERMARK, 10) })

describe('github-stars-sync', () => {
  it('writes nothing and exits 0 when every count is current', () => {
    const r = run(current())
    expect(r.code).toBe(0)
    expect(r.changed).toBe(false)
    expect(r.out).toMatch(/No change/)
  })

  it('writes only the changed count', () => {
    const r = run({ ...current(), [CYCLOIDAL]: repo(CYCLOIDAL, 35) })
    expect(r.code).toBe(0)
    expect(r.stars('cycloidal-drive-creator')).toBe(35)
    expect(r.stars('image-watermark-remover')).toBe(10)
    expect(r.out).toMatch(/cycloidal-drive-creator: 32 -> 35/)
  })

  it('accepts a small, normal drop', () => {
    const r = run({ ...current(), [CYCLOIDAL]: repo(CYCLOIDAL, 31) })
    expect(r.code).toBe(0)
    expect(r.stars('cycloidal-drive-creator')).toBe(31)
  })

  it('--dry-run reports the change and writes nothing', () => {
    const r = run({ ...current(), [CYCLOIDAL]: repo(CYCLOIDAL, 35) }, { dryRun: true })
    expect(r.code).toBe(0)
    expect(r.changed).toBe(false)
  })

  const refusals: [string, Stub, RegExp][] = [
    ['a non-200 response', { ...current(), [WATERMARK]: { status: 404 } }, /HTTP 404/],
    ['a private repo', { ...current(), [WATERMARK]: repo(WATERMARK, 10, true) }, /private/i],
    ['a renamed repo', { ...current(), [WATERMARK]: repo('osyounis/renamed', 10) }, /renamed/i],
    ['a non-integer count', { ...current(), [WATERMARK]: repo(WATERMARK, '10') }, /not a whole number/i],
    ['a missing count', { ...current(), [WATERMARK]: repo(WATERMARK, undefined) }, /not a whole number/i],
    ['a drop to zero', { ...current(), [CYCLOIDAL]: repo(CYCLOIDAL, 0) }, /suspicious/i],
    ['a drop of more than half', { ...current(), [CYCLOIDAL]: repo(CYCLOIDAL, 15) }, /suspicious/i],
  ]

  it.each(refusals)('refuses %s: exits 1 and writes nothing, even for the good repo', (_n, stub, msg) => {
    // CYCLOIDAL changes to 40 in every refusal case so a partial write would show.
    const s = { ...stub } as Stub
    if ((s[CYCLOIDAL] as any)?.stargazers_count === 32) s[CYCLOIDAL] = repo(CYCLOIDAL, 40)
    const r = run(s)
    expect(r.code).toBe(1)
    expect(r.changed).toBe(false)
    expect(r.out).toMatch(msg)
    expect(r.out).toMatch(/Nothing was written/)
  })

  it('refuses a synced project with no links.github', () => {
    const r = run(current(), {
      edit: (doc) => {
        delete doc.projects.find((p: any) => p.id === 'image-watermark-remover').links.github
      },
    })
    expect(r.code).toBe(1)
    expect(r.out).toMatch(/no links\.github/)
  })

  it('parses a trailing slash and a .git suffix on links.github', () => {
    const r = run(current(), {
      edit: (doc) => {
        doc.projects.find((p: any) => p.id === 'cycloidal-drive-creator').links.github =
          'https://github.com/osyounis/cycloidal_drive_creator/'
        doc.projects.find((p: any) => p.id === 'image-watermark-remover').links.github =
          'https://github.com/osyounis/image_watermark_remover.git'
      },
    })
    expect(r.code).toBe(0)
  })
})
```

- [ ] **Step 2: Run the tests and confirm they fail.**
  Run: `npx vitest run src/lib/__tests__/github-stars-sync.test.ts`
  Expected: FAIL. Node exits 1 with "Cannot find module", so the success cases fail.

- [ ] **Step 3: Implement** `scripts/github-stars-sync.mjs`:

```js
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
```

- [ ] **Step 4: Run the tests and confirm they pass.**
  Run: `npx vitest run src/lib/__tests__/github-stars-sync.test.ts`, then `npm run test:run`
  Expected: PASS.

- [ ] **Step 5: One live read-only check.**
  Run: `node scripts/github-stars-sync.mjs --dry-run`
  Expected: two rows, then "No change" (32 and 10 are current), exit 0.

- [ ] **Step 6: Run lint, then commit.**

```bash
npm run lint
git add scripts/github-stars-sync.mjs src/lib/__tests__/github-stars-sync.test.ts
git commit -m "feat: github-stars-sync script that validates every repo before writing any"
```

---

### Task 3: Workflows

**Files:**
- Create: `.github/workflows/github-stars-sync.yml`
- Modify: `.github/workflows/appstore-sync.yml` (the `with:` block of the create-pull-request step)

**Interfaces:**
- Consumes: the CLI and the `drift` output from Task 2.

- [ ] **Step 1: Create** `.github/workflows/github-stars-sync.yml`:

```yaml
# Weekly GitHub star-count sync.
#
# NEVER PUSHES. It runs the script, and if the script wrote anything, hands the
# working tree to create-pull-request, which requests Omar's review so he gets a
# GitHub Mobile push and an email. A human merges. On any doubt about any repo the
# script exits non-zero and this job fails with nothing written: a stale count
# beats a missing or guessed one. A failed scheduled run emails whoever last
# edited this schedule.
#
# The cron and the "Run workflow" button only exist once this file is on main.
name: GitHub star-count sync

on:
  schedule:
    - cron: '47 6 * * 1' # Mondays 06:47 UTC, 30 min after appstore-sync.
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

concurrency:
  group: github-stars-sync
  cancel-in-progress: false

jobs:
  sync:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v5

      - uses: actions/setup-node@v5
        with:
          node-version-file: .nvmrc

      # No npm ci: the script has no dependencies (fetch and node:fs are built in).
      - name: Sync star counts
        id: sync
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node scripts/github-stars-sync.mjs

      - name: Open a pull request if a count changed
        # Same commit pin as appstore-sync.yml, for the same reason: this job
        # holds write permissions and a tag is mutable. v7.0.11.
        uses: peter-evans/create-pull-request@22a9089034f40e5a961c8808d113e2c98fb63676 # v7.0.11
        with:
          branch: automation/github-stars-sync
          base: dev
          commit-message: 'chore: sync GitHub star counts'
          title: 'chore: GitHub star counts have changed'
          labels: automation
          reviewers: osyounis
          assignees: osyounis
          delete-branch: true
          body: |
            GitHub's API reports different star counts from `src/data/projects.json`.

            ${{ steps.sync.outputs.drift || '_(see the job log)_' }}

            Every repo was validated before anything was written. Merging this
            into `dev` and then `dev` into `main` updates the live site. Until
            then, the site keeps showing the previous counts.
```

- [ ] **Step 2: Add the reviewer request to** `appstore-sync.yml`. In its create-pull-request `with:` block, directly after `labels: automation`, insert:

```yaml
          reviewers: osyounis
          assignees: osyounis
```

- [ ] **Step 3: Validate both files parse as YAML.**
  Run: `ruby -ryaml -e 'ARGV.each { |f| YAML.load_file(f); puts "ok #{f}" }' .github/workflows/github-stars-sync.yml .github/workflows/appstore-sync.yml`
  (macOS ships Ruby with Psych.)
  Expected: one `ok …` per file.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/github-stars-sync.yml .github/workflows/appstore-sync.yml
git commit -m "ci: weekly star-count sync PR, and both syncs request Omar's review"
```

---

### Task 4: e2e guard and docs

**Files:**
- Modify: `tests/e2e/homepage.spec.ts` (inside `test.describe('Homepage'`)
- Modify: `tests/e2e/projects-filter.spec.ts` (inside its top-level describe)
- Modify: `docs/DECISIONS.md` (append an entry)
- Modify: `.claude/CLAUDE.md` (gitignored, local only: the automations bullet)

- [ ] **Step 1: Add the e2e assertions.**

In `tests/e2e/homepage.spec.ts`, inside `test.describe('Homepage', …)`:

```ts
  test('the Cycloidal row renders its synced star count, never a raw token', async ({ page }) => {
    await page.goto('/')
    const row = page.getByRole('link', { name: /Cycloidal Drive Creator/ })
    await expect(row).toContainText(/\d+★ · MIT/)
    await expect(page.locator('body')).not.toContainText('{stars}')
  })
```

In `tests/e2e/projects-filter.spec.ts`:

```ts
test('star counts render as numbers on /projects, never a raw {stars} token', async ({ page }) => {
  await page.goto('/projects')
  const card = page.getByTestId('project-card').filter({ hasText: 'Cycloidal Drive Creator' })
  await expect(card).toContainText(/\d+★ · MIT/)
  await expect(page.locator('main')).not.toContainText('{stars}')
})
```

- [ ] **Step 2: Run them.**
  Kill stray `next dev`/`workerd` processes first. Then run `npx playwright test tests/e2e/homepage.spec.ts tests/e2e/projects-filter.spec.ts -g "star count"`.
  Expected: PASS.

- [ ] **Step 3: Append to `docs/DECISIONS.md`:**

```markdown
## 2026-10-08 — Star counts sync weekly by reviewed PR; stale beats missing

**Decision:** Visible GitHub star counts live in a structured `githubStars`
field, displayed through a `{stars}` token in `cardStat` by `getCardStat`.
`scripts/github-stars-sync.mjs` runs weekly from
`.github/workflows/github-stars-sync.yml` and opens a PR into `dev`. It never
pushes and never merges. It validates every repo before writing anything, and
it refuses a private or renamed repo, a non-integer count, or a collapse (to 0,
or by more than half). Every sync PR, and every `appstore-sync` PR, requests
`osyounis` as reviewer and assignee, which is how Omar is notified.

**Why:** The live site must never show a blank or guessed number. It renders
only what is committed, and a missing count fails the build, so Cloudflare
keeps the last good deploy. Build-time and client-side fetching were rejected:
both bring back rate limits and blank-on-failure. Spec:
`docs/superpowers/specs/2026-10-08-github-stars-sync-design.md`.
```

- [ ] **Step 4: Update `.claude/CLAUDE.md`.** In the automations bullet, replace `**Two automations run in CI, and both only ever open a PR.**` with `**Three automations run in CI, and all only ever open a PR.**`. Then add one sentence before `**Neither pushes`: "`github-stars-sync` (weekly + `workflow_dispatch`) refreshes `githubStars` for every project that has it, validating every repo before writing any; both syncs request `osyounis` as reviewer." Finally, change `**Neither pushes to a branch and neither merges.` to `**None pushes to a branch and none merges.`

- [ ] **Step 5: Full verification.**
  Run: `npm run lint && npm run test:run && npm run build && npm run test:e2e`
  Expected: all green.

- [ ] **Step 6: Commit and push, then open a PR into `main`.**

```bash
git add tests/e2e/homepage.spec.ts tests/e2e/projects-filter.spec.ts docs/DECISIONS.md
git commit -m "test,docs: guard the {stars} token in e2e and record the sync decision"
git push origin dev
gh pr create --base main --head dev --title "GitHub star-count sync" --body "<summary + test plan>"
```

- [ ] **Step 7: After Omar merges, run the proof.**
  Run: `gh workflow run github-stars-sync.yml`, then
  `gh run watch $(gh run list --workflow github-stars-sync.yml --limit 1 --json databaseId --jq '.[0].databaseId')`
  Expected: green, "No change", no PR opened. If a count did change in the meantime, a PR opens and requests his review, which also proves the notification path.
