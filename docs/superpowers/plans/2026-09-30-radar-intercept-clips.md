# radar-moboard intercept case-study update — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present radar-moboard's new intercept capability on its case study: one clip player with a scenario choice (Avoid / Intercept) and a view choice (Board view / Sea view), plus the locked copy and catalog changes.

**Architecture:** The existing `clips` media block gains a second shape, `scenarios`, normalised by a `clipScenarios()` helper so one component renders both. The pill control is extracted into `ClipSwitch` with two modes: `tabs` (the axis that decides what the panel is) and `toggle` (`aria-pressed`, the camera on the same panel). `CaseStudyClips` holds a `{ scenario, view }` choice and still keys its single `<video>` on it, so an unchosen clip is never fetched.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, plain CSS in `src/app/styles/case-study.css` (container query for the row), Vitest (unit), Playwright (e2e).

**Spec:** `docs/superpowers/specs/2026-09-30-radar-intercept-clips-design.md`. Copy source of truth: `docs/superpowers/content/radar-moboard-COPY.md` §7. Read both before starting.

## Global Constraints

- Copy strings are lifted **verbatim** from COPY §7; where this plan and §7 disagree, §7 wins. No rewording.
- Every clip caption, in every scenario, contains `All scenarios synthetic.`
- **Exactly one `<video>` in the DOM** at all times; it is keyed on the full choice (`${scenario}:${view}`).
- Every option in both switches is **≥ 44px tall**; switch columns stay equal width (the indicator steps by 100% of itself).
- Scenario switch = `role="tablist"`, manual activation. View switch on a scenario block = `role="group"` named `View`, buttons with `aria-pressed`.
- Never use Tailwind `blue-*` for brand colour; prefer existing tokens (`--clip-switch-*`, `--accent`, `--fg-strong`).
- Test count is **1,689** (radar-moboard `6370331`). Before Task 4, re-run `npx vitest run` in `~/Documents/github/radar-moboard`; if the passed count is not 1,689, **stop and ask Omar**. Do not edit the number on your own.
- No commercial context in any file: the intercept is framed only as "the question a boarding approach asks". Never name who asked for it.
- Before every commit: kill stray `next dev` / `wrangler` processes (`pkill -f "next dev"; pkill -f wrangler`), then `npm run build` (the ONLY typecheck), `npm run test:all` (lint + unit + e2e). All green or no commit (`docs/ENGINEERING-NOTES.md` §8, §9).
- Work on `dev`. Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Do not push.

## Review Focus

1. **Two choices inside one 200ms fade** (Intercept, then Sea view): it must land on intercept + sea and never mount, and so never fetch, intercept + board. Test: Task 3, "never requests a clip the reader did not land on".
2. **Widths between the two layouts** (~520–640px tile content): the switches must wrap to the stacked layout before either one overflows the tile. Test: Task 3 layout test runs at 1440, 768, **600** and 390.
3. **Reduced motion with a scenario switch**: it must be instant and must not autoplay the new scenario's clip. Test: Task 3 reduced-motion test switches scenario as well as view.
4. **Screen-reader name of the transport button** once two clips share a view label ("Board view" exists in both scenarios): the name must say which scenario. Test: Task 3, "the transport names the scenario and the view it acts on".
5. **A single-axis `clips` block** has no consumer after this change, so no e2e covers it. Mitigation: the helper unit test pins `clipScenarios()` on a single-axis block, and Task 2's refactor runs the old e2e suite unchanged against that exact path before Task 3 converts radar.

---

### Task 1: Extract `ClipSwitch` (pure refactor)

The pill control moves into its own component, which gains a `toggle` mode that nothing uses yet. Rendered output for `tabs` mode is byte-identical to today's, so the existing e2e suite is the test.

**Files:**
- Create: `src/components/projects/ClipSwitch.tsx`
- Modify: `src/components/projects/CaseStudyClips.tsx` (replace the inline tablist at lines 240–285 and `onTabKeyDown` at 194–213)
- Modify: `src/app/styles/case-study.css` (hover rule near line 531)

**Interfaces:**
- Produces: `default export ClipSwitch(props: ClipSwitchProps)`, `export interface ClipSwitchOption { readonly id: string; readonly label: string }`.

- [ ] **Step 1: Run the existing clip e2e to record the baseline**

Run: `pkill -f "next dev"; npx playwright test tests/e2e/case-study-content.spec.ts`
Expected: PASS (all). If anything is red before you start, stop and report it.

- [ ] **Step 2: Create `src/components/projects/ClipSwitch.tsx`**

```tsx
'use client';

import { useRef, type CSSProperties, type KeyboardEvent } from 'react';

export interface ClipSwitchOption {
  readonly id: string;
  readonly label: string;
}

interface ClipSwitchProps {
  /**
   * `tabs`: a WAI-ARIA tablist with MANUAL activation, for the axis that decides
   * what the panel IS. `toggle`: a group of `aria-pressed` buttons, for a second
   * axis that only changes the camera on the same panel. Two tablists pointing at
   * one panel is a broken tabs pattern, which is why the second axis is not one.
   */
  mode: 'tabs' | 'toggle';
  options: readonly ClipSwitchOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** The visible element that names this switch. Preferred over `label`. */
  labelledBy?: string;
  /** Accessible name when nothing on screen names the switch. */
  label?: string;
  /** Tabs mode only: the DOM id of an option's tab. */
  tabId?: (id: string) => string;
  /** Tabs mode only: the panel the tabs control. */
  panelId?: string;
}

/**
 * THE PILL, ON apple.com/mac's "Explore the lineup." PATTERN. Extracted from
 * `CaseStudyClips` when a second axis arrived; everything below about the
 * indicator and the keys is unchanged from there.
 *
 * The indicator is decorative (`aria-selected` / `aria-pressed` state the
 * selection) and travels by a CSS transition on `transform`, set inline from the
 * selected index. A transition retargets from the value on screen, so a second
 * press mid-travel turns it round instead of snapping or queueing. Equal-width
 * columns (case-study.css) are what let it step by exactly 100% of itself.
 *
 * In tabs mode the control is ONE tab stop (roving tabindex), arrows move focus,
 * and Enter or Space commits: manual activation, because every activation starts
 * a video download. In toggle mode each button is its own tab stop, as any pair
 * of buttons is.
 */
export default function ClipSwitch({
  mode,
  options,
  selectedId,
  onSelect,
  labelledBy,
  label,
  tabId,
  panelId,
}: ClipSwitchProps) {
  const tabs = mode === 'tabs';
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.id === selectedId)
  );

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = options.length - 1;
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? index === last
          ? 0
          : index + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? index === 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    buttons.current[next]?.focus();
  };

  return (
    <div
      className="case-clip-switch"
      role={tabs ? 'tablist' : 'group'}
      // Named by the visible sentence above it when there is one, so the name a
      // screen reader hears is the one on screen.
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      style={{ '--tab-count': options.length } as CSSProperties}
    >
      <span
        className="case-clip-indicator"
        aria-hidden="true"
        style={{ transform: `translateX(${selectedIndex * 100}%)` }}
      />
      {options.map((option, index) => {
        const selected = option.id === selectedId;
        return (
          <button
            key={option.id}
            ref={(el) => {
              buttons.current[index] = el;
            }}
            type="button"
            className="case-clip-tab"
            role={tabs ? 'tab' : undefined}
            id={tabs ? tabId?.(option.id) : undefined}
            aria-selected={tabs ? selected : undefined}
            aria-controls={tabs ? panelId : undefined}
            aria-pressed={tabs ? undefined : selected}
            tabIndex={tabs ? (selected ? 0 : -1) : undefined}
            onClick={() => onSelect(option.id)}
            onKeyDown={tabs ? (event) => onKeyDown(event, index) : undefined}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Use it in `CaseStudyClips.tsx`**

Add the import under the existing ones:

```tsx
import ClipSwitch from '@/components/projects/ClipSwitch';
```

Delete `const tabs = useRef<(HTMLButtonElement | null)[]>([]);`, `const selectedIndex = …;` and the whole `onTabKeyDown` function. Replace the `<div className="case-clip-switch" role="tablist" …>…</div>` element (everything between `{title && (…)}` and the closing `</>`) with:

```tsx
          <ClipSwitch
            mode="tabs"
            options={clips}
            selectedId={selectedId}
            onSelect={select}
            labelledBy={title ? titleId : undefined}
            label="Choose a viewpoint"
            tabId={tabId}
            panelId={panelId}
          />
