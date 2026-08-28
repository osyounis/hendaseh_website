import { Fragment } from 'react';

/**
 * The arc: mechanical, then software, then what is next, on a dotted vertical
 * timeline whose nodes are radar blips.
 *
 * Copy is locked verbatim from the approved mockup (v9). The bold runs are
 * data, not markup decisions -- `Run` keeps them beside the words they
 * emphasise so a paragraph can never be reworded without touching the run it
 * bolds.
 *
 * Each chapter is a `[data-reveal]` block. The dot's pop-in keys off that
 * state (`.about-dot` in about.css); an un-armed chapter -- above the fold, no
 * JavaScript, reduced motion -- renders its dot at rest, full size.
 */

type Run = string | { em: string };

type Chapter = {
  eyebrow: string;
  heading: string;
  paragraphs: Run[][];
};

const CHAPTERS: Chapter[] = [
  {
    eyebrow: 'MECHANICAL',
    heading: 'It started with a V8 engine.',
    paragraphs: [
      [
        'I was six when my father started teaching me mechanical design and engineering. Not long after, I built a working 1/8-scale V8 engine. In high school it was composites, carbon fiber and fiberglass. I liked making things people actually used, and that never changed.',
      ],
      [
        'I studied mechanical engineering at Worcester Polytechnic Institute with a minor in aerospace, then spent seven years as a mechanical engineer across defense systems, medical devices, and precision manufacturing. At D&K Engineering I led a 20-person team building the ecoATM recycling kiosk and helped secure a ',
        { em: '$1M contract extension' },
        '. The constant through all of it: find what the system needs, then build it. Increasingly, what the system needed was software. The Python tools I wrote to automate my own work kept spreading to other teams.',
      ],
    ],
  },
  {
    eyebrow: 'SOFTWARE',
    heading: 'So I retrained, properly.',
    paragraphs: [
      [
        "In 2021 I went all in: a 500-hour data science immersive at General Assembly, then a machine learning role at Elemeno AI, improving delivery predictions for Brazil's largest package carrier by ",
        { em: '25 percent' },
        '. An M.S. in Computer Science at Cal State Fullerton followed, finished May 2026, while I taught C++ to 64 students as instructor of record. At Qualcomm I built AWS pipelines processing over ',
        { em: 'a million data points a minute' },
        '.',
      ],
      [
        "My graduate project was the first CUDA implementation of Brent's root-finding method, ",
        { em: '35 times faster' },
        ' at the kernel. It taught me to think in hardware, memory layout, and where performance actually comes from.',
      ],
    ],
  },
  {
    eyebrow: "WHAT'S NEXT",
    heading: 'Next: AI and autonomous systems.',
    paragraphs: [
      [
        "Since 2022 I've been the volunteer software engineer for the Coast Guard Auxiliary at Sector San Diego, a role I created. The reporting tools I built run at ",
        { em: 'every U.S. Coast Guard air station' },
        ". I also built a maritime collision avoidance trainer that solves radar plotting geometry, and I'm rebuilding it now as a TypeScript monorepo.",
      ],
      [
        { em: 'AI and autonomous systems' },
        ' sit exactly where my two careers overlap. That is the work I want next.',
      ],
    ],
  },
];

export default function AboutArc() {
  return (
    <div className="page-wrap about-arc">
      {CHAPTERS.map((chapter) => (
        <section key={chapter.eyebrow} className="about-chapter" data-reveal="">
          <div className="about-chapter-side">
            {/* Decorative: the eyebrow beside it names the chapter. */}
            <div className="about-dot" aria-hidden="true" />
            <span className="section-eyebrow">{chapter.eyebrow}</span>
          </div>

          <div>
            <h2 className="about-chapter-title">{chapter.heading}</h2>
            {chapter.paragraphs.map((prose, index) => (
              <p key={index} className="about-chapter-p">
                {prose.map((run, runIndex) =>
                  typeof run === 'string' ? (
                    <Fragment key={runIndex}>{run}</Fragment>
                  ) : (
                    <strong key={runIndex}>{run.em}</strong>
                  )
                )}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
