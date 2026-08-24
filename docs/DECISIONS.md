# Decisions

Program-level decisions for the hendaseh.com redesign. Each entry records the **decision**, **why**, and **revisit when**. Entries are append-only — supersede an old entry with a new dated one rather than editing history.

Source of authority: the "Program-level decisions (locked)" section of [`docs/superpowers/specs/2026-08-23-foundation-reset-design.md`](superpowers/specs/2026-08-23-foundation-reset-design.md). The master plan is [`docs/ROADMAP.md`](ROADMAP.md).

---

## 2026-08-23 — Four-page public site structure

**Decision:** Exactly four public pages — Home, About, Projects, Contact — plus the Nahtadi family and per-project showcase pages. `/capabilities` is deleted, with a permanent redirect to `/about`.
**Why:** The old page set had overlapping, thin pages. Four pages give each one enough content to justify itself and keep navigation obvious.
**Revisit when:** A genuinely new content type appears (e.g. writing/blog) that does not fit inside the four.

## 2026-08-23 — Nahtadi URLs are frozen

**Decision:** `/nahtadi`, `/nahtadi/privacy`, and `/nahtadi/support` never change — not the paths, not the slugs.
**Why:** The App Store listing links to them. A broken support or privacy URL is an App Store compliance problem, not just a 404.
**Revisit when:** Never, unless the App Store listing itself is updated first and verified live.

## 2026-08-23 — Keep Next.js (App Router) + Tailwind v4

**Decision:** No framework change. The redesign is a cleanup and rebuild *inside* the existing Next.js 16 App Router + React 19 + Tailwind v4 stack.
**Why:** The stack is current and fits the work (RSC, `next/og`, file-based routing). A framework migration would spend the program's budget on rewriting what already works.
**Revisit when:** A hosting or feature requirement the App Router genuinely cannot meet appears.

## 2026-08-23 — Host on Cloudflare Workers via `@opennextjs/cloudflare`

**Decision:** Migrate hosting from Vercel to **Cloudflare Workers** using the `@opennextjs/cloudflare` adapter. Explicitly **not** Cloudflare Pages.
**Why:** Cloudflare Pages is in maintenance mode; Workers is Cloudflare's recommended target for new projects, and `@opennextjs/cloudflare` is the Next.js-team-recommended adapter.
**Revisit when:** Sub-project 2 hits an adapter limitation that blocks a required route (contact form, OG generation, redirects).

## 2026-08-23 — Tiered project detail pages

**Decision:** Three tiers — `flagship` (Nahtadi, custom page at `/nahtadi`), `showcase` (`/projects/[slug]` case study, only where there is a real story *and* real visuals), `card` (grid card links out, no page). Every project gets the full asset treatment regardless of tier.
**Why:** A thin auto-generated detail page for a project with nothing to show reads worse than a good card. Uniform assets keep the grid consistent even when depth is not.
**Revisit when:** A `card` project gains a demo, GIF, or written story that clears the showcase bar (final tier assignment happens in sub-project 5).

## 2026-08-23 — Hybrid asset pipeline (code frame + AI artwork layer)

**Decision:** Project assets are produced by a code-rendered brand frame (gradient, layout, typography — deterministic, free to re-render) plus an *optional* AI-generated artwork layer for the icon mark.
**Why:** Code guarantees brand consistency and cheap regeneration across the whole catalog; AI only fills the gap where a project has nothing to screenshot.
**Revisit when:** Sub-project 3 finds the artwork layer is unnecessary, or the frame needs to become fully design-authored instead of generated.

## 2026-08-23 — No backend; Supabase is the designated choice if one is ever needed

**Decision:** The site has **no backend**. It stays static/SSR with server actions only (contact form via Resend). If a backend ever becomes necessary, **Supabase** is the pre-decided choice.
**Why:** Nothing on a portfolio currently justifies a database or auth. Naming the future choice now prevents a rushed, ad-hoc pick later.
**Revisit when:** A feature actually requires persistence, auth, or user data — at which point this entry is the starting point, not a re-litigation.

## 2026-08-23 — ImageKit for image delivery and generated-asset storage

**Decision:** ImageKit replaces Vercel's image optimizer as the `next/image` loader once the site runs on Cloudflare, and also stores/transforms the assets the asset engine generates.
**Why:** Vercel's optimizer does not come along in the migration; ImageKit covers both needs with one account, and its API/DevTools MCP is already connected.
**Revisit when:** Cloudflare Images proves simpler, or ImageKit's limits/costs stop fitting.

## 2026-08-23 — Higgsfield for project icon artwork (API access unverified)

**Decision:** Higgsfield is the intended generator for the icon-artwork layer, mainly for projects with nothing to screenshot. **API access is unverified** and must be confirmed in sub-project 3 before anything depends on it.
**Why:** It matches the needed style and is already available through tooling; the asset engine, though, is designed so artwork is optional.
**Revisit when:** Sub-project 3 verifies (or fails to verify) API access — if it fails, the code-rendered frame ships alone or another generator is picked.

## 2026-08-23 — Internal working docs stay out of version control

**Decision:** `docs/CONTENT-AUDIT.md` and `docs/content/` are **local-only and gitignored**. They are not in version control and will not be present on a fresh clone; they live only on Omar's machine.
**Why:** This repo is public. The audit documents a correctness bug in an app that is live and iframe-embedded on the site, names private repositories, records pre-negotiation commercial posture toward the Coast Guard, and contains candid per-project self-assessment. `docs/content/` is raw, possibly-outdated personal source material. `.claude/` and `CLAUDE.md` are already excluded for the same reason.
**Revisit when:** The repo goes private, or a sanitised public summary of the audit's conclusions is wanted — in which case write a new file rather than un-ignoring these.
