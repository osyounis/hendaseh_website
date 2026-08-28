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

## 2026-08-24 — Contact form dropped; Resend decommissioned

**Decision:** The contact form is removed and **Resend is decommissioned**. `RESEND_API_KEY` is gone from the repo (it was never committed — `.env.local` is gitignored and appears in no commit), gone from the dependency tree, and the `send` TXT/MX and `resend._domainkey` DNS records are deleted from the zone. **Still outstanding:** the API key itself remains valid in the Resend dashboard and in a stale local `.env.local` on Omar's machine — it needs revoking, and that file deleting. `/contact` remains one of the four public pages and presents direct channels only (email, LinkedIn, GitHub, résumé). Supersedes the "no backend" entry of 2026-08-23 insofar as it described a contact form via Resend.
**Why:** The form was the site's only server-side mutation, its only secret, and its only runtime third-party dependency — three sources of migration risk and ongoing maintenance for a channel nobody used. The real audience (recruiters, hiring managers) contacts by email or LinkedIn.
**Revisit when:** A contact channel is actually needed that email cannot serve. Any replacement must not reintroduce a runtime secret without a deliberate decision about where it lives on Workers.

## 2026-08-24 — OG images move from runtime generation to build time

**Decision:** The runtime `/api/og` route is deleted. Cards are pre-rendered by `npm run generate:og` (`scripts/generate-og.tsx` → `src/lib/assetTemplates.tsx` + `src/lib/ogCards.ts`) into `public/og/*.png` and served as static assets. `satori` and `sharp` are **build-time-only** devDependencies. Two 307 redirects in `next.config.ts` map old `/api/og` URLs onto their static PNGs.
**Why:** `next/og` at runtime needs `sharp` and `node:fs`; neither runs on Cloudflare Workers. The card set is finite and fully deterministic — one per project plus the site card — so there was never a reason to render it per request. Static PNGs are also faster and cheaper for the crawlers that actually fetch them.
**Revisit when:** Cards need to vary per request (they should not), or the card set grows large enough that generating it by hand becomes a chore. **Regeneration is manual** — a copy or gradient change ships a stale card unless `npm run generate:og` is re-run and the PNGs committed.

## 2026-08-24 — ImageKit is the `next/image` loader, chosen over Cloudflare Images

**Decision:** `next.config.ts` uses `loader: 'custom'` with `src/lib/imagekitLoader.ts`, pointing at endpoint `https://ik.imagekit.io/osyounis` with a WEB_FOLDER origin at `https://hendaseh.com`. Images stay in `public/`; ImageKit pulls and transforms them. Cloudflare Images remains the documented fallback.
**Why:** Host portability. The loader is nothing but a URL prefix, so a future host change does not touch the image pipeline at all — whereas Cloudflare Images would bind image delivery to the same vendor as hosting, which is exactly the coupling this migration just spent a sub-project undoing. ImageKit also stores the generated project assets sub-project 3 will produce, so one account covers both needs.
**Revisit when:** ImageKit's free-tier limits or costs stop fitting, or the origin-pull model conflicts with the asset engine's storage model.

## 2026-08-24 — Analytics: Cloudflare Web Analytics (chosen; not yet enabled)

**Decision:** **Cloudflare Web Analytics** (free, cookieless) is the chosen replacement for `@vercel/analytics` and `@vercel/speed-insights`; both packages and their `layout.tsx` usage are removed. Once enabled, the beacon is injected automatically by Cloudflare because the zone is proxied — **no `<script>` tag lives in this repo**.
**Status (2026-08-24): not yet enabled.** Turning it on is a dashboard action of Omar's, so **the site currently collects no analytics at all** — the Vercel beacons are gone and nothing has replaced them. The decision itself stands regardless; only its activation is pending.
**Why:** The Vercel packages do not work off Vercel. Cloudflare's equivalent is free with the zone, needs no cookie banner, and auto-injection keeps third-party script management out of the codebase. If auto-injection ever has to be replaced by the manual snippet, **never add an `integrity`/SRI hash** to it: the beacon is self-updating, and a pinned hash would silently kill analytics on Cloudflare's next release.
**Revisit when:** Real-user performance data (Core Web Vitals over time) is wanted at a depth Cloudflare's free tier does not reach.

## 2026-08-24 — CI/CD: Cloudflare Workers Builds

