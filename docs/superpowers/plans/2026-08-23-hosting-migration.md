# Hosting Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **This plan has CHECKPOINTS requiring Omar** (account creation, dashboard configuration, DNS). At each `⏸ CHECKPOINT`, stop and work through the step with him interactively before continuing. Tasks 8–10 are operational (dashboards/DNS), not code — execute them as guided walkthroughs.

**Goal:** hendaseh.com served from Cloudflare Workers via `@opennextjs/cloudflare`, contact form and Resend removed, OG images static, images through ImageKit, DNS on Cloudflare, Vercel decommissioned.

**Architecture:** Phase A ships all app changes on Vercel first (Tasks 1–5), so the platform switch (Tasks 6–10) carries zero app changes. DNS is inventoried before it is touched and has a recorded rollback.

**Tech Stack:** Next.js 16 (≥16.2.11), `@opennextjs/cloudflare` + `wrangler`, `satori` + `sharp` (build-time only), ImageKit URL endpoint, Cloudflare Workers Builds CI, Cloudflare Web Analytics.

**Spec:** `docs/superpowers/specs/2026-08-23-hosting-migration-design.md`

## Global Constraints

- Frozen URLs: `/nahtadi`, `/nahtadi/privacy`, `/nahtadi/support`.
- Both 308 redirects must keep passing `tests/e2e/redirects.spec.ts`.
- No visual change except `/contact` losing its form (its other content stays; real redesign is sub-project 4).
- hendaseh.com and omar@hendaseh.com must never break: Vercel serves until Cloudflare is verified; email records verified before and after the nameserver move.
- Verification baseline per task: `npm run build && npm run test:run && npm run lint` (plus `npm run test:e2e` where a task touches routes).
- Commits on `dev`; messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Next.js patch bump to ≥ 16.2.11

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Bump**

```bash
npm install next@^16.2.11 eslint-config-next@^16.2.11
node -e "console.log(require('next/package.json').version)"
```
Expected: version ≥ 16.2.11.

- [ ] **Step 2: Verify**

Run: `npm run build && npm run test:run && npm run lint && npm run test:e2e`
Expected: all green.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: bump Next.js to >=16.2.11 (opennextjs-cloudflare floor)"
```

---

### Task 2: Remove the contact form and Resend

**Files:**
- Delete: `src/components/contact/ContactForm.tsx`, `src/app/contact/actions.ts`, `src/lib/validations/contact.ts` (and any tests of these — `grep -rln "ContactForm\|sendContactEmail\|validations/contact" src tests`)
- Modify: `src/app/contact/page.tsx`, `package.json`

**Interfaces:**
- Produces: `/contact` renders with no form, no server action; `resend`, `react-hook-form`, `@hookform/resolvers` gone from dependencies.

- [ ] **Step 1: Edit `src/app/contact/page.tsx`**

Keep metadata and the header section untouched. Replace the "Two-Column Layout" grid: delete the 2/3-width form column (the `lg:col-span-2` div and the `ContactForm` import); keep the three sidebar cards (Quick Contact, Connect, Response Time) and re-lay them as a single centered row:

```tsx
{/* Direct channels (form removed — design pass comes in sub-project 4) */}
<div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
  {/* Quick Contact card — unchanged JSX */}
  {/* Connect card — unchanged JSX, plus one new entry after GitHub: */}
  {/* Response Time card — unchanged JSX */}
</div>
```

New Connect entry (résumé), matching the site's existing download-name rule:

```tsx
<a
  href="/omar_younis_resume_2026.pdf"
  download="Omar_Younis_Resume.pdf"
  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
>
  <HiMail className="w-5 h-5 text-[#0093FF]" />
  <span className="text-[#0A1A2F] group-hover:text-blue-600 font-medium">Résumé (PDF)</span>
