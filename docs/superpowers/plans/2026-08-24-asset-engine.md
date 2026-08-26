# Asset Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Execution split:** Tasks 1–2 are a *design session* — run them with Fable and the design skills (`frontend-design`, `ui-ux-pro-max`) loaded; they are taste work with Omar in the loop. Tasks 3–4 are standard implementation. Tasks 5, 6 and 8 have `⏸ CHECKPOINT`s where Omar approves artwork or uploads files. Do not batch past a checkpoint.

**Goal:** A one-command pipeline that turns a `projects.json` entry into an approved artwork + four composed assets (icon, squircle icon, card, GitHub banner), and the current 13-project catalog regenerated through it.

**Architecture:** Non-deterministic artwork (Higgsfield, Omar-gated, committed to `assets/artwork/`) is separated from deterministic composition (`sharp` + `satori`, extending the phase-2 OG machinery into a shared `assetTemplates.tsx`). The file contract `assets/artwork/<id>.png` is the interface between the two halves.

**Tech Stack:** Higgsfield CLI (interface discovered in Task 1), `sharp`, `satori`, `tsx` (all already devDependencies except the CLI), Vitest.

**Spec:** `docs/superpowers/specs/2026-08-24-asset-engine-design.md`

> **STATUS 2026-08-25:** Tasks 1–2 are COMPLETE (done interactively with Fable + Omar; 25-generation anchor session). The generator changed from Higgsfield CLI to the **Recraft REST API** — `assets/anchors/CLI-NOTES.md` (Recraft section) is the generator interface and `assets/anchors/STYLE.md` is the locked style + workflow, including the custom style_id trained on the approved anchors. **Execution starts at Task 3.** Where later tasks say "generate with anchors as references", read: generate per STYLE.md (recraftv3 + style_id + controls.colors, V4.1 long-prompt fallback).

## Global Constraints

- Art direction is locked by the spec: **Apple-modern flat**, palette = project `brand.gradient` + white/navy, App-Store-icon quality bar. The written form lives in `assets/anchors/STYLE.md` after Task 2 — treat it as the single source of truth for prompts.
- **Nahtadi:** never generate artwork for it; its icon is `public/images/nahtadi/icon.png` (the real App Store icon). Banners compose around it.
- Omar approves every artwork and the final grid. No auto-accepting.
- Composition must be reproducible: same inputs → byte-identical outputs (`--compose-only` re-runs prove it).
- Site pages/layouts unchanged except the images themselves (phase 4 owns layout).
- Baseline per task: `npm run build && npm run test:run && npm run lint` green; e2e where routes/paths change.
- Commits on `dev`; end messages with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Higgsfield CLI spike — ⏸ CHECKPOINT (Omar signs in)

**Files:**
- Create: `assets/anchors/CLI-NOTES.md` (committed — later tasks consume it as the generator interface)

This is a spike: the output is knowledge, not kept code.

- [ ] **Step 1: Install and authenticate**

Find the CLI install command at https://higgsfield.ai/cli (their docs point at a GitHub repo; expect an `npx`/`npm i -g` form). Install it, then run its auth/login flow — ⏸ Omar signs in with his Higgsfield account.

- [ ] **Step 2: Generate one test image**

Generate a single image with a simple prompt (e.g. "flat geometric illustration of a lighthouse, orange and navy palette, centered, soft shadow") using **Nano Banana Pro** if model selection exists, else the default. Confirm an output file lands on disk.

- [ ] **Step 3: Answer the design assumptions and write `assets/anchors/CLI-NOTES.md`**

Document, with the exact working commands used:
1. Install + auth commands.
2. Generation command shape: prompt, model selection, output size (need ≥1024²; native up to 4K claimed), output path.
3. **Reference-image support** — can a generation include style-reference image(s)? Exact flag. If not supported → fallback note: use the MCP server (`claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp`) interactively for generation; the rest of the pipeline is unchanged (file contract).
4. **Background control** — can it emit transparent background, or reliably render on a specified solid color (which `sharp` will key out)? Record which works; if neither is clean, record that artwork will be generated *directly on the project gradient* and composited without keying (acceptable fallback — icons then bake their background).
5. **Credits:** cost of the test image, Omar's current balance, projected catalog cost (≈13 subjects × ~3 attempts). ⏸ Omar confirms the budget is acceptable.

