# Home — APPROVED design contract (M1 complete, 2026-08-26)

**Approved mockups (the visual contract for Task B1):**
- `v9-final.html` — dark theme (canonical)
- `v9-final-light.html` — light theme companion
- History: v1 directions → v9 across 9 iterations with Omar; superseded files kept for reference.

## Page structure (locked, in order)

1. **Hero** — aurora + starfield sky; **swarm cluster**: Hendaseh hexagon tile pinned at center, 7 project icons (squircle assets) at varied sizes/radii revolving **clockwise as one group**, icons counter-rotated to stay upright, full lap ≈ 60s; staggered pop-in on load. Below: `Omar Younis` (Roboto 900), tagline `Software Engineer · iOS, ML & Autonomous Systems` (tagline segment in blue), CTAs `View projects` (primary) + `Résumé (PDF)`. **No availability line. No radar sweep. No orbit rings/guides.**
2. **Ticker** — full-width moving tape (~30s loop, pauses on hover, `aria-hidden`, static under reduced motion): quiet monochrome pairs + uncostumed real stats. Items: SWIFT/SWIFTUI · PYTORCH/TENSORFLOW · CUDA/C++ 35.31× · PYTHON/NUMPY · APP STORE 5.0★ · MECHANICAL 7 YRS. **No stock-price styling, no green gains.**
3. **Flagship band** — eyebrow `FLAGSHIP`, heading `Shipped, and live today.`; green-gradient card (Nahtadi brand gradient), Nahtadi icon **on its green tile** (the raw icon is transparent — never place it bare on dark), meta line `LIVE ON THE APP STORE · 5.0★ · PRIVACY-FIRST`, description, white `The story →` button → `/nahtadi`.
4. **Work grid** — eyebrow `WORK`, heading `Proof, not promises.` **Tier-semantic sizes:** two horizontal feature tiles (showcase tier: brent-cuda, collision-avoidance-radar) with full **uncropped** square icons (172px), one-line description, `Case study →` → `/projects/<slug>`; three compact tiles (card tier: islamic-prayer-time, cycloidal-drive-creator, image-watermark-remover) with 72px icons → GitHub links. `All projects →` button → `/projects`. **Never center-crop the square card images into banner slivers.**
5. **CTA** — card `Have a role in mind?` / `Sunnyvale, CA · omar@hendaseh.com` / `Email me` + `LinkedIn`.
6. **Footer** — © Omar Younis · omar@hendaseh.com · Sunnyvale, CA.

**Cut from Home (deliberate):** Range/skills section (ticker owns that message; ME line lives in hero lede + About), scroll-scrub statement (mechanic rejected; the sentence moves to About), availability stamp, blueprint numbered section labels.

## Section header pattern (sitewide)
Small blue eyebrow (12px, 900, letterspaced) + large statement heading (Roboto 900). No numbers, no rules-with-boxes.

## Hero copy (locked)
Lede (if used under tagline): "I design the solution first — then learn whatever the problem needs. Machines for seven years; now the software that drives them." — canonical-facts compliant; no embellishment beyond it.

## Build notes for B1
- Both themes per the mockup pair; system `prefers-color-scheme` (flip mechanism stays Task B6).
- Framer Motion for pop-in/orbit or pure CSS — either, but reduced-motion = fully static (cluster frozen in the mockup's default pose, tape stopped).
- **Performance warning:** do NOT implement fine repeating-gradient rings/patterns in CSS (choked rasterizers in testing); SVG for any ring/guide geometry.
- Icons come from `public/images/projects/<id>/icon-squircle.png` + `public/images/nahtadi/icon.png` (green tile treatment for Nahtadi).
- Ticker duplicates its content once for the seamless -50% translateX loop.
- Mockup hex values map to the existing token scales (blue-400/500/600, navy-*); any value not in tokens becomes a token first.
