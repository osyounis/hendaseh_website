'use client';

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
      </section>
      <section className="grid md:grid-cols-2 gap-4 rounded-2xl overflow-hidden border border-edge">
        <Panel theme="light" />
        <Panel theme="dark" />
      </section>
    </div>
  );
}