- [ ] **Step 4: Commit**

```bash
git add assets/anchors/CLI-NOTES.md
git commit -m "docs: Higgsfield CLI spike notes — interface, references, background, credits"
```

---

### Task 2: Style anchors — ⏸ CHECKPOINT (taste session: Omar + Fable)

**Files:**
- Create: `assets/anchors/STYLE.md`, `assets/anchors/anchor-1.png` … `anchor-3.png`

- [ ] **Step 1: Draft `assets/anchors/STYLE.md`**

Starting text (iterate during the session; this file is the prompt's home):

```markdown
# Hendaseh project-icon style — "Apple-modern flat"

## Master prompt template
Flat geometric illustration of {SUBJECT}, professional iOS app icon artwork.
Centered single subject, generous margins, no text.
Strict palette: {GRADIENT_FROM}, {GRADIENT_TO}, white, deep navy (#0A1A2F) accents only.
Subtle depth: gentle gradients within shapes, one soft drop shadow under the subject,
restrained highlight edges. Clean vector-like rendering.
No outlines-only line art, no neon, no glossy 3D, no photorealism, no background scene.

## Per-project inputs
{SUBJECT} — one concrete pictorial subject per project (chosen in Task 5, listed there)
{GRADIENT_FROM}/{GRADIENT_TO} — from projects.json brand.gradient

## Anchors
anchor-1.png — <subject> · anchor-2.png — <subject> · anchor-3.png — <subject>
Every generation passes all anchors as style references (see CLI-NOTES.md).
```

- [ ] **Step 2: Generate anchor candidates for three deliberately different subjects**

Suggested trio (diverse domains stress the style): an astronomical instrument (prayer-time library), a helicopter (pilot tracker), an abstract machine (mini-compiler). Generate 2–4 candidates each using the master prompt + that project's real gradient colors.

- [ ] **Step 3: ⏸ Iterate with Omar until three are exactly right**

This is the highest-value hour of the phase. Adjust the master prompt as learnings emerge (the prompt edits are the real deliverable alongside the images). Save winners as `assets/anchors/anchor-{1..3}.png`, update STYLE.md's anchor list and prompt.

- [ ] **Step 4: Verify anchoring works**

Regenerate one of the three subjects *with the other two anchors as references* — confirm the result lands in-family. If reference support is absent (per CLI-NOTES), confirm the prompt alone holds the style acceptably; tighten wording if not.

- [ ] **Step 5: Commit**

```bash
git add assets/anchors
git commit -m "feat: lock Apple-modern-flat style — master prompt and three approved anchors"
```

---

### Task 3: Shared asset templates (refactor OG machinery)

**Files:**
- Create: `src/lib/assetTemplates.tsx` (scripts-only module)
- Modify: `scripts/generate-og.tsx`, `src/lib/ogTemplate.tsx` → contents move into `assetTemplates.tsx`; `ogTemplate.tsx` is deleted
- Test: `src/lib/__tests__/assetTemplates.test.ts`

**Interfaces:**
- Produces (Task 4 consumes exactly these):
  - `CardTemplate({ card, mark })` — the existing OG 1200×630 template, moved verbatim
  - `BannerTemplate({ title, tagline, iconPng, gradient }: { title: string; tagline?: string; iconPng: string /* data URI */; gradient: { from: string; to: string } })` — 1280×640 GitHub banner: icon tile left-of-center or above, title in Roboto Medium, tagline + `hendaseh.com` footer, gradient background — **same visual family as the locked OG cards**
  - `loadMarks(): Promise<{ hendaseh: Mark; nahtadi: Mark }>` — moved verbatim
  - `GRADIENT_CSS(g: {from: string; to: string}): string` — `linear-gradient(135deg, from, to)` helper

- [ ] **Step 1: Move + add**

Move everything from `ogTemplate.tsx` into `assetTemplates.tsx` unchanged; add `BannerTemplate` and `GRADIENT_CSS`. Update the import in `scripts/generate-og.tsx`. Top-of-file comment: "Imported only by scripts/ — uses sharp and node:fs; never import from app code."

- [ ] **Step 2: Prove OG output unchanged**

```bash
npm run generate:og && git diff --stat public/og
```
Expected: **no diff** (deterministic byte-stability was established in phase 2).

- [ ] **Step 3: Template smoke test**

`src/lib/__tests__/assetTemplates.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import satori from 'satori'
import { readFile } from 'node:fs/promises'
import { BannerTemplate } from '../assetTemplates'

describe('BannerTemplate', () => {
  it('renders a 1280x640 SVG with title and footer', async () => {
    const medium = await readFile('src/fonts/roboto/Roboto-Medium.ttf')
    const regular = await readFile('src/fonts/roboto/Roboto-Regular.ttf')
    const onePx = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    const svg = await satori(
      BannerTemplate({ title: 'Test Project', tagline: 'A tagline', iconPng: onePx, gradient: { from: '#0A1A2F', to: '#04294A' } }),
      { width: 1280, height: 640, fonts: [
        { name: 'Roboto', data: regular, weight: 400, style: 'normal' },
        { name: 'Roboto', data: medium, weight: 500, style: 'normal' },
      ] }
    )
    expect(svg).toContain('width="1280"')
    expect(svg).toContain('Test Project')
    expect(svg).toContain('hendaseh.com')
  })
})
```

- [ ] **Step 4: Verify + commit**

Run: `npm run build && npm run test:run && npm run lint`

```bash
git add -A
git commit -m "refactor: shared assetTemplates module; add GitHub banner template"
```

---

### Task 4: Compositor + `npm run assets` CLI

**Files:**
- Create: `scripts/generate-assets.tsx`, `scripts/lib/compose.ts`
- Modify: `package.json` (script `"assets": "tsx scripts/generate-assets.tsx"`)
- Test: `src/lib/__tests__/compose.test.ts` (imports from `scripts/lib/compose.ts` via relative path)

**Interfaces:**
- Consumes: `assets/artwork/<id>.png` (Task 5 fills these; tests use a generated fixture), `BannerTemplate`/`loadMarks` from Task 3, `getAllProjects`/`getProjectById` from `src/lib/projects.ts`.
- Produces: `composeAll(projectId: string): Promise<void>` writing the four outputs to `public/images/projects/<id>/`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeAll } from 'vitest'
import sharp from 'sharp'
import { composeIcon, squirclePath } from '../../../scripts/lib/compose'