```

Move the block comment's "MANUAL ACTIVATION" and "THE INDICATOR IS INTERRUPTIBLE" paragraphs out of `CaseStudyClips`'s header comment; they now live on `ClipSwitch`. Leave a one-line pointer in their place: `The chooser (manual activation, the interruptible indicator) is ClipSwitch.`

- [ ] **Step 4: Make hover feedback cover pressed buttons**

In `src/app/styles/case-study.css`, replace

```css
    .case-clip-tab[aria-selected='false']:hover {
```

with

```css
    .case-clip-tab[aria-selected='false']:hover,
    .case-clip-tab[aria-pressed='false']:hover {
```

- [ ] **Step 5: Verify nothing changed**

Run: `pkill -f "next dev"; npm run build && npx playwright test tests/e2e/case-study-content.spec.ts tests/e2e/a11y.spec.ts`
Expected: build succeeds; all PASS (same tests as Step 1).

- [ ] **Step 6: Full gate and commit**

Run: `npm run test:all`
Expected: PASS.

```bash
git add src/components/projects/ClipSwitch.tsx src/components/projects/CaseStudyClips.tsx src/app/styles/case-study.css
git commit -m "refactor: extract the clip chooser into ClipSwitch

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Scenario-capable data model and player (radar unchanged)

Add the `scenarios` shape, the helpers, the two-axis state and the controls row. radar-moboard still ships its single-axis block, which now runs through `clipScenarios()` as one unnamed scenario. The old e2e suite must pass unchanged in behaviour: that is the proof the single-axis path renders exactly as before (Review Focus 5).

**Files:**
- Modify: `src/lib/caseStudies.ts` (types near lines 128–176, helpers near the end)
- Modify: `src/components/projects/CaseStudyClips.tsx`
- Modify: `src/app/projects/[slug]/page.tsx:343-352`
- Modify: `src/app/styles/case-study.css` (clip section, after `.case-clip-title`)
- Test: `src/lib/__tests__/caseStudies.test.ts`, `tests/e2e/case-study-content.spec.ts`

**Interfaces:**
- Consumes: `ClipSwitch` (Task 1).
- Produces (all exported from `src/lib/caseStudies.ts`):
  - `interface CaseStudyClipScenario { readonly id: string; readonly label: string; readonly caption: string; readonly clips: readonly [CaseStudyClip, ...CaseStudyClip[]] }`
  - `interface CaseStudyScenarioClipsBlock { readonly kind: 'clips'; readonly title: string; readonly scenarios: readonly [CaseStudyClipScenario, CaseStudyClipScenario, ...CaseStudyClipScenario[]]; readonly clips?: never; readonly caption?: never }`
  - `type CaseStudyMedia = CaseStudyImageBlock | CaseStudyClipsBlock | CaseStudyScenarioClipsBlock`
  - `function isScenarioBlock(block: CaseStudyMedia): block is CaseStudyScenarioClipsBlock`
  - `function clipScenarios(block: CaseStudyClipsBlock | CaseStudyScenarioClipsBlock): readonly CaseStudyClipScenario[]`. A single-axis block returns `[{ id: 'default', label: '', caption: block.caption, clips: block.clips }]`.
  - `function mediaCaptions(block: CaseStudyMedia): readonly string[]`
  - `CaseStudyClips` props become `{ scenarios: readonly CaseStudyClipScenario[]; title?: string }`.
  - DOM: `.case-clip-controls > .case-clip-row > .case-clip-switch` (1 or 2 switches). Scenario tab ids `${uid}-scenario-tab-${id}`; view tab ids unchanged `${uid}-clip-tab-${id}`. View group accessible name on a scenario block: `View`. Transport name on a scenario block: `<Verb> <scenario label>, <view label>`, lowercased after the verb, e.g. `Play avoid, board view`.

- [ ] **Step 1: Write the failing unit tests**

In `src/lib/__tests__/caseStudies.test.ts`, change the import to:

```ts
import {
  getCaseStudy,
  clipScenarios,
  mediaCaptions,
  type CaseStudyClipsBlock,
} from '../caseStudies'
```

Add this `describe` at the end of the file:

```ts
describe('clipScenarios', () => {
  const single: CaseStudyClipsBlock = {
    kind: 'clips',
    caption: 'One run. All scenarios synthetic.',
    clips: [
      {
        id: 'board',
        label: 'Board',
        src: '/video/x.mp4',
        poster: '/video/x.png',
        description: 'A description long enough to pass.',
      },
    ],
  }

  it('reads a single-axis block as one unnamed scenario carrying the block caption', () => {
    expect(clipScenarios(single)).toEqual([
      { id: 'default', label: '', caption: single.caption, clips: single.clips },
    ])
    expect(mediaCaptions(single)).toEqual([single.caption])
  })
})
```

Then update the four existing tests that read `block.caption` or `block.clips`, so they accept both shapes:

In "marks every Coast Guard scenario on screen as synthetic", replace the `media.forEach(...)` with:

```ts
    media.forEach((block, i) => {
      // EVERY caption a block can show -- a scenario block shows one per
      // scenario, and each must carry the marker on its own.
      mediaCaptions(block).forEach((caption, j) => {
        expect(caption, `radar-moboard media[${i}] caption ${j}`).toContain('All scenarios synthetic.')
      })
    })
```

In "has no em dashes anywhere in the copy", replace the media line with:

```ts
        ...(cs.media ?? []).flatMap((block) => [
          block.title ?? '',
          ...mediaCaptions(block),
          ...(block.kind === 'clips'
            ? clipScenarios(block).flatMap((s) => [s.label, ...s.clips.map((c) => c.description)])
            : []),
        ]),
```

In "points every block at a file that exists", replace the `files` expression with:

```ts
      const files =
        block.kind === 'image'
          ? [block.src]
          : clipScenarios(block).flatMap((s) => s.clips.flatMap((clip) => [clip.src, clip.poster]))
```

In "gives every clip a label that names what it shows, and a unique id", replace the body of the `blocks.forEach` with:

```ts
      if (block.kind !== 'clips') return
      clipScenarios(block).forEach((scenario) => {
        const ids = scenario.clips.map((clip) => clip.id)
        expect(new Set(ids).size, `${id} media[${index}] has duplicate clip ids`).toBe(ids.length)
        scenario.clips.forEach((clip) => {
          expect(clip.label.trim().length).toBeGreaterThan(0)
          // The control names what it SHOWS, never a file or a format.
          expect(clip.label, `${id} clip ${clip.id}`).not.toMatch(/\.(mp4|webm|mov|png)$/i)
          expect(clip.label.toLowerCase()).not.toContain('video')
          expect(clip.description.trim().length).toBeGreaterThan(10)
        })
      })
```

In "gives every media block a caption, and no title that merely repeats it", replace the body with:

```ts
    blocks.forEach(({ id, index, block }) => {
      mediaCaptions(block).forEach((caption) => {
        expect(caption.trim().length, `${id} media[${index}]`).toBeGreaterThan(0)
        if (block.title) {
          expect(
            caption.toLowerCase().startsWith(block.title.toLowerCase()),
            `${id} media[${index}] title just restates the caption's opening`
          ).toBe(false)
        }
      })
    })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/lib/__tests__/caseStudies.test.ts`
Expected: FAIL. `clipScenarios` / `mediaCaptions` are not exported.

- [ ] **Step 3: Add the types and helpers to `src/lib/caseStudies.ts`**

After the `CaseStudyClip` interface, add:

```ts
/**
 * ONE SCENARIO IN A TWO-AXIS CLIP BLOCK: a different job or encounter, offered
 * in the same views as every other scenario in the block.
 *
 * Added for radar-moboard's intercept (2026-09-30): avoid and intercept are two
 * answers the trainer gives, and each can be watched from the board or from the
 * sea. Scenario is the axis that changes what the panel IS -- a different run,
 * so a different caption -- and view only changes the camera.
 *
 * THE VIEWS MUST MATCH ACROSS SCENARIOS: same ids, same labels, same order.
 * "The view you chose survives a scenario switch" is only well defined if every
 * scenario offers it. `caseStudies.test.ts` asserts this; the type cannot.
 */
