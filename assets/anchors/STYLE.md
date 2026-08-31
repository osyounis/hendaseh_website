# Hendaseh project-icon style — locked 2026-08-25 (v2)

> **v1 (flat "Apple-modern flat", full-bleed gradient tile) was REJECTED by Omar at the Task-5 gate.**
> It is preserved at the bottom of this file for history. Do not generate from it.

The visual source of truth is **Omar's own existing project icons** in `public/images/projects/`.
Anything ambiguous: match those.

## The language

1. **Transparent floating subject — no background tile.** The artwork is a subject on full
   transparency; the compositor puts it on the project gradient. (10 of Omar's 11 originals are
   built this way: alpha mean 44–118 on a 1024² canvas.)
2. **Colour lives INSIDE the subject**, as luminous multi-hue gradients — not in a flat ground
   behind it. This is the single biggest difference from v1 and the reason v1 read as monotonous.
3. **Glossy and dimensional**, with soft specular highlights and a gentle three-quarter view.
   Not flat vector, not photoreal, not chunky toy-3D.
4. **Simple, clean, professional.** One subject, few elements, exquisitely rendered.
5. **Text is allowed** where it carries meaning (`NLP`, `CUDA`) — v1 banned it; Omar does not.

## Generator

Recraft REST API (see `CLI-NOTES.md` for endpoints). Catalog default:

- `model: recraftv3`
- **`style_id: bb32bb31-09dc-40fd-84ed-ba21f1b9732a`** — custom style trained on FIVE of Omar's own
  originals (pilot-tracker, image-watermark-remover, cycloidal-drive-creator, wildfire-predictor,
  asl-detector). Private to Omar's account. Recreate with `POST /v1/styles`,
  `style=digital_illustration`, repeated `files=` (~5 credits).
- **`controls.colors` is MANDATORY on every call, including image-to-image.**
- `POST /v1/images/removeBackground` after generation, to key the plain-white ground out.

### Prompt tail

```
Clean professional app icon illustration, glossy, luminous gradients, soft highlights,
single centered subject, plain white background.
```

## Rule: colour must be chosen per project, never defaulted

The v1 catalog pass failed because a gold/amber accent was reused for **9 of 12** projects, so every
subject read white-plus-amber and only the ground hue varied. Derive each project's colours from its
own `brand.gradient`, or sample them off its existing icon — and pass them in `controls.colors`.
Prompt words alone do not hold a palette.

**A dropped `controls` field on the image-to-image path once turned a purple helicopter green and a
red joystick salmon.** Multipart calls need `controls` as a JSON string field; it is easy to omit.

## Techniques, in order of preference

Generation is the last resort, not the first. Cheaper and more faithful, in order:

1. **Keep the original.** Omar's icons are strong. Several rounds of generation failed to beat them.
   Regenerate only where something is actually missing or wrong.
2. **Deterministic recolour** (`sharp`, HSL hue remap by family) — when the render is right and only
   the hues are off. Preserves shading exactly. Used for `islamic-prayer-time`.
3. **Glyph extraction** (`sharp`, min-channel + saturation gate + connected-component filter, keep
   the N largest blobs) — to lift a subject off its own background tile. Used for `mini-compiler`,
   which removed the tile while keeping Omar's exact `>_`.
4. **Image-to-image seeding** from Omar's original, `strength` 0.35–0.50 — keeps his composition and
   restyles it. Used for `cycloidal-drive-creator`.
5. **Geometry seeding** — render the true shape yourself (SVG from real parametric equations) and
   seed image-to-image from it, when the model does not know a technical subject. Tried for the
   cycloidal disc; the geometry was correct but the result lost craft, and Omar rejected it.
   Keep the technique in mind; it is right for a shape a model has no prior for.
6. **Fresh text-to-image** — for subjects with no existing artwork at all (`brent-cuda`).

## Exceptions

- **Nahtadi:** never generate artwork for it. Its real App Store icon
  (`public/images/nahtadi/icon.png`) is its artwork; the engine only builds banners around it.
