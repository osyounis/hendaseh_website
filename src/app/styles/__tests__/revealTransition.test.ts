import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * THE `.home-tile[data-reveal="in"]` DRIFT GUARD (Task B6).
 *
 * shared.css has three transition lists that are not independent:
 *
 *   .home-tile               transform / border-color / box-shadow   (hover)
 *   [data-reveal="in"]       opacity / translate                     (reveal)
 *   .home-tile[data-reveal="in"]   BOTH, restated by hand
 *
 * The compound rule exists because `transition` is a single shorthand and both
 * source rules sit at specificity (0,1,0): the reveal rule, being later in the
 * file, replaced the tile's list wholesale, so a revealed card's hover snapped
 * instead of easing. There is no way to append to `transition`, so the two
 * lists are restated together at (0,2,0). Every card on the About page is
 * exactly this combination.
 *
 * WHICH MEANS THE COMPOUND RULE IS A MANUAL COPY OF VALUES OWNED ELSEWHERE,
 * and its own comment says "Change either rule and change this one with it."
 * Nothing enforced that. Retune the hover from 0.28s to 0.3s and the site
 * still builds, every existing test still passes, and revealed About cards
 * quietly keep hovering at the old duration while every other card uses the
 * new one — a difference no one would find by looking.
 *
 * This is the enforcement. It parses the three lists out of the stylesheet and
 * asserts the compound rule is exactly the union of its two sources, with the
 * stagger delay on the reveal entries only (a delay on the hover entries would
 * make a hovered card lag behind the pointer).
 *
 * It deliberately reads the CSS as text rather than through a browser: this is
 * a claim about the SOURCE staying in sync, and it should fail in `npm run
 * test:run` in under a second, next to the change that broke it.
 */

const CSS = readFileSync(join(process.cwd(), 'src/app/styles/shared.css'), 'utf8')

/** Splits on top-level commas only — `var(--reveal-delay, 0s)` has one inside. */
function splitEntries(value: string): string[] {
  const out: string[] = []
  let depth = 0
  let current = ''
  for (const ch of value) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      out.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) out.push(current.trim())
  return out
}

/** The body of the first rule whose selector matches exactly, at any indent. */
function ruleBody(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(^|\\n)\\s*${escaped}\\s*\\{([\\s\\S]*?)\\n\\s*\\}`)
  const m = CSS.match(re)
  if (!m) throw new Error(`rule not found in shared.css: ${selector}`)
  return m[2]
}

/** `prop -> "duration easing [delay]"` for one rule's `transition` shorthand. */
function transitionMap(selector: string): Map<string, string> {
  const body = ruleBody(selector)
  const m = body.match(/(^|\n)\s*transition:([\s\S]*?);/)
  if (!m) throw new Error(`no transition shorthand in: ${selector}`)
  const map = new Map<string, string>()
  for (const entry of splitEntries(m[2])) {
    const normalised = entry.replace(/\s+/g, ' ').trim()
    const space = normalised.indexOf(' ')
    map.set(normalised.slice(0, space), normalised.slice(space + 1))
  }
  return map
}

/** The `transition-delay` longhand that follows the reveal rule's shorthand. */
function transitionDelay(selector: string): string {
  const body = ruleBody(selector)
  const m = body.match(/(^|\n)\s*transition-delay:\s*([^;]+);/)
  if (!m) throw new Error(`no transition-delay in: ${selector}`)
  return m[2].replace(/\s+/g, ' ').trim()
}

describe('.home-tile[data-reveal="in"] stays in sync with the rules it restates', () => {
  const hover = transitionMap('.home-tile')
  const reveal = transitionMap('[data-reveal="in"]')
  const delay = transitionDelay('[data-reveal="in"]')
  const compound = transitionMap('.home-tile[data-reveal="in"]')

  it('parses all three rules, so a rename fails here instead of silently passing', () => {
    // Guards the guard: if a selector is renamed, `ruleBody` throws above and
    // the whole describe fails to build — but if a `transition` were merely
    // emptied, the maps would be empty and every assertion below would pass
    // vacuously. These sizes are the floor.
    expect(hover.size, '.home-tile must transition its three hover properties').toBe(3)
    expect(reveal.size, '[data-reveal="in"] must transition opacity and translate').toBe(2)
    expect(compound.size, 'the compound rule must carry all five').toBe(5)
  })

  it('covers exactly the union of the two source rules — no more, no less', () => {
    const expected = [...hover.keys(), ...reveal.keys()].sort()
    expect([...compound.keys()].sort()).toEqual(expected)
  })

  it('restates the hover entries verbatim, with no stagger delay on them', () => {
    for (const [prop, value] of hover) {
      expect(compound.get(prop), `${prop} must match .home-tile exactly`).toBe(value)
      expect(
        compound.get(prop),
        `${prop} must NOT take the reveal delay — a hovered card would lag the pointer`
      ).not.toContain(delay)
    }
  })

  it('restates the reveal entries with the stagger delay appended', () => {
    for (const [prop, value] of reveal) {
      expect(compound.get(prop), `${prop} must be [data-reveal="in"]'s value plus the delay`).toBe(
        `${value} ${delay}`
      )
    }
  })

  it('is still named in the reduced-motion block, which specificity requires', () => {
    // (0,2,0) — a media query adds no specificity, so the bare
    // `[data-reveal="in"]` selector in that block would lose to the compound
    // rule and a revealed tile would keep animating under reduced motion.
    const reducedMotion = CSS.slice(CSS.indexOf('@media (prefers-reduced-motion: reduce)', CSS.indexOf('.home-tile[data-reveal="in"]')))
    expect(
      reducedMotion.slice(0, 600),
      'the compound selector must be listed explicitly in the reduced-motion block'
    ).toContain('.home-tile[data-reveal="in"]')
  })
})
