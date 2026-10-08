import { describe, it, expect } from 'vitest'
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdtempSync, cpSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * The star sync, exercised without the network. Each run copies src/data into a
 * temp dir and points the script at a stub, so the real projects.json is never
 * written and no test depends on GitHub being up.
 */
const REPO = process.cwd()
const CYCLOIDAL = 'osyounis/cycloidal_drive_creator'
const WATERMARK = 'osyounis/image_watermark_remover'

/* eslint-disable @typescript-eslint/no-explicit-any -- untyped JSON fixtures */
type Stub = Record<string, unknown>
const repo = (full_name: string, stargazers_count: unknown, priv = false) => ({
  full_name,
  private: priv,
  stargazers_count,
})

function run(stub: Stub, opts: { dryRun?: boolean; edit?: (doc: any) => void } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'stars-'))
  cpSync(join(REPO, 'src/data'), join(dir, 'src/data'), { recursive: true })
  if (opts.edit) {
    const p = join(dir, 'src/data/projects.json')
    const doc = JSON.parse(readFileSync(p, 'utf8'))
    opts.edit(doc)
    writeFileSync(p, JSON.stringify(doc, null, 2) + '\n')
  }
  writeFileSync(join(dir, 'stub.json'), JSON.stringify(stub))
  const before = readFileSync(join(dir, 'src/data/projects.json'), 'utf8')
  const res = spawnSync(
    process.execPath,
    [join(REPO, 'scripts/github-stars-sync.mjs'), ...(opts.dryRun ? ['--dry-run'] : [])],
    {
      cwd: dir,
      encoding: 'utf8',
      env: { ...process.env, GITHUB_OUTPUT: '', GITHUB_STARS_SYNC_STUB: join(dir, 'stub.json') },
    }
  )
  const after = readFileSync(join(dir, 'src/data/projects.json'), 'utf8')
  const stars = (id: string) => JSON.parse(after).projects.find((p: any) => p.id === id).githubStars
  return { code: res.status, out: res.stdout + res.stderr, changed: before !== after, after, stars }
}

const current = () => ({ [CYCLOIDAL]: repo(CYCLOIDAL, 32), [WATERMARK]: repo(WATERMARK, 10) })

describe('github-stars-sync', () => {
  it('writes nothing and exits 0 when every count is current', () => {
    const r = run(current())
    expect(r.code).toBe(0)
    expect(r.changed).toBe(false)
    expect(r.out).toMatch(/No change/)
  })

  it('writes only the changed count', () => {
    const r = run({ ...current(), [CYCLOIDAL]: repo(CYCLOIDAL, 35) })
    expect(r.code).toBe(0)
    expect(r.stars('cycloidal-drive-creator')).toBe(35)
    expect(r.stars('image-watermark-remover')).toBe(10)
    expect(r.out).toMatch(/cycloidal-drive-creator: 32 -> 35/)
  })

  it('accepts a small, normal drop', () => {
    const r = run({ ...current(), [CYCLOIDAL]: repo(CYCLOIDAL, 31) })
    expect(r.code).toBe(0)
    expect(r.stars('cycloidal-drive-creator')).toBe(31)
  })

  it('--dry-run reports the change and writes nothing', () => {
    const r = run({ ...current(), [CYCLOIDAL]: repo(CYCLOIDAL, 35) }, { dryRun: true })
    expect(r.code).toBe(0)
    expect(r.changed).toBe(false)
  })

  const refusals: [string, Stub, RegExp][] = [
    ['a non-200 response', { ...current(), [WATERMARK]: { status: 404 } }, /HTTP 404/],
    ['a private repo', { ...current(), [WATERMARK]: repo(WATERMARK, 10, true) }, /private/i],
    ['a renamed repo', { ...current(), [WATERMARK]: repo('osyounis/renamed', 10) }, /renamed/i],
    ['a non-integer count', { ...current(), [WATERMARK]: repo(WATERMARK, '10') }, /not a whole number/i],
    ['a missing count', { ...current(), [WATERMARK]: repo(WATERMARK, undefined) }, /not a whole number/i],
    ['a drop to zero', { ...current(), [CYCLOIDAL]: repo(CYCLOIDAL, 0) }, /suspicious/i],
    ['a drop of more than half', { ...current(), [CYCLOIDAL]: repo(CYCLOIDAL, 15) }, /suspicious/i],
  ]

  it.each(refusals)('refuses %s: exits 1 and writes nothing, even for the good repo', (_n, stub, msg) => {
    // CYCLOIDAL changes to 40 in every refusal case it is not the subject of,
    // so a partial write of the good repo would show.
    const s = { ...stub } as Stub
    if ((s[CYCLOIDAL] as any)?.stargazers_count === 32) s[CYCLOIDAL] = repo(CYCLOIDAL, 40)
    const r = run(s)
    expect(r.code).toBe(1)
    expect(r.changed).toBe(false)
    expect(r.out).toMatch(msg)
    expect(r.out).toMatch(/Nothing was written/)
  })

  it('refuses a synced project with no links.github', () => {
    const r = run(current(), {
      edit: (doc) => {
        delete doc.projects.find((p: any) => p.id === 'image-watermark-remover').links.github
      },
    })
    expect(r.code).toBe(1)
    expect(r.out).toMatch(/no links\.github/)
  })

  it('parses a trailing slash and a .git suffix on links.github', () => {
    const r = run(current(), {
      edit: (doc) => {
        doc.projects.find((p: any) => p.id === 'cycloidal-drive-creator').links.github =
          'https://github.com/osyounis/cycloidal_drive_creator/'
        doc.projects.find((p: any) => p.id === 'image-watermark-remover').links.github =
          'https://github.com/osyounis/image_watermark_remover.git'
      },
    })
    expect(r.code).toBe(0)
  })
})
