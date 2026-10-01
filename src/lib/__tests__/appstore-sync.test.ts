import { describe, it, expect } from 'vitest'
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdtempSync, cpSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * The sync's refusal path, exercised without touching the network.
 *
 * WHY THIS TEST EXISTS. Apple's customer-reviews RSS returns a rolling window of
 * recent reviews, not the full history. A sync that treated "absent from the
 * feed" as "withdrawn by its author" would eventually delete all six stored
 * reviews, one at a time, in PRs that each looked plausible. The script's
 * contract is the opposite: locate every stored review BY ID, and if one cannot
 * be found, name it in a WARNING and never touch the reviews file.
 *
 * A WARNING, NOT A FAILURE (2026-09-30). Until then a missing review exited 1.
 * The 2026-09-28 run went red because the `jo` feed briefly omitted both
 * Jordanian reviews, which were back two days later. The script never writes
 * the reviews file, so failing protected nothing. It only skipped the rating
 * sync and trained everyone to ignore a red run.
 *
 * The feed is stubbed by pointing the script at a local file: a real network
 * call would make this test flaky and, worse, would go green for the wrong
 * reason on the day the missing review scrolls back into the window.
 */

const REPO = process.cwd()

function runWithStubbedFeed(feedIds: string[], userRatingCount = 7) {
  const dir = mkdtempSync(join(tmpdir(), 'sync-'))
  cpSync(join(REPO, 'src/data'), join(dir, 'src/data'), { recursive: true })

  const entries = feedIds.map((id) => ({ id: { label: id } }))
  writeFileSync(join(dir, 'feed.json'), JSON.stringify({ feed: { entry: entries } }))
  writeFileSync(
    join(dir, 'lookup.json'),
    JSON.stringify({
      results: [{ price: 3.99, version: '1.2.1', averageUserRating: 5, userRatingCount }],
    })
  )

  // spawnSync rather than execFileSync: the missing-review warning goes to
  // stderr on a run that exits 0, and execFileSync only returns stdout then.
  const res = spawnSync(process.execPath, [join(REPO, 'scripts/appstore-sync.mjs'), '--dry-run'], {
    cwd: dir,
    encoding: 'utf8',
    env: {
      ...process.env,
      APPSTORE_SYNC_STUB_LOOKUP: join(dir, 'lookup.json'),
      APPSTORE_SYNC_STUB_FEED: join(dir, 'feed.json'),
    },
  })
  return { code: res.status, out: res.stdout + res.stderr }
}

const storedIds: string[] = JSON.parse(
  readFileSync(join(REPO, 'src/data/nahtadiReviews.json'), 'utf8')
).reviews.map((r: { id: string }) => r.id)

describe('appstore-sync review protection', () => {
  it('passes when every stored review is still in the feed', () => {
    const { code } = runWithStubbedFeed(storedIds)
    expect(code).toBe(0)
  })

  it('warns, exits 0 and names the review when one is missing from the feed', () => {
    const dropped = storedIds[0]
    const { code, out } = runWithStubbedFeed(storedIds.slice(1))

    expect(code).toBe(0)
    // Named, not just counted: a human has to know WHICH review to decide about.
    expect(out).toContain(dropped)
    expect(out).toMatch(/could not be found by id/i)
    // And it must say plainly that this is not grounds for deletion.
    expect(out).toMatch(/NOT a reason\s*\n?\s*to delete/i)
  })

  it('still syncs the rating when a review is missing from the feed', () => {
    const { code, out } = runWithStubbedFeed(storedIds.slice(1), 8)
    expect(code).toBe(0)
    expect(out).toMatch(/appStoreRating\.count: 7 -> 8/)
  })

  it('logs how many entries each storefront feed returned', () => {
    // So the next missing review says whether a feed came back empty or partial.
    const { out } = runWithStubbedFeed(storedIds)
    expect(out).toMatch(new RegExp(`us: ${storedIds.length} entries`))
    expect(out).toMatch(new RegExp(`jo: ${storedIds.length} entries`))
  })

  it('never deletes: the reviews file is untouched when reviews are missing', () => {
    const before = readFileSync(join(REPO, 'src/data/nahtadiReviews.json'), 'utf8')
    runWithStubbedFeed(storedIds.slice(2))
    expect(readFileSync(join(REPO, 'src/data/nahtadiReviews.json'), 'utf8')).toBe(before)
  })
})
