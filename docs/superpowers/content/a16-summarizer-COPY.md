# a16-summarizer — LOCKED COPY (W3, approved 2026-08-30)

**This copy is LOCKED VERBATIM on Omar's approval.** It carries the same status as
About's locked copy and the Nahtadi COPY-LOCKED rows: every string below was ruled
line by line at the W3 checkpoint. It is not a draft and it is not a starting point.

- **B-A and B-B lift these strings mechanically.** Every row is a *value*: write it
  exactly as it appears. No re-phrasing, no "while I'm in here" improvements, no
  restoring anything from §6.
- **If a layout cannot hold a line, raise it with Omar.** The strings do not shrink
  to fit a layout.
- Sitewide copy law is satisfied and verified: no em dashes, no AI cadence, canonical
  facts only, skills-defensibility applied to A6. **No Core ML claim anywhere.**
  Nahtadi is not mentioned, so nothing here can imply Nahtadi contains ML.

Scope: the `a16-summarizer` entry in `src/data/projects.json` (§1), its entry in
`src/lib/caseStudies.ts` (§2), and the asset/gradient facts already landed (§3).

---

## §0 — The model-size ruling (READ BEFORE USING ANY SIZE NUMBER)

The repo carried **three** different figures. They measure three different things,
and one of them is simply wrong. Resolved by direct measurement of the model
directory and of the published Hugging Face snapshot, which are byte-identical.

| Figure | Where it appears | What it actually is | Verdict |
|---|---|---|---|
| **831 MB** | `hero_screen.PNG` stat tile, README | **Active RAM**, not storage. The app's own Memory Details popover reads `Active Memory: 831 MB/5.25 GB`. | Correct, but it is a memory number. Never place it beside a disk number without saying so. |
| **828 MB** | `results/rouge_mlx_4bit.md` | `model.safetensors` = 868,628,547 B = **828.4 MiB**. Binary units, labelled "MB". | Correct value, wrong unit label, and weights only. |
| **847 MB** | README (x2), `app/README.md` (x2), `quantization_delta.md` (x2) | Matches **no measured artifact**. Closest reading: 1.5e9 params x 4.501 bits = 844 MB, an estimate from a *rounded* parameter count. The real count implied by 4.501 bits/weight is 1.544B. | **WRONG. Do not publish it.** |

**Measured ground truth** (local `mlx_model/` == HF `osyounis/a16-summarizer-mlx-4bit` blobs, both 880,107,314 B):

| Quantity | Bytes | Decimal | Binary |
|---|---:|---:|---:|
| `model.safetensors` (weights only) | 868,628,547 | 868.6 MB | 828.4 MiB |
| Full snapshot (what the phone downloads) | 880,107,314 | **880.1 MB** | 839.3 MiB |

**The locked copy uses `880 MB`, and it means the complete 4-bit model on disk:
weights plus tokenizer, decimal MB, which is the unit iOS reports storage in.**
Compression against the ~3.1 GB fp16 merged model is 3.5x.

Consequence for the media figure: **831 vs 880 is not a contradiction**, because one
is RAM and one is disk. The composite is therefore unblocked, provided its caption
names each quantity. See §5.

---

## §1 — Catalog entry (`src/data/projects.json`)

| # | Field | LOCKED value |
|---|---|---|
| A1 | `id` | `a16-summarizer` |
| A2 | `title` | `On-Device LLM Summarizer` |
| A3 | `tagline` | `A 1.5B model fine-tuned, quantized to 4-bit, and running entirely on an iPhone Apple ruled out for on-device AI.` |
| A4 | `cardStat` | `880 MB on-device` |
| A5 | `description` | `QLoRA fine-tune of Qwen2.5-1.5B on DialogSum, merged and quantized to 4-bit MLX, then shipped in a SwiftUI app that runs entirely on an iPhone 14 Pro. Apple draws its on-device LLM line at the A17 Pro with 8 GB of RAM; this runs below it on an A16 with 6 GB, at 880 MB on disk and 44.4 tokens per second.` |
| A6 | `technologies` | `["Python", "PyTorch", "QLoRA", "MLX", "Swift", "SwiftUI"]` |
| A7 | `keywords` | `["llm", "on-device", "quantization", "fine-tuning"]` |
| A8 | `tier` / `featured` / `private` | `showcase` / `true` / `false` |
| A9 | `stats` | `880 MB at 4-bit • 44.4 tok/s • iPhone 14 Pro` |
| A10 | `category` | `machine-learning` |
| A11 | `imageAlt` | `An A16 chip die with pins, glowing in violet, magenta and orange, with a chat bubble at its upper right` |
| A12 | `links` | `{ "github": "https://github.com/osyounis/a16-summarizer" }` |
| A13 | `brand.gradient` | `{ "from": "#0A0A0C", "to": "#2A2A2E" }` |
| A14 | `image` | `/images/projects/a16-summarizer/card.png` |

