/**
 * Case-study prose for `/projects/[slug]`.
 *
 * WHY THIS IS NOT IN `projects.json`
 *
 * `projects.json` is the catalog: the facts every surface needs (title,
 * tagline, tech, links, stats) and the data the OG-card renderer reads. This
 * file is long-form editorial copy for exactly the projects that have a case
 * study. Putting multi-paragraph prose in the catalog would push it into every
 * consumer that only wants a card, and it would put the page's copy under a
 * schema whose other fields are load-bearing for the build.
 *
 * What matters for Task B2.4 is that the copy is DATA either way: the template
 * in `src/app/projects/[slug]/page.tsx` renders whatever this file returns and
 * never branches on a slug. Adding a third case study means adding an entry
 * here, not editing the page.
 *
 * Copy is Omar-approved and transcribed verbatim. `brent-cuda` comes from
 * `docs/superpowers/mockups/projects/v5.html`; `radar-moboard` and
 * `a16-summarizer` come from the locked workshop documents under
 * `docs/superpowers/content/` (§2 of each). Do not reword anything here.
 * Approved copy changes come from those sources, never from this file.
 */

/** A run of prose. `{ em: '...' }` is the mockup's `<b>` emphasis. */
export type Prose = ReadonlyArray<string | { readonly em: string }>;

export interface CaseStudySection {
  /** Small blue label: THE PROBLEM / THE APPROACH / THE IMPACT. */
  readonly eyebrow: string;
  /** A statement, not a topic. Sentence with a full stop. */
  readonly heading: string;
  readonly paragraphs: readonly Prose[];
}

export interface CaseStudyStat {
  /** The number or short fact. Real, and traceable to the project's own record. */
  readonly value: string;
  /** What the number means. */
  readonly label: string;
}

export interface CaseStudyFigure {
  /**
   * Optional by design. The contract RESERVES a 16:9 media slot for phase-5
   * charts and GIFs; neither project has its artwork yet, so both ship without
   * one. The slot renders only when there is a real image to put in it -- a
   * hatched "media goes here" placeholder is a mockup device, not something a
   * portfolio should serve to a recruiter.
   */
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
}

/**
 * A looping clip, rendered after the figure rather than instead of it. Optional
 * and rare: only radar-moboard has one, because only radar-moboard has motion
 * that carries information a still cannot.
 */
export interface CaseStudyVideoData {
  readonly src: string;
  /** First frame of the CLIP, not a related still. The two differ. */
  readonly poster: string;
  /** What the clip shows, for anyone who cannot watch it. */
  readonly description: string;
  readonly caption: string;
}

export interface CaseStudy {
  /**
   * Hero gradient stops. Two ends; the template adds the shared dark third
   * stop so every hero lands on the same ground.
   *
   * These are the approved mockup's hero values, NOT `brand.gradient` from
   * `projects.json`, for two reasons:
   *  - `brand.gradient` is coupled to the committed OG card PNGs (see
   *    CLAUDE.md, "OG cards silently go stale"), so it is not free to move.
   *  - the catalog gradients are chosen to sit behind a card's own artwork,
   *    not behind white display type, and they fail at both ends. The retired
   *    `collision-avoidance-radar` started at #8DA2B8, too LIGHT for white
   *    46px type at about 2.6:1; `a16-summarizer`'s #0A0A0C is too DARK to
   *    separate from its own near-black squircle. Each hero below is picked
   *    against the artwork's measured hue and checked for white contrast.
   */
  readonly hero: { readonly from: string; readonly to: string };
  /** One line under the title. Distinct from the card tagline. */
  readonly thesis: string;
  /** Exactly three. Real numbers and real facts only, never a rounded guess. */
  readonly stats: readonly [CaseStudyStat, CaseStudyStat, CaseStudyStat];
  readonly problem: CaseStudySection;
  readonly approach: CaseStudySection;
  readonly impact: CaseStudySection;
  readonly figure?: CaseStudyFigure;
  readonly video?: CaseStudyVideoData;
}