export interface CaseStudyClipScenario {
  /** Stable within its block; part of the tab and panel ids. */
  readonly id: string;
  /** What the reader picks. Short and parallel, like a clip label. */
  readonly label: string;
  /** Swaps with the scenario. Carries the synthetic-data sentence on its own. */
  readonly caption: string;
  readonly clips: readonly [CaseStudyClip, ...CaseStudyClip[]];
}
```

Change `CaseStudyClipsBlock` to:

```ts
export interface CaseStudyClipsBlock extends CaseStudyMediaCommon {
  readonly kind: 'clips';
  /** In the order they are offered. The first is the default. */
  readonly clips: readonly [CaseStudyClip, ...CaseStudyClip[]];
  /** Never on this shape: a block is one axis or two, not both. */
  readonly scenarios?: never;
}

/**
 * TWO AXES IN ONE PLAYER: scenarios, each offering the same views.
 *
 * Still ONE video area with ONE <video>, never a tile per scenario (a second
 * ~800px tile in an already long stack was considered and rejected, 2026-09-30).
 * The title is fixed across scenarios because it is the scenario tablist's
 * visible accessible name; a name that changed under its own control would be
 * no name at all. The caption moves onto each scenario.
 */
export interface CaseStudyScenarioClipsBlock {
  readonly kind: 'clips';
  readonly title: string;
  /** Two or more; the first is the default. */
  readonly scenarios: readonly [
    CaseStudyClipScenario,
    CaseStudyClipScenario,
    ...CaseStudyClipScenario[],
  ];
  readonly clips?: never;
  readonly caption?: never;
}

export type CaseStudyMedia =
  | CaseStudyImageBlock
  | CaseStudyClipsBlock
  | CaseStudyScenarioClipsBlock;
```

(Delete the old `export type CaseStudyMedia = CaseStudyImageBlock | CaseStudyClipsBlock;` line.)

After `getCaseStudy`, add:

```ts
export function isScenarioBlock(block: CaseStudyMedia): block is CaseStudyScenarioClipsBlock {
  return block.kind === 'clips' && block.scenarios !== undefined;
}

/**
 * Every clip block, read as scenarios. A single-axis block is one unnamed
 * scenario carrying the block's caption, so the player has exactly one shape to
 * render and a single-axis block comes out as it always did.
 */
export function clipScenarios(
  block: CaseStudyClipsBlock | CaseStudyScenarioClipsBlock
): readonly CaseStudyClipScenario[] {
  if (isScenarioBlock(block)) return block.scenarios;
  return [{ id: 'default', label: '', caption: block.caption, clips: block.clips }];
}

/** Every caption a block can show, in the order it can show them. */
export function mediaCaptions(block: CaseStudyMedia): readonly string[] {
  return block.kind === 'image' ? [block.caption] : clipScenarios(block).map((s) => s.caption);
}
```

- [ ] **Step 4: Run the unit tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/caseStudies.test.ts`
Expected: PASS.

- [ ] **Step 5: Rewrite the state and markup of `CaseStudyClips.tsx`**

Replace the props interface and imports' type line with:

```tsx
import type { CaseStudyClipScenario } from '@/lib/caseStudies';

interface CaseStudyClipsProps {
  /** From `clipScenarios()`. One entry for a single-axis block. */
  scenarios: readonly CaseStudyClipScenario[];
  title?: string;
}

/** What the reader has chosen: a scenario and a view. */
interface Choice {
  scenario: string;
  view: string;
}

/** The single <video> is keyed on this, so it changes on EITHER axis. */
const keyOf = (choice: Choice) => `${choice.scenario}:${choice.view}`;
```

Add one paragraph to the header comment, under "THERE IS ONLY EVER ONE <video> IN THE DOM":

```
 * TWO AXES, STILL ONE ELEMENT. A block may offer scenarios (radar-moboard: avoid
 * or intercept) as well as views (board or sea). The element is keyed on the
 * pair, so a change on EITHER axis replaces it, and the view the reader chose is
 * kept when the scenario changes. Scenario is the tablist -- it changes what the
 * panel is, and its caption -- and view becomes a pair of pressed buttons, since
 * two tablists pointing at one panel is a broken tabs pattern.
```

Replace the component body from `const [selectedId, …` through the end of `select` with:

```tsx
  const views = scenarios[0]!.clips;
  const hasScenarios = scenarios.length > 1;
  const hasViews = views.length > 1;
  const showControls = hasScenarios || hasViews;
  const first: Choice = { scenario: scenarios[0]!.id, view: views[0]!.id };

  /**
   * TWO CHOICES, AND THE SPLIT IS DELIBERATE.
   *
   * `selected` updates on the press and drives the switches, so they answer
   * instantly. `mounted` is what is actually in the DOM, and lags by the
   * fade-out so the swap happens while the stage is at zero opacity.
   */
  const [selected, setSelected] = useState<Choice>(first);
  const [mounted, setMounted] = useState<Choice>(first);
  const mountedKey = keyOf(mounted);
  const scenario = scenarios.find((s) => s.id === mounted.scenario) ?? scenarios[0]!;
  const active = scenario.clips.find((c) => c.id === mounted.view) ?? scenario.clips[0]!;

  const ref = useRef<HTMLVideoElement>(null);
  /** The choice that has already auto-started, so scrolling back past a clip the
   *  reader stopped does not restart it, while a NEW choice does start. */
  const autoStartedFor = useRef<string | null>(null);
  /** The newest choice, readable from inside the swap timeout, where state
   *  would be a stale closure. */
  const pending = useRef<Choice>(first);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [swapping, setSwapping] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  const panelId = `${uid}-clip-panel`;
  const titleId = `${uid}-clip-title`;
  const tabId = (id: string) => `${uid}-clip-tab-${id}`;
  const scenarioTabId = (id: string) => `${uid}-scenario-tab-${id}`;

  useEffect(() => () => clearTimeout(swapTimer.current), []);

  const start = (video: HTMLVideoElement) => video.play().catch(() => setPlaying(false));

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduced) {
      video.pause();
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      if (autoStartedFor.current !== mountedKey) {
        autoStartedFor.current = mountedKey;
        void start(video);
      }
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if (autoStartedFor.current === mountedKey) return;
        autoStartedFor.current = mountedKey;
        void start(video);
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced, mountedKey]);

  const mount = (choice: Choice) => {
    // The element is about to be replaced, so it will never fire the `pause`
    // that would otherwise reset the transport.
    setMounted(choice);
    setPlaying(false);
    setEnded(false);
  };

  const select = (change: Partial<Choice>) => {
    const next = { ...pending.current, ...change };
    if (keyOf(next) === keyOf(pending.current)) return;
    pending.current = next;
    setSelected(next);

    if (reduced) {
      clearTimeout(swapTimer.current);
      setSwapping(false);
      mount(next);
      return;
    }

    setSwapping(true);
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => {
      // `pending.current`, not `next`: a second choice made during the fade --
      // on either switch -- is the one that lands, and the sequence in flight is
      // retargeted rather than doubled. A pair passed through on the way is
      // never mounted, so never fetched.
      mount(pending.current);
      setSwapping(false);
    }, FADE_OUT_MS);
  };
```

Keep the existing `toggle` function unchanged (the old `onTabKeyDown` was already removed in Task 1). Replace the `control` constant with:

```tsx
  // Names WHICH clip, and on a scenario block which scenario: "Board view" is
  // offered twice, so the view alone would not say what the button acts on.
  const subject = (hasScenarios ? `${scenario.label}, ${active.label}` : active.label).toLowerCase();
  const control = ended
    ? { Glyph: ReplayGlyph, word: `Replay ${subject}` }
    : playing
      ? { Glyph: PauseGlyph, word: `Pause ${subject}` }
      : { Glyph: PlayGlyph, word: `Play ${subject}` };
```

Replace the returned JSX's control section (from `{clips.length > 1 && (` through its closing `)}`) with:

```tsx
      {showControls && (
        <>
          {title && (
            <p className="case-clip-title" id={titleId}>
              {title}
            </p>
          )}
          {/* The row decides side-by-side or stacked from its OWN width (a
              container query in case-study.css), scenario first in both. */}
          <div className="case-clip-controls">
            <div className="case-clip-row">
              {hasScenarios && (
                <ClipSwitch
                  mode="tabs"
                  options={scenarios}
                  selectedId={selected.scenario}
                  onSelect={(id) => select({ scenario: id })}
                  labelledBy={title ? titleId : undefined}
                  label="Choose a scenario"
                  tabId={scenarioTabId}
                  panelId={panelId}
                />
              )}
              {hasViews && (
                <ClipSwitch
                  mode={hasScenarios ? 'toggle' : 'tabs'}
                  options={views}
                  selectedId={selected.view}
                  onSelect={(id) => select({ view: id })}
                  labelledBy={!hasScenarios && title ? titleId : undefined}
                  label={hasScenarios ? 'View' : 'Choose a viewpoint'}
                  tabId={tabId}
                  panelId={panelId}
                />
              )}
            </div>
          </div>
        </>
      )}
```

