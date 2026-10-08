import { describe, it, expect } from 'vitest'
import { getAllProjects, getCardStat, type Project } from '@/lib/projects'

const base = getAllProjects().find((p) => p.id === 'cycloidal-drive-creator')!

describe('getCardStat', () => {
  it('substitutes {stars} with githubStars', () => {
    const p = { ...base, cardStat: '{stars}★ · MIT', githubStars: 41 } as Project
    expect(getCardStat(p)).toBe('41★ · MIT')
  })

  it('returns a cardStat without the token unchanged', () => {
    const p = { ...base, cardStat: '207 tests', githubStars: undefined } as Project
    expect(getCardStat(p)).toBe('207 tests')
  })

  it('returns undefined when there is no cardStat', () => {
    const p = { ...base, cardStat: undefined } as Project
    expect(getCardStat(p)).toBeUndefined()
  })

  it('throws, naming the project, when the token has no number to fill it', () => {
    const p = { ...base, cardStat: '{stars}★', githubStars: undefined } as Project
    expect(() => getCardStat(p)).toThrow(/cycloidal-drive-creator/)
  })
})

describe('catalog invariant: githubStars and {stars} travel together', () => {
  it.each(getAllProjects().map((p) => [p.id, p] as const))('%s', (_id, p) => {
    const hasToken = (p.cardStat ?? '').includes('{stars}')
    expect(hasToken, 'a synced count must be displayed, and a token must have a count').toBe(
      p.githubStars !== undefined
    )
    if (p.githubStars !== undefined) expect(p.links.github, 'githubStars needs links.github').toBeTruthy()
  })

  it('opts in exactly the two cards that show stars today', () => {
    const synced = getAllProjects().filter((p) => p.githubStars !== undefined).map((p) => p.id)
    expect(synced.sort()).toEqual(['cycloidal-drive-creator', 'image-watermark-remover'])
  })
})
