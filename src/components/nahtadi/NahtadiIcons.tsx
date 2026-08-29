/**
 * The /nahtadi family's own glyphs — self-drawn, stroked, `currentColor`.
 *
 * Drawn here rather than pulled from `react-icons`, which is what the page
 * used before: Hi/Fa are three unrelated icon families with three different
 * stroke conventions and three different optical weights, and mixing them is
 * what made eight feature tiles read as eight separate marks. These share one
 * 24x24 box and one stroke weight, set once by `.nh-ico svg` in
 * `styles/nahtadi.css`, so they read as a set.
 *
 * They are NOT link-affordance glyphs and must never be added to
 * `LinkAffordance.tsx` — that file's five marks are a locked, measured,
 * test-guarded family with a specific semantic (chevrons move within the
 * experience, arrows leave it). These are subject icons. Same ruling that
 * keeps the transport controls in `TransportGlyphs.tsx` and the FAQ's
 * rotating plus in the page that draws it.
 *
 * Every one is `aria-hidden`: each sits beside a heading that already names
 * it, so announcing the icon would repeat the label.
 */

type IconProps = { className?: string };

function Icon({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

/** Prayer times. */
export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </Icon>
  );
}

/** Qibla. A compass needle rather than a magnetic-compass rose. */
export function CompassIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.6 8.4 13.8 13.8 8.4 15.6 10.2 10.2z" />
    </Icon>
  );
}

/** Hijri calendar. */
export function CalendarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.6h17M8.5 3.2v3.4M15.5 3.2v3.4" />
    </Icon>
  );
}

/** Prayer notifications. */
export function BellIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 8.6a6 6 0 1 0-12 0c0 5-2 6.4-2 6.4h16s-2-1.4-2-6.4Z" />
      <path d="M10.3 19a2 2 0 0 0 3.4 0" />
    </Icon>
  );
}

/**
 * Fully offline. The signal arcs, with the dot filled: a stroked dot at this
 * size renders as a ring rather than a point, so the fill is restated locally
 * against the shared `fill: none`.
 */
export function SignalIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.6 8.9a14 14 0 0 1 18.8 0M5.8 12.4a9.4 9.4 0 0 1 12.4 0M9 15.9a4.8 4.8 0 0 1 6 0" />
      <circle cx="12" cy="19.2" r="1.1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** Works worldwide. */
export function GlobeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </Icon>
  );
}

/** Calculation methods — the app's own Settings gear. */
export function GearIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.4 14.6a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-.97 1.47V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1.05-1.47 1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.47-.97H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.47-1.05 1.6 1.6 0 0 0-.32-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.6 1.6 0 0 0 1.77.32H9a1.6 1.6 0 0 0 .97-1.47V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 .97 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.6 1.6 0 0 0-.32 1.77V9a1.6 1.6 0 0 0 1.47.97H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.47.97Z" />
    </Icon>
  );
}

/** Privacy first — a shield with a check. */
export function ShieldCheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 2.8 19.6 6v5.4c0 4.6-3.1 8.1-7.6 9.8-4.5-1.7-7.6-5.2-7.6-9.8V6z" />
      <path d="M9 12.1l2.1 2.1 4-4" />
    </Icon>
  );
}

/** The privacy policy tile — the plain shield, without the check. */
export function ShieldIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 2.8 19.6 6v5.4c0 4.6-3.1 8.1-7.6 9.8-4.5-1.7-7.6-5.2-7.6-9.8V6z" />
    </Icon>
  );
}

/** The support tile. */
export function HelpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.4 9.2a2.7 2.7 0 1 1 3.6 2.5c-.6.25-1 .84-1 1.5v.4" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** Email support. */
export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3.6 7.4 12 13.2l8.4-5.8" />
    </Icon>
  );
}

/**
 * The FAQ disclosure mark: a plus that rotates 45 degrees into a cross when
 * its row opens. Deliberately NOT `ChevronRight` — grammar v2 assigns that
 * glyph to internal navigation, and a disclosure is neither navigation nor a
 * link, so reusing it would corrupt a locked vocabulary. Its own 20x20 box,
 * because it is a UI mark rather than a subject icon.
 */
export function PlusMark() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}