On the stage `<div className="case-clip-stage" …>`, replace the three `clips.length > 1` attributes with:

```tsx
        role={showControls ? 'tabpanel' : undefined}
        id={showControls ? panelId : undefined}
        aria-labelledby={
          showControls ? (hasScenarios ? scenarioTabId(selected.scenario) : tabId(selected.view)) : undefined
        }
```

On the `<video>`, change `key={active.id}` to `key={mountedKey}`. Replace the caption line at the end with:

```tsx
      {/* The scenario's caption: it describes the run on screen, so it follows
          the MOUNTED choice and changes with the picture, not ahead of it. */}
      <CaseStudyCaption title={showControls ? undefined : title} caption={scenario.caption} />
```

Remove the now-unused `CaseStudyClip` import if TypeScript flags it.

- [ ] **Step 6: Wire the page**

In `src/app/projects/[slug]/page.tsx`, add `clipScenarios,` to the existing multi-line `import { … } from '@/lib/caseStudies';` (it closes at line 11), and replace

```tsx
                  <CaseStudyClips
                    clips={block.clips}
                    title={block.title}
                    caption={block.caption}
                  />
```

with

```tsx
                  <CaseStudyClips scenarios={clipScenarios(block)} title={block.title} />
```

- [ ] **Step 7: Add the controls row CSS**

In `src/app/styles/case-study.css`, directly after the `.case-clip-title { … }` rule, add:

```css
  /* The switches' row. It decides side-by-side or stacked from the width IT
     has, not the viewport's: the tile's padding changes across breakpoints, and
     a viewport query would have to restate every one of them. */
  .case-clip-controls {
    container-type: inline-size;
    margin-bottom: 16px;
  }

  .case-clip-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .case-clip-row .case-clip-switch {
    margin-bottom: 0;
  }

  /* Two pills side by side need about 500px (17px labels, 20px padding, the
     44px touch floor). Below 520px they stack -- scenario first, each full
     width -- rather than either one shrinking under the floor to make room. */
  @container (max-width: 520px) {
    .case-clip-row {
      flex-direction: column;
      align-items: stretch;
    }
  }
```

- [ ] **Step 8: Adapt the e2e helpers that read the old shape**

In `tests/e2e/case-study-content.spec.ts`, change the import to:

```ts
import { getCaseStudy, clipScenarios, mediaCaptions } from '@/lib/caseStudies'
```

In "renders every media block in the authored order, and nothing else", replace the caption mapping with:

```ts
        blocks.map((b) =>
          // A clip block's title is rendered above its chooser, where it names
          // the choice, so only its (default scenario's) caption reaches the
          // caption element.
          b.kind === 'clips'
            ? clipScenarios(b)[0]!.caption
            : [b.title, b.caption].filter(Boolean).join('\n')
        )
```

and the `else` branch's `block.clips[0].src` with `clipScenarios(block)[0]!.clips[0].src`.

In "every private-work figure states on the page that its data is synthetic", replace the data loop with:

```ts
    for (const block of blocks) {
      for (const caption of mediaCaptions(block)) {
        expect(caption, `${slug} caption lost its synthetic marker`).toContain(sentence)
      }
    }
```

In the clip-block section, change `CLIP_BLOCKS` and the next test to:

```ts
const CLIP_BLOCKS = CASE_STUDIES.flatMap((p) =>
  (getCaseStudy(p.id)!.media ?? []).flatMap((b) =>
    b.kind === 'clips' ? [{ slug: p.id, block: b, clips: clipScenarios(b)[0]!.clips }] : []
  )
)

test('only radar-moboard ships clips, and both of them live in one block', async () => {
  expect(CLIP_BLOCKS.map((c) => `${c.slug}:${c.clips.map((clip) => clip.id).join('+')}`)).toEqual([
    'radar-moboard:board+seaview',
  ])
})

for (const { slug: projectId, block, clips } of CLIP_BLOCKS) {
  const project = { id: projectId }
  const [first, second] = clips
```

and in that describe, replace the two remaining `block.clips.length` / `block.clips.map(...)` uses with `clips.length` / `clips.map(...)`. (Task 3 replaces this whole section; this is only enough to keep it compiling and green now.)

- [ ] **Step 9: Verify the single-axis path is unchanged**

Run: `pkill -f "next dev"; npm run build && npx vitest run && npx playwright test tests/e2e/case-study-content.spec.ts tests/e2e/a11y.spec.ts tests/e2e/reduced-motion-hydration.spec.ts`
Expected: build succeeds; all PASS. The single tablist, its ids and the transport wording ("Play board view") are what they were.

- [ ] **Step 10: Full gate and commit**

Run: `npm run test:all`
Expected: PASS.