</a>
```

(Use `HiDocumentDownload` from `react-icons/hi` instead of `HiMail` for the icon.) Keep the bottom "Prefer Direct Email?" section but retitle the `<h2>` to `Email Me` and delete the words "also" and "directly" from its first sentence (the form it contrasted with is gone).

- [ ] **Step 2: Delete the form files and remove dependencies**

```bash
git rm src/components/contact/ContactForm.tsx src/app/contact/actions.ts src/lib/validations/contact.ts
npm uninstall resend react-hook-form @hookform/resolvers
```
Then `grep -rn "react-hook-form\|@hookform\|resend" src tests` → zero hits (delete any test files found in Step 0 grep).

- [ ] **Step 3: Verify**

Run: `npm run build && npm run test:run && npm run lint && npm run test:e2e`
Expected: green. Load `/contact` in dev: header, three cards, email CTA; no form.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: drop contact form and Resend; /contact presents direct channels"
```

---

### Task 3: Static OG generation

**Files:**
- Create: `src/lib/ogTemplate.tsx` (extracted from the route), `scripts/generate-og.tsx`
- Modify: `package.json` (script + devDeps), `next.config.ts` (redirects), every metadata file referencing `/api/og` (`grep -rln "/api/og" src tests`)
- Delete: `src/app/api/og/` (route + bundled fonts move; see Step 2)
- Test: `tests/e2e/og.spec.ts` (create or update existing OG assertions found by grep)

**Interfaces:**
- Consumes: `getOgCard(card: string): OgCard` from `src/lib/ogCards.ts` (exists, pure data).
- Produces: `public/og/site.png`, `public/og/nahtadi.png`, and `public/og/<id>.png` for every showcase-tier project; npm script `generate:og`.

- [ ] **Step 1: Extract the card template**

Move `CardTemplate`, `Mark`, `fitWithin`, `toDataUri`, and the two mark loaders (`loadHendasehMark`, `loadNahtadiMark`) from `src/app/api/og/route.tsx` into `src/lib/ogTemplate.tsx`, exporting `CardTemplate` and a `loadMarks()` helper that returns `{ hendaseh: Mark; nahtadi: Mark }`. Keep the `sharp`/`node:fs` imports — this module is **only ever imported by the build script**, never by app code; add a top-of-file comment saying exactly that.

- [ ] **Step 2: Write `scripts/generate-og.tsx`**

```tsx
import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getOgCard } from '../src/lib/ogCards';
import { getShowcaseProjects } from '../src/lib/projects';
import { CardTemplate, loadMarks } from '../src/lib/ogTemplate';

const FONT_DIR = 'src/fonts/roboto'; // moved from the deleted route dir, Step 3
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
    const mark = card.icon ? marks[card.icon.src === 'nahtadi' ? 'nahtadi' : 'hendaseh'] : null;
    const svg = await satori(<CardTemplate card={card} mark={mark} />, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Roboto', data: regular, weight: 400, style: 'normal' },
        { name: 'Roboto', data: medium, weight: 500, style: 'normal' },
      ],
    });
    await writeFile(path.join(OUT, `${id}.png`), await sharp(Buffer.from(svg)).png().toBuffer());
    console.log(`og: ${id}.png`);
  }
}
main();
```

`package.json`: `npm i -D satori tsx` (keep `sharp` but **move it from dependencies to devDependencies**); add script `"generate:og": "tsx scripts/generate-og.tsx"`. `tsx` resolves the `@/` path alias from tsconfig; if an alias import inside `src/lib/*` fails anyway, run as `tsx --tsconfig tsconfig.json scripts/generate-og.tsx` rather than changing app imports. The script is run manually when cards change — generated PNGs are committed (deterministic outputs, no build coupling).

- [ ] **Step 3: Run it, compare, and swap references**

```bash
mkdir -p src/fonts && git mv src/app/api/og/fonts/Roboto/static src/fonts/roboto && git mv src/app/api/og/fonts/Roboto/OFL.txt src/fonts/roboto/OFL.txt
npm run generate:og
```
Open each `public/og/*.png` beside the live `/api/og?card=<id>` output — visually identical (layout, colors, fonts). Then:
- `grep -rln "/api/og" src tests` → replace every `'/api/og?card=X'` with `'/og/X.png'` (the plain `?card=site` refs become `/og/site.png`).
- Delete `src/app/api/og/` entirely.

- [ ] **Step 4: Add legacy redirects in `next.config.ts`**

