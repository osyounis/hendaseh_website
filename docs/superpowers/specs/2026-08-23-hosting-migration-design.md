# Hosting Migration (Vercel → Cloudflare Workers) — Design Spec

**Date:** 2026-08-23
**Sub-project:** 2 of 5 (see `docs/ROADMAP.md`; program decisions in `docs/DECISIONS.md`)
**Status:** Awaiting review

## Goal

hendaseh.com serving from Cloudflare Workers via `@opennextjs/cloudflare`, with the current known-good site — no redesign — verified end to end, DNS moved from GoDaddy-managed to Cloudflare-managed, and Vercel decommissioned. Every sub-project after this builds on the final platform.

## Decisions made in this design (append to `docs/DECISIONS.md` during implementation)

1. **Contact form dropped.** The form was the site's only server-side mutation, only secret (`RESEND_API_KEY`), and only runtime third-party dependency, while the real audience (recruiters) contacts via email/LinkedIn. `/contact` remains one of the four pages, presenting direct channels (email, LinkedIn, GitHub, résumé); its full redesign is sub-project 4. **Resend is decommissioned with it.**
2. **OG images move from runtime to build time.** The `/api/og` route depends on `sharp` (native binary) and `node:fs` — neither runs on Workers. The card set is finite and deterministic, so a build step renders all cards to static `public/og/*.png` from the existing `ogCards.ts` definitions. Faster, CDN-cacheable, zero runtime risk; `sharp` becomes build-time-only.
3. **ImageKit as the `next/image` loader, confirmed over Cloudflare Images.** Omar's rationale: host portability — the loader is a URL prefix, so a future hosting change doesn't touch the image pipeline. ImageKit also does more (media library, overlays, AI edits, video). Cloudflare Images remains the documented fallback if ImageKit limits/costs ever bite.
4. **Analytics: Cloudflare Web Analytics** (free, cookieless beacon) replaces `@vercel/analytics` + `@vercel/speed-insights` at cutover.
5. **CI/CD: Cloudflare Workers Builds** (git integration) replicates the Vercel flow: push to `main` → production deploy; PR branches → preview URLs.

## Constraints

