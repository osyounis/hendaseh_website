# Asset Engine — Design Spec

**Date:** 2026-08-24
**Sub-project:** 3 of 5 (see `docs/ROADMAP.md`; program decisions in `docs/DECISIONS.md`)
**Status:** Awaiting review

## Goal

One command per project produces its complete, brand-consistent asset set — app-style icon, site card image, and GitHub social banner — replacing today's stylistically unrelated, pay-per-iteration icons. All 13 current projects regenerated so the grid reads as one system. Adding a future project (radar-moboard, a16-summarizer — both queued for sub-project 5) becomes: add the JSON entry, run the command, approve the artwork.

## Scope boundary (confirmed with Omar 2026-08-24)

**In:** the generation pipeline, the locked art direction, regenerating the current catalog, banner files staged for GitHub distribution.
**Out:** page/layout changes (sub-project 4), case-study imagery and new project entries (sub-project 5), ImageKit media-library organization beyond what serving requires.

The only user-visible change on the site: new card images inside the existing layouts.

## Locked art direction

**“Apple-modern flat”** — the reconciliation of Omar's two references (his flat-geometric mosque-tower icon; Apple's own icon language):

- Flat geometric construction; one centered pictorial subject per project; generous margins.
- Palette restricted to the project's `brand.gradient` colors plus white and navy accents — no colors outside that set.
- Subtle depth only: gentle within-shape gradients, soft shadow under the subject, restrained highlight edges. No neon, no glossy 3D, no photorealism, no outline-only glyphs.
- Quality bar: would pass as a professional App Store app icon.
- Backgrounds: the project's own gradient (per-project variety is deliberate; the shared style provides the family resemblance).
- **Nahtadi exception:** its real App Store icon *is* its icon — the engine composes banners around it and never generates artwork for it.

### Style anchoring

Before catalog generation, 2–3 **anchor icons** are created and iterated with Omar until exactly right. Anchors are stored in the repo (`assets/anchors/`) and passed as style-reference images with every subsequent generation. Anchors are the style's source of truth; the text prompt is written down beside them (`assets/anchors/STYLE.md`) so regeneration years later starts from the same place.

### Review gate

**Omar approves every generated artwork** before it is composited (his choice — he is the taste gate). The pipeline treats artwork as the only non-deterministic input: a re-roll regenerates one subject image, never the composition. Everything downstream of approval is code and reproducible.

## Architecture

```
projects.json (id, title, tagline, brand.gradient)
      │
      ▼
[1] artwork generation  — Higgsfield CLI: style prompt + palette + anchor refs
      │        ↺ re-roll until Omar approves (approved file saved to assets/artwork/<id>.png)
      ▼
[2] deterministic composition — sharp + satori, extending the phase-2 OG machinery
      ├─ public/images/projects/<id>/icon.png        1024×1024, rounded-square on gradient
      ├─ public/images/projects/<id>/icon-squircle.png  1024×1024, Apple-squircle mask
      ├─ public/images/projects/<id>/card.png        site card image (current card slot)
      └─ public/images/projects/<id>/github-banner.png  1280×640: icon tile + name + tagline + hendaseh.com
      ▼
[3] site serving — files committed to the repo; ImageKit serves via the existing web-folder origin (no upload step)
```

- **Command UX:** `npm run assets -- <project-id>` (single project) and `npm run assets -- --all` (catalog); `--compose-only` re-runs step 2 from saved approved artwork (no AI, no credits — e.g. after a template tweak).
- The OG-card generator from phase 2 (`generate:og`, `ogTemplate.tsx`) becomes part of this engine: one template family, shared marks/fonts/gradient handling; OG cards, card images, and GitHub banners are sibling outputs. `getOgCard`/card templates refactor into a shared `src/lib/assetTemplates.tsx` consumed only by scripts.
- **Approved artwork is committed** (`assets/artwork/`) — it is the expensive, irreplaceable input; composition outputs are also committed (deterministic, but committing them keeps the site buildable without rerunning anything).
- `projects.json` gains no new required fields; `tagline` (already optional in schema v2) gets filled for all projects since banners display it. Old flat images under `public/images/projects/*.png` are deleted after the catalog swap; consumers move to the new per-project directory paths.

## Higgsfield integration — spike first

The plan's first task is a **spike**: install/auth the Higgsfield CLI, generate one test image, and learn the actual interface — model selection (start with Nano Banana Pro; fall back by quality), reference-image support, transparent-background or solid-background output, credit cost per generation, rate limits. **Design assumptions to verify in the spike:** artwork can be generated as a subject on a plain background that `sharp` can key out or that models can emit transparently; anchors can be passed as style references. If the CLI can't do reference images, fall back to the MCP server (`https://mcp.higgsfield.ai/mcp`) driven interactively, keeping the same review gate and file contract (`assets/artwork/<id>.png`). The file contract is the interface — the generator behind it may change.

## Distribution to GitHub

- GitHub offers no API for repo social-preview images. The engine stages the files; uploading each is a ~1-minute manual step. The plan ends with a **distribution checklist**: repo → file path → uploaded? — worked through with Omar in one sitting.
- README header banners (embedding `github-banner.png` at the top of each repo's README) are automatable later but **out of scope** — touching 10+ repos' READMEs is its own editorial task, queued as an optional follow-on.

## Error handling

- **Model drift** (artwork off-style): caught by the review gate; re-roll with anchors is the remedy; if a subject persistently fails, the anchor set gains an example closer to that subject's domain.
- **Credit exhaustion:** the spike establishes cost-per-image; catalog generation is ~13 subjects + re-rolls — Omar confirms budget after the spike, before catalog generation starts.
- **Composition regressions:** a Vitest snapshot-style test asserts the compositor produces expected dimensions/formats for a fixture project; visual QA is Omar's approval of the final grid on `/projects` locally.

## Success criteria

- Anchors + style prompt committed; Omar signed off on the style.
- All 13 projects have the four outputs generated through the pipeline; `/projects` grid shows the new set, visually one family (Omar approves the grid as a whole).
- Nahtadi banners built around its real icon; its icon untouched.
- `--compose-only --all` reproduces every composed output byte-stably from committed artwork.
- OG cards still serve identically (or upgraded intentionally as part of the shared-template refactor — any change is shown to Omar before shipping).
- Old mismatched images gone; no references to old paths (`grep` clean); build/tests/lint/e2e green; site live on Cloudflare with the new assets.
- GitHub distribution checklist completed for every public repo with a banner.

## Needs from Omar

- Higgsfield account sign-in for the CLI/MCP (spike, first task).
- Taste iterations on the 2–3 anchors (the highest-value hour of this phase).
- Artwork approvals (~13, plus re-rolls) and the final grid approval.
- The GitHub social-preview upload sitting at the end.
