'use client';

import { Fragment, useEffect, useRef, useState } from 'react';

// Every swatch class is written out literally so Tailwind's scanner emits it.
// Do NOT build class names by interpolation in this file.
const BRAND_SWATCHES: { label: string; className: string }[] = [
  { label: 'brand-50', className: 'bg-brand-50' },
  { label: 'brand-100', className: 'bg-brand-100' },
  { label: 'brand-200', className: 'bg-brand-200' },
  { label: 'brand-300', className: 'bg-brand-300' },
  { label: 'brand-400', className: 'bg-brand-400' },
  { label: 'brand-500', className: 'bg-brand-500' },
  { label: 'brand-600', className: 'bg-brand-600' },
  { label: 'brand-700', className: 'bg-brand-700' },
  { label: 'brand-800', className: 'bg-brand-800' },
  { label: 'brand-900', className: 'bg-brand-900' },
  { label: 'brand-950', className: 'bg-brand-950' },
];

const NAVY_SWATCHES: { label: string; className: string }[] = [
  { label: 'navy-50', className: 'bg-navy-50' },
  { label: 'navy-100', className: 'bg-navy-100' },
  { label: 'navy-200', className: 'bg-navy-200' },
  { label: 'navy-300', className: 'bg-navy-300' },
  { label: 'navy-400', className: 'bg-navy-400' },
  { label: 'navy-500', className: 'bg-navy-500' },
  { label: 'navy-600', className: 'bg-navy-600' },
  { label: 'navy-700', className: 'bg-navy-700' },
  { label: 'navy-800', className: 'bg-navy-800' },
  { label: 'navy-900', className: 'bg-navy-900' },
  { label: 'navy-950', className: 'bg-navy-950' },
];

const INK_SWATCHES: { label: string; className: string }[] = [
  { label: 'ink-50', className: 'bg-ink-50' },
  { label: 'ink-100', className: 'bg-ink-100' },
  { label: 'ink-200', className: 'bg-ink-200' },
  { label: 'ink-300', className: 'bg-ink-300' },
  { label: 'ink-400', className: 'bg-ink-400' },
  { label: 'ink-500', className: 'bg-ink-500' },
  { label: 'ink-600', className: 'bg-ink-600' },
  { label: 'ink-900', className: 'bg-ink-900' },
];

const HAZE_SWATCHES: { label: string; className: string }[] = [
  { label: 'haze-100', className: 'bg-haze-100' },
  { label: 'haze-200', className: 'bg-haze-200' },
];

const APPLE_BLUE_SWATCHES: { label: string; className: string }[] = [
  { label: 'apple-blue', className: 'bg-apple-blue' },
];

const DEEP_SWATCHES: { label: string; className: string }[] = [
  { label: 'deep-page', className: 'bg-deep-page' },
  { label: 'deep-sky', className: 'bg-deep-sky' },
  { label: 'deep-ticker', className: 'bg-deep-ticker' },
  { label: 'deep-card', className: 'bg-deep-card' },
  { label: 'deep-hairline', className: 'bg-deep-hairline' },
  { label: 'deep-core-top', className: 'bg-deep-core-top' },
  { label: 'deep-core-bottom', className: 'bg-deep-core-bottom' },
];

const NAHTADI_SWATCHES: { label: string; className: string }[] = [
  { label: 'nahtadi-100', className: 'bg-nahtadi-100' },
  { label: 'nahtadi-200', className: 'bg-nahtadi-200' },
  { label: 'nahtadi-600', className: 'bg-nahtadi-600' },
  { label: 'nahtadi-700', className: 'bg-nahtadi-700' },
  { label: 'nahtadi-800', className: 'bg-nahtadi-800' },
  { label: 'nahtadi-900', className: 'bg-nahtadi-900' },
];

function SwatchRow({
  name,
  swatches,
}: {
  name: string;
  swatches: { label: string; className: string }[];
}) {
  return (
    <div className="mb-4">
      <h2 className="mb-2 text-sm font-medium">{name}</h2>
      <div className="flex gap-1">
        {swatches.map(({ label, className }) => (
          <div
            key={label}
            className={'h-12 flex-1 rounded ' + className}
            title={label}
          />
        ))}
      </div>
    </div>
  );
}