```ts
async redirects() {
  return [
    { source: '/capabilities', destination: '/about', permanent: true },
    {
      source: '/api/og',
      has: [{ type: 'query', key: 'card', value: '(?<card>[a-z0-9-]+)' }],
      destination: '/og/:card.png',
      permanent: false,
    },
    { source: '/api/og', destination: '/og/site.png', permanent: false },
  ];
}
```
(Keep the existing `/capabilities` entry — shown here for placement. Unknown card values will 404 at `/og/<x>.png` instead of falling back to the site card like the old route; acceptable, only real card ids were ever emitted.)

- [ ] **Step 5: e2e coverage**

In `tests/e2e/og.spec.ts` (or the existing spec that asserted `/api/og`, if grep found one):

```ts
import { test, expect } from '@playwright/test'

test('static OG cards serve and legacy URLs redirect', async ({ request }) => {
  for (const id of ['site', 'nahtadi']) {
    const res = await request.get(`/og/${id}.png`)
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('image/png')
  }
  const legacy = await request.get('/api/og?card=nahtadi', { maxRedirects: 0 })
  expect([307, 308]).toContain(legacy.status())
  expect(legacy.headers()['location']).toBe('/og/nahtadi.png')
})
```

- [ ] **Step 6: Verify + commit**

Run: `npm run build && npm run test:run && npm run lint && npm run test:e2e`
Expected: green; build output no longer lists `/api/og`.

```bash
git add -A
git commit -m "feat: pre-render OG cards to static PNGs; retire runtime /api/og route"
```

---

### Task 4: ImageKit loader — ⏸ CHECKPOINT (needs Omar)

**Files:**
- Create: `src/lib/imagekitLoader.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: ⏸ Get two things from Omar (guide him in the ImageKit dashboard)**

1. His **URL-endpoint ID** (dashboard → URL endpoints; looks like `https://ik.imagekit.io/<id>`).
2. Add a **web-folder origin** `https://hendaseh.com` to that endpoint (dashboard → External storage → Add origin → Web folder, then attach to the URL endpoint) so `/images/*` paths resolve without re-uploading.

- [ ] **Step 2: Create the loader**

`src/lib/imagekitLoader.ts` (endpoint is public, safe to commit):

```ts
import type { ImageLoaderProps } from 'next/image';

const ENDPOINT = 'https://ik.imagekit.io/<ID-FROM-STEP-1>';

export default function imagekitLoader({ src, width, quality }: ImageLoaderProps) {
  // Dev serves originals — ImageKit's web-folder origin can't reach localhost.
  if (process.env.NODE_ENV === 'development') return src;
  return `${ENDPOINT}/tr:w-${width},q-${quality ?? 75},f-auto${src}`;
}
```

`next.config.ts` images block becomes:

```ts
images: {
  loader: 'custom',
  loaderFile: './src/lib/imagekitLoader.ts',
},
```

(`remotePatterns` is dead config under a custom loader — remove it.)

- [ ] **Step 3: Verify locally + production-mode**

`npm run dev` → images load (plain paths). `npm run build && npm run start` → inspect an `<img>` on `/projects`: `src` is an `ik.imagekit.io/.../tr:w-…` URL. It will 404 locally (origin points at production hendaseh.com; expected) — paste one URL in a browser and confirm ImageKit serves the transformed image fetched from the live site.

- [ ] **Step 4: Verify e2e + commit**

Run: `npm run test:run && npm run lint && npm run test:e2e`

```bash
git add src/lib/imagekitLoader.ts next.config.ts
git commit -m "feat: serve next/image through ImageKit URL endpoint"
```

---

### Task 5: Ship Phase A on Vercel — ⏸ CHECKPOINT (Omar merges)

- [ ] **Step 1: Push and PR**

```bash
git push origin dev
gh pr create --base main --head dev --title "Phase A: pre-migration app changes" --body "Next >=16.2.11, contact form + Resend removed, static OG cards, ImageKit loader.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

- [ ] **Step 2: ⏸ Omar reviews/merges; verify production hendaseh.com**

After deploy: `/contact` (no form), an OG check (`https://hendaseh.com/og/site.png` 200; `/api/og?card=site` redirects), project images served from `ik.imagekit.io`, `/nahtadi` intact. LinkedIn Post Inspector on `https://hendaseh.com` shows the card.

---

### Task 6: Cloudflare bring-up — ⏸ CHECKPOINT (account + login)