**A13 must be mirrored into `src/lib/projectStyles.ts`** as
`className: 'bg-gradient-to-br from-[#0A0A0C] to-[#2A2A2E]'` plus matching `stops`.
`src/lib/__tests__/projectStyles.test.ts` fails if the two drift.

---

## §2 — Case study (`src/lib/caseStudies.ts`, key `'a16-summarizer'`)

| # | Slot | LOCKED value |
|---|---|---|
| B1 | `hero` | `{ from: '#4338CA', to: '#1E1B4B' }` |
| B2 | `thesis` | `Apple draws its on-device LLM line at the A17 Pro with 8 GB. This one runs below it, on an A16 with 6 GB.` |
| B3 | stat 1 | value `0.29 → 0.46` · label `ROUGE-L, base to the shipped 4-bit model` |
| B4 | stat 2 | value `880 MB` · label `4-bit model on disk, down from 3.1 GB` |
| B5 | stat 3 | value `44.4 tok/s` · label `sustained decode on an iPhone 14 Pro` |
| B6 | tech chips | renders from A6: `Python · PyTorch · QLoRA · MLX · Swift · SwiftUI` |

### B7 — THE PROBLEM
**eyebrow:** `THE PROBLEM`
**heading:** `Apple drew the on-device line above this phone.`

**¶1** (no emphasis runs)
> Apple Intelligence runs its on-device language model only on the A17 Pro and newer, which ship with 8 GB of RAM. The iPhone 14 Pro sits one generation below that line, an A16 with 6 GB, and gets nothing. The hardware gap is real, but the line is drawn for a general assistant.

**¶2** (emphasis run: `one thing`)
> A model that has to do everything needs the headroom Apple says it needs. A model that has to do **one thing** does not. Narrowing the task is the whole experiment.

### B8 — THE APPROACH
**eyebrow:** `THE APPROACH`
**heading:** `Apple's own recipe, one size down.`

**¶1** (emphasis run: `QLoRA fine-tuning of Qwen2.5-1.5B on DialogSum`)
> Apple's published on-device approach is a small base model, a task-specific LoRA adapter, and aggressive quantization. This project runs that recipe end to end on its own model: **QLoRA fine-tuning of Qwen2.5-1.5B on DialogSum**, merged to fp16, then quantized to 4-bit MLX at group size 64, which lands at 4.5 effective bits per weight.

**¶2** (no emphasis runs)
> Licensing decided as much as size did. Qwen2.5-1.5B is Apache 2.0 where the 3B is not, and DialogSum is MIT where the more common SAMSum forbids commercial use. Training ran on a single RTX 3080 with about 9 GB of usable VRAM, which is what made 4-bit QLoRA the only way in rather than a nice-to-have.

**¶3** (emphasis run: `published ROUGE numbers describe the model on the phone`)
> The app is three Swift files on MLX Swift, running on the phone's GPU through Metal. It rebuilds the eval's exact prompt and decoding, greedy at temperature zero with a 96-token cap, so the **published ROUGE numbers describe the model on the phone** and not a friendlier lab configuration.

### B9 — THE IMPACT
**eyebrow:** `THE IMPACT`
**heading:** `It runs, and the cost of running it is measured.`

**¶1** (emphasis runs: `880 MB on disk`, `44.4 tokens per second`)
> On an iPhone 14 Pro the model is **880 MB on disk**, peaks at 1.05 GB of memory against a 5.25 GB ceiling, and decodes at **44.4 tokens per second** after 2.0 seconds to first token. After the first download it never touches the network.

**¶2** (emphasis run: `length and register`)
> Quantization costs about 1.5 to 2 ROUGE points against the fp16 fine-tune, and the loss is almost entirely precision: recall barely moves, and there are no repetition loops, truncation spikes, or empty outputs. The gain over the base model deserves the same honesty. The base model summarizes fine, it just writes around 68 tokens where the human references average 27.8, so its precision collapses. What the fine-tune actually learned is **length and register**, which for a task-scoped summarizer is exactly the job.

**¶3** (no emphasis runs) — **the Core ML sentence is LOCKED IN, per ruling 4**
> It began as a way to put the Generative AI with Large Language Models coursework into practice on hardware I already owned. Core ML and the Neural Engine were scoped as a stretch and left unattempted, so this is an MLX and Metal result.

