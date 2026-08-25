# hendaseh.com

Source for [hendaseh.com](https://hendaseh.com) — Omar Younis's software engineering portfolio.

The site covers his projects (including Nahtadi, a shipped iOS app) and hosts Nahtadi's privacy and support pages.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zod · Framer Motion · Vitest + Playwright.

Deployed to **Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare). Images are served through ImageKit (a custom `next/image` loader); Open Graph cards are rendered at build time with Satori into `public/og/`.

The site is fully static — no backend, no server actions, no API routes, and no environment variables to configure. `npm install && npm run dev` is all the setup there is.

## Getting started

```bash
npm install
npm run dev        # local dev server at http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run test:run` | Unit tests (Vitest, single run) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run lint` | ESLint |
| `npm run test:all` | Lint + unit + e2e |
| `npm run generate:og` | Re-render the static Open Graph cards into `public/og/` |
| `npm run assets -- <id>` / `-- --all` | Regenerate one project's (or every project's) icon/banner assets |
| `npm run preview` | Build the Worker and run it locally in workerd |
| `npm run deploy` | Build and deploy the Worker to Cloudflare |

## Deployment

Hosted on **Cloudflare Workers**. Deploys run on **Cloudflare Workers Builds**, connected to this repository:

- push to `main` → production (hendaseh.com, www.hendaseh.com)
- pull request → a Cloudflare preview URL

`npm run preview` runs a production build inside workerd locally, which is the honest way to check Workers-specific behaviour before opening a PR. `npm run deploy` deploys straight from a workstation and is for deliberate, out-of-band deploys only — CI is the normal path.

Custom domains are declared as `routes` in `wrangler.jsonc` rather than attached in the Cloudflare dashboard, because Wrangler reconciles routes on every deploy.

## Assets

Every project's icon, squircle icon, catalog card, and GitHub social-preview banner are produced by `npm run assets -- <id>` (or `-- --all` for the whole catalog), a deterministic compositor (`scripts/generate-assets.tsx`) that takes one human-approved artwork PNG per project from `assets/artwork/` and renders it onto that project's brand gradient. Artwork is committed and expensive to produce; the four generated files under `public/images/projects/<id>/` are disposable and fully reproducible from it, so they're never hand-edited. Open Graph cards are a separate, similarly manual step — `npm run generate:og` — since neither pipeline runs at request time on Cloudflare Workers.

### Adding a project's assets

1. Add the `projects.json` entry (with `brand.gradient`).
2. Pick a subject and one-line tagline per [`assets/anchors/STYLE.md`](assets/anchors/STYLE.md).
3. Get artwork — cheapest technique first: keep an existing icon, deterministic HSL recolour, glyph extraction, image-to-image seeding, geometry seeding, fresh generation, in that order. `STYLE.md` documents all six.
4. **Omar approves the artwork.**
5. Commit it as `assets/artwork/<id>.png`.
6. Run `npm run assets -- <id>`.
7. `src/lib/__tests__/projects.test.ts`'s file-exists assertion keeps you honest — it fails if any of the four generated files is missing.

`assets/artwork/` is **committed and precious** — one human-approved PNG per project, expensive to produce. Everything under `public/images/projects/<id>/` (`icon.png`, `icon-squircle.png`, `card.png`, `github-banner.png`) is **disposable** — deterministically regenerated from that artwork, never hand-edited. Nahtadi is the one exception: its artwork is its real shipped App Store icon (`public/images/nahtadi/icon.png`), never AI-generated.

- **Colour is chosen per project, never defaulted.** Derive it from that project's `brand.gradient` or sample it off its existing icon, and pass it via the generator's `controls.colors` — prompt text alone will not hold a palette. Reusing one amber/gold accent across most of the catalog is what made the first full-catalog generation pass read monotonous; dropping `controls` entirely on an image-to-image call has separately shifted hues wildly (a purple subject went green, a red one went salmon).
- **OG cards silently go stale.** They're pre-rendered PNGs (see the Deployment section above); changing a project's gradient does not touch its committed `public/og/<slug>.png`, and the e2e OG spec only checks HTTP status/content-type — nothing in CI catches the mismatch. Re-run `npm run generate:og` and commit the output whenever a project's gradient changes.

## Project docs

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — the redesign plan and current status.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — architecture and product decisions, with rationale.

## License

Licensed under the GNU General Public License v3.0. See [`LICENSE`](LICENSE).
