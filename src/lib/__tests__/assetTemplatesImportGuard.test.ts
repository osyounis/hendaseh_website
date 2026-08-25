import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

// sharp and node:fs/node:fs/promises cannot run on the Cloudflare Workers
// runtime this site deploys to. src/lib/assetTemplates.tsx uses both and is
// only meant to be imported by build-time scripts (e.g.
// scripts/generate-og.tsx, scripts/generate-assets.tsx) — never by app code.
//
// A per-file "does src/app or src/components import assetTemplates"
// grep (the original version of this test) misses three things a real
// mistake could hit: a transitive import through some other src/lib module,
// any file elsewhere under src/lib itself (where assetTemplates.tsx lives,
// beside modules that ARE always bundled), and a second sharp/node:fs entry
// point that bypasses assetTemplates.tsx entirely (e.g. a future
// scripts/lib/compose.ts-style helper added under src/ by mistake). Guard
// the actual invariant instead: nothing under src/ imports sharp or
// node:fs/node:fs/promises directly, except assetTemplates.tsx itself and
// test files (which run under Node, not the Workers runtime).

function listFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFiles(full)
    if (/\.(ts|tsx)$/.test(entry.name)) return [full]
    return []
  })
}

const FORBIDDEN_SPECIFIERS = ['sharp', 'node:fs', 'node:fs/promises']

function importsForbiddenModule(contents: string): boolean {
  return FORBIDDEN_SPECIFIERS.some((specifier) => {
    const escaped = specifier.replace(/\//g, '\\/')
    const fromImport = new RegExp(`from\\s+['"]${escaped}['"]`)
    const bareImport = new RegExp(`import\\s+['"]${escaped}['"]`)
    const requireCall = new RegExp(`require\\(['"]${escaped}['"]\\)`)
    return fromImport.test(contents) || bareImport.test(contents) || requireCall.test(contents)
  })
}

describe('sharp / node:fs stay out of src/', () => {
  it('is imported only by assetTemplates.tsx and __tests__ files', () => {
    const root = path.resolve(__dirname, '../../..')
    const srcDir = path.join(root, 'src')

    const offenders: string[] = []
    for (const file of listFiles(srcDir)) {
      const relative = path.relative(root, file)
      const isAssetTemplates = relative === path.join('src', 'lib', 'assetTemplates.tsx')
      const isTestFile = relative.split(path.sep).includes('__tests__')
      if (isAssetTemplates || isTestFile) continue

      const contents = readFileSync(file, 'utf8')
      if (importsForbiddenModule(contents)) {
        offenders.push(relative)
      }
    }

    expect(offenders).toEqual([])
  })
})