---

## §3 — Assets and gradients (ALREADY LANDED, 2026-08-30)

Done in this session, not left for a B-task:

- `assets/artwork/a16-summarizer.png` replaced with Omar's chosen image (1254x1254,
  straight alpha). **Verified, not assumed:** composited on A13's gradient, background
  pixels deviate from the pure gradient by at most **1/255 per channel** (mean 0.17).
  The extraction is clean, with no halo and no dark fringing. Do not re-extract.
- `public/images/projects/a16-summarizer/` regenerated via `npm run assets`.
- `public/og/a16-summarizer.png` generated via `npm run generate:og`. No other OG card
  changed, since no other gradient moved.
- `assets/artwork/a16-summarizer-render.mjs` renamed to
  `…-render.SUPERSEDED.mjs`, given a header stating its output is not the shipped
  artwork, and pointed at a gitignored scratch filename with a guard that throws if
  its output path is ever aimed back at the shipped PNG. **Proven by running it:**
  the shipped PNG's SHA-256 was identical before and after.
- `assets/anchors/STYLE.md` corrected. Its previous a16 entry claimed a light card
  gradient and told the reader to regenerate from the render script. Both were false
  after the replacement.
- **B1 was chosen from measurement, not impression.** The artwork's saturated pixels
  are 53% inside hue 210-270 degrees, peaking at 220-250 (blue-violet), which is why
  the checkpoint's fuchsia proposal was wrong. `#4338CA` sits at hue 245, carries
  white at **7.90:1** (AA normal text is 4.50), and separates from the near-black
  squircle at **2.50:1** so the 132px icon reads as a distinct tile on the hero.

**The catalog entry and the case study both landed in B-A** (`8d17e6b`), together in
one commit, because a `showcase` entry with no `caseStudies.ts` key is a deliberate
hard build failure (`src/app/projects/[slug]/page.tsx`). §1 and §2 are live.

---

## §3b — The media figure (W3b, 2026-08-31)

W3 promised this figure and never built it. It exists now.

| file | what it is |
|---|---|
| `phone-hero.png` | the real iPhone 14 Pro capture, 1179x2556. Model name, a live summary, and the stats grid: 44.4 tok/s, 2047 ms TTFT, 831 MB |
| `rouge-light.png` / `rouge-light.svg` | the ROUGE chart, light theme, 873x648 |
| `rouge-dark.png` / `rouge-dark.svg` | the same chart, dark theme |
| `figure-rouge.png` | **the media slot.** 1280x720, authored at exactly 16:9 |

Caption, LOCKED:

> `The model on the phone, and what it scores. Base, fp16 fine-tune, and the 4-bit model that ships.`

### The chart plots THREE models, and says so

This was the trap. The figures in `results/rouge_comparison.md` are the **fp16
merged fine-tune**: ROUGE-L 0.4808. Stat row B3 says **0.29 to 0.46**, which is the
**shipped 4-bit model** from `results/rouge_mlx_4bit.md`. Both are correct, and the
gap between them is the quantization cost §0.4 already documents. But a chart
reading 0.4808 sitting beside a stat row reading 0.46 looks like a contradiction to
anyone who checks.

**Ruling: plot all three rather than label one.** Base, fp16 fine-tune, and shipped
4-bit, named in the legend and in the subtitle. That makes the quantization step
visible instead of implied, and it makes B3's `0.29 → 0.46` legible as the base and
shipped endpoints of the ROUGE-L group. Labelling a two-series chart "fp16" would
have been correct and would still have left the reader doing arithmetic.

Error bars are the **95% CI on the fine-tune's gain over base**, drawn as
`base + CI` on the fp16 bar, since the published interval is on the delta and not on
the absolute score. Paired bootstrap, 10,000 resamples, all three p < 0.0001.

### The palette is validator output, not taste

Run, not reasoned about, per the dataviz skill. Three earlier candidates FAILED and
were re-stepped rather than argued with:

| candidate | why it failed |
|---|---|
| grey / blue / indigo | grey below the chroma floor; blue-indigo ΔE 13.1 normal-vision, under the 15 hard floor |
| amber / blue / purple | blue-purple ΔE 5.7 deutan |
| amber / blue / violet | blue-violet ΔE 1.0 deutan, effectively identical to a deuteranope |

Shipped: **light `#B45309, #0071E3, #15803D`** and **dark `#D97706, #0093FF,
#16A34A`**, both ALL CHECKS PASS. The middle series in each is a site token
(`--color-apple-blue`, `--color-brand-500`). Every purple and indigo option failed
deutan separation against blue, which is exactly what the validator exists to catch
and exactly what eyeballing would have shipped.

