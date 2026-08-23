# Foundation Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the repo's ground solid for the redesign: brand design tokens, validated `projects.json` schema v2 with tiers, `/capabilities` removed, ESLint restored, and all project docs rewritten fresh.

**Architecture:** Tokens live in Tailwind v4 `@theme` blocks in `globals.css` with semantic light/dark variables (dark styles are *defined but not yet applied to the live site* — pages adopt them in sub-project 4, so this sub-project causes **no visible change** except the `/capabilities` redirect). `projects.json` becomes the single validated source of truth via a Zod schema that the `Project` type is inferred from; a mechanical tier assignment replaces `hasDetailPage`/`customUrl` semantics; link URLs collapse into a `links` object. Existing per-project gradients stay in `projectStyles.ts` for Tailwind scanning, with a sync test tying them to the new `brand.gradient` data.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Zod 4 (already a dependency), Vitest, Playwright, ESLint 9 flat config, `gh` CLI for the GitHub audit.

**Spec:** `docs/superpowers/specs/2026-08-23-foundation-reset-design.md`

## Global Constraints

- **No visual change** to any public page in this sub-project (the only user-visible change: `/capabilities` now 301s to `/about`).
- **Frozen URLs:** `/nahtadi`, `/nahtadi/privacy`, `/nahtadi/support` must not change.
- Brand colors verbatim: blue `#0093FF`, navy `#0A1A2F`. Typeface: Roboto (Medium headings / Regular body).
- Tailwind is v4: config belongs in CSS (`@theme`), not `tailwind.config.ts`.
- No new runtime dependencies. Dev dependency additions allowed only where a task names them (`@eslint/eslintrc`).
- All commits on the `dev` branch; commit messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Verification baseline: `npm run build`, `npm run test:run`, and (after Task 6) `npm run lint` must pass at the end of every task.

---

### Task 1: Design tokens in globals.css

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: Tailwind utilities for the brand scales (`bg-blue-500`, `text-navy-950`, etc. now map to Hendaseh-derived values) and semantic utilities (`bg-surface`, `bg-surface-raised`, `text-primary`, `text-secondary`, `text-accent`, `border-edge`), plus a `dark:` variant scoped to `[data-theme="dark"]`. Task 2 renders all of these.

- [ ] **Step 1: Replace `globals.css` with the token system**

Keep the existing `body` rule, `.text-balance`, `.font-secondary`, and the `.rounded-3xl img` fix **unchanged** at the bottom (no-visual-change constraint). Above them, replace the bare `@import` with:

