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

// Two pixel-identical halves: the tape translates exactly -50% and seams up.
const TAPE = [...TICKER_ITEMS, ...TICKER_ITEMS];

export default function HomeTicker() {
  return (
    <div className="home-ticker" aria-hidden="true">
      <div className="home-tape">
        {TAPE.map(({ symbol, rest, stat }, index) => (
          <span key={`${symbol}-${index}`} className="home-tk">
            <span className="text-secondary text-[14px] font-black tracking-[0.14em]">{symbol}</span>
            {rest && (
              <>
                <span className="text-faint font-black">/</span>
                <span className="text-[color:var(--ticker-secondary)] text-[13px] font-bold tracking-[0.1em]">
                  {rest}
                </span>
              </>
            )}
            {stat && (
              <span className="text-secondary text-[13px] font-bold tracking-[0.08em]">{stat}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
