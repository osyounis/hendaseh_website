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
 * Copy is the Omar-approved text from `docs/superpowers/mockups/projects/v5.html`
 * (the two populated instances), transcribed verbatim. Do not reword it here;
 * approved copy changes come from a new mockup.
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
   *    not behind white display type. `collision-avoidance-radar` starts at
   *    #8DA2B8, which carries white 46px type at about 2.6:1. The mockup's
   *    hero stops are dark enough for the hero's white text everywhere.
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

  'collision-avoidance-radar': {
    hero: { from: '#334155', to: '#111827' },
    thesis:
      'A radar-plotting trainer for Coast Guard navigators. CPA, course, and speed, solved and drawn.',
    stats: [
      { value: 'CPA', label: 'closest point of approach, solved and plotted' },
      { value: 'Live', label: 'running demo, free and anonymous' },
      { value: 'USCG Aux', label: 'built for real navigation training' },
    ],
    problem: {
      eyebrow: 'THE PROBLEM',
      heading: 'Radar plotting is taught on paper.',
      paragraphs: [
        [
          'Maritime navigators learn collision avoidance by hand-plotting relative motion on paper maneuvering boards. The math is unforgiving, the practice materials are static, and mistakes only surface after the plot is finished.',
        ],
      ],
    },
    approach: {
      eyebrow: 'THE APPROACH',
      heading: 'A maneuvering board that checks the math.',
      paragraphs: [
        [
          'A Python app computes the ',
          { em: 'closest point of approach' },
          ' from own-ship and contact parameters, works out the required course and speed changes, and renders the full radar plot. Trainees watch the geometry respond as the inputs change.',
        ],
      ],
    },
    impact: {
      eyebrow: 'THE IMPACT',
      heading: 'Try it in the browser. No install, no dataset.',
      paragraphs: [
        [
          'The trainer runs live, free, and anonymous. Everything on screen is synthetic training data. The tool encodes the method, never any operational information.',
        ],
      ],
    },
  },
};

export function getCaseStudy(id: string): CaseStudy | undefined {
  return CASE_STUDIES[id];
}
