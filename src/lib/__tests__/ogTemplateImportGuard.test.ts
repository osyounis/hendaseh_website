import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

// src/lib/ogTemplate.tsx imports sharp + node:fs and is only meant to be
// imported by the build-time script scripts/generate-og.tsx. Neither sharp
// nor node:fs runs on the Cloudflare Workers runtime this site deploys to, so
// if any app module (src/app/** or src/components/**) ever imports it, the
// Workers build breaks. Guard that by grepping the tree for the import.

function listFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFiles(full)
    if (/\.(ts|tsx)$/.test(entry.name)) return [full]
    return []
  })
}

describe('ogTemplate stays out of app code', () => {
  it('is never imported from src/app or src/components', () => {
    const root = path.resolve(__dirname, '../../..')
    const dirs = ['src/app', 'src/components'].map((d) => path.join(root, d))

    const offenders: string[] = []
    for (const dir of dirs) {
      if (!statSync(dir, { throwIfNoEntry: false })) continue
      for (const file of listFiles(dir)) {
        const contents = readFileSync(file, 'utf8')
        if (/from\s+['"][^'"]*ogTemplate['"]/.test(contents) || /require\(['"][^'"]*ogTemplate['"]\)/.test(contents)) {
          offenders.push(path.relative(root, file))
        }
      }
    }

    expect(offenders).toEqual([])
  })
})