const CASE_STUDIES: Readonly<Record<string, CaseStudy>> = {
  'brent-cuda': {
    hero: { from: '#166534', to: '#0d2b1c' },
    thesis:
      "One independent root-finder per GPU thread. The first CUDA implementation of Brent's method.",
    stats: [
      { value: '35.31×', label: 'kernel speedup vs single-thread CPU' },
      { value: '8.79×', label: 'end-to-end on an RTX 3080' },
      { value: '<1e-10', label: 'fp64 deviation across Python, C++, CUDA' },
    ],
    problem: {
      eyebrow: 'THE PROBLEM',
      heading: 'Root-finding refuses to parallelize.',
      paragraphs: [
        [
          "Brent's method is the workhorse of numerical root-finding: robust, derivative-free, and stubbornly ",
          { em: 'sequential' },
          '. Each iteration depends on the one before it, so a single solve cannot be spread across GPU threads.',
        ],
        [
          'But scientific workloads rarely need one root. They need thousands of them: the same equation swept across parameters, ensembles, and batched simulations. That reframing is the whole trick.',
        ],
      ],
    },
    approach: {
      eyebrow: 'THE APPROACH',
      heading: 'Batch parallelism, one solver per thread.',
      paragraphs: [
        [
          "Instead of parallelizing inside the algorithm, each CUDA thread runs a complete, independent Brent's solve. The project built the same solver three times, in reference Python, single-thread C++, and CUDA, and validated every implementation against a Python ground truth.",
        ],
        [
          'The hard part was ',
          { em: 'bit-level discipline' },
          ': keeping fp64 results identical across all three implementations, so the GPU version is a drop-in replacement rather than an approximation.',
        ],
      ],
    },
    impact: {
      eyebrow: 'THE IMPACT',
      heading: '35 times faster, provably identical.',
      paragraphs: [
        [
          'On an NVIDIA RTX 3080 the CUDA kernel solves batches ',
          { em: '35.31 times faster' },
          ' than the CPU baseline, and ',
          { em: '8.79 times faster' },
          ' end-to-end including transfers, with results validated to below ',
          { em: '1e-10' },
          ' against the reference. The same technique generalizes to any batchable numerical method.',
        ],
      ],
    },
  },

  'radar-moboard': {
    hero: { from: '#155E75', to: '#0B2A38' },
    thesis:
      'Paper plots do not check themselves. This one is graded against two independent answer keys.',
    stats: [
      { value: '12 days', label: 'Python prototype to TypeScript monorepo' },
      { value: '16 problems', label: 'graded against two independent answer keys' },
      { value: '1,589 tests', label: 'green across both answer keys' },
    ],
    problem: {
      eyebrow: 'THE PROBLEM',
      heading: 'Paper does not tell you when you are wrong.',
      paragraphs: [
        [
          'Deck licence candidates work maneuvering board problems by hand, on a paper plotting sheet, under examination conditions. The construction is unforgiving and the feedback arrives at the end: one vector laid off a degree wide carries through every step after it, and the mistake only shows up when the final answer misses.',
        ],
        [
          'An earlier Python version of this got the method right and the frame of reference wrong. It drew the board head up, with own ship\u2019s course sitting at 000, and recovered the true course by adding that course back at the very end. That is a legitimate way to work a relative plot on paper. On a screen it means the bearings drawn are relative rather than true, so ',
          { em: 'certain valid inputs plotted wrongly' },
          ', and nothing in the app said so.',
        ],
      ],
    },
    approach: {
      eyebrow: 'THE APPROACH',
      heading: 'Rebuild it in TypeScript, and let the answer keys decide.',
      paragraphs: [
        [
          'The rewrite is a four-package TypeScript monorepo. Geometry holds every construction and knows nothing about a screen, render turns a solved problem into a scene, app is the React front end, and export is the interface for handing a worked sheet back out. The port took ',
          { em: '12 days' },
          ', and the language was new. Claude Code carried the debugging and refactoring and wrote a tutorial alongside each feature as it landed, 42 of them by the end.',
        ],
        [
          'Correctness here is graded, not asserted. The suite runs the solver against ',
          { em: 'two independent answer keys' },
          ': six worked examples from Pub. 217, the United States government maneuvering board manual, and ten problems from a separate training key. Sixteen problems, twelve of which require a maneuver. A branch protection rule blocks any merge to main until the whole suite passes.',
        ],
        [
          'The retired prototype is a second witness, on one scenario. Run on its own default problem, the two implementations ',
          { em: 'agree on all nine' },
          ' reported values, down to the decimals behind the rounding. That is corroboration rather than proof, and worth saying why: own ship steers 000 there, which is the one heading the older frame of reference could not get wrong.',
        ],
        [
          'Two cases are skipped deliberately, each with its reason written down, and neither is quietly smoothed over. The standing rule when a hand-derived construction disagreed with a key was that ',
          { em: 'the fixture is what gets questioned first' },
          ', then the instrument doing the measuring, then the geometry. One suspected transcription error turned out to be neither: the tolerance had been set without allowing for answers already rounded to the nearest knot.',
        ],
      ],
    },
    impact: {
      eyebrow: 'THE IMPACT',
      heading: 'It grades the plot, and it shows the motion.',
      paragraphs: [
        [
          'Enter two radar observations of a contact, own ship\u2019s course and speed, and the closest point of approach you need. It returns the contact\u2019s true course and speed, the CPA and the time to it if nobody alters, and the course or speed change that opens the CPA to the distance required. It cites COLREGS Rule 19 for which way the turn should go, and leaves the decision with the mariner.',
        ],
        [
          'The board draws two ways. One is the familiar top-down plotting sheet. The other is ',
          { em: 'a tilted sea view' },
          ', and the transition eases between them while the clock keeps running, so the geometry stays continuous rather than cutting. Motion plays back across the run, which lets a trainee watch relative motion develop instead of reading it off a finished sheet. The prototype had neither view and no playback at all.',
        ],
        [
          'The modelling is deliberately narrow. It assumes instantaneous course changes, ignores advance and transfer, ignores set and drift, and takes every contact as holding a steady course and speed. It is ',
          { em: 'a trainer, not a navigation instrument' },
          ', and the repository says so in those words.',
        ],
      ],
    },
    figure: {
      src: '/images/case-studies/radar-moboard.png',
      alt: 'The same maneuvering board problem worked twice, side by side: the retired Python prototype on the left, the TypeScript rewrite on the right.',
      caption:
        'The same encounter, worked by both implementations. They agree on all nine reported values. All scenarios synthetic.',
    },
    video: {
      src: '/video/radar-moboard-board.mp4',
      poster: '/video/radar-moboard-board-poster.png',
      description:
        'The maneuvering board playing the encounter forward: the contact closes along the relative motion line, the maneuver fires at the Mx ring, and the new relative track opens the CPA to the required distance.',
      caption:
        'The same encounter, played forward. The maneuver fires at the Mx ring. All scenarios synthetic.',
    },
  },

  'a16-summarizer': {
    hero: { from: '#4338CA', to: '#1E1B4B' },
    thesis:
      'Apple draws its on-device LLM line at the A17 Pro with 8 GB. This one runs below it, on an A16 with 6 GB.',
    stats: [
      { value: '0.29 \u2192 0.46', label: 'ROUGE-L, base to the shipped 4-bit model' },
      { value: '880 MB', label: '4-bit model on disk, down from 3.1 GB' },
      { value: '44.4 tok/s', label: 'sustained decode on an iPhone 14 Pro' },
    ],
    problem: {
      eyebrow: 'THE PROBLEM',
      heading: 'Apple drew the on-device line above this phone.',
      paragraphs: [
        [
          'Apple Intelligence runs its on-device language model only on the A17 Pro and newer, which ship with 8 GB of RAM. The iPhone 14 Pro sits one generation below that line, an A16 with 6 GB, and gets nothing. The hardware gap is real, but the line is drawn for a general assistant.',
        ],
        [
          'A model that has to do everything needs the headroom Apple says it needs. A model that has to do ',
          { em: 'one thing' },
          ' does not. Narrowing the task is the whole experiment.',
        ],
      ],
    },
    approach: {
      eyebrow: 'THE APPROACH',
      heading: 'Apple\u2019s own recipe, one size down.',
      paragraphs: [
        [
          'Apple\u2019s published on-device approach is a small base model, a task-specific LoRA adapter, and aggressive quantization. This project runs that recipe end to end on its own model: ',
          { em: 'QLoRA fine-tuning of Qwen2.5-1.5B on DialogSum' },
          ', merged to fp16, then quantized to 4-bit MLX at group size 64, which lands at 4.5 effective bits per weight.',
        ],
        [
          'Licensing decided as much as size did. Qwen2.5-1.5B is Apache 2.0 where the 3B is not, and DialogSum is MIT where the more common SAMSum forbids commercial use. Training ran on a single RTX 3080 with about 9 GB of usable VRAM, which is what made 4-bit QLoRA the only way in rather than a nice-to-have.',
        ],
        [
          'The app is three Swift files on MLX Swift, running on the phone\u2019s GPU through Metal. It rebuilds the eval\u2019s exact prompt and decoding, greedy at temperature zero with a 96-token cap, so the ',
          { em: 'published ROUGE numbers describe the model on the phone' },
          ' and not a friendlier lab configuration.',
        ],
      ],
    },
    impact: {
      eyebrow: 'THE IMPACT',
      heading: 'It runs, and the cost of running it is measured.',
      paragraphs: [
        [
          'On an iPhone 14 Pro the model is ',
          { em: '880 MB on disk' },
          ', peaks at 1.05 GB of memory against a 5.25 GB ceiling, and decodes at ',
          { em: '44.4 tokens per second' },
          ' after 2.0 seconds to first token. After the first download it never touches the network.',
        ],
        [
          'Quantization costs about 1.5 to 2 ROUGE points against the fp16 fine-tune, and the loss is almost entirely precision: recall barely moves, and there are no repetition loops, truncation spikes, or empty outputs. The gain over the base model deserves the same honesty. The base model summarizes fine, it just writes around 68 tokens where the human references average 27.8, so its precision collapses. What the fine-tune actually learned is ',
          { em: 'length and register' },
          ', which for a task-scoped summarizer is exactly the job.',
        ],
        [
          'It began as a way to put the Generative AI with Large Language Models coursework into practice on hardware I already owned. Core ML and the Neural Engine were scoped as a stretch and left unattempted, so this is an MLX and Metal result.',
        ],
      ],
    },
    figure: {
      src: '/images/case-studies/a16-summarizer.png',
      alt: 'The summarizer running on an iPhone 14 Pro beside a grouped bar chart of ROUGE-1, ROUGE-2 and ROUGE-L for the base model, the fp16 fine-tune and the shipped 4-bit model.',
      caption:
        'The model on the phone, and what it scores. Base, fp16 fine-tune, and the 4-bit model that ships.',
    },
  },

  'coast-guard-pilot-tracker': {
    hero: { from: '#17395C', to: '#0A1D30' },
    thesis:
      'Compiling aircrew flight currency took over a week by hand. One graded sheet does it in three minutes.',
    stats: [
      { value: '3 minutes', label: 'to compile a report that took over a week' },
      { value: '6 weeks to 2 days', label: 'to build the flight schedule, wall to wall' },
      { value: 'Fleetwide', label: 'every U.S. Coast Guard air station' },
    ],
    problem: {
      eyebrow: 'THE PROBLEM',
      heading: 'Currency lived in three places and agreed in none.',
      paragraphs: [
        [
          'Aircrew flight qualifications expire. Each one runs on its own clock, some every 30 days, some every 90, most annually, and a lapsed qualification grounds the aircrew until it is renewed. Knowing who is close to the edge meant pulling three separate exports, the flight logbook, the simulator logbook and the designations list, and cross-referencing them by hand.',
        ],
        [
          'Done properly for a whole air station, compiling that picture took ',
          { em: 'over a week' },
          ', and the flight schedule built on top of it took six weeks wall to wall. Long enough that the answer had aged by the time it arrived, which is the failure mode that matters: a currency report nobody can produce often enough is a currency report nobody trusts.',
        ],
      ],
    },
    approach: {
      eyebrow: 'THE APPROACH',
      heading: 'Three exports in, one graded sheet out.',
      paragraphs: [
        [
          'I am its ',
          { em: 'sole author and sole maintainer' },
          '. I wrote it in Python and later VBA so it would run inside the Excel the unit already had. Two officers at USCG Sector San Diego shaped it as domain stakeholders: they explained the manual process it replaced, defined what each qualification and interval actually meant, and reviewed every iteration of the output. The requirements came from the people who had been doing it by hand.',
        ],
        [
          'A run takes three CSV exports, loads each into a temporary sheet, matches pilots across all three, computes every interval against the report date, writes one row per pilot grouped by designation class, and deletes the temporary sheets behind it. Nine qualification dates and eight recency counters per pilot, on one sheet, in one pass.',
        ],
        [
          'The finished sheet contains ',
          { em: 'no formulas and no conditional formatting' },
          '. The macro writes values and paints fills directly, which is a deliberate choice rather than an omission: the output is a fixed artifact of the moment it was run, and it cannot silently recalculate into a different answer on a different machine on a different day. The thresholds live in the code, where they can be read and reasoned about, and they are not uniform: a pilot\u2019s designation class decides how many days count as overdue.',
        ],
      ],
    },
    impact: {
      eyebrow: 'THE IMPACT',
      heading: 'Two days, at every air station.',
      paragraphs: [
        [
          'The report now takes three minutes to generate instead of over a week, and the flight schedule it feeds went from six weeks to two days end to end. It was adopted at ',
          { em: 'every U.S. Coast Guard air station' },
          ' and is still in daily use. The work was recognised with the Coast Guard Auxiliary Achievement Medal, awarded by the Commandant of the U.S. Coast Guard in March 2023; the citation credits a training records program that spread fleetwide.',
        ],
        [
          'All of it is ',
          { em: 'unpaid volunteer work' },
          '. I have been a Coast Guard Auxiliary volunteer since 2015 and have written software for Sector San Diego since 2022, a role that did not exist until I created it, and I have been its only maintainer since.',
        ],
        [
          'A second tool for the same Sector, a parts inventory system and database, cut helicopter parts search time by roughly 85 percent. It stays a card on this site rather than a case study, for the honest reason that there is nothing about it that can be shown.',
        ],
      ],
    },
    figure: {
      src: '/images/case-studies/coast-guard-pilot-tracker.png',
      alt: 'The generated training report: the full 28-column sheet above, and a detail below showing the colour-graded qualification dates.',
      caption:
        'The report the macro writes, on a synthetic roster. All pilots, dates and values are invented.',
    },
  },
};

export function getCaseStudy(id: string): CaseStudy | undefined {
  return CASE_STUDIES[id];
}