describe('compose', () => {
  const gradient = { from: '#166534', to: '#111827' }
  let artwork: Buffer
  beforeAll(async () => {
    artwork = await sharp({ create: { width: 600, height: 600, channels: 4, background: '#ffffff' } }).png().toBuffer()
  })

  it('composeIcon emits 1024x1024 png on the gradient', async () => {
    const out = await composeIcon(artwork, gradient, 'rounded')
    const meta = await sharp(out).metadata()
    expect(meta.width).toBe(1024); expect(meta.height).toBe(1024); expect(meta.format).toBe('png')
  })

  it('squircle mask corners are transparent', async () => {
    const out = await composeIcon(artwork, gradient, 'squircle')
    const { data, info } = await sharp(out).raw().toBuffer({ resolveWithObject: true })
    expect(data[3]).toBe(0) // top-left pixel alpha
    expect(info.width).toBe(1024)
  })

  it('is deterministic', async () => {
    const a = await composeIcon(artwork, gradient, 'rounded')
    const b = await composeIcon(artwork, gradient, 'rounded')
    expect(Buffer.compare(a, b)).toBe(0)
  })

  it('squirclePath is a closed path', () => {
    const p = squirclePath(1024)
    expect(p.startsWith('M')).toBe(true); expect(p.trim().endsWith('Z')).toBe(true)
  })
})
```

Run: `npm run test:run` → FAIL (module missing).

- [ ] **Step 2: Implement `scripts/lib/compose.ts`**

```ts
import sharp from 'sharp';