**Decision:** Deploys run on **Cloudflare Workers Builds**, connected to the GitHub repo: push to `main` → production, pull requests → preview URLs. No GitHub Actions workflow, no API token stored in the repo.
**Why:** It is the native equivalent of the Vercel git integration the migration removed, so the day-to-day workflow (`dev` → PR → `main`) is unchanged. Cloudflare holds its own credentials, so nothing has to be minted, scoped, and rotated in GitHub secrets.
**Revisit when:** A build step Workers Builds cannot run is needed (e.g. asset generation requiring credentials), at which point GitHub Actions with a scoped API token is the fallback.

## 2026-08-24 — `incrementalCache: staticAssetsIncrementalCache` is a binding constraint

**Decision:** `open-next.config.ts` overrides the adapter default with `staticAssetsIncrementalCache`. This is a **constraint on all future work, not a footnote.**
**Why:** With the adapter's plain `defineCloudflareConfig()` there is no incremental cache, so the Worker's read of the prerendered SSG payload for `/projects/[slug]` misses — and because that route sets `dynamicParams = false`, the miss becomes a **404**. Both showcase case studies (`/projects/brent-cuda`, `/projects/collision-avoidance-radar`) were dead in exactly this way before the override. `staticAssetsIncrementalCache` reads the payloads out of the Workers static-assets binding: read-only, provisions nothing, costs nothing.
**Revisit when:** **Before** any work adds ISR, `revalidate`, a server action, an API route, or the composable cache — a read-only cache **forbids revalidation** and any of those will break against it. Sub-projects 3–5 must swap in a KV-backed incremental cache first if they need any of them.

## 2026-08-24 — Custom domains are declared in `wrangler.jsonc`, never attached in the dashboard

**Decision:** `hendaseh.com` and `www.hendaseh.com` are declared as `routes` with `custom_domain: true` in `wrangler.jsonc`. They are **not** attached by clicking in the Cloudflare dashboard.
**Why:** Wrangler reconciles routes on **every** deploy. A CI deploy from a config that lacks these entries would detach the custom domains and take the live site down — a dashboard-only attachment is a silent trap waiting for the next `main` push. Declaring them in config makes the deploy idempotent and the domain binding reviewable in a diff.
**Revisit when:** Never remove these entries while the domains are live. Adding a hostname means adding it here first.

## 2026-08-24 — No CAA records on the zone

**Decision:** The zone carries **no CAA records**. The three inherited CAA records (which authorized Vercel's certificate issuers) were deleted before cutover.
**Why:** CAA restricts which CAs may issue for the domain. The inherited set named Vercel's issuers, so leaving it in place would have blocked Cloudflare's certificate at the worst possible moment. Absent CAA, any CA may issue — which is the permissive default and is what allowed the cutover to complete cleanly.
**Revisit when:** Tightening certificate issuance is wanted as hardening — then add CAA records naming **Cloudflare's** issuers (`digicert.com`, `letsencrypt.org`, `pki.goog`, `ssl.com`, per Cloudflare's current set), verify certificate renewal afterwards, and never leave a stale issuer list behind again.

## 2026-08-25 — Project-artwork art direction locked as v2 (transparent subject, colour inside the subject); v1 "Apple-modern flat" rejected

**Decision:** The asset engine's icon-artwork style is a **transparent floating subject — no background tile** — carrying luminous multi-hue gradients inside itself, glossy and dimensional, which the code-rendered frame composites onto each project's own `brand.gradient`. The source of truth is **Omar's own existing icons** in `public/images/projects/`, and the locked spec is `assets/anchors/STYLE.md` (v2). v1 is preserved at the bottom of that file for history and must never be generated from again.
**Why:** v1 — a flat geometric subject on a full-bleed gradient tile, palette restricted to the gradient pair plus white and one accent, no text — was built and three anchors were approved individually. But once the full 12-project catalog was generated and reviewed together as a grid, Omar rejected it: putting colour in the *background* and leaving the subject flat white made the set read duller and more uniform than the hand-made icons it was meant to replace — the opposite of the redesign's "not boring" requirement. v2 stops inventing a new style from the brandbook and instead targets what already worked: Omar's own icons.
**Revisit when:** A future full-catalog review finds v2 itself reading monotonous or off-brand at scale — the same failure mode that sank v1 — or Omar's own icon style changes and the source-of-truth set needs updating with it.

## 2026-08-25 — Recraft REST API is the generator, superseding "Higgsfield for project icon artwork (API access unverified)"