```bash
git add src/lib/caseStudies.ts src/lib/__tests__/caseStudies.test.ts src/components/projects/CaseStudyClips.tsx "src/app/projects/[slug]/page.tsx" src/app/styles/case-study.css tests/e2e/case-study-content.spec.ts
git commit -m "feat: let a clip block offer scenarios as well as views

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: radar-moboard becomes Avoid / Intercept × Board / Sea

Ship the two intercept clips and their posters, convert the radar block to a scenario block with the locked §7.4 strings, and replace the clip e2e section with tests for the two-axis player.

**Files:**
- Create: `public/video/radar-moboard-intercept-board.mp4`, `public/video/radar-moboard-intercept-seaview.mp4`, `public/video/radar-moboard-intercept-board-poster.png`, `public/video/radar-moboard-intercept-seaview-poster.png`
- Modify: `src/lib/caseStudies.ts` (radar `media` clips block, near line 372)
- Modify: `src/lib/__tests__/caseStudies.test.ts`
- Modify: `tests/e2e/case-study-content.spec.ts` (from the `/** The clip blocks.` comment to the end of the file)

**Interfaces:**
- Consumes: everything Task 2 produced. Scenario ids `avoid`, `intercept`; view ids `board`, `seaview` in both.

- [ ] **Step 1: Write the failing unit test (view parity)**

Add to the `describe('case-study media', …)` block in `src/lib/__tests__/caseStudies.test.ts`:

```ts
  it('offers the same views, in the same order, in every scenario of a block', () => {
    // "The view you chose survives a scenario switch" is only well defined if
    // every scenario offers it. The type cannot say this; this does.
    blocks.forEach(({ id, index, block }) => {
      if (block.kind !== 'clips') return
      const [first, ...rest] = clipScenarios(block)
      const shape = (s: { clips: readonly { id: string; label: string }[] }) =>
        s.clips.map((c) => `${c.id}:${c.label}`)
      rest.forEach((s) =>
        expect(shape(s), `${id} media[${index}] scenario "${s.id}"`).toEqual(shape(first!))
      )
    })
  })

  it('gives every scenario a unique id and a label that names the job', () => {
    blocks.forEach(({ id, index, block }) => {
      if (!isScenarioBlock(block)) return
      const ids = block.scenarios.map((s) => s.id)
      expect(new Set(ids).size, `${id} media[${index}] has duplicate scenario ids`).toBe(ids.length)
      block.scenarios.forEach((s) => expect(s.label.trim().length, `${id} ${s.id}`).toBeGreaterThan(0))
    })
  })

  it('ships radar-moboard as avoid and intercept, each from the board and the sea', () => {
    const block = (getCaseStudy('radar-moboard')!.media ?? []).find(isScenarioBlock)
    expect(block, 'radar-moboard has no scenario block').toBeDefined()
    expect(block!.scenarios.map((s) => `${s.id}(${s.clips.map((c) => c.id).join('+')})`)).toEqual([
      'avoid(board+seaview)',
      'intercept(board+seaview)',
    ])
  })
```

Add `isScenarioBlock` to the import from `'../caseStudies'`.

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/__tests__/caseStudies.test.ts`
Expected: FAIL on "ships radar-moboard as avoid and intercept" (no scenario block yet).

- [ ] **Step 3: Ship the media**

```bash
cp capture/out-intercept/board.mp4 public/video/radar-moboard-intercept-board.mp4
cp capture/out-intercept/seaview.mp4 public/video/radar-moboard-intercept-seaview.mp4
ffmpeg -v error -y -i public/video/radar-moboard-intercept-board.mp4 -frames:v 1 public/video/radar-moboard-intercept-board-poster.png
ffmpeg -v error -y -i public/video/radar-moboard-intercept-seaview.mp4 -frames:v 1 public/video/radar-moboard-intercept-seaview-poster.png
for f in public/video/radar-moboard-intercept-*; do ffprobe -v error -show_entries stream=codec_name,width,height -of csv=p=0 "$f"; done
```

Expected: the two mp4s report `h264,600,600`; the two PNGs report `png,600,600`. `capture/` is gitignored and exists only on Omar's machine: if `capture/out-intercept/` is missing, stop and ask him. Do not re-capture.

- [ ] **Step 4: Convert the radar block**

In `src/lib/caseStudies.ts`, replace the whole radar `kind: 'clips'` object (from its leading comment `// Rendered ABOVE the chooser…` through its closing `},`) with:

```ts
      {
        kind: 'clips',
        // Fixed across scenarios: it is the scenario tablist's visible
        // accessible name, and it mirrors the two switches word for word. The
        // caption is what changes, because each scenario is a different run.
        title: 'Avoid or intercept, from the board or the sea.',
        scenarios: [
          {
            id: 'avoid',
            label: 'Avoid',
            caption:
              'The maneuver fires at the Mx ring, and the clock never stops between the two views. All scenarios synthetic.',
            clips: [
              {
                id: 'board',
                label: 'Board view',
                src: '/video/radar-moboard-board.mp4',
                poster: '/video/radar-moboard-board-poster.png',
                description:
                  'The maneuvering board playing the encounter forward: the contact closes along the relative motion line, the maneuver fires at the Mx ring, and the new relative track opens the CPA to the required distance.',
              },
              {
                id: 'seaview',
                label: 'Sea view',
                src: '/video/radar-moboard-seaview.mp4',
                poster: '/video/radar-moboard-seaview-poster.png',
                description:
                  'The same run in the tilted sea view: own ship holds the centre with the required-CPA ring around it, and the contact crosses from ahead to astern as the maneuver takes effect.',
              },
            ],
          },
          {
            // The app's own intercept demo, a DIFFERENT encounter from the
            // shared avoidance scenario. No copy claims the two share a run.
            id: 'intercept',
            label: 'Intercept',
            caption:
              'Own ship alters at the second observation and is on the contact at 14:36. All scenarios synthetic.',
            clips: [
              {
                id: 'board',
                label: 'Board view',
                src: '/video/radar-moboard-intercept-board.mp4',
                poster: '/video/radar-moboard-intercept-board-poster.png',
                description:
                  'The maneuvering board for an intercept: own ship alters at the second observation to 016° at 16.6 knots, and the contact runs down the new relative motion line straight into the centre, arriving at 14:36.',
              },
              {
                id: 'seaview',
                label: 'Sea view',
                src: '/video/radar-moboard-intercept-seaview.mp4',
                poster: '/video/radar-moboard-intercept-seaview-poster.png',
                description:
                  'The same intercept in the tilted sea view: own ship turns onto the new course and the contact closes until the two hulls meet. The view holds there while the clock runs on to 14:36.',
              },
            ],
          },
        ],
      },
```

Check every string against COPY §7.4 character by character before moving on.

- [ ] **Step 5: Run the unit tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/caseStudies.test.ts`
Expected: PASS.

- [ ] **Step 6: Replace the clip e2e section**

In `tests/e2e/case-study-content.spec.ts`, change the import to:

```ts
import {
  getCaseStudy,
  clipScenarios,
  mediaCaptions,
  type CaseStudyClip,
  type CaseStudyClipScenario,
} from '@/lib/caseStudies'
```

Extend "every private-work figure states on the page that its data is synthetic" so the DOM check covers every scenario. After its existing `for (let i …)` loop, inside the `for (const [slug, sentence] …)` loop, add:

```ts
    // A scenario's caption only reaches the page once it is chosen, so choose
    // each one and read it there too.
    const tabs = page.getByRole('tablist').getByRole('tab')
    for (let t = 1; t < (await tabs.count()); t++) {
      await tabs.nth(t).click()
      await expect(page.locator('.case-media-stack .case-caption').filter({ hasText: sentence }))
        .toHaveCount(blocks.length)
    }
```

Then delete everything from the `/**` comment that opens "The clip blocks." to the end of the file, and put this in its place:

```ts
/**
 * The clip blocks. Derived from the data, and written for the shape radar-moboard
 * ships: two scenarios (a tablist) of two views (a group of pressed buttons), in
 * ONE player with ONE <video>.
 */
const CLIP_BLOCKS = CASE_STUDIES.flatMap((p) =>
  (getCaseStudy(p.id)!.media ?? []).flatMap((b, index) =>
    b.kind === 'clips' ? [{ slug: p.id, index, block: b, scenarios: clipScenarios(b) }] : []
  )
)

test('only radar-moboard ships clips: two scenarios of two views, in one block', async () => {
  expect(
    CLIP_BLOCKS.map(
      (c) =>
        `${c.slug}:` +
        c.scenarios.map((s) => `${s.id}(${s.clips.map((clip) => clip.id).join('+')})`).join('+')
    )
  ).toEqual(['radar-moboard:avoid(board+seaview)+intercept(board+seaview)'])
})

type Page = import('@playwright/test').Page

