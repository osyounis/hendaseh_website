# hendaseh.com

Source for [hendaseh.com](https://hendaseh.com) — Omar Younis's software engineering portfolio.

The site covers his projects (including Nahtadi, a shipped iOS app) and hosts Nahtadi's privacy and support pages.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zod · Framer Motion · Resend (contact form) · Vitest + Playwright. Deployed on Vercel.

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

## Project docs

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — the redesign plan and current status.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — architecture and product decisions, with rationale.

## License

Licensed under the GNU General Public License v3.0. See [`LICENSE`](LICENSE).

<!-- Workers Builds preview smoke test — this branch is never merged. -->