```css
@import "tailwindcss";

/* Dark mode is opt-in via data-theme, NOT prefers-color-scheme, until
   sub-project 4 applies tokens to every page. Flipping on media query now
   would restyle the live site inconsistently. */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  /* ---- Hendaseh brand core (brandbook, verbatim) ---- */
  --color-brand: #0093ff;
  --color-brand-navy: #0a1a2f;

  /* ---- Blue scale anchored on #0093FF at 500 ---- */
  --color-blue-50: #eff8ff;
  --color-blue-100: #dbefff;
  --color-blue-200: #bde3ff;
  --color-blue-300: #8fd0ff;
  --color-blue-400: #57b4ff;
  --color-blue-500: #0093ff;
  --color-blue-600: #0076d1;
  --color-blue-700: #005da6;
  --color-blue-800: #004e89;
  --color-blue-900: #064271;
  --color-blue-950: #04294a;

  /* ---- Navy scale anchored on #0A1A2F at 950 ---- */
  --color-navy-50: #f3f6fa;
  --color-navy-100: #e5ecf4;
  --color-navy-200: #c7d6e6;
  --color-navy-300: #9db8d1;
  --color-navy-400: #6d94b7;
  --color-navy-500: #4b779f;
  --color-navy-600: #3a5f85;
  --color-navy-700: #304d6c;
  --color-navy-800: #2b425b;
  --color-navy-900: #1a2c42;
  --color-navy-950: #0a1a2f;

  /* ---- Typography ---- */
  --font-heading: var(--font-roboto-medium), system-ui, -apple-system, sans-serif;
  --font-body: var(--font-roboto-regular), system-ui, -apple-system, sans-serif;

  /* ---- Type scale (display sizes get tightened leading) ---- */
  --text-display: 4.5rem;
  --text-display--line-height: 1.05;
  --text-h1: 3rem;
  --text-h1--line-height: 1.1;
  --text-h2: 2rem;
  --text-h2--line-height: 1.2;
  --text-h3: 1.5rem;
  --text-h3--line-height: 1.3;
  --text-body: 1rem;
  --text-body--line-height: 1.6;
  --text-small: 0.875rem;
  --text-small--line-height: 1.5;

  /* ---- Radius ---- */
  --radius-card: 1.5rem;
  --radius-control: 0.75rem;

  /* ---- Motion ---- */
  --ease-brand: cubic-bezier(0.22, 1, 0.36, 1);
}

/* Semantic tokens: light values on :root, dark values under [data-theme="dark"]. */
:root {
  --surface: #ffffff;
  --surface-raised: #f3f6fa;      /* navy-50 */
  --surface-sunken: #e5ecf4;      /* navy-100 */
  --text-strong: #0a1a2f;         /* navy-950 */
  --text-body: #2b425b;           /* navy-800 */
  --text-muted: #4b779f;          /* navy-500 */
  --accent: #0076d1;              /* blue-600: AA on white */
  --accent-strong: #005da6;       /* blue-700 */
  --edge: #c7d6e6;                /* navy-200 */
}

[data-theme="dark"] {
  --surface: #0a1a2f;             /* navy-950 */
  --surface-raised: #1a2c42;      /* navy-900 */
  --surface-sunken: #061120;
  --text-strong: #f3f6fa;         /* navy-50 */
  --text-body: #c7d6e6;           /* navy-200 */
  --text-muted: #9db8d1;          /* navy-300 */
  --accent: #57b4ff;              /* blue-400: AA on navy-950 */
  --accent-strong: #8fd0ff;       /* blue-300 */
  --edge: #2b425b;                /* navy-800 */
}

/* Register semantic tokens as Tailwind utilities. */
@theme inline {
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-surface-sunken: var(--surface-sunken);
  --color-primary: var(--text-strong);
  --color-secondary: var(--text-body);
  --color-muted: var(--text-muted);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-edge: var(--edge);
}
```

- [ ] **Step 2: Verify no visual change**

Run: `npm run build && npm run test:run`
Expected: both pass. Then `npm run dev`, load `/` and `/projects`, confirm they look identical to production (hendaseh.com) — the tokens are defined but nothing consumes them yet.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add Hendaseh design token system (brand scales + semantic light/dark tokens)"
```

---

### Task 2: /dev/tokens preview page

**Files:**
- Create: `src/app/dev/tokens/page.tsx`
- Create: `src/app/dev/tokens/TokensClient.tsx`

**Interfaces:**
- Consumes: every token utility from Task 1.
- Produces: an unlinked, `noindex` page for visually verifying tokens in both themes. (Gated or removed before the program ends — tracked in ROADMAP phase 4.)

- [ ] **Step 1: Create the server page with noindex metadata**

`src/app/dev/tokens/page.tsx`:

```tsx
import type { Metadata } from 'next';
import TokensClient from './TokensClient';

export const metadata: Metadata = {
  title: 'Design Tokens (internal)',
  robots: { index: false, follow: false },
};

export default function TokensPage() {
  return <TokensClient />;
}
```

- [ ] **Step 2: Create the client preview**

`src/app/dev/tokens/TokensClient.tsx` — renders both themes side by side by stamping `data-theme` on wrappers (no global toggle needed):

```tsx
'use client';

const BLUE = ['50','100','200','300','400','500','600','700','800','900','950'];
const NAVY = BLUE;