// Type scale — one entry per --text-* token in @theme. Full literal class names.
const TYPE_SAMPLES: { label: string; className: string }[] = [
  { label: 'text-display', className: 'text-display' },
  { label: 'text-h1', className: 'text-h1' },
  { label: 'text-h2', className: 'text-h2' },
  { label: 'text-h3', className: 'text-h3' },
  { label: 'text-body', className: 'text-body' },
  { label: 'text-small', className: 'text-small' },
];

// Radii — one entry per --radius-* token in @theme. Full literal class names.
const RADIUS_SAMPLES: { label: string; className: string }[] = [
  { label: 'rounded-card', className: 'rounded-card' },
  { label: 'rounded-control', className: 'rounded-control' },
];

const PANGRAM = 'Hendaseh — Sphinx of black quartz, judge my vow. 0123456789';

// Reads the *computed* font-family off a rendered node. This is the check that
// catches a broken --font-heading / --font-body: if the next/font variable is
// not defined on the same element as the @theme :root declaration, the token
// resolves to the guaranteed-invalid value and this readout shows the inherited
// or UA font instead of a Roboto face.
function useComputedFontFamily() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [family, setFamily] = useState<string>('measuring…');
  useEffect(() => {
    if (ref.current) setFamily(getComputedStyle(ref.current).fontFamily);
  }, []);
  return { ref, family };
}

