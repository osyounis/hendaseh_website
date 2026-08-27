/**
 * Quiet monochrome pairs and uncostumed real stats. Decorative — the same facts
 * are stated as real content in the bands below — so the whole strip is hidden
 * from assistive technology and carries nothing focusable.
 */
type TickerItem = { symbol: string; rest?: string; stat?: string };

const TICKER_ITEMS: TickerItem[] = [
  { symbol: 'SWIFT', rest: 'SWIFTUI' },
  { symbol: 'PYTORCH', rest: 'TENSORFLOW' },
  { symbol: 'CUDA', rest: 'C++', stat: '35.31×' },
  { symbol: 'PYTHON', rest: 'NUMPY' },
  { symbol: 'APP STORE', stat: '5.0★' },
  { symbol: 'MECHANICAL', stat: '7 YRS' },
];

/*
 * Two pixel-identical halves, each its OWN element with its own animation.
 *
 * They used to be one 2581px-wide `.home-tape` translating -50%. That is a
 * single element, so `will-change: transform` gave it a single compositor layer
 * 2581 CSS px wide — 5162 device px at DPR 2 and 7742 at DPR 3, both past iOS's
 * ~4096px GPU texture limit. WebKit fell back to tiled rendering and evicted
 * tiles under memory pressure, which is the flicker Omar saw on device
 * (measured 2026-08-27). It cannot reproduce on desktop, where DPR is 1–2 and
 * the GPU limits are far larger — which is why every headless run was clean.
 *
 * Splitting the tape at its seam gives two 1290px layers instead of one 2581px
 * one. The geometry is unchanged: half B sits at x=1290 in layout and both
 * halves translate -100% of their OWN width, so at the end of a cycle every
 * item is exactly where the item one half-length to its right started. Same
 * pixels, same 30s period, half the layer.
 *
 * The repeating unit cannot shrink below this six-item sequence — the items,
 * their copy and their 30px padding are locked by
 * docs/superpowers/mockups/home/APPROVED.md.
 */
const TAPE_HALVES = ['a', 'b'] as const;

export default function HomeTicker() {
  return (
    <div className="home-ticker" aria-hidden="true">
      <div className="home-tape-track">
        {TAPE_HALVES.map((half) => (
          <div key={half} className="home-tape">
            {TICKER_ITEMS.map(({ symbol, rest, stat }) => (
              <span key={symbol} className="home-tk">
                <span className="text-secondary text-[14px] font-black tracking-[0.14em]">
                  {symbol}
                </span>
                {rest && (
                  <>
                    <span className="text-faint font-black">/</span>
                    <span className="text-[color:var(--ticker-secondary)] text-[13px] font-bold tracking-[0.1em]">
                      {rest}
                    </span>
                  </>
                )}
                {stat && (
                  <span className="text-secondary text-[13px] font-bold tracking-[0.08em]">
                    {stat}
                  </span>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