function Panel({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div data-theme={theme} className="bg-surface text-secondary p-8 space-y-6">
      <h2 className="text-primary text-2xl">Theme: {theme}</h2>
      <div className="bg-surface-raised border border-edge rounded-xl p-4">
        <p className="text-primary">text-primary on surface-raised</p>
        <p className="text-secondary">text-secondary</p>
        <p className="text-muted">text-muted</p>
        <a className="text-accent hover:text-accent-strong" href="#">accent link</a>
      </div>
      <div className="bg-surface-sunken rounded-xl p-4 text-secondary">surface-sunken</div>
    </div>
  );
}

export default function TokensClient() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      <section>
        <h1 className="text-2xl mb-4">Brand scales</h1>
        {(['blue', 'navy'] as const).map((name) => (
          <div key={name} className="flex gap-1 mb-2">
            {(name === 'blue' ? BLUE : NAVY).map((step) => (
              <div key={step} className={`h-12 flex-1 rounded bg-${name}-${step}`} title={`${name}-${step}`} />
            ))}
          </div>
        ))}
      </section>
      <section className="grid md:grid-cols-2 gap-4 rounded-2xl overflow-hidden border border-edge">
        <Panel theme="light" />
        <Panel theme="dark" />
      </section>
    </div>
  );
}
```

**Note:** `bg-${name}-${step}` is dynamic — Tailwind's scanner will NOT emit those classes. Add a safelist comment block at the bottom of the file containing every literal class name (`bg-blue-50 bg-blue-100 … bg-navy-950`) so the scanner picks them up, or write the swatch rows as literal arrays. Literal arrays preferred; do not ship a broken swatch grid.

- [ ] **Step 3: Verify**

Run: `npm run dev`, open `http://localhost:3000/dev/tokens`.
Expected: both scale rows render as smooth ramps; light and dark panels both readable; accent link visibly ≥ AA contrast against its surface in both panels (spot-check with browser devtools contrast checker).

- [ ] **Step 4: Confirm the page is not in the sitemap**

Run: `grep -c "dev/tokens" src/app/sitemap.ts`
Expected: `0` (sitemap lists routes explicitly; nothing to change).

- [ ] **Step 5: Commit**

```bash
git add src/app/dev
git commit -m "feat: add internal /dev/tokens preview page (noindex)"
```

---

### Task 3: projects.json schema v2 + Zod validation

**Files:**
- Create: `src/lib/projectSchema.ts`
- Modify: `src/data/projects.json`
- Modify: `src/lib/projects.ts`
- Test: `src/lib/__tests__/projects.test.ts`

**Interfaces:**
- Produces (Tasks 4–5 rely on these exact names):
  - `type Tier = 'flagship' | 'showcase' | 'card'`
  - `interface/type Project` (inferred from Zod) with: `id`, `title`, `tagline?`, `description`, `tier: Tier`, `featured: boolean`, `private: boolean`, `technologies: string[]`, `keywords?: string[]`, `category: string`, `stats: string`, `detailPath?: string`, `buttonText?: string`, `image?: string`, `imageAlt?: string`, `links: { github?: string; live?: string; embed?: string; appStore?: string }`, `brand?: { gradient: { from: string; to: string }; iconArt?: string }`, `appStoreLive?: boolean`, `appStoreRating?: { value: string; count: number }`
  - `getAllProjects(): Project[]`, `getFeaturedProjects(): Project[]`, `getProjectById(id): Project | undefined` (unchanged signatures)
  - **New:** `getProjectHref(p: Project): string | null` — `null` for `card` tier, else `p.detailPath ?? '/projects/' + p.id`
  - **New:** `getShowcaseProjects(): Project[]` — `tier === 'showcase'` (sitemap uses this)

- [ ] **Step 1: Write failing tests**

Append to `src/lib/__tests__/projects.test.ts` (keep existing tests; they must still pass):