function FontSample({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  const { ref, family } = useComputedFontFamily();
  return (
    <div>
      <div className="text-muted mb-1 font-mono text-xs">{label}</div>
      <p ref={ref} className={className}>
        {PANGRAM}
      </p>
      <div className="text-muted mt-1 font-mono text-xs break-all">
        computed font-family: {family}
      </div>
    </div>
  );
}

function TypeScale() {
  return (
    <div className="space-y-3">
      <h3 className="text-muted font-mono text-xs uppercase tracking-wide">Type scale</h3>
      {TYPE_SAMPLES.map(({ label, className }) => (
        <div key={label} className="flex items-baseline gap-3">
          <span className="text-muted w-28 shrink-0 font-mono text-xs">{label}</span>
          <span className={className}>Aa</span>
        </div>
      ))}
    </div>
  );
}

function Fonts() {
  return (
    <div className="space-y-4">
      <h3 className="text-muted font-mono text-xs uppercase tracking-wide">Fonts</h3>
      <FontSample label="font-heading (Roboto 500/700/900)" className="font-heading text-h3" />
      <p className="font-heading text-h3 font-black">Roboto 900 — statement heading weight</p>
      <FontSample label="font-body (Roboto Regular 400)" className="font-body text-body" />
    </div>
  );
}

function Radii() {
  return (
    <div className="space-y-3">
      <h3 className="text-muted font-mono text-xs uppercase tracking-wide">Radii</h3>
      <div className="flex flex-wrap gap-4">
        {RADIUS_SAMPLES.map(({ label, className }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div className={'bg-accent h-20 w-20 ' + className} />
            <span className="text-muted font-mono text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Every semantic token the redesign consumes, printed with its *computed*
// value in each theme. Colour tokens get a swatch; gradients, shadows and
// lengths are text-only because that is what is actually worth eyeballing.
const COLOUR_TOKENS = [
  '--surface',
  '--surface-raised',
  '--surface-sunken',
  '--ticker-surface',
  '--fg-strong',
  '--fg-body',
  '--fg-muted',
  '--fg-subtle',
  '--fg-faint',
  '--accent',
  '--accent-strong',
  '--edge',
  '--edge-soft',
  '--tile-hover-edge',
  '--pill-primary-bg',
  '--pill-primary-fg',
  '--pill-secondary-bg',
  '--pill-secondary-fg',
  '--pill-sky-bg',
  '--nav-fg',
  '--nav-fg-active',
  '--ticker-secondary',
  '--flagship-fg',
  '--flagship-meta',
  '--flagship-body',
  '--flagship-pill-bg',
  '--flagship-pill-fg',
];

const VALUE_TOKENS = [
  '--nav-h',
  '--home-sky',
  '--cta-surface',
  '--card-shadow',
  '--cta-shadow',
  '--tile-hover-shadow',
  '--aurora-image',
  '--aurora-opacity',
  '--stars-opacity',
  '--core-bg',
  '--core-shadow',
  '--sat-shadow',
  '--pill-sky-shadow',
  '--pill-secondary-shadow',
  '--flagship-bg',
  '--flagship-edge',
  '--flagship-glow',
  '--nahtadi-tile',
  '--nahtadi-tile-flagship',
  '--nahtadi-tile-shadow',
];

function useComputedTokens(names: string[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!ref.current) return;
    const styles = getComputedStyle(ref.current);
    setValues(Object.fromEntries(names.map((n) => [n, styles.getPropertyValue(n).trim()])));
    // `names` is a module-level constant array; re-running on identity is noise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, values };
}

function SemanticTokens() {
  const { ref, values } = useComputedTokens(COLOUR_TOKENS);
  return (
    <div ref={ref} className="space-y-3">
      <h3 className="text-muted font-mono text-xs uppercase tracking-wide">Semantic colours</h3>
      <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 font-mono text-xs">
        {COLOUR_TOKENS.map((name) => (
          <Fragment key={name}>
            <dt className="text-secondary">{name}</dt>
            <dd className="flex items-center gap-2">
              <span className="text-muted">{values[name] ?? '…'}</span>
              <span
                className="border-edge inline-block h-4 w-8 shrink-0 rounded border"
                style={{ background: `var(${name})` }}
              />
            </dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}

function EffectTokens() {
  const { ref, values } = useComputedTokens(VALUE_TOKENS);
  return (
    <div ref={ref} className="space-y-3">
      <h3 className="text-muted font-mono text-xs uppercase tracking-wide">
        Layout, gradients &amp; elevation
      </h3>
      <dl className="space-y-1 font-mono text-xs">
        {VALUE_TOKENS.map((name) => (
          <Fragment key={name}>
            <dt className="text-secondary">{name}</dt>
            <dd className="text-muted mb-1 break-all">{values[name] ?? '…'}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}

function Panel({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div data-theme={theme} className="bg-surface text-secondary p-8 space-y-6">
      <h2 className="text-primary text-2xl">Theme: {theme}</h2>
      <div className="bg-surface-raised border border-edge rounded-xl p-4">
        <p className="text-primary">text-primary on surface-raised</p>
        <p className="text-secondary">text-secondary</p>
        <p className="text-muted">text-muted</p>
        <a className="text-accent hover:text-accent-strong" href="#">
          accent link
        </a>
      </div>
      <div className="bg-surface-sunken rounded-xl p-4 text-secondary">
        surface-sunken
      </div>
      <TypeScale />
      <Fonts />
      <Radii />
      <SemanticTokens />
      <EffectTokens />
    </div>
  );
}

export default function TokensClient() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      <section>
        <h1 className="text-2xl mb-4">Brand scales</h1>
        <SwatchRow name="brand" swatches={BRAND_SWATCHES} />
        <SwatchRow name="navy" swatches={NAVY_SWATCHES} />
        <SwatchRow name="ink (Apple gray ladder, light theme)" swatches={INK_SWATCHES} />
        <SwatchRow name="haze (light tints)" swatches={HAZE_SWATCHES} />
        <SwatchRow name="apple-blue (light-theme accent)" swatches={APPLE_BLUE_SWATCHES} />
        <SwatchRow name="deep (dark grounds)" swatches={DEEP_SWATCHES} />
        <SwatchRow name="nahtadi (flagship card)" swatches={NAHTADI_SWATCHES} />
      </section>
      <section className="grid md:grid-cols-2 gap-4 rounded-2xl overflow-hidden border border-edge">
        <Panel theme="light" />
        <Panel theme="dark" />
      </section>
    </div>
  );
}
