// Per-card config for the OG image engine (rendered by scripts/generate-og.tsx).
// One small config object per card feeds ONE template, so the same engine renders
// the site card, the Nahtadi card, per-project cards, and (later) GitHub banners.

import { getProjectById } from '@/lib/projects';
import { getProjectGradientStops } from '@/lib/projectStyles';

type OgBackground =
  | { kind: 'solid'; color: string }
  | { kind: 'gradient'; from: string; to: string };

interface OgIcon {
  /**
   * which mark the template should render — the two fixed marks, or a
   * project's own transparent artwork (assets/artwork/<id>.png), identified
   * by `{ project: id }` so the loader can resolve it per-card.
   */
  src: 'hendaseh-mark' | 'nahtadi' | { project: string };
  /** wrap the mark in a white rounded tile (needed for the transparent Nahtadi arch) */
  tile: boolean;
}

export interface OgCard {
  background: OgBackground;
  icon?: OgIcon;
  name: string;
  nameSize: number;
  tagline?: string;
  taglineColor?: string;
  footer?: string;
  textColor: string;
}

const NAVY = '#0A1A2F';
const BLUE = '#0093FF';
const WHITE = '#FFFFFF';
const ON_DARK_MUTED = 'rgba(255,255,255,0.86)';

/** The locked brand site/default card. */
function siteCard(): OgCard {
  return {
    background: { kind: 'solid', color: NAVY },
    icon: { src: 'hendaseh-mark', tile: false },
    name: 'Omar Younis',
    nameSize: 88,
    tagline: 'Software Engineer · iOS, ML & Autonomous Systems',
    taglineColor: BLUE,
    footer: 'hendaseh.com',
    textColor: WHITE,
  };
}

/**
 * Resolve a `?card=` value to a card config.
 * - `site` (or unknown) → the brand site card
 * - `nahtadi` → green gradient + Nahtadi mark on a white tile
 * - any project id → that project's gradient + title
 */
export function getOgCard(card: string): OgCard {
  if (card === 'nahtadi') {
    const { from, to } = getProjectGradientStops('nahtadi');
    return {
      background: { kind: 'gradient', from, to },
      icon: { src: 'nahtadi', tile: true },
      name: 'Nahtadi',
      nameSize: 88,
      tagline: 'Prayer Times & Qibla Compass',
      taglineColor: ON_DARK_MUTED,
      textColor: WHITE,
    };
  }

  if (card && card !== 'site') {
    const project = getProjectById(card);
    if (project) {
      const { from, to } = getProjectGradientStops(project.id);
      return {
        background: { kind: 'gradient', from, to },
        icon: { src: { project: project.id }, tile: false },
        name: project.title,
        nameSize: 64,
        footer: 'hendaseh.com',
        textColor: WHITE,
      };
    }
  }

  return siteCard();
}