```ts
import { ProjectsFileSchema } from '../projectSchema'
import projectsData from '../../data/projects.json'
import { getProjectHref, getShowcaseProjects } from '../projects'

describe('projects.json schema v2', () => {
  it('validates against ProjectsFileSchema', () => {
    const parsed = ProjectsFileSchema.safeParse(projectsData)
    expect(parsed.success, JSON.stringify(parsed.success ? '' : parsed.error.issues, null, 2)).toBe(true)
  })

  it('has exactly one flagship (nahtadi) with detailPath /nahtadi', () => {
    const flagships = getAllProjects().filter(p => p.tier === 'flagship')
    expect(flagships.map(p => p.id)).toEqual(['nahtadi'])
    expect(flagships[0].detailPath).toBe('/nahtadi')
  })
})

describe('getProjectHref', () => {
  it('returns null for card tier', () => {
    const card = getAllProjects().find(p => p.tier === 'card')!
    expect(getProjectHref(card)).toBeNull()
  })
  it('returns /projects/<id> for showcase tier without detailPath', () => {
    const sc = getAllProjects().find(p => p.tier === 'showcase' && !p.detailPath)!
    expect(getProjectHref(sc)).toBe(`/projects/${sc.id}`)
  })
  it('returns detailPath when set', () => {
    expect(getProjectHref(getProjectById('nahtadi')!)).toBe('/nahtadi')
  })
})

describe('getShowcaseProjects', () => {
  it('returns only showcase-tier projects', () => {
    const s = getShowcaseProjects()
    expect(s.length).toBeGreaterThan(0)
    s.forEach(p => expect(p.tier).toBe('showcase'))
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run`
Expected: FAIL — `projectSchema` module not found.

- [ ] **Step 3: Create the Zod schema**

`src/lib/projectSchema.ts`:

```ts
import { z } from 'zod';

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'expected 6-digit hex color');

export const TierSchema = z.enum(['flagship', 'showcase', 'card']);
export type Tier = z.infer<typeof TierSchema>;

export const ProjectSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    tagline: z.string().optional(),
    description: z.string().min(1),
    tier: TierSchema,
    featured: z.boolean(),
    private: z.boolean().default(false),
    technologies: z.array(z.string().min(1)).min(1),
    keywords: z.array(z.string().min(1)).optional(),
    category: z.string().min(1),
    stats: z.string(),
    detailPath: z.string().startsWith('/').optional(),
    buttonText: z.string().optional(),
    image: z.string().startsWith('/').optional(),
    imageAlt: z.string().optional(),
    links: z
      .object({
        github: z.url().optional(),
        live: z.url().optional(),
        embed: z.url().optional(),
        appStore: z.url().optional(),
      })
      .default({}),
    brand: z
      .object({
        gradient: z.object({ from: hex, to: hex }),
        iconArt: z.string().optional(),
      })
      .optional(),
    appStoreLive: z.boolean().optional(),
    appStoreRating: z.object({ value: z.string(), count: z.number().int().positive() }).optional(),
  })
  .strict();

export const ProjectsFileSchema = z.object({ projects: z.array(ProjectSchema).min(1) }).strict();
export type Project = z.infer<typeof ProjectSchema>;
```

`.strict()` matters: it makes leftover v1 fields (e.g. `githubUrl`) a validation error, so the migration can't silently half-complete.

- [ ] **Step 4: Migrate `projects.json` to v2**

