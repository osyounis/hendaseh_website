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

## Project docs

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — the redesign plan and current status.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — architecture and product decisions, with rationale.

## License

Licensed under the GNU General Public License v3.0. See [`LICENSE`](LICENSE).