**Files:**
- Create: `wrangler.jsonc`, `open-next.config.ts`
- Modify: `package.json` (scripts + devDeps), `.gitignore` (`.open-next/`)

- [ ] **Step 1: ⏸ Omar creates the Cloudflare account (free plan) at dash.cloudflare.com, then:**

```bash
npm i -D @opennextjs/cloudflare wrangler
npx wrangler login
```

- [ ] **Step 2: Adapter config**

`wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "hendaseh",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-08-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" }
}
```

`open-next.config.ts`:

```ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig();
```

`package.json` scripts:

```json
"preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
```

Add `.open-next/` to `.gitignore`.

- [ ] **Step 3: Local workerd preview**

Run: `npm run preview` → open the printed localhost URL; spot-check `/`, `/projects`, `/contact`, `/nahtadi`, `/og/site.png`, `/capabilities` (redirect). Fix any adapter errors before deploying (consult https://opennext.js.org/cloudflare if the build fails; the site has no middleware, no ISR, no server actions after Task 2 — failures should be config-level).

- [ ] **Step 4: First deploy**

Run: `npm run deploy`
Expected: a `https://hendaseh.<account>.workers.dev` URL serving the site.

- [ ] **Step 5: Commit**

```bash
git add wrangler.jsonc open-next.config.ts package.json package-lock.json .gitignore
git commit -m "feat: Cloudflare Workers deployment via @opennextjs/cloudflare"
```

---

### Task 7: Full verification against workers.dev

**Files:**
- Modify: `playwright.config.ts`

- [ ] **Step 1: Make baseURL/webServer env-driven**

```ts
use: {
  baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  trace: 'on-first-retry',
},
// …
webServer: process.env.BASE_URL
  ? undefined
  : {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
```

- [ ] **Step 2: Run the suite against the Worker**

Run: `BASE_URL=https://hendaseh.<account>.workers.dev npm run test:e2e`
Expected: all specs pass (redirects 308s, OG, routes).

- [ ] **Step 3: Manual matrix on workers.dev**

Every sitemap route 200; `/sitemap.xml` + `/robots.txt`; `/dev/tokens` both themes; images through ImageKit; `/projects/reddit-nlp` 404s; `response headers` show Cloudflare. Record results in the task notes.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts
git commit -m "test: allow pointing Playwright at a deployed BASE_URL"
```

---

### Task 8: CI via Workers Builds — ⏸ CHECKPOINT (dashboard, with Omar)

Guided dashboard session (no code): Cloudflare dash → Workers → `hendaseh` → Settings → Builds → connect GitHub repo `osyounis/hendaseh_website`.
- Build command: `npx opennextjs-cloudflare build`; deploy command: `npx opennextjs-cloudflare deploy`; production branch: `main`; enable **preview URLs for non-production branches**.

- [ ] **Step 1: ⏸ Configure as above**
- [ ] **Step 2: Verify production path** — push a trivial commit to a test branch, open a PR, confirm a preview URL appears and serves; merge nothing yet.
- [ ] **Step 3: Disable Vercel's auto-deploy for PRs?** No — leave Vercel exactly as is until Task 10 (parallel deploys are harmless and preserve rollback).

---

### Task 9: DNS migration and cutover — ⏸ CHECKPOINT (GoDaddy session with Omar)

All steps are done together with Omar at the keyboard. Nothing here is code.

- [ ] **Step 1: Inventory (BEFORE any change)**

In GoDaddy DNS management for hendaseh.com, record **every** record (type, name, value, TTL) into `docs/content/dns-inventory-2026-08.md` (gitignored dir). Explicitly identify and label: MX records (expected Google Workspace: `smtp.google.com` or `aspmx.l.google.com` forms — this settles the email question), SPF TXT (note whether it includes both `_spf.google.com` and Resend/`amazonses` includes), DKIM CNAMEs/TXTs (Google `google._domainkey`, Resend `resend._domainkey` or similar), A/CNAME for apex + www (currently Vercel), and **anything unidentified — stop and identify it before proceeding**. Also record GoDaddy's current nameservers (rollback path).

- [ ] **Step 2: Create the Cloudflare zone**

Cloudflare dash → Add site → hendaseh.com → Free plan. Diff Cloudflare's auto-imported records against the inventory **line by line**; add anything missed (MX records are the classic miss). Set apex + www to proxied (orange cloud). Leave the Vercel A/CNAME values in place for now — Cloudflare will serve them until the Worker domain attaches.

- [ ] **Step 3: Switch nameservers at GoDaddy**

Replace GoDaddy nameservers with the two Cloudflare assigns. Wait for the zone to go Active (minutes to hours). Site keeps serving from Vercel throughout (records unchanged).

- [ ] **Step 4: Email check #1**

Send omar@hendaseh.com an email from an external account → arrives. Send one from Google Workspace out → arrives, not spam-foldered.

- [ ] **Step 5: Attach the domain to the Worker**

Workers → hendaseh → Settings → Domains & Routes → add custom domain `hendaseh.com` and `www.hendaseh.com` (this replaces the Vercel-pointing records for those two hosts; everything else in the zone stays).

- [ ] **Step 6: Production verification**

`BASE_URL=https://hendaseh.com npm run test:e2e` passes; manual matrix from Task 7 Step 3 repeated on the production domain; `curl -sI https://hendaseh.com | grep -i server` shows cloudflare; App Store → Nahtadi support/privacy links work; email check #1 repeated.

**Rollback if anything is wrong:** remove the custom domain from the Worker (traffic returns to the Vercel records still in the zone); worst case, restore GoDaddy nameservers from the inventory file.

---

### Task 10: Decommission + docs

**Files:**
- Modify: `src/app/layout.tsx`, `package.json`, `docs/DECISIONS.md`, `docs/ROADMAP.md`, `.claude/CLAUDE.md`, `README.md`

- [ ] **Step 1: Swap analytics**

Remove `@vercel/analytics` and `@vercel/speed-insights` from `layout.tsx` (imports + `<Analytics />` + `<SpeedInsights />`) and `npm uninstall` both. Enable Cloudflare Web Analytics: dash → Analytics → Web Analytics → add hendaseh.com with **automatic setup** (zone is proxied, so injection works). If the beacon doesn't appear in page source within a few minutes, fall back to the manual snippet in `layout.tsx` before `</body>`:

```tsx
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "<TOKEN-FROM-DASHBOARD>"}'
/>
```

Note on SRI: do **not** add an `integrity` hash to this tag. Cloudflare's beacon is a self-updating script served from Cloudflare's own edge (the same infrastructure serving the site); a pinned hash would silently kill analytics on their next release. Prefer the dashboard auto-injection path, which puts no script tag in our code at all.

- [ ] **Step 2: Clean DNS + delete Vercel project (with Omar)**

In the Cloudflare zone: remove Resend-only records (its DKIM/return-path); if SPF is a single shared TXT, remove only the Resend include, keep Google's. Then Vercel dashboard → project → delete (domains were already detached in Task 9). Omar may also disconnect the Vercel MCP server.

- [ ] **Step 3: Docs**

- `docs/DECISIONS.md`: append the five entries from the spec's "Decisions made in this design" section, dated, in the file's decision/why/revisit format.
- `docs/ROADMAP.md`: sub-project 2 → **Complete** with date; update the phase-2 section's "Needs from Omar" to done; standing notes — remove Vercel MCP mention, note Resend decommissioned.
- `.claude/CLAUDE.md`: project blurb now says Cloudflare Workers (Workers Builds CI: `main` → prod, PRs → previews); remove contact-form/Resend references; note `sharp`/`satori` are build-time only and `npm run generate:og` regenerates cards.
- `README.md`: deploy section updated (Cloudflare, `npm run preview`/`deploy`, Workers Builds).

- [ ] **Step 4: Final verification (spec success criteria)**

Every success-criteria bullet in the spec checked and noted. `npm run build && npm run test:run && npm run lint && BASE_URL=https://hendaseh.com npm run test:e2e` all green.

- [ ] **Step 5: Commit, push, PR to main**

```bash
git add -A
git commit -m "feat: complete Cloudflare migration — analytics swap, Vercel decommissioned, docs"
git push origin dev
gh pr create --base main --head dev --title "Phase B–D: Cloudflare Workers migration" --body "Workers deploy, CI, DNS cutover complete; Vercel decommissioned.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```