Mechanical mapping for every entry:
- `githubUrl`/`liveUrl`/`embedUrl`/`appStoreUrl` → `links.github`/`links.live`/`links.embed`/`links.appStore`; **omit null/absent ones** (no nulls in v2).
- Drop `privacyPolicyUrl` and `supportUrl` (fixed routes; verify no consumer first: `grep -rn "privacyPolicyUrl\|supportUrl" src --include="*.tsx" --include="*.ts"` — if a consumer exists, hardcode the route there as part of Task 4).
- Drop `hasDetailPage`, `customUrl`. Add `tier`: `nahtadi` → `"flagship"` with `detailPath: "/nahtadi"`; any other entry that had `hasDetailPage: true` → `"showcase"`; the rest → `"card"`. (Initial mechanical assignment; final tiers decided in sub-project 5 from the Task 8 audit.)
- Add `private: true` to `coast-guard-pilot-tracker` and `coast-guard-inventory`; `private: false` everywhere else.
- Add `brand.gradient` from `getProjectGradientStops(id)`'s values in `src/lib/projectStyles.ts` — copy each project's `stops` hex pair verbatim; for ids not in the map, use the module's default stops.
- Keep verbatim: `id`, `title`, `description`, `technologies`, `featured`, `stats`, `category`, `buttonText`, `image`, `imageAlt`, `appStoreLive`, `appStoreRating`.

- [ ] **Step 5: Update `src/lib/projects.ts`**

Replace the hand-written `Project` interface with the schema import; parse once at module load so a bad JSON fails the build/tests, not production rendering:

```ts
import projectsData from '@/data/projects.json';
import nahtadiReviewsData from '@/data/nahtadiReviews.json';
import { ProjectsFileSchema, type Project } from './projectSchema';

export type { Project, Tier } from './projectSchema';

const projects: Project[] = ProjectsFileSchema.parse(projectsData).projects;

export function getAllProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getShowcaseProjects(): Project[] {
  return projects.filter((p) => p.tier === 'showcase');
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectHref(p: Project): string | null {
  if (p.tier === 'card') return null;
  return p.detailPath ?? `/projects/${p.id}`;
}
```

Keep the `NahtadiReview` interface and `getNahtadiReviews()` unchanged.

- [ ] **Step 6: Run unit tests**

Run: `npm run test:run`
Expected: new tests PASS. **TypeScript errors in consumer components are expected** (`tsc` runs at build, not in vitest) — that's Task 4. If vitest itself fails on consumer imports, note which and proceed to Task 4 before committing both together (see Task 4 Step 4).