- **`coast-guard-pilot-tracker`** uses `anchor-2-helicopter.png`, which is an **opaque full-bleed**
  image from v1, not a transparent subject. It is the one input in the set that carries its own
  background. The compositor detects this by alpha coverage and uses it as the full tile.

---

## Superseded — v1 "Apple-modern flat" (2026-08-25, rejected same day)

Flat geometric subject, full-bleed square artwork on the project gradient, palette restricted to the
gradient pair + white + one accent, no text, corners masked by the compositor. Anchors
`anchor-1-compass.png`, `anchor-2-helicopter.png`, `anchor-3-gears.png`; custom style
`9771fd49-aadc-48c8-a309-98ccffe53175` (trained on anchors 1+2).

Rejected because, at catalog scale, colour-in-the-background plus a flat white subject reads
duller and more uniform than Omar's existing icons. Only `anchor-2` survives, as noted above.


## Sub-project 5 additions (2026-08-30)

- `radar-moboard.png` — drafting-compass-on-plotting-dial, recraftv3 + custom style, background keyed. Gradient: deep sea-steel `#0F2A43 -> #101F2E`, cyan/amber accents.
- `a16-summarizer.png` — **REPLACED 2026-08-30 (W3), superseding the W4 render below.** Omar's chosen image: an A16 die with pins and a chat bubble, glowing on pure black. Extracted to a transparent PNG (1254x1254, straight alpha) by the sanctioned glyph-extraction technique, using `alpha = max(R,G,B)` with un-premultiplied RGB. The subject is ADDITIVE GLOW, not an object on a backdrop, so **do not re-extract with a threshold** — that clips the glow and leaves a dark halo. Verified: composited on the card gradient, background pixels deviate from the pure gradient by at most 1/255 per channel.
  Card gradient: **`#0A0A0C -> #2A2A2E`** (near-black to dark grey). Three plausible alternatives are all wrong, recorded so they are not retried:
  - the W4 LIGHT gradient `#F5F5F7 -> #E8E8ED` fails outright — composited, the chip washes out and the A16 wordmark is barely legible, because the artwork is glow-on-black. a16-summarizer is therefore **no longer the catalog's one light card**: a deliberate W4 choice given up knowingly, not overlooked.
  - VIOLET and FUCHSIA fail on hue collision. Measured, the artwork's saturated pixels sit 53% inside 210-270 degrees (peak 220-250, blue-violet); asl-detector already owns violet (`#5B21B6 -> #2E1065`), and a fuchsia ground sits too close to the subject to separate from it — the same rule `home/APPROVED.md` records as the green-on-green blend bug.
  - NEUTRAL DOES NOT COLLIDE with brent-cuda (`#4B5563 -> #1F2937`), which reads as a blue-grey slate against this near-black. Verified by rendering side by side.
  - Do not darken further toward flat black. Every other catalog card has visible gradient movement; one that reads flat would look like a fault.
  The **case-study hero** gradient is separate and is `#4338CA -> #1E1B4B` (see `docs/superpowers/content/a16-summarizer-COPY.md`, row B1): the near-black squircle needs a ground to separate from, which the card gradient cannot provide.
- `a16-summarizer-render.SUPERSEDED.mjs` — the W4 generator, **kept as the worked example of technique 7 and nothing else**. It no longer produces the shipped artwork; it writes a `-SUPERSEDED-w4.png` scratch file (gitignored) and hard-fails if its output path is ever pointed back at `a16-summarizer.png`. It is the only paired render script in `assets/artwork/`; the convention there remains **one committed, human-approved PNG per project**, with generators the exception rather than the rule.
  What it drew (for the method record): FULL-SQUARE opaque artwork, 100% procedural, no AI — per-pixel conic aurora on the die face (Omar's key observation: the aurora sits ON the face, not around it), silver A16, white received-style iMessage bubble with blue quote.
- **New technique 7 for the ladder: full-procedural rendering** — when the reference demands precision no model will hold (exact geometry, exact color fields), render it in code (per-pixel math + SVG overlay). Deterministic, infinitely tunable, free.