### Why the composite ground is dark

The phone capture is a **dark-mode screenshot**. A white panel wrapped around a
black phone screen reads as a mistake, so the ground follows the artifact and the
chart is the dark variant. The phone carries a `#2b425b` hairline so a black screen
on a near-black ground still reads as a device rather than a hole.

**One honest limitation, recorded rather than papered over.** On the dark page the
figure's ground (`#06131F`) and the page (`#04101e`) differ by 1.02:1, so the panel
boundary rests entirely on `.case-figure`'s own 1px `--edge` hairline, which is
1.85:1. Raising the ground to the site's `--color-deep-card` was tried and moved it
only to 1.11, so it was not worth mismatching the phone bezel for. This is the
template's edge token behaving the same way it does for every dark figure, not
something this figure introduced. On the light page the separation is 18.13.

### Apple-calibration and both-theme check: DONE

| element | ratio | floor |
|---|---:|---|
| chart title 22px `#ffffff` | 18.74 | 3.00 |
| subtitle, legend, value labels `#c7d6e6` | 12.66 | 4.50 |
| axis and footer 11px `#9db8d1` | 9.11 | 4.50 |
| base amber mark | 5.88 | 3.00 |
| fine-tune blue mark | 5.90 | 3.00 |
| shipped green mark | 5.69 | 3.00 |

Rendered inside the real `.case-figure` frame above the real caption bar on both
page grounds, and looked at, not only measured: the fine-tune value labels first
collided with their own CI caps and were moved above the upper whisker.

---

## §4 — Rulings carried from the W3 checkpoint

1. **B3 is `0.29 → 0.46`.** Independently verified against `results/rouge_comparison.md`:
   rougeL 0.2889 → 0.4808, Δ +0.1919, 95% CI [+0.1772, +0.2067], p ≈ 0, paired bootstrap
   over 10,000 resamples. A before/after pair beats a delta: it shows the baseline, quotes
   the model that ships, and dodges the 0-1 vs 0-100 ambiguity that produced "+0.9".
2. **Model size resolved.** See §0. `880 MB`, stated as disk.
3. **Media figure: composite approved in principle**, now unblocked by §0. Caveat on
   record: the stat row already carries ROUGE, so the chart is partly redundant, while
   the screenshot is the only evidence the thing runs on the phone, which is the thesis.
   If the composite reads cramped, fall back to **screenshot-only, never chart-only**.
4. **Core ML sentence: KEEP.** `.claude/CLAUDE.md` is explicit that Core ML must never be
   a claimed competency, so saying plainly it was not used is exactly right.
5. **Hugging Face link: DROP.** `Prose` is `string | { em }` with no link run, and this is
   not worth a template change. The README is one click away.
6. **`LICENSE` placeholder** in the public repo (`Copyright (c) 2026 <your-name>`) is
   flagged to Omar. Not site work.
7. **The résumé** understates the measured ROUGE-L result by roughly nineteen times.
   Omar's to fix. `public/omar_younis_resume_2026.pdf` and
   `docs/content/Omar_Younis_Resume.pdf` must stay byte-identical.

---

## §5 — Open, and explicitly NOT decided here

- ~~The media figure asset is not built.~~ **DONE in W3b**, see §3b. It did not read
  cramped, so the §4.3 fallback to screenshot-only was not needed. The 831 vs 880
  distinction is carried by the chart's own subtitle and footer rather than the
  caption: the chart states which model each bar is, and the phone panel shows
  831 MB labelled `Memory` by the app itself.
- **Repo drift.** `a16-summarizer`'s own README, `app/README.md` and
  `quantization_delta.md` state 847 MB in six places. The site will say 880 MB. A
  reader comparing them sees a mismatch, exactly as with the résumé. Omar's call
  whether to correct the repo.
- **Home swap** (`image-watermark-remover` out, a16 in, both grid and orbit) is B-A's,
  and needs no new copy: `HomeWork.tsx` renders `title` and `cardStat` straight from
  `projects.json`, so A2 and A4 already cover it.

---

## §6 — Struck, do not restore

- `847 MB` in any slot. It is not a measurement. See §0.
- `+0.9 ROUGE-L`, and any bare delta form of B3.
- The W4 light card gradient `#F5F5F7 → #E8E8ED`, and the "catalog's one light card"
  framing that went with it.
- The checkpoint's fuchsia hero `#A21CAF → #17101F`. Wrong hue family, measured.
- Any Hugging Face link or repo ID in body copy.
- Any mention of Core ML that does not state it was left unattempted.