- **Frozen URLs** `/nahtadi`, `/nahtadi/privacy`, `/nahtadi/support` must work identically on Cloudflare (App Store links).
- Both 308 redirects (`/capabilities` → `/about`; showcase-slug enforcement) must survive; `tests/e2e/redirects.spec.ts` guards them.
- No SEO regression: metadata, JSON-LD, canonical URLs, sitemap, robots, OG cards all byte-comparable before/after (modulo the OG URL change, which keeps old query URLs working via redirect).
- No visual change except the contact page losing its form (the page's other content stays until sub-project 4).
- **hendaseh.com must not have a gap in service or email.** Vercel stays live until Cloudflare is verified on the production domain path; nameserver rollback plan retained.
- Adapter floor: `@opennextjs/cloudflare` requires Next ≥ 16.2.11 (repo is on 16.2.9 — patch bump required). No Node middleware exists in the repo (adapter would reject it).

## Architecture / phases

Ordered so the risky step (DNS) carries zero app changes.

### Phase A — App changes, shipped and verified on Vercel first

1. **Next.js patch bump** to latest 16.x (≥ 16.2.11), with `eslint-config-next` matched.
2. **Remove the contact form**: delete `ContactForm.tsx`, `src/app/contact/actions.ts`, `src/lib/validations/contact.ts`, their tests, and the `resend` + `@hookform/resolvers` + `react-hook-form` dependencies (verify no other consumer of react-hook-form first). `/contact` keeps its heading/intro and gains a plain direct-channels block (email `mailto:`, LinkedIn, GitHub, résumé link — unstyled beyond existing utilities; design comes in sub-project 4).
3. **Static OG generation**: `scripts/generate-og.mjs` — a Node build script rendering the cards via `satori` + `sharp` (`next/og`'s `ImageResponse` only runs inside Next, so the script uses satori directly). It reuses the card definitions in `src/lib/ogCards.ts`; if those are currently JSX-shaped for the route, refactor them into a plain data shape that the script (and the future asset engine) consumes. Outputs `public/og/<card>.png` (1200×630) for the site card, Nahtadi card, and each showcase card currently served. Metadata files point at `/og/<card>.png`; `/api/og` route is deleted and `next.config.ts` gains a redirect `/api/og?card=X` → `/og/X.png` (`permanent: false` first, flip to permanent after a release cycle). Rendered output must be visually identical to the current cards (pixel-diff spot check).
4. **ImageKit loader**: `next.config.ts` `images: { loader: 'custom', loaderFile: './src/lib/imagekitLoader.ts' }`. Loader returns `src` unchanged in development; in production prefixes the ImageKit URL endpoint with transformation params (`tr:w-{width},q-{quality|75},f-auto`). ImageKit dashboard: add a **web-folder origin** pointing at `https://hendaseh.com` so existing `/images/*` paths resolve with no re-upload. Needs from Omar: ImageKit URL endpoint ID (public, not a secret).
5. Deploy all of Phase A to Vercel production, verify (build, tests, OG cards render, images serve through ImageKit).

### Phase B — Cloudflare bring-up (no DNS changes)

1. Omar creates the Cloudflare account (free plan) + one-time `wrangler login`.
2. Add `@opennextjs/cloudflare` (devDependency) + `wrangler.jsonc` (`nodejs_compat` compat flag, assets binding, `compatibility_date` current) + `open-next.config.ts` (defaults; no cache KV needed for a static-ish site initially).
3. Scripts: `preview` (adapter's local workerd preview) and `deploy` (build + `opennextjs-cloudflare deploy`).
4. First deploy to `hendaseh.<account>.workers.dev`.
5. **Full verification against workers.dev** — the gate for Phase C:
   - Playwright suite with `BASE_URL` pointed at the preview (all existing e2e specs pass).
   - Manual matrix: every route in the sitemap; both redirects return 308; `/og/*.png` serve; `sitemap.xml`/`robots.txt`; `/dev/tokens` both themes; images served via ImageKit; 404 behavior for unknown slugs.
6. Connect the GitHub repo to Workers Builds: `main` → production Worker; PRs → preview URLs. Verify one PR preview end to end.

### Phase C — DNS migration and cutover

1. **Inventory first**: export/screenshot every DNS record at GoDaddy before touching anything. Explicitly identify: MX records (expected: Google Workspace — this confirms Omar's email hosting definitively), SPF TXT (may cover both Google and Resend), DKIM records (Google + Resend), any CNAME/A for www/apex, and anything unexplained (resolve before proceeding). Save the inventory to `docs/content/dns-inventory-<date>.md` (gitignored dir — it's operational detail).
2. Add hendaseh.com as a Cloudflare zone; Cloudflare auto-imports records; **manually diff against the inventory** — every record accounted for. Resend-specific records are carried over now and removed in Phase D (never mid-cutover).
3. Record GoDaddy's current nameservers in the inventory file (rollback path), then switch nameservers at GoDaddy to Cloudflare's pair.
4. After propagation: attach the custom domain (hendaseh.com + www) to the Worker; Cloudflare manages certs.
5. **Post-cutover verification**: production domain serves from Workers (check `server` headers); full route matrix again on hendaseh.com; **email receive test** (send to omar@hendaseh.com from an external account) and Google Workspace send test; App Store → `/nahtadi` link click-through.
6. Vercel keeps serving until step 5 passes; nothing is removed from Vercel before then.

### Phase D — Decommission and docs

1. Remove `@vercel/analytics` + `@vercel/speed-insights` (packages and `layout.tsx` usage); add the Cloudflare Web Analytics beacon (zone-level auto-injection, or the snippet in `layout.tsx` if auto-injection doesn't fire on Workers responses — verify which applies).
2. Remove Resend DNS records (after confirming SPF changes don't affect Google Workspace sending — if a shared SPF record, edit rather than delete).
3. Delete the Vercel project; note the Vercel MCP server can be disconnected.
4. Docs: append the five decision entries above to `docs/DECISIONS.md`; update `docs/ROADMAP.md` status; update CLAUDE.md's project blurb (now "on Cloudflare Workers", contact form gone, `RESEND_API_KEY`/`.env.local` no longer needed); README deploy notes.

## Error handling / rollback

- **Any Phase B failure**: nothing user-visible has changed; fix or stop.
- **Phase C failure after nameserver switch**: revert nameservers at GoDaddy to the recorded originals (propagation ≤ TTL; GoDaddy zone still intact because we never delete it).
- **Email breakage**: the #1 guarded risk — inventory diff before, receive/send test after; if MX records were missed, re-add in Cloudflare DNS (fix-forward, minutes).
- **ImageKit outage/misconfig**: `next/image` requests fail visibly in Phase A verification while still on Vercel — before Cloudflare is involved. Loader falls back to plain `src` in dev, so local work never blocks.

## Out of scope

- Any page redesign (including the contact page's proper design — sub-project 4).
- Asset engine / regenerating project banners (sub-project 3; the OG build script is deliberately minimal, not the engine).
- ImageKit media-library organization (sub-project 3).
- Turnstile/spam protection (moot — form dropped).

## Success criteria

- hendaseh.com and www resolve to the Worker; all sitemap routes 200; both redirects 308; `/nahtadi*` intact.
- OG cards render as static files, visually identical to current; old `/api/og?card=` URLs redirect.
- Images serve through ImageKit with correct dimensions/format.
- Email to omar@hendaseh.com received after cutover; Google Workspace sending unaffected.
- Push to `main` deploys production via Workers Builds; PR gets a preview URL.
- `npm run build && npm run test:run && npm run lint && npm run test:e2e` green; no `@vercel/*`, `resend`, `react-hook-form` dependencies remain.
- Vercel project deleted; DECISIONS/ROADMAP/CLAUDE.md/README updated.

## Needs from Omar (collected at the step that needs them)

- Cloudflare account creation + `wrangler login` (Phase B).
- ImageKit URL endpoint ID (Phase A).
- GoDaddy login for DNS inventory + nameserver switch (Phase C; done together at the keyboard).
- A quick "did the test email arrive" confirmation (Phase C).
