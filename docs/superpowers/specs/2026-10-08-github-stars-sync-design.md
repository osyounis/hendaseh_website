# GitHub star-count sync — design

**Date:** 2026-10-08 · **Status:** approved in conversation, awaiting spec review

## Goal

The star counts shown on the site stay correct without hand edits, and never
render blank or wrong. A stale count is acceptable; a missing or guessed one is
not.

## Decisions (agreed with Omar)

- **A weekly GitHub Action opens a PR. It never pushes and never merges.**
  It follows the same rule as `appstore-sync` and `intake`. Production changes
  only when Omar merges.
- **The count is a structured field, not text inside a string.** The script
  writes only a number, and never edits prose.
- **The live site never calls GitHub.** It renders the count committed to the
  repo, so an automation failure cannot affect visitors.
- **Omar is notified** through a review request on every sync PR (GitHub Mobile
  push and email). `appstore-sync` gets the same.
- Build-time fetching and client-side fetching were rejected. Both reintroduce
  rate limits, nondeterminism and blank-on-failure.

## Components

### 1. Data — `src/data/projects.json`, `src/lib/projectSchema.ts`

- New optional field `githubStars: z.number().int().nonnegative()`. Any project
  that has the field is synced: today `cycloidal-drive-creator` (32) and
  `image-watermark-remover` (10).
- The repo comes from the existing `links.github`. No second copy of it.
- `cardStat` carries a `{stars}` token: `"{stars}★ · MIT"`, `"{stars}★"`.
- Star counts are removed from the unrendered `stats` field (cycloidal,
  watermark, reddit-nlp), so the only copy of each count is `githubStars`.

### 2. Rendering — `src/lib/projects.ts`

- `getCardStat(project): string | undefined` replaces `{stars}` with
  `githubStars`. It **throws** if the token is present and the number is
  absent. That fails the build, and Cloudflare keeps the previous deploy live.
- `ProjectCard` and `HomeWork`, the only two places that render `cardStat`,
  read it through the helper.

### 3. Script — `scripts/github-stars-sync.mjs`

Zero dependencies, modelled on `scripts/appstore-sync.mjs`.

- For each project with `githubStars`, it sends
  `GET https://api.github.com/repos/{owner}/{repo}`. It authenticates with
  `GITHUB_TOKEN` when one is present, and sends a User-Agent header.
- **Every response is validated before anything is written.** Any of these
  fails the whole run with nothing written:
  - the request fails, or the status is not 200
  - `private` is true
  - `full_name` differs from `links.github`, meaning the repo was renamed and
    the link must be updated by hand
  - `stargazers_count` is not a non-negative integer
  - the count is suspicious: it falls to 0 from above 0, or drops by more than
    half
- Otherwise it writes only the changed counts. It also writes a
  `- \`<id>\`: 32 → 35` summary to `GITHUB_OUTPUT` for the PR body.
- Flags: `--dry-run`. Test seam: the `GITHUB_STARS_SYNC_STUB` env var points
  at a JSON map `{ "owner/repo": <response object or {"status": 404}> }`. No
  test touches the network.

### 4. Workflows

- New `.github/workflows/github-stars-sync.yml`:
  - Triggers: cron `47 6 * * 1`, 30 minutes after `appstore-sync`, plus
    `workflow_dispatch`.
  - Permissions: `contents: write`, `pull-requests: write`.
  - It uses `peter-evans/create-pull-request` pinned to the same SHA as
    `appstore-sync.yml`, opening branch `automation/github-stars-sync` against
    base `dev`.
  - Label `automation`; `reviewers: osyounis`; `assignees: osyounis`.
- `appstore-sync.yml` gains the same `reviewers` and `assignees`.

### 5. Tests (Vitest, written before the code)

- **Helper:** it substitutes the count, and it throws on a missing count.
- **Data invariant:** `githubStars` and the `{stars}` token always appear
  together.
- **Script, against the stub:**
  - a changed count is written
  - an unchanged count writes nothing and exits 0
  - a 404 or network failure writes nothing and exits 1
  - a private repo is refused
  - a renamed repo is refused
  - a drop to 0 or by more than half is refused
- **e2e:** the Cycloidal card on /projects and its homepage row render the
  substituted count (`32★ · MIT`), never a literal `{stars}`.

### 6. Docs

- A `docs/DECISIONS.md` entry recording the rules above: stale beats missing,
  only a human merges, and the review-request notification.
- `.claude/CLAUDE.md`: the automations paragraph changes from two automations
  to three.

## Failure behaviour

| Failure | Result | Visitors see |
|---|---|---|
| API down / rate-limited | red run, nothing written | last merged count |
| Bad data / private / renamed | red run naming the repo | last merged count |
| Suspicious drop | red run; Omar checks by hand | last merged count |
| Hand edit breaks the field | schema or helper fails the build | previous deploy |
| Cron stops (60 days of repo inactivity) | nothing changes | last merged count |

A scheduled-run failure emails the user who last edited the workflow's
schedule, which is Omar.

## Out of scope / known

- PRs opened with the built-in `GITHUB_TOKEN` do not trigger `ci.yml`. The
  same is true of `appstore-sync` today. Fixing that needs a PAT or a GitHub
  App token.
- Commit counts are not tracked.
- The cron and the manual "Run workflow" button both need the workflow file
  on `main`. The proof run (`workflow_dispatch`) therefore happens after the
  merge, and it should open no PR, because the counts will already be current.