**Decision:** Supersedes the 2026-08-23 entry above, "Higgsfield for project icon artwork (API access unverified)." The asset engine's generator is the **Recraft REST API** — `POST https://external.api.recraft.ai/v1/images/generations` for text-to-image, `POST /v1/images/imageToImage` for image-to-image seeding, `POST /v1/images/replaceBackground` for reworking a ground — not the Higgsfield CLI. The catalog default is `model: recraftv3` with a custom style, `style_id: bb32bb31-09dc-40fd-84ed-ba21f1b9732a`, trained on five of Omar's own originals (pilot-tracker, image-watermark-remover, cycloidal-drive-creator, wildfire-predictor, asl-detector) and private to his account. `controls.colors` is mandatory on every call, generation or image-to-image. Full interface details live in `assets/anchors/CLI-NOTES.md`; the style and generation-order workflow are locked in `assets/anchors/STYLE.md`.
**Why:** The superseded entry was wrong on two independent counts. First, Higgsfield's best-fit model (Recraft V4.1, vector mode) turned out to require a paid Basic plan that was never purchased, and its free-tier alternatives spiked at mediocre subject fidelity for a technical, budget-constrained catalog run. Second, and more fundamentally, the art direction that entry assumed — v1 "Apple-modern flat" — was itself rejected (see the entry above), so even a verified Higgsfield path would have generated the wrong style. Calling Recraft directly gave exact-palette control via `controls.colors`, a custom style trainable on Omar's own art, and a per-generation cost (35–40 units, ≈$0.04) that fit comfortably inside the ~$10 of API units purchased for the phase.
**Revisit when:** Recraft's pricing, custom-style support, or palette-control API stops fitting the catalog's needs. Higgsfield remains a documented fallback — the account still holds 9 free credits — if a future asset type needs video, which Recraft does not do.

## 2026-08-25 — Nahtadi's catalog card renders through the asset engine, not the raw App Store icon file

**Decision:** The projects-grid card for Nahtadi (`projects.json` → `image`) points at the engine-composited `public/images/projects/nahtadi/card.png`, not `public/images/nahtadi/icon.png` directly. `public/images/nahtadi/icon.png` itself is untouched, and `/nahtadi` still uses it as-is.
**Why:** `icon.png` is the mihrab-arch mark on full transparency (alpha mean ≈61 across the 1024² canvas) — it's the real shipped App Store icon asset, not a pre-composed square tile. Used directly as a grid card it had no ground of its own and depended entirely on whatever background the card slot happened to supply. The engine card instead renders that same mark on Nahtadi's own dark-green `brand.gradient`, reproducing the mark-plus-ground pairing users actually see on the App Store, and is now produced by the same deterministic pipeline (`npm run assets -- nahtadi`) as every other project's card instead of being a special case.
**Revisit when:** Nahtadi's App Store icon is redesigned — regenerate its card with `npm run assets -- nahtadi` (still seeded from the real icon, never AI-generated; `STYLE.md`'s Nahtadi exception is unaffected).

## 2026-08-27 — Real-device testing runs against `npm run preview`, never the dev server

**Decision:** Every ⏸ browser-approval checkpoint and every motion, hydration, or touch check on a physical device runs against the Worker build — `npm run preview -- --ip 0.0.0.0`, opened at `http://<LAN-IP>:8787`. The `next dev` server is never the target of a real-device check. Separately, `next.config.ts` now sets `allowedDevOrigins: ['192.168.1.*', '192.168.0.*']` so that loading the dev server from a phone fails loudly rather than misleadingly. A checkpoint verdict taken against the dev server is not evidence and does not count.
**Why:** Next 16 blocks cross-origin requests to `/_next/*` by default, and a phone on a LAN IP is cross-origin. With `allowedDevOrigins` unset the phone silently received HTML with no JavaScript: React never hydrated, so every interactive element was dead and the dev client repeatedly restarted CSS animations. Nothing announced itself as a blocked request — it presented as "the hamburger is broken sitewide" and "the ticker and hero orbit flicker," and a review cycle was spent chasing both as rendering defects in code that was in fact fine. The config change removes the trap; the procedure change removes the reason to be near it, since `dev` is not what ships anyway (no production build, no minification, StrictMode double-invokes effects, HMR live) while `preview` runs the real Worker in workerd.
**Revisit when:** The local subnet changes — add the new range to `allowedDevOrigins` (matching is per dot-segment from the right, so `172.20.10.*` covers an iPhone Personal Hotspot). If a future workflow genuinely needs HMR on a device, that is an explicit, narrow exception and still never the basis for an approval verdict.
