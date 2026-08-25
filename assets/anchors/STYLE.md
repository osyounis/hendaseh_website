# Hendaseh project-icon style — locked 2026-08-25

Omar-approved style, distilled from a 25-generation anchor session. The three anchor PNGs in this
directory are the visual source of truth; this file is the operational recipe. Anything ambiguous:
match the anchors.

## The three anchors (all Omar-approved)

| file | subject | how it was made |
|---|---|---|
| `anchor-1-compass.png` | compass rose dial, green/gold (islamic-prayer-time palette) | `recraftv3`, prompt-only (round 5) |
| `anchor-2-helicopter.png` | rescue helicopter over water, orange/blue (pilot-tracker palette) | `recraftv4_1`, prompt-only (round 8) |
| `anchor-3-gears.png` | meshing white+amber gears, teal/purple (mini-compiler palette) | `recraftv3` + **custom style** (see below) |

## Custom style — the primary generation path

A Recraft custom style trained on anchors 1+2 (our own images, nothing third-party):

- **style_id: `9771fd49-aadc-48c8-a309-98ccffe53175`** (private to Omar's Recraft account)
- Pass `"style_id"` in the generation body **instead of** `"style"`. Works with `recraftv3` (custom styles are V2/V3-only; V4.1 ignores them).
- Re-create if ever lost: `POST /v1/styles` with `style=digital_illustration`, `files=` anchor-1 + anchor-2 (+3). Costs ~5 credits.

**Catalog default:** `recraftv3` + `style_id` + `controls.colors` (project gradient + white + accent) + a SHORT prompt (V3 caps prompts ≈1000 chars). Fall back to `recraftv4_1` prompt-only (long prompts allowed, no style_id) when V3's output goes busy — then apply the style rules below hard in the prompt.

## Style rules (from the anchor session + studying Apple's real icons locally — analysis only, never as generation inputs)

1. **Full-bleed square artwork, no tile** — background reaches all four edges. Baked rounded corners from the model are fine; the compositor masks corners authoritatively.
2. **Subject fills most of the frame** (~85–90%). Small floating subjects read sterile.
3. **Light from directly above; vertical gradients** (lighter top). Diagonal reads less Apple.
4. **Depth = silky continuous shading** — soft volumetric gradients inside shapes, one soft contact/cast shadow. NEVER bevel rings or "inner shadow ring" language (produces clunk), never grain/noise.
5. **No outlines. No text** (letters sneak in via compass cardinal marks etc. — reject those).
6. **Palette per project**: gradient pair from `projects.json` `brand.gradient` + white + ONE accent chosen to complement that palette (gold vs greens, amber vs teal/purple…). Record the accent per project. Enforce via `controls.colors` (rgb array), not just prompt.
7. **Few elements, exquisitely rendered** — Apple's lesson. One subject; complexity budget like the anchors, no scenery unless it IS the concept (helicopter's sky/water).
8. **Prompt discipline**: describe only what should exist. Naming decorations in negations ("no scattered stars") plants them. Keep a short Forbidden list for structural things only (tile, margins, borders, text, outlines, gloss, photorealism).

## Master prompt template (V3 + style_id — keep under 1000 chars)

```
App icon artwork: {SUBJECT}, on a smooth vertical gradient from {FROM_NAME} to {TO_NAME}.
Simple, clean, softly shaded, subject filling most of the frame, no outlines, no text.
```

With `controls`: `{"colors": [{FROM_RGB},{TO_RGB},{255,255,255},{ACCENT_RGB}]}`.

For the V4.1 fallback, expand with the full style language (see `git log` for the round-8 helicopter prompt as the reference long-form).

## Fix-up toolkit (when a single generation is 90% right)

Use surgically, in this order of preference — each proved out in the anchor session:

1. **Re-roll** with a tightened prompt (cheap, ~$0.04).
2. **Image-to-image** `POST /v1/images/imageToImage` (multipart: `image`, `prompt`, `strength`, `model=recraftv3`): strength 0.15–0.25 preserves composition while fixing style/depth. Composition problems can be fixed by hand first (sharp: cut with feathered circular mask, patch background by sampling a clean column of the vertical gradient and stretching), then healed at ~0.18.
3. **Background replacement** `POST /v1/images/replaceBackground` (multipart: `image`, `prompt`, `model=recraftv3`) — when the subject is right and only the background is wrong. May mute colors: restore with sharp `modulate({brightness:~1.04, saturation:~1.12})`.
4. Know when to STOP compositing: chains of surgery accumulate wrongness (the gear saga). If two fix-ups haven't landed it, regenerate fresh — ideally via the custom style.

## Nahtadi exception

Never generate artwork for Nahtadi. Its real App Store icon (`public/images/nahtadi/icon.png`) is its artwork; the engine only builds banners around it.