for (const { slug, index: blockIndex, block, scenarios } of CLIP_BLOCKS) {
  const [S0, S1] = scenarios as readonly CaseStudyClipScenario[] as [
    CaseStudyClipScenario,
    CaseStudyClipScenario,
  ]
  const [V0, V1] = S0.clips as readonly CaseStudyClip[] as [CaseStudyClip, CaseStudyClip]
  const clipAt = (s: CaseStudyClipScenario, viewId: string) => s.clips.find((c) => c.id === viewId)!
  /** The transport's subject, after its verb: "avoid, board view". */
  const named = (s: CaseStudyClipScenario, v: CaseStudyClip) => `${s.label}, ${v.label}`

  const stage = (page: Page) => page.locator('.case-clip-stage')
  const clip = (page: Page) => page.locator('.case-video')
  const transport = (page: Page) => page.locator('.case-video-toggle')
  const scenarioTabs = (page: Page) => page.getByRole('tablist').getByRole('tab')
  const viewButtons = (page: Page) => page.getByRole('group', { name: 'View' }).getByRole('button')
  const caption = (page: Page) => page.locator('.case-media-stack .case-caption').nth(blockIndex)
  const isFocused = (l: import('@playwright/test').Locator) =>
    l.evaluate((el) => el === document.activeElement)

  test.describe(`/projects/${slug} clips`, () => {
    test('offers one video area: a scenario tablist and a view toggle, never two players', async ({
      page,
    }) => {
      await page.goto(`/projects/${slug}`)

      await expect(clip(page)).toHaveCount(1)
      await expect(clip(page)).toHaveAttribute('src', V0.src)
      await expect(clip(page)).toHaveAttribute('poster', V0.poster)

      await expect(page.getByRole('tablist')).toHaveCount(1)
      expect(await scenarioTabs(page).allInnerTexts()).toEqual(scenarios.map((s) => s.label))
      await expect(scenarioTabs(page).nth(0)).toHaveAttribute('aria-selected', 'true')
      await expect(scenarioTabs(page).nth(1)).toHaveAttribute('aria-selected', 'false')

      // The view is NOT a second tablist: two tablists pointing at one panel is
      // a broken tabs pattern. It is a pair of pressed / unpressed buttons.
      expect(await viewButtons(page).allInnerTexts()).toEqual(S0.clips.map((c) => c.label))
      await expect(viewButtons(page).nth(0)).toHaveAttribute('aria-pressed', 'true')
      await expect(viewButtons(page).nth(1)).toHaveAttribute('aria-pressed', 'false')

      const panel = page.getByRole('tabpanel')
      await expect(panel).toHaveCount(1)
      expect(await panel.getAttribute('aria-labelledby')).toBe(
        await scenarioTabs(page).nth(0).getAttribute('id')
      )
    })

    test('names the scenario choice by the sentence above it', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      const heading = page.locator('.case-clip-title')
      await expect(heading).toHaveCount(1)
      await expect(heading).toHaveText(block.title!)
      const list = page.getByRole('tablist')
      expect(await list.getAttribute('aria-labelledby')).toBe(await heading.getAttribute('id'))
      await expect(list).not.toHaveAttribute('aria-label', /./)
      await expect(list).toHaveAccessibleName(block.title!)
    })

    test('sets the switches side by side when wide, stacks them when narrow, never overflows', async ({
      page,
    }) => {
      for (const width of [1440, 768, 600, 390]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/projects/${slug}`)
        const switches = page.locator('.case-clip-switch')
        await switches.first().scrollIntoViewIfNeeded()
        const a = (await switches.nth(0).boundingBox())!
        const b = (await switches.nth(1).boundingBox())!
        const tile = (await page.locator('.case-media-stack .case-figure').nth(blockIndex).boundingBox())!

        for (const box of [a, b]) {
          expect(box.x, `a switch overflows left at ${width}px`).toBeGreaterThanOrEqual(tile.x - 0.5)
          expect(box.x + box.width, `a switch overflows right at ${width}px`).toBeLessThanOrEqual(
            tile.x + tile.width + 0.5
          )
        }
        // The touch floor holds on every option at every width: neither switch
        // is shrunk to make room for the other.
        const heights = await page
          .locator('.case-clip-tab')
          .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height))
        for (const h of heights) expect(h, `an option is under 44px at ${width}px`).toBeGreaterThanOrEqual(44)

        // Scenario first, in both layouts.
        expect(b.y + b.x, `view switch is not after the scenario at ${width}px`).toBeGreaterThan(a.y + a.x)
        if (width === 1440) {
          expect(Math.abs(a.y - b.y), 'switches are not on one row at 1440').toBeLessThan(1)
          expect(b.x, 'view switch is not right of the scenario at 1440').toBeGreaterThan(a.x + a.width)
        }
        if (width === 390) {
          expect(b.y, 'view switch is not stacked under the scenario at 390').toBeGreaterThanOrEqual(
            a.y + a.height
          )
          expect(Math.abs(a.width - b.width), 'stacked switches differ in width at 390').toBeLessThan(1)
        }
      }
    })

    test("keeps each switch's columns equal and its labels inside the pill, down to 390px", async ({
      page,
    }) => {
      for (const width of [1440, 768, 390]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/projects/${slug}`)
        const switches = page.locator('.case-clip-switch')
        await switches.first().scrollIntoViewIfNeeded()
        for (let i = 0; i < 2; i++) {
          const options = switches.nth(i).locator('.case-clip-tab')
          // EQUAL COLUMNS ARE THE INDICATOR'S WHOLE PREMISE: it is one column
          // wide and travels by 100% of itself.
          const boxes = await options.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width))
          expect(Math.abs(boxes[0] - boxes[1]), `switch ${i} columns disagree at ${width}px`).toBeLessThan(1)
          const indicator = (await switches.nth(i).locator('.case-clip-indicator').boundingBox())!
          expect(Math.abs(indicator.width - boxes[0]), `switch ${i} indicator misfits at ${width}px`).toBeLessThan(1)
          const slack = await options.evaluateAll((els) =>
            els.map((el) => {
              const range = document.createRange()
              range.selectNodeContents(el)
              return el.getBoundingClientRect().width - range.getBoundingClientRect().width
            })
          )
          for (const [j, s] of slack.entries()) {
            expect(s, `switch ${i} label ${j} has ${s}px of slack at ${width}px`).toBeGreaterThan(24)
          }
        }
      }
    })

    test('carries selection on a moving indicator, not by recolouring the label', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      for (let i = 0; i < 2; i++) {
        const sw = page.locator('.case-clip-switch').nth(i)
        const options = sw.locator('.case-clip-tab')
        await options.first().scrollIntoViewIfNeeded()
        const colours = await options.evaluateAll((els) => els.map((el) => getComputedStyle(el).color))
        expect(new Set(colours).size, `switch ${i} labels are not one colour`).toBe(1)
        const indicator = sw.locator('.case-clip-indicator')
        const at = () =>
          indicator.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)
        const home = await at()
        await options.nth(1).click()
        await expect.poll(at, { timeout: 3000 }).toBeGreaterThan(home + 1)
      }
    })

    test('the scenario indicator retargets mid-flight instead of snapping or queueing', async ({
      page,
    }) => {
      await page.goto(`/projects/${slug}`)
      const tabs = scenarioTabs(page)
      const indicator = page.locator('.case-clip-switch').nth(0).locator('.case-clip-indicator')
      await tabs.first().scrollIntoViewIfNeeded()
      const at = () =>
        indicator.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)

      const home = await at()
      await tabs.nth(1).click()
      await page.waitForTimeout(110)
      const midway = await at()
      expect(midway, 'the indicator never left its first tab').toBeGreaterThan(home + 1)
      const target = await indicator.evaluate((el) => el.getBoundingClientRect().width)
      expect(midway, 'the indicator had already arrived; catch it earlier').toBeLessThan(home + target - 1)

      await tabs.nth(0).click()
      // Snapped, queued or restarted would each visit an anchor; retargeting
      // from the presentation value visits neither.
      const justAfter = await at()
      expect(justAfter, 'the indicator snapped home on reversal').toBeGreaterThan(home + 1)
      expect(justAfter, 'the indicator snapped to the far tab on reversal').toBeLessThan(home + target - 2)
      const samples: number[] = []
      for (let i = 0; i < 8; i++) {
        samples.push(await at())
        await page.waitForTimeout(20)
      }
      expect(Math.max(...samples), 'the indicator queued or restarted').toBeLessThan(home + target - 2)

      await expect.poll(at, { timeout: 3000 }).toBeLessThan(home + 1)
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
      await expect(clip(page)).toHaveAttribute('src', V0.src)
    })

    test('swaps the clip while it is invisible, and never empties the frame', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      await stage(page).scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)

      const frames = await page.evaluate(async (target) => {
        const stage = document.querySelector('.case-clip-stage')!
        const button = [...document.querySelectorAll('[role=group] .case-clip-tab')][1] as HTMLElement
        const out: { t: number; opacity: number; src: string; panelH: number }[] = []
        const t0 = performance.now()
        button.click()
        await new Promise<void>((done) => {
          const tick = () => {
            const media = stage.querySelector('.case-clip-media') as HTMLElement
            const video = stage.querySelector('.case-video') as HTMLVideoElement
            const panel = stage.querySelector('.case-video-frame') as HTMLElement
            out.push({
              t: performance.now() - t0,
              opacity: Number(getComputedStyle(media).opacity),
              src: video?.getAttribute('src') ?? '',
              panelH: Math.round(panel.getBoundingClientRect().height),
            })
            if (performance.now() - t0 < 900) requestAnimationFrame(tick)
            else done()
          }
          requestAnimationFrame(tick)
        })
        return out.map((f) => ({ ...f, swapped: f.src === target }))
      }, V1.src)

      const swap = frames.findIndex((f) => f.swapped)
      expect(swap, 'the clip never swapped').toBeGreaterThan(0)
      expect(frames[swap].opacity, 'the clip was swapped in plain sight').toBeLessThan(0.05)
      const after = frames.slice(swap).map((f) => f.opacity)
      expect(Math.max(...after)).toBeGreaterThan(0.95)
      expect(after.filter((o) => o > 0.1 && o < 0.9).length, 'the clip popped in').toBeGreaterThan(1)
      expect([...new Set(frames.map((f) => f.panelH))], 'the panel changed size').toHaveLength(1)
    })

    test('never requests a clip the reader did not land on', async ({ page }) => {
      const requested: string[] = []
      page.on('request', (r) => {
        if (/\.mp4(\?|$)/.test(r.url())) requested.push(new URL(r.url()).pathname)
      })

      await page.goto(`/projects/${slug}`)
      await stage(page).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1200)
      expect(
        requested.filter((src) => src !== V0.src),
        'more than the default clip was fetched on load'
      ).toEqual([])

      // Two choices inside ONE fade, on two different switches: Intercept, then
      // Sea view. The pair passed through on the way (intercept + board) must
      // never mount, so it must never be fetched.
      await page.evaluate(() => {
        ;(document.querySelectorAll('[role=tablist] [role=tab]')[1] as HTMLElement).click()
        ;(document.querySelectorAll('[role=group] .case-clip-tab')[1] as HTMLElement).click()
      })
      await expect(clip(page)).toHaveAttribute('src', clipAt(S1, V1.id).src)
      await expect(clip(page)).toHaveCount(1)
      await page.waitForTimeout(1200)
      expect(requested, 'a pair passed through mid-fade was fetched').not.toContain(clipAt(S1, V0.id).src)
      expect(requested, 'the unchosen avoid view was fetched').not.toContain(V1.src)
    })

    test('keeps the chosen view across a scenario switch', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      await stage(page).scrollIntoViewIfNeeded()

      await viewButtons(page).nth(1).click()
      await expect(clip(page)).toHaveAttribute('src', V1.src)

      await scenarioTabs(page).nth(1).click()
      await expect(clip(page)).toHaveAttribute('src', clipAt(S1, V1.id).src)
      await expect(viewButtons(page).nth(1)).toHaveAttribute('aria-pressed', 'true')

      await scenarioTabs(page).nth(0).click()
      await expect(clip(page)).toHaveAttribute('src', V1.src)
      await expect(clip(page)).toHaveCount(1)
    })

    test('swaps the caption with the scenario, and keeps the title fixed', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      await expect(caption(page)).toHaveText(S0.caption)

      await scenarioTabs(page).nth(1).click()
      await expect(caption(page)).toHaveText(S1.caption)
      await expect(page.locator('.case-clip-title')).toHaveText(block.title!)

      // The view does not change what the run is, so it does not change the caption.
      await viewButtons(page).nth(1).click()
      await expect(clip(page)).toHaveAttribute('src', clipAt(S1, V1.id).src)
      await expect(caption(page)).toHaveText(S1.caption)
    })

    test('switching swaps the clip, resets to its own poster, and leaves nothing running', async ({
      page,
    }) => {
      await page.goto(`/projects/${slug}`)
      await stage(page).scrollIntoViewIfNeeded()
      await expect(transport(page)).toHaveText(new RegExp(`Pause ${named(S0, V0)}`, 'i'), {
        timeout: 10_000,
      })
      await expect
        .poll(async () => clip(page).evaluate((v: HTMLVideoElement) => v.currentTime), {
          timeout: 10_000,
        })
        .toBeGreaterThan(0.3)

      await scenarioTabs(page).nth(1).click()

      const landed = clipAt(S1, V0.id)
      await expect(clip(page)).toHaveAttribute('src', landed.src)
      await expect(clip(page)).toHaveAttribute('poster', landed.poster)
      await expect(clip(page)).toHaveCount(1)
      expect(await clip(page).evaluate((v: HTMLVideoElement) => v.currentTime)).toBeLessThan(0.3)
    })

    test('scenario is one tab stop with manual activation, then the view, then the transport', async ({
      page,
    }) => {
      await page.goto(`/projects/${slug}`)
      const tabs = scenarioTabs(page)
      await tabs.nth(0).scrollIntoViewIfNeeded()

      expect(await tabs.nth(0).getAttribute('tabindex')).toBe('0')
      expect(await tabs.nth(1).getAttribute('tabindex')).toBe('-1')

      await tabs.nth(0).focus()
      await page.keyboard.press('ArrowRight')
      expect(await isFocused(tabs.nth(1)), 'ArrowRight did not move focus').toBe(true)
      // MANUAL activation: focus alone must not start a download.
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')

      await page.keyboard.press('Enter')
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
      await expect(clip(page)).toHaveAttribute('src', clipAt(S1, V0.id).src)
      expect(
        await tabs.nth(1).evaluate(
          (el) => el.matches(':focus-visible') && getComputedStyle(el).outlineStyle !== 'none'
        )
      ).toBe(true)

      // Reading order: scenario, then view, then the transport.
      await page.keyboard.press('Tab')
      expect(await isFocused(viewButtons(page).nth(0)), 'Tab did not reach the view').toBe(true)
      await page.keyboard.press('Tab')
      expect(await isFocused(viewButtons(page).nth(1))).toBe(true)
      await page.keyboard.press('Space')
      await expect(viewButtons(page).nth(1)).toHaveAttribute('aria-pressed', 'true')
      await expect(clip(page)).toHaveAttribute('src', clipAt(S1, V1.id).src)
      await page.keyboard.press('Tab')
      expect(await isFocused(transport(page)), 'Tab did not reach the transport').toBe(true)
    })

    test('does not loop, and the transport names the scenario and the view it acts on', async ({
      page,
    }) => {
      await page.goto(`/projects/${slug}`)
      const el = clip(page)
      expect(
        await el.evaluate((v: HTMLVideoElement) => ({
          muted: v.muted,
          loop: v.loop,
          playsInline: v.hasAttribute('playsinline'),
          autoplayAttribute: v.hasAttribute('autoplay'),
        }))
      ).toEqual({ muted: true, loop: false, playsInline: true, autoplayAttribute: false })
      expect(await el.evaluate((v) => getComputedStyle(v).objectFit)).toBe('contain')

      const button = transport(page)
      await button.scrollIntoViewIfNeeded()
      const box = (await button.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
      // "Board view" is offered in both scenarios, so the name must say which.
      await expect(button).toHaveText(new RegExp(named(S0, V0), 'i'))
      await scenarioTabs(page).nth(1).click()
      await expect(button).toHaveText(new RegExp(named(S1, V0), 'i'))
    })

    test('plays once, then offers replay rather than pretending it can be played', async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      const el = clip(page)
      const button = transport(page)
      await el.scrollIntoViewIfNeeded()
      await expect(button).toHaveText(new RegExp(`Pause ${named(S0, V0)}`, 'i'), { timeout: 10_000 })
      await el.evaluate((v: HTMLVideoElement) => {
        v.currentTime = v.duration - 0.05
      })
      await expect(button).toHaveText(new RegExp(`Replay ${named(S0, V0)}`, 'i'), { timeout: 10_000 })
      expect(
        await el.evaluate((v: HTMLVideoElement) => ({ ended: v.ended, near: v.currentTime > 1 }))
      ).toEqual({ ended: true, near: true })
      await button.click()
      await expect(button).not.toHaveText(new RegExp(`Replay ${named(S0, V0)}`, 'i'))
      expect(await el.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeLessThan(2)
    })

    test('under prefers-reduced-motion it shows the poster, never plays, and switches instantly', async ({
      browser,
    }) => {
      const context = await browser.newContext({ reducedMotion: 'reduce' })
      const page = await context.newPage()
      const HYDRATION_ERROR = /hydrat|did not match|Minified React error #(418|423|425)/i
      const errors: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error' && HYDRATION_ERROR.test(m.text())) errors.push(m.text())
      })

      await page.goto(`/projects/${slug}`)
      const el = clip(page)
      await el.scrollIntoViewIfNeeded()
      await page.waitForTimeout(1500)
      const state = await el.evaluate((v: HTMLVideoElement) => ({ paused: v.paused, t: v.currentTime }))
      expect(state.paused, 'the clip autoplayed under reduced motion').toBe(true)
      expect(state.t).toBeLessThan(0.5)
      await expect(transport(page)).toHaveText(new RegExp(`Play ${named(S0, V0)}`, 'i'))

      // Both axes switch instantly: no fade, no slide.
      await viewButtons(page).nth(1).click()
      await expect(el).toHaveAttribute('poster', V1.poster, { timeout: 200 })
      await scenarioTabs(page).nth(1).click()
      await expect(el).toHaveAttribute('poster', clipAt(S1, V1.id).poster, { timeout: 200 })
      expect(
        await page.locator('.case-clip-stage').evaluate((s) => ({
          swapping: s.getAttribute('data-swapping'),
          clip: getComputedStyle(s.querySelector('.case-clip-media')!).opacity,
          clipEase: getComputedStyle(s.querySelector('.case-clip-media')!).transitionDuration,
          indicators: [...s.parentElement!.querySelectorAll('.case-clip-indicator')].map(
            (i) => getComputedStyle(i).transitionDuration
          ),
        }))
      ).toEqual({ swapping: null, clip: '1', clipEase: '0s', indicators: ['0s', '0s'] })

      // A scenario switch under reduce must not autoplay the new clip either.
      await page.waitForTimeout(800)
      expect(await el.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
      expect(errors, 'hydration or runtime errors under reduced motion').toEqual([])
      await context.close()
    })
  })
}
```

(`mediaCaptions` is used by the synthetic test from Task 2; keep the import.)

- [ ] **Step 7: Run the clip e2e**

Run: `pkill -f "next dev"; npx playwright test tests/e2e/case-study-content.spec.ts`
Expected: PASS. If the layout test fails at 600px with the switches side by side but overflowing, the container threshold in `.case-clip-controls` is too low: measure the two switches' combined min width at 600 in DevTools and raise the `520px` to that width + 20, then re-run. Do not shrink the pills.

- [ ] **Step 8: Full gate and commit**

Run: `npm run build && npm run test:all`
Expected: PASS (including `a11y.spec.ts` in both themes).

```bash
git add public/video/radar-moboard-intercept-* src/lib/caseStudies.ts src/lib/__tests__/caseStudies.test.ts tests/e2e/case-study-content.spec.ts
git commit -m "feat: radar-moboard clips offer avoid and intercept, from the board or the sea

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: The locked copy (stats, Approach, Impact, catalog)

