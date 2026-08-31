import { describe, it, expect } from 'vitest'
import { getAllProjects, getCaseStudyProjects, getNextCaseStudy } from '../projects'
import { getCaseStudy } from '../caseStudies'

describe('getCaseStudyProjects', () => {
  it('returns showcase-tier projects that have no detailPath of their own', () => {
    const caseStudies = getCaseStudyProjects()
    expect(caseStudies.length).toBeGreaterThan(0)
    caseStudies.forEach((p) => {
      expect(p.tier, p.id).toBe('showcase')
      expect(p.detailPath, p.id).toBeUndefined()
    })
  })

  it('excludes every card-tier project, so no card slug can prerender a page', () => {
    // Assert over the whole catalog, not two hardcoded ids -- otherwise a
    // new card-tier project could leak into getCaseStudyProjects() without
    // this test ever going red.
    const caseStudyIds = new Set(getCaseStudyProjects().map((p) => p.id))
    const cardTierIds = getAllProjects()
      .filter((p) => p.tier === 'card')
      .map((p) => p.id)
    expect(cardTierIds.length).toBeGreaterThan(0)
    cardTierIds.forEach((id) => {
      expect(caseStudyIds.has(id), id).toBe(false)
    })
    // The flagship (Nahtadi) has its own custom page, not the [slug] template.
    expect(caseStudyIds.has('nahtadi')).toBe(false)
  })
})

describe('getNextCaseStudy', () => {
  // The bottom nav's right slot is fixed: it always says "Next case study".
  // A fixed slot has to be filled from every page, which is the whole reason
  // the list wraps instead of running out at the end.
  it('wraps from the last case study back to the first', () => {
    const caseStudies = getCaseStudyProjects()
    const last = caseStudies[caseStudies.length - 1]
    expect(getNextCaseStudy(last.id)?.id).toBe(caseStudies[0].id)
  })

  it('advances in catalog order from every case study', () => {
    const caseStudies = getCaseStudyProjects()
    caseStudies.forEach((p, index) => {
      const expected = caseStudies[(index + 1) % caseStudies.length]
      expect(getNextCaseStudy(p.id)?.id, p.id).toBe(expected.id)
    })
  })

  it('never points at the page you are already on', () => {
    getCaseStudyProjects().forEach((p) => {
      expect(getNextCaseStudy(p.id)?.id, p.id).not.toBe(p.id)
    })
  })

  it('returns null for a project that has no case-study page', () => {
    expect(getNextCaseStudy('reddit-nlp')).toBeNull()
    expect(getNextCaseStudy('nahtadi')).toBeNull()
  })
})

describe('case-study content', () => {
  // The template throws rather than rendering a half-empty page, and
  // /projects/[slug] is prerendered, so a missing entry breaks the build.
  // Failing here first says which project is missing and why.
  it('every case-study project has an entry', () => {
    getCaseStudyProjects().forEach((p) => {
      expect(getCaseStudy(p.id), `no case study content for "${p.id}"`).toBeDefined()
    })
  })

  it('every entry has exactly three stats and all three sections', () => {
    getCaseStudyProjects().forEach((p) => {
      const cs = getCaseStudy(p.id)!
      expect(cs.stats, p.id).toHaveLength(3)
      cs.stats.forEach((stat) => {
        expect(stat.value.trim(), p.id).not.toBe('')
        expect(stat.label.trim(), p.id).not.toBe('')
      })
      expect(cs.problem.eyebrow, p.id).toBe('THE PROBLEM')
      expect(cs.approach.eyebrow, p.id).toBe('THE APPROACH')
      expect(cs.impact.eyebrow, p.id).toBe('THE IMPACT')
      expect(cs.problem.paragraphs.length, p.id).toBeGreaterThan(0)
      expect(cs.approach.paragraphs.length, p.id).toBeGreaterThan(0)
      expect(cs.impact.paragraphs.length, p.id).toBeGreaterThan(0)
    })
  })

  it('uses a hero gradient dark enough for its white display type', () => {
    // The hero is a colour card: white text in both themes. Catalog gradients
    // fail at both ends -- the retired collision-avoidance-radar started at
    // #8DA2B8, carrying white at about 2.6:1, and a16-summarizer's #0A0A0C is
    // too dark to separate from its own squircle -- which is why these are
    // separate values from `brand.gradient` rather than read from the catalog.
    const relativeLuminance = (hex: string) => {
      const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
      const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16) / 255))
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    getCaseStudyProjects().forEach((p) => {
      const { from, to } = getCaseStudy(p.id)!.hero
      ;[from, to].forEach((stop) => {
        const contrastWithWhite = 1.05 / (relativeLuminance(stop) + 0.05)
        expect(contrastWithWhite, `${p.id}: ${stop}`).toBeGreaterThanOrEqual(4.5)
      })
    })
  })

  it('marks every Coast Guard scenario on screen as synthetic', () => {
    // A Coast Guard training tool has to say on the page that nothing shown is
    // operational. It used to be a sentence in the radar demo's IMPACT copy;
    // the demo is retired, so the claim now rides on the figure caption that
    // B-B wires. This guard follows it there: the moment radar-moboard gets a
    // figure, its caption must carry the marker. Never drop this.
    const radar = getCaseStudy('radar-moboard')!
    if (radar.figure) {
      expect(radar.figure.caption).toContain('All scenarios synthetic.')
    }
  })

  it('has no em dashes anywhere in the copy (sitewide copy rule)', () => {
    getCaseStudyProjects().forEach((p) => {
      const cs = getCaseStudy(p.id)!
      const copy = [
        cs.thesis,
        ...cs.stats.flatMap((s) => [s.value, s.label]),
        ...[cs.problem, cs.approach, cs.impact].flatMap((section) => [
          section.heading,
          ...section.paragraphs.flat().map((run) => (typeof run === 'string' ? run : run.em)),
        ]),
      ].join(' ')
      expect(copy, p.id).not.toContain('—')
    })
  })
})

describe('case-study projects still carry what the template renders', () => {
  it('gives every case study a repo link OR marks it private, never neither', () => {
    // This used to assert a github link on every case study, which held only
    // while every case study had a public repo. `radar-moboard` does not: the
    // repository is private and stays private, and the superseded prototype is
    // public but is the version its own case study describes as wrong, so
    // linking it would point a reader at the defect.
    //
    // The invariant the Projects contract actually states is weaker and true:
    // never a dead link, and never a silent absence. A case study either links
    // its repo or carries the private badge that explains why it cannot.
    getCaseStudyProjects().forEach((p) => {
      expect(Boolean(p.links.github) || p.private, `${p.id}: no repo link and not marked private`).toBe(true)
      expect(p.technologies.length, p.id).toBeGreaterThan(0)
    })
  })

  it('carries no live-demo affordance anywhere in the catalog', () => {
    // Sub-project 5 retired the Streamlit demo: `links.embed` is gone from the
    // schema, the hero button is gone from the template, and no card may
    // advertise a demo. The schema is strict, so a resurrected `embed` key
    // fails validation at module load rather than here; this guards the copy.
    getAllProjects().forEach((p) => {
      expect(p.cardStat ?? '', p.id).not.toMatch(/live demo/i)
      expect(p.stats, p.id).not.toMatch(/live demo/i)
      expect(Object.keys(p.links), p.id).not.toContain('embed')
    })
  })
})
