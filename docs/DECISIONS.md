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

## 2026-08-23 — Brand blue is namespaced `brand-50…950`; Tailwind's `blue-*` is untouched

**Decision:** The Hendaseh blue scale is registered as `--color-brand-50 … --color-brand-950` in `@theme`. Tailwind's **default `blue-*` palette is deliberately left alone** — brand blue does not overwrite it.
**Why:** Two reasons, both concrete. (1) 93 existing `blue-*` utility occurrences across 16 files in `src/` would have silently changed hue. (2) `src/lib/projectStyles.ts` pairs `blue-*` classNames with **default-blue hex literals** for the same gradient — e.g. `reddit-nlp` is `from-blue-500` alongside `{ from: '#3B82F6' }` — because Satori cannot resolve Tailwind tokens, so the OG card reads the hex while the in-site card reads the class. Redefining `blue-500` would desync the share card from the card it is supposed to mirror, and `src/lib/__tests__` guards that pairing.
**Revisit when:** Sub-project 4 has moved pages onto the semantic tokens and the raw `blue-*` usages are gone — at which point the namespace question is moot rather than resolved.

## 2026-08-23 — Semantic foreground vars are `--fg-strong` / `--fg-body` / `--fg-muted`

**Decision:** The semantic text tokens use the `--fg-*` prefix. `--text-body` is **not** available as a semantic color name.
**Why:** `--text-body` collided with the `@theme` type-scale variable of the same name (`--text-body: 1rem`, which generates the `text-body` font-size utility). The unlayered `:root` rule won the cascade over Tailwind's layered `@theme` output, so the color value overwrote the font size and broke the `text-body` utility. `--fg-*` has no such collision.
**Revisit when:** Never for this reason — but any future semantic token must be checked against the `@theme` namespaces (`--text-*`, `--color-*`, `--font-*`, `--radius-*`, `--ease-*`) before it is added.

## 2026-08-23 — Dark mode is opt-in via `data-theme="dark"`, not `prefers-color-scheme`

**Decision:** The dark variant is defined as `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))`. It does **not** follow the OS `prefers-color-scheme` media query yet.
**Why:** Only the token layer is dark-aware so far; the pages still carry hard-coded light colors. Binding dark to the media query today would restyle the live site inconsistently for every visitor with a dark OS setting — a half-dark page is worse than a light one.
**Revisit when:** Sub-project 4 has flipped the pages onto the semantic tokens. At that point add the `prefers-color-scheme` default while keeping `data-theme` as the explicit override.

## 2026-08-23 — Known caveat: light-theme `accent` and `fg-muted` are AA-large only on raised surfaces

**Decision:** Shipped as-is and recorded rather than fixed now. Light-theme `--accent` `#0076d1` and `--fg-muted` `#4b779f` clear WCAG AA against `--surface` (#ffffff) at **4.65:1** and **4.73:1**, but against `--surface-raised` (#f3f6fa) they fall to **4.29:1** and **4.36:1** — below the 4.5:1 body-text threshold, so **AA-large only** there.
**Why:** The values come straight off the brand scale, and no shipped page currently puts body-size accent or muted text on a raised surface. Darkening them mid-sub-project would have changed rendered color while the brief was zero visual change.
**Revisit when:** Sub-project 4 applies the tokens to real pages — it must either darken both values or keep them off `surface-raised` for body-size text. This is a blocker for that sub-project, not an optional cleanup.

## 2026-08-23 — Known gap: spacing and elevation tokens were not shipped

**Decision:** The foundation-reset token system shipped **color, type scale, fonts, radius (`--radius-card`, `--radius-control`) and one motion easing (`--ease-brand`)**. The spacing and elevation (shadow) scales the design spec asked for were **not** built.
**Why:** Recorded honestly rather than quietly dropped. Spacing and elevation are only meaningful once real layouts consume them, and inventing a scale with no consumer would have been guesswork that sub-project 4 then had to undo.
**Revisit when:** Sub-project 4 — it owns adding both scales, driven by the layouts it actually builds.