- [ ] **Step 7: Commit (only if the full suite and build are green — otherwise this commit merges with Task 4's)**

```bash
git add src/lib/projectSchema.ts src/lib/projects.ts src/data/projects.json src/lib/__tests__/projects.test.ts
git commit -m "feat: projects.json schema v2 with tiers, links object, and Zod validation"
```

---

### Task 4: Migrate schema consumers

**Files:**
- Modify: `src/components/projects/AnimatedProjectCard.tsx`
- Modify: `src/components/home/FeaturedProjects.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/nahtadi/page.tsx`
- Modify: `src/components/nahtadi/PlatformButtons.tsx`
- Modify: `src/app/projects/[slug]/page.tsx`
- Modify (check): `src/components/projects/FilterableProjectList.tsx`, `src/components/projects/ProjectFilter.tsx`, `src/lib/ogCards.ts`

**Interfaces:**
- Consumes: `Project`, `getProjectHref`, `getShowcaseProjects` from Task 3 exactly as defined there.

- [ ] **Step 1: Sweep for every v1 field reference**

Run: `grep -rn "githubUrl\|liveUrl\|embedUrl\|appStoreUrl\|hasDetailPage\|customUrl\|privacyPolicyUrl\|supportUrl" src --include="*.tsx" --include="*.ts"`
Fix each hit with these mappings (rendered output must be identical):

| v1 | v2 |
|---|---|
| `project.githubUrl` | `project.links.github` |
| `project.liveUrl` | `project.links.live` |
| `project.embedUrl` | `project.links.embed` |
| `project.appStoreUrl` | `project.links.appStore` |
| `project.hasDetailPage && (<Link href={project.customUrl \|\| \`/projects/${project.id}\`}>` | `getProjectHref(project) && (<Link href={getProjectHref(project)!}>` |
| `!project.githubUrl && !project.liveUrl && !project.hasDetailPage` | `!project.links.github && !project.links.live && !getProjectHref(project)` |
| sitemap `filter(p => p.hasDetailPage)` | `getShowcaseProjects()` (flagship's `/nahtadi` is already a static sitemap entry — do not emit `/projects/nahtadi`) |

In `FeaturedProjects.tsx` line 34, `href={project.customUrl || (project.hasDetailPage ? … : '/projects')}` becomes `href={getProjectHref(project) ?? '/projects'}`.

- [ ] **Step 2: Typecheck until clean**

Run: `npx tsc --noEmit`
Expected: zero errors mentioning removed fields.

- [ ] **Step 3: Full verification — no visual change**

Run: `npm run build && npm run test:run && npm run test:e2e`
Expected: all pass. Manually diff `/projects` and `/` against production: identical cards, identical link targets (spot-check Nahtadi card → `/nahtadi`, a showcase card → its `/projects/<id>`, a card-tier project → GitHub link only).

- [ ] **Step 4: Commit**

```bash
git add -A src
git commit -m "refactor: migrate all consumers to projects schema v2"
```

(If Task 3 Step 7 was deferred, this commit includes those files — one commit for the atomic schema+consumers migration is correct.)

---

### Task 5: Gradient sync guard

**Files:**
- Test: `src/lib/__tests__/projectStyles.test.ts` (create)

**Interfaces:**
- Consumes: `getProjectGradientStops(id)` from `src/lib/projectStyles.ts`; `getAllProjects()` from Task 3.

- [ ] **Step 1: Write the sync test**

```ts
import { describe, it, expect } from 'vitest'
import { getAllProjects } from '../projects'
import { getProjectGradientStops } from '../projectStyles'

describe('brand.gradient stays in sync with projectStyles', () => {
  it('every project brand.gradient matches getProjectGradientStops', () => {
    getAllProjects().forEach((p) => {
      if (!p.brand) return
      const stops = getProjectGradientStops(p.id)
      expect(p.brand.gradient.from.toLowerCase(), p.id).toBe(stops.from.toLowerCase())
      expect(p.brand.gradient.to.toLowerCase(), p.id).toBe(stops.to.toLowerCase())
    })
  })

  it('every project has brand.gradient defined', () => {
    getAllProjects().forEach((p) => expect(p.brand, `${p.id} missing brand.gradient`).toBeDefined())
  })
})
```

- [ ] **Step 2: Run — fix any mismatch by correcting `projects.json` (projectStyles is the current visual truth)**

Run: `npm run test:run`
Expected: PASS (after fixing any copy errors from Task 3 Step 4).

- [ ] **Step 3: Commit**

```bash
git add src/lib/__tests__/projectStyles.test.ts src/data/projects.json
git commit -m "test: guard brand.gradient sync between projects.json and projectStyles"
```

---

### Task 6: Remove /capabilities with redirect

**Files:**
- Delete: `src/app/capabilities/page.tsx`, `src/components/CapabilitiesClient.tsx`
- Modify: `next.config.ts`, `src/app/sitemap.ts`, `src/components/navigation/Navigation.tsx`, `src/components/home/HomeCapabilities.tsx`, `src/components/home/HomeCTA.tsx`
- Test: `tests/redirects.spec.ts` (create; follow the naming/style of existing specs in `tests/`)

- [ ] **Step 1: Write the failing Playwright test**

```ts
import { test, expect } from '@playwright/test'

test('/capabilities permanently redirects to /about', async ({ page }) => {
  const response = await page.goto('/capabilities')
  await expect(page).toHaveURL(/\/about$/)
  expect(response?.request().redirectedFrom()?.response()?.status()).toBe(308)
})
```

(Next.js `permanent: true` emits 308 — equivalent to 301 for SEO purposes.)

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:e2e -- redirects`
Expected: FAIL — `/capabilities` currently renders a page.

- [ ] **Step 3: Add the redirect in `next.config.ts`**

```ts
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async redirects() {
    return [{ source: '/capabilities', destination: '/about', permanent: true }];
  },
};
```

- [ ] **Step 4: Delete the route and update references**

- Delete `src/app/capabilities/` and `src/components/CapabilitiesClient.tsx`.
- `Navigation.tsx`: remove the Capabilities nav item (check both desktop and mobile menus).
- `HomeCapabilities.tsx` / `HomeCTA.tsx`: change any `href="/capabilities"` to `/about`. Do not otherwise restyle (no-visual-change constraint; these sections get redesigned in sub-project 4).
- `sitemap.ts`: remove the `/capabilities` entry.
- Sweep: `grep -rn "capabilities" src --include="*.tsx" --include="*.ts"` → zero route references remain.

- [ ] **Step 5: Verify**

Run: `npm run build && npm run test:run && npm run test:e2e`
Expected: all pass, including the new redirect test.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: remove /capabilities page, 308-redirect to /about"
```

---

### Task 7: Re-enable ESLint + delete dead Tailwind config

**Files:**
- Create: `eslint.config.mjs`
- Modify: `package.json` (scripts + devDependency)
- Delete: `tailwind.config.ts` (v3 leftover; Tailwind v4 config is CSS-based — verify first: `grep -rn "tailwind.config" . --include="*.ts" --include="*.mjs" --include="*.json" -l | grep -v node_modules` must return nothing)

- [ ] **Step 1: Install the compat shim**

Run: `npm i -D @eslint/eslintrc`

- [ ] **Step 2: Create `eslint.config.mjs`**

```js
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  { ignores: ['node_modules/**', '.next/**', 'playwright-report/**', 'test-results/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];
```

(If `eslint-config-next@16` exports native flat configs — check `node_modules/eslint-config-next/package.json` `exports` — prefer importing those directly and drop `@eslint/eslintrc`.)

- [ ] **Step 3: Restore the lint script**

In `package.json`: `"lint": "eslint ."` (replacing the disabled echo).

- [ ] **Step 4: Run and fix violations**

Run: `npm run lint`
Fix every error. For warnings-only rules, fix rather than disable where the fix is mechanical; a rule may be turned off in `eslint.config.mjs` only with an inline comment saying why.

- [ ] **Step 5: Delete `tailwind.config.ts`, then full verify**

Run: `npm run build && npm run test:run && npm run lint`
Expected: all green; site unchanged (`npm run dev` spot-check one page).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: restore ESLint (flat config) and remove dead tailwind.config.ts"
```

---

### Task 8: Content audit (GitHub ↔ projects.json) — CHECKPOINT with Omar

**Files:**
- Create: `docs/CONTENT-AUDIT.md`

- [ ] **Step 1: Enumerate repos**

Run: `gh repo list osyounis --limit 100 --json name,description,visibility,isArchived,stargazerCount,pushedAt`
(If `gh` is unauthenticated, use the GitHub MCP server's repo listing instead.)

- [ ] **Step 2: Write `docs/CONTENT-AUDIT.md`**

Structure (fill with real data, no placeholders):

```markdown
# Content Audit — <date>

## A. Repos not in projects.json
| repo | visibility | last push | verdict (add as tier? / skip — why) |

## B. projects.json entries and proposed final tier
| id | current tier | proposed tier | rationale (has story + visuals? / card is enough) |

## C. Stale or wrong facts found on the live site
(bulleted: page, claim, correction source)

## D. Canonical facts sheet — NEEDS OMAR
- Display location: ("San Francisco Bay Area" vs specific city) → ?
- Contact email shown on site: (CSUF address must go; which hendaseh.com/other address?) → ?
- Résumé: public/omar_younis_resume_2026.pdf is outdated — Omar supplies current master + section text into docs/content/ → ?
- Employer title check (e.g., Elemeno AI "Machine Learning Engineer") against current résumé → ?
- Radar Moboard: description, tech stack, status, what can be shown publicly → ?
- Anything in section B marked "needs Omar"
```

Verdicts in A/B are proposals argued from the repo data and the tier bar ("a showcase page only where there's a real story + visuals").

- [ ] **Step 3: STOP — present section D questions to Omar**

Present the audit and the canonical-facts questions to Omar (AskUserQuestion or chat). Record his answers directly into `docs/CONTENT-AUDIT.md`, replacing the `?`s. Ask him to drop his résumé + saved section text into `docs/content/` now. **Do not proceed to Task 9 until answers are recorded** — Task 9's CLAUDE.md states canonical facts and must not guess.

- [ ] **Step 4: Commit**

```bash
git add docs/CONTENT-AUDIT.md docs/content
git commit -m "docs: content audit with canonical facts from Omar"
```

---

### Task 9: Documentation rewrite (CLAUDE.md, README, DECISIONS)

**Files:**
- Rewrite: `.claude/CLAUDE.md`
- Rewrite: `README.md`
- Create: `docs/DECISIONS.md`
- Modify: `docs/ROADMAP.md` (status table only)

- [ ] **Step 1: Create `docs/DECISIONS.md`**

One entry per program-level decision, dated 2026-08-23, each 2–4 lines (decision, why, revisit-when): four-page structure; frozen Nahtadi URLs; keep Next.js; Cloudflare Workers via `@opennextjs/cloudflare` (not Pages — maintenance mode); tiered project pages (flagship/showcase/card); hybrid asset pipeline (code frame + AI artwork); **no backend — Supabase is the designated choice if one is ever needed**; ImageKit = image loader on Cloudflare + generated-asset storage; Higgsfield = icon artwork generation (API access unverified).

- [ ] **Step 2: Rewrite `.claude/CLAUDE.md` from scratch**

Fresh content only — do not carry forward old sections. Required contents, stated tersely:
- Project: hendaseh.com portfolio, redesign program in flight → pointer to `docs/ROADMAP.md` (master plan) and `docs/DECISIONS.md`.
- Positioning: software engineer & problem-solver, iOS-forward with on-device ML; ME background as bridge; never position as full-stack/frontend specialist (carry the two memory rules: positioning thesis, skills defensibility).
- Canonical facts: the answered section D of `docs/CONTENT-AUDIT.md` — copy values, cite the audit as source of truth.
- Structure rules: four public pages; `/projects/[slug]` showcase tier; frozen `/nahtadi*` URLs; `/capabilities` is gone (redirect stays).
- Design: brandbook at `docs/brand/Hendaseh-brand-updated.pdf` is the identity anchor (blue `#0093FF`, navy `#0A1A2F`, Roboto Medium/Regular); tokens live in `globals.css`; site design is expressive, dark-first, "not boring"; WCAG-conscious; `prefers-reduced-motion` respected.
- Data: `projects.json` validated by `src/lib/projectSchema.ts` (`.strict()`); never bypass helpers in `src/lib/projects.ts`; gradients synced with `projectStyles.ts` by test.
- SEO: preserve metadata exports, JSON-LD, sitemap, OG images; no route/slug changes without redirects.
- Workflow: dev branch → PR to main; build+test+lint must pass; Tailwind v4 (CSS config, no tailwind.config).

- [ ] **Step 3: Rewrite `README.md`**

Short public-facing readme: what the site is, stack, `npm run dev|build|test:run|test:e2e|lint`, pointer to ROADMAP/DECISIONS, license note. No marketing copy.

- [ ] **Step 4: Update `docs/ROADMAP.md` status table**

Sub-project 1 → `**Complete** — <date>`.

- [ ] **Step 5: Final full verification (spec success criteria)**

Run: `npm run build && npm run test:run && npm run test:e2e && npm run lint`
Expected: all green. Confirm each spec success criterion explicitly; `/dev/tokens` renders both themes; `/capabilities` redirects.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "docs: rewrite CLAUDE.md, README; add DECISIONS.md; mark foundation reset complete"
```