export interface Gradient { from: string; to: string }

/** Apple-style superellipse |x/a|^n + |y/a|^n = 1, n≈4.6 */
export function squirclePath(size: number, n = 4.6): string {
  const a = size / 2;
  const pts: string[] = [];
  const STEPS = 720;
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * 2 * Math.PI;
    const c = Math.cos(t), s = Math.sin(t);
    const x = a + Math.sign(c) * a * Math.abs(c) ** (2 / n);
    const y = a + Math.sign(s) * a * Math.abs(s) ** (2 / n);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `${pts.join(' ')} Z`;
}

function gradientSvg(size: number, g: Gradient, opts: { maskPath?: string; rx?: number } = {}): Buffer {
  const clip = opts.maskPath ? `<clipPath id="m"><path d="${opts.maskPath}"/></clipPath>` : '';
  const shapeAttr = opts.maskPath ? 'clip-path="url(#m)"' : opts.rx ? `rx="${opts.rx}"` : '';
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${g.from}"/><stop offset="1" stop-color="${g.to}"/>
      </linearGradient>${clip}</defs>
      <rect width="${size}" height="${size}" fill="url(#g)" ${shapeAttr}/>
    </svg>`
  );
}

const SIZE = 1024;
const SUBJECT = 720; // artwork box, centered — generous margins per STYLE.md

export async function composeIcon(artwork: Buffer, g: Gradient, shape: 'rounded' | 'squircle'): Promise<Buffer> {
  const bg = gradientSvg(SIZE, g, shape === 'squircle' ? { maskPath: squirclePath(SIZE) } : { rx: 180 });
  const subject = await sharp(artwork)
    .resize(SUBJECT, SUBJECT, { fit: 'inside', withoutEnlargement: false })
    .png().toBuffer();
  const meta = await sharp(subject).metadata();
  return sharp(bg)
    .composite([{ input: subject, left: Math.round((SIZE - meta.width!) / 2), top: Math.round((SIZE - meta.height!) / 2) }])
    .png().toBuffer();
}

/** Square card image: same composition as the rounded icon, no corner radius. */
export async function composeCard(artwork: Buffer, g: Gradient): Promise<Buffer> {
  const bg = gradientSvg(SIZE, g); // square, no radius
  const subject = await sharp(artwork).resize(SUBJECT, SUBJECT, { fit: 'inside' }).png().toBuffer();
  const meta = await sharp(subject).metadata();
  return sharp(bg)
    .composite([{ input: subject, left: Math.round((SIZE - meta.width!) / 2), top: Math.round((SIZE - meta.height!) / 2) }])
    .png().toBuffer();
}
```

**Note on artwork background:** if CLI-NOTES.md (Task 1) concluded artwork arrives with a baked background rather than transparent, `composeIcon`/`composeCard` skip the gradient layer and just resize/mask the artwork itself — implement whichever branch CLI-NOTES specifies, keep the same signatures, and adjust the corner-transparency test expectation for the rounded (non-squircle) card accordingly.

- [ ] **Step 3: Write `scripts/generate-assets.tsx`**

```tsx
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
  const projects = all ? getAllProjects() : args.map((id) => {
    const p = getProjectById(id);
    if (!p) throw new Error(`unknown project id: ${id}`);
    return p;
  });
  if (projects.length === 0) throw new Error('usage: npm run assets -- <id> [<id>…] | --all [--compose-only]');
  for (const p of projects) {
    try { await access(p.id === 'nahtadi' ? 'public/images/nahtadi/icon.png' : ARTWORK(p.id)); }
    catch { console.warn(`assets: ${p.id} skipped — no artwork at ${ARTWORK(p.id)}`); continue; }
    await compose(p);
  }
}
main();
```

(`--compose-only` is currently implied — generation lives in Task 5's loop, not this script; the flag is accepted so the command in the spec works verbatim.)

- [ ] **Step 4: Tests green, fixture run**

Run: `npm run test:run` → PASS. Then a real smoke: put any anchor PNG at `assets/artwork/mini-compiler.png` temporarily, `npm run assets -- mini-compiler`, confirm four files in `public/images/projects/mini-compiler/`, then delete both (test fixture only — real artwork comes in Task 5).

- [ ] **Step 5: Commit**

```bash
git add scripts package.json src/lib/__tests__/compose.test.ts
git commit -m "feat: asset compositor and npm run assets CLI (icon, squircle, card, GitHub banner)"
```

---

### Task 5: Catalog artwork generation — ⏸ CHECKPOINT (Omar gates each artwork)

**Files:**
- Create: `assets/artwork/<id>.png` × 12 (every project except nahtadi)
- Modify: `src/data/projects.json` (fill `tagline` for all projects — banners display it)

- [ ] **Step 1: Choose subjects + taglines**

Draft a subject (one concrete pictorial noun) and a tagline (≤ 6 words) per project; confirm the list with Omar in one pass before generating. Starting proposals — revise freely:

| id | subject | tagline draft |
|---|---|---|
| brent-cuda | GPU die with radiating compute lanes | Brent's method, 35× faster |
| islamic-prayer-time | astrolabe | Prayer times from the sky |
| new-game-plus | game controller with branching paths | Logic-driven game picks |
| mini-compiler | interlocking gear-and-tape machine | Pascal-like → Python |
| collision-avoidance-radar | radar scope with two vessel traces | Radar plotting, taught right |
| cycloidal-drive-creator | cycloidal gear rotor | Parametric gears for CAD |
| image-watermark-remover | image frame losing a watermark veil | GAN-erased watermarks |
| coast-guard-pilot-tracker | helicopter over a checklist | A week's summary in 3 minutes |
| coast-guard-inventory | shelf grid with a located crate | 85% faster part search |
| asl-detector | open hand with detection frame | ASL letters, live |
| wildfire-predictor | pine tree and thermometer | Wildfire risk from weather |
| reddit-nlp | two speech bubbles, different patterns | Which subreddit said it? |

Taglines obey the skills-defensibility and positioning rules in CLAUDE.md (plain claims, no embellishment). `nahtadi` tagline: `Prayer Times & Qibla Compass` (matches App Store).

- [ ] **Step 2: Generate per project, Omar approving each**

For each of the 12: run the generation command from `assets/anchors/CLI-NOTES.md` with the master prompt from `STYLE.md` (subject + that project's `brand.gradient` hexes) and the three anchors as references. ⏸ Show Omar; re-roll until he approves; save approved file to `assets/artwork/<id>.png`. Track re-roll count against the Task 1 budget.

- [ ] **Step 3: Commit (artwork is the irreplaceable input — commit as soon as all are approved)**

```bash
git add assets/artwork src/data/projects.json
git commit -m "feat: approved Apple-modern-flat artwork for all 12 projects; taglines for banners"
```

---

### Task 6: Catalog swap — ⏸ CHECKPOINT (Omar approves the grid)

**Files:**
- Modify: `src/data/projects.json` (image paths), generated files under `public/images/projects/<id>/`
- Delete: old flat `public/images/projects/*.png`
- Test: existing suites must stay green; `src/lib/__tests__/projects.test.ts` gains a files-exist check

- [ ] **Step 1: Compose everything**

```bash
npm run assets -- --all
```
Expected: 13 project directories each with 4 files (nahtadi included, from its real icon).

- [ ] **Step 2: Point `projects.json` at the new files**

Every project: `image` → `/images/projects/<id>/card.png` (keep `imageAlt`, updating any alt text that described the old artwork). Nahtadi's `image` stays `/images/nahtadi/icon.png` **unless** its new `card.png` looks better in the current card slot — show Omar both, let him pick.

- [ ] **Step 3: Add the files-exist test**

Append to `src/lib/__tests__/projects.test.ts`:

```ts
import { existsSync } from 'node:fs'

describe('project assets', () => {
  it('every project image path resolves to a real file in public/', () => {
    getAllProjects().forEach((p) => {
      expect(p.image, p.id).toBeDefined()
      expect(existsSync(`public${p.image}`), `${p.id}: ${p.image}`).toBe(true)
    })
  })
})
```

- [ ] **Step 4: Delete old images, sweep references**

```bash
git rm public/images/projects/*.png
grep -rn "images/projects/" src tests --include="*.ts" --include="*.tsx" --include="*.json"
```
Every hit must reference the new `<id>/` paths (or be `projects.json` itself).

- [ ] **Step 5: Determinism proof**

```bash
npm run assets -- --all && git status --porcelain public/images/projects
```
Expected: empty (second run reproduced every byte).

- [ ] **Step 6: ⏸ Grid approval + verify**

`npm run dev` → Omar reviews `/projects` and `/` (featured cards) — the grid must read as one family. Then: `npm run build && npm run test:run && npm run lint && npm run test:e2e` green.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: regenerate full project catalog through the asset engine"
```

---

### Task 7: OG-card alignment check

- [ ] **Step 1: Regenerate and diff**

```bash
npm run generate:og && git status --porcelain public/og
```
Expected: empty — OG cards unaffected by the refactor. If project OG cards *should* now include the new icons (they currently render title-only), that is an intentional upgrade: mock one (`brent-cuda`) with the icon tile, show Omar, and only apply on his yes. Either way, `tests/e2e/og.spec.ts` stays green.

- [ ] **Step 2: Commit (only if anything changed)**

```bash
git add public/og && git commit -m "feat: project OG cards pick up engine icons (Omar-approved)"
```

---

### Task 8: GitHub distribution — ⏸ CHECKPOINT (manual uploads with Omar)

- [ ] **Step 1: Build the checklist**

Write `docs/content/github-banners-checklist.md` (gitignored dir — lists private repos): every **public** repo with a corresponding project → its `github-banner.png` path. Private repos (coast-guard-*) noted as N/A.

- [ ] **Step 2: ⏸ Upload session**

With Omar: each repo → Settings → General → Social preview → upload the banner. Check off each. Verify one by pasting a repo link into a social-preview debugger (e.g. opengraph.xyz).

---

### Task 9: Docs + roadmap

**Files:**
- Modify: `docs/DECISIONS.md`, `docs/ROADMAP.md`, `.claude/CLAUDE.md`, `README.md`

- [ ] **Step 1: DECISIONS.md** — append, in the file's decision/why/revisit format: (a) locked art direction "Apple-modern flat" with anchors as source of truth; (b) Higgsfield verified — record which model + interface (CLI or MCP fallback) the spike settled on, superseding the "API access unverified" entry.
- [ ] **Step 2: ROADMAP.md** — sub-project 3 → **Complete** + date; phase-5 section note: new projects (radar-moboard, a16-summarizer) get assets via `npm run assets`.
- [ ] **Step 3: CLAUDE.md** — add an "Adding a project's assets" recipe: JSON entry → subject/tagline per STYLE.md → generate with anchors → Omar approves → `npm run assets -- <id>` → files-exist test keeps you honest. Note `assets/artwork/` is committed and precious; composition is disposable.
- [ ] **Step 4: README.md** — one paragraph on the asset pipeline commands.
- [ ] **Step 5: Final verification** — every spec success criterion checked; full suite green; push `dev`, PR to `main`, Omar merges; confirm production shows the new grid.

```bash
git add -A
git commit -m "docs: asset engine complete — decisions, roadmap, contributor recipes"
git push origin dev
gh pr create --base main --head dev --title "Asset engine: consistent icons and banners for the full catalog" --body "Apple-modern-flat art direction, Higgsfield-generated artwork behind a deterministic compositor; all 13 projects regenerated.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```
