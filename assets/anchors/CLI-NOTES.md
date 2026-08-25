# Generator interface notes

> **SUPERSEDED for generation (2026-08-25):** the asset engine's generator is now the **Recraft REST API**, not the Higgsfield CLI — see the "Recraft API" section below, and `STYLE.md` for the locked style + workflow. The Higgsfield notes remain for reference (account still holds 9 free credits; useful someday for video).

## Recraft API (the active generator)

- Auth: `Authorization: Bearer $RECRAFT_API_KEY` — key in `.env.local` (gitignored). Omar's account, ~$10 API units purchased 2026-08-24; a generation costs 35–40 units (≈ $0.04), custom-style creation ~5 credits.
- Generate: `POST https://external.api.recraft.ai/v1/images/generations` — JSON body: `prompt`, `model` (`recraftv4_1` | `recraftv3`), `size: "1024x1024"`, `n`, optional `style_id` (V3 only), `controls: { colors: [{"rgb":[r,g,b]},…], background_color? }`.
- Image-to-image: `POST /v1/images/imageToImage` — multipart: `image`, `prompt`, `strength` (0–1), `model`. V3 examples only.
- Background replace: `POST /v1/images/replaceBackground` — multipart: `image`, `prompt`, `model`.
- Custom styles: `POST /v1/styles` — multipart: `style=digital_illustration`, repeated `files=`. Returns `id` → pass as `style_id`. **Active style: `9771fd49-aadc-48c8-a309-98ccffe53175`** (trained on anchors 1+2).
- Response: JSON `data[0].url` (CDN); download with `curl -sL`. `credits` field reports the charge.
- Caps: V3 prompt ≈1000 chars; V4.1 accepts long prompts. V4.1 ignores `style`/`style_id` (prompt + controls only).

---

# Higgsfield CLI — spike notes (2026-08-24, superseded)

Interface contract for the asset engine's generation half. Verified live against CLI v1.1.23 on Omar's account (`omar@hendaseh.com`).

## Setup

```bash
npm i -g @higgsfield/cli        # installs `higgsfield` (aliases: higgs, hf)
higgsfield auth login           # browser sign-in (Omar's account was already authed)
higgsfield workspace list       # find workspace id
higgsfield workspace set <id>   # required once before any generation
```

Workspace: `df9cde10-c0f9-4545-a292-6556e8043791` ("Private").

## Generation command shape (verified)

```bash
higgsfield generate create <job_type> \
  --prompt "..." \
  --<param> <value> ... \
  --wait --wait-timeout 5m
```

- Model params are plain `--name value` flags; run `higgsfield model get <job_type>` for each model's params.
- **Array params take a JSON string**: `--colors '["#0093FF","#04294A"]'` (repeated string flags fail with "should be array").
- `--wait` blocks and prints the **result CDN URL** (cloudfront); download with `curl -sO <url>`.
- Reference images: `--image-references <path-or-uuid>` (local paths auto-upload; also `higgsfield upload` for explicit upload ids).

## Models (image) — availability and cost per generation

| model | job_type | cost | free plan? | notes |
|---|---|---|---|---|
| Recraft V4.1 | `recraft_v4_1` | 1.25 cr | **NO — Basic plan required** (`job_minimum_basic_plan_required`) | Best fit on paper: `model_type: vector`, `colors` array of exact hex (hard palette enforcement), `background_color` hex — no prompt-hoping. No image-reference param; consistency via constraints. |
| Nano Banana Pro | `nano_banana_pro` | 2 cr | untested (didn't spend) | Up to **14 `--image-references`** — the anchor mechanism. `resolution 1k/2k/4k`, `aspect_ratio 1:1`. |
| Seedream 5.0 Lite | `seedream_v5_lite` | 1 cr | **YES — verified working** | 2048×2048 out. Good palette adherence from prompt alone; subject fidelity mediocre (asked astrolabe, got atom); more gloss than the style wants. |
| Image Background Remover | `image_background_remover` | n/a | untested | Takes exactly one `image_references` — post-processing option if keying is ever needed. |

Test artifact: scratchpad `spike-astrolabe.png` (not committed — spike output, style not yet locked).

## Background control (design assumption #4)

- Seedream: solid near-white background via prompt — worked; `sharp` can key a known solid color, or we generate ON the project gradient directly (bake-in fallback per the plan's Task 4 note).
- Recraft (paid): `background_color` param makes this exact — the clean path.

## Credits / budget (design assumption #5)

- Free plan balance: **10 credits → 9 after the spike**.
- Projection for the phase: anchor session ≈ 8–12 gens + catalog 12 subjects × 2–3 attempts ≈ **40–60 credits total**.
- **⏸ OPEN — Omar's call:** free credits cannot cover the phase. Recommended: **Higgsfield Basic plan** — it both supplies monthly credits and unlocks Recraft V4.1, the best-fit model. Decision pending; anchor session (Task 2) starts after it.

## Model recommendation for Task 2

Start anchors on **Recraft V4.1 vector mode** if the Basic plan is purchased (exact-hex palette + background control beats prompt-hoping); otherwise **Nano Banana Pro** (2 cr) with anchors-as-references, falling back to Seedream Lite for cheap candidate exploration. Whichever model wins the anchor session becomes THE model, recorded in STYLE.md.