**Files:**
- Modify: `src/lib/caseStudies.ts` (radar `stats` ~line 291, `approach` ¶1 ~line 317, `impact.paragraphs` ~line 336)
- Modify: `src/data/projects.json` (radar entry ~lines 192–211)
- Test: `tests/e2e/case-study-content.spec.ts`, `src/lib/__tests__/caseStudies.test.ts`

- [ ] **Step 1: Re-check the test count**

Run: `cd ~/Documents/github/radar-moboard && npx vitest run 2>&1 | grep "Tests "; cd -`
Expected: `Tests  1689 passed | 9 skipped (1698)`. If the passed count differs, **stop and ask Omar**.

- [ ] **Step 2: Write the failing tests**

Append to `tests/e2e/case-study-content.spec.ts`:

```ts
test('radar-moboard states the intercept, and keeps it outside the graded claim', async ({ page }) => {
  await page.goto('/projects/radar-moboard')
  await expect(page.getByText('44 of them by the end', { exact: false })).toBeVisible()
  // The two emphasis runs of the new Impact paragraphs (COPY §7.3).
  await expect(page.locator('strong', { hasText: /^alter now$/ })).toBeVisible()
  await expect(page.locator('strong', { hasText: /^one check, not an answer key$/ })).toBeVisible()
  // The stale count must be gone everywhere on the page.
  await expect(page.getByText(/1,589/)).toHaveCount(0)
})
```

