import { describe, it, expect } from 'vitest'
import { execFileSync } from 'node:child_process'
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
 * be found, exit 1 and write nothing.
 *
 * The feed is stubbed by pointing the script at a local file: a real network
 * call would make this test flaky and, worse, would go green for the wrong
 * reason on the day the missing review scrolls back into the window.
 */

const REPO = process.cwd()

function runWithStubbedFeed(feedIds: string[]) {
  const dir = mkdtempSync(join(tmpdir(), 'sync-'))
  cpSync(join(REPO, 'src/data'), join(dir, 'src/data'), { recursive: true })

  const entries = feedIds.map((id) => ({ id: { label: id } }))
  writeFileSync(join(dir, 'feed.json'), JSON.stringify({ feed: { entry: entries } }))
  writeFileSync(
    join(dir, 'lookup.json'),
    JSON.stringify({
      results: [{ price: 3.99, version: '1.2.1', averageUserRating: 5, userRatingCount: 7 }],
    })
  )

  try {
    const out = execFileSync(
      process.execPath,
      [join(REPO, 'scripts/appstore-sync.mjs'), '--dry-run'],
      {
        cwd: dir,
        encoding: 'utf8',
        stdio: 'pipe',
        env: {
          ...process.env,
          APPSTORE_SYNC_STUB_LOOKUP: join(dir, 'lookup.json'),
          APPSTORE_SYNC_STUB_FEED: join(dir, 'feed.json'),
        },
      }
    )
    return { code: 0, out }
  } catch (e) {
    const err = e as { status: number; stdout: string; stderr: string }
    return { code: err.status, out: err.stdout + err.stderr }
  }
}

const storedIds: string[] = JSON.parse(
  readFileSync(join(REPO, 'src/data/nahtadiReviews.json'), 'utf8')
).reviews.map((r: { id: string }) => r.id)

describe('appstore-sync review protection', () => {
  it('passes when every stored review is still in the feed', () => {
    const { code } = runWithStubbedFeed(storedIds)
    expect(code).toBe(0)
  })

  it('exits 1 and names the review when one has aged out of the feed', () => {
    const dropped = storedIds[0]
    const { code, out } = runWithStubbedFeed(storedIds.slice(1))

    expect(code).toBe(1)
    // Named, not just counted: a human has to know WHICH review to decide about.
    expect(out).toContain(dropped)
    expect(out).toMatch(/could not be found by id/i)
    // And it must say plainly that this is not grounds for deletion.
    expect(out).toMatch(/NOT a reason\s*\n?\s*to delete/i)
    expect(out).toMatch(/Nothing was written/i)
  })

  it('never deletes: the reviews file is untouched on the failure path', () => {
    const before = readFileSync(join(REPO, 'src/data/nahtadiReviews.json'), 'utf8')
    runWithStubbedFeed(storedIds.slice(2))
    expect(readFileSync(join(REPO, 'src/data/nahtadiReviews.json'), 'utf8')).toBe(before)
  })
})