Append to the `describe('case-study projects still carry what the template renders', …)` block in `src/lib/__tests__/caseStudies.test.ts`:

```ts
  it('never says radar-moboard is graded in CI', () => {
    // CI runs the PUBLIC answer key only; the private key's problems skip there.
    // "Graded in CI against two independent answer keys" was false for one of
    // the two, so no catalog or case-study string may put CI next to grading.
    const radar = getAllProjects().find((p) => p.id === 'radar-moboard')!
    const strings = [radar.description, radar.stats, radar.cardStat ?? '', radar.tagline ?? '']
    strings.forEach((s) => expect(s).not.toMatch(/\bCI\b/))
    expect(radar.stats).not.toContain('1,589')
  })
```

- [ ] **Step 3: Run them to verify they fail**

Run: `npx vitest run src/lib/__tests__/caseStudies.test.ts && pkill -f "next dev"; npx playwright test tests/e2e/case-study-content.spec.ts -g "keeps it outside the graded claim"`
Expected: both FAIL (the description still says "in CI"; the page still says 42 and 1,589).

- [ ] **Step 4: Apply the copy (verbatim from COPY §7.1–§7.3)**

In `src/lib/caseStudies.ts`, radar entry, replace `stats` with:

```ts
    stats: [
      { value: '16 problems', label: 'graded against two independent answer keys' },
      { value: '1,689 tests', label: 'passing with both answer keys loaded' },
      { value: 'Alter now', label: 'the lowest-speed intercept, every time' },
    ],
```

In `approach.paragraphs[0]`, change `42 of them by the end.` to `44 of them by the end.`

In `impact.paragraphs`, insert these two entries **after the first paragraph and before** the one that begins `'The board draws two ways.`:

```ts
        [
          'It answers a second question as well, the one a boarding approach asks: be on the contact at a set time. Give it the two observations and that time, and it returns one course and one speed. The answer is always to ',
          { em: 'alter now' },
          ', at the second observation, and that is a result rather than a default. Any later plan covers the same ground in two legs instead of one straight one, in the same time, so it needs more speed. On the demonstration encounter that is 16.6 knots altering now, 20.1 knots ten minutes later and 53 knots at twenty-five.',
        ],
        [
          'The intercept sits outside the answer keys, because neither of them contains an intercept problem. The nearest check is Pub. 217’s Example 4(1), changing station with time specified, which is the same construction aimed at a different point. The book gives 062° at 27 knots and the code gives 061.7° at 26.85. That is ',
          { em: 'one check, not an answer key' },
          ', and it is not counted in the sixteen.',
        ],
```

In `src/data/projects.json`, radar entry:
- `"cardStat": "1,589 tests"` → `"cardStat": "1,689 tests"`
- `"stats": "16 problems • two answer keys • 1,589 tests"` → `"stats": "16 problems • two answer keys • 1,689 tests"`
- in `"description"`, replace `the course or speed change that opens the CPA to the distance required. Graded in CI against two independent answer keys.` with `the course or speed change that opens the CPA to the distance required. It also finds the one course and speed that put own ship on a contact at a set time. Graded against two independent answer keys.`
- `"tagline"`: unchanged.

Diff every changed string against COPY §7 before moving on.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run && pkill -f "next dev"; npx playwright test tests/e2e/case-study-content.spec.ts tests/e2e/projects-filter.spec.ts`
Expected: PASS. (The stats test in "renders its hero, three stats and three sections" now checks the three new values automatically.)

- [ ] **Step 6: Full gate and commit**

Run: `npm run build && npm run test:all`
Expected: PASS.

```bash
git add src/lib/caseStudies.ts src/data/projects.json src/lib/__tests__/caseStudies.test.ts tests/e2e/case-study-content.spec.ts
git commit -m "feat: radar-moboard copy for the intercept, and the stale counts fixed

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Docs and the real-device checkpoint

**Files:**
- Modify: `.claude/CLAUDE.md` (the "case-study media system" bullet under "Site structure")
- Modify: `docs/superpowers/content/radar-moboard-COPY.md` (§7 status line)

- [ ] **Step 1: Update CLAUDE.md**

In `.claude/CLAUDE.md`, in the bullet that begins "**The case-study media system**", replace `or kind: 'clips' (one video area with a segmented chooser).` with:

```
or `kind: 'clips'` (one video area). A clips block is either one axis (`clips`, a segmented chooser) or two (`scenarios`, each offering the same views: a scenario tablist plus a view toggle, as radar-moboard's Avoid / Intercept × Board view / Sea view). `clipScenarios()` normalises both, and the one `<video>` is keyed on the full choice.
```

- [ ] **Step 2: Mark §7 as shipped**

In `docs/superpowers/content/radar-moboard-COPY.md`, under the §7 heading's status paragraph, add one line: `**Shipped on dev, <date>, commits <Task 3 sha>, <Task 4 sha>.**` with the real date and short SHAs.

- [ ] **Step 3: Commit**

```bash
git add .claude/CLAUDE.md docs/superpowers/content/radar-moboard-COPY.md
git commit -m "docs: record the two-axis clip block and the intercept copy as shipped

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 4: ⏸ Real-device checkpoint (Omar)**

Run: `pkill -f "next dev"; npm run preview -- --ip 0.0.0.0`, then give Omar `http://<LAN-IP>:8787/projects/radar-moboard` (find the IP with `ipconfig getifaddr en0`). Never point the phone at `npm run dev` (`docs/ENGINEERING-NOTES.md` §7).

Ask him to check, on the phone and on desktop:
1. The switches sit on one row on desktop and stack, scenario first, on the phone; every option is comfortable to tap.
2. Sea view, then Intercept: the sea view is kept, and the caption changes to the 14:36 sentence.
3. Fast double taps across both switches land on the last choice with one clean fade.
4. With Reduce Motion on (iOS Settings → Accessibility → Motion), nothing autoplays and switches are instant.
5. Both themes (toggle the OS appearance) read correctly.

Record his verdict. Do not merge or push until he approves.
