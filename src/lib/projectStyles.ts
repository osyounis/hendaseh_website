// Single source of truth for per-project card gradients (audit M5).
//
// `className` values are FULL literal strings so Tailwind's content scanner emits
// their CSS; the web project cards consume these (visuals unchanged from the old
// inline ternaries). `stops` are real hex colors for the next/og image engine —
// Satori can't resolve Tailwind tokens, so the share cards read these instead.
// Keeping both in one map guarantees the in-site card and the OG share card stay
// in sync (notably Nahtadi's deep green).

export interface GradientStops {
  from: string;
  to: string;
}

interface ProjectGradient {
  className: string;
  stops: GradientStops;
}

const PROJECT_GRADIENTS: Record<string, ProjectGradient> = {
  nahtadi: {
    className: 'bg-gradient-to-br from-[#0F5F50] to-[#022E28]',
    stops: { from: '#0F5F50', to: '#022E28' },
  },
  'mini-compiler': {
    className: 'bg-gradient-to-br from-[#49F2E5] to-[#7E22CE]',
    stops: { from: '#49F2E5', to: '#7E22CE' },
  },
  'brent-cuda': {
    className: 'bg-gradient-to-br from-[#4B5563] to-[#1F2937]',
    stops: { from: '#4B5563', to: '#1F2937' },
  },
  'radar-moboard': {
    className: 'bg-gradient-to-br from-[#0F2A43] to-[#101F2E]',
    stops: { from: '#0F2A43', to: '#101F2E' },
  },
  'a16-summarizer': {
    className: 'bg-gradient-to-br from-[#0A0A0C] to-[#2A2A2E]',
    stops: { from: '#0A0A0C', to: '#2A2A2E' },
  },
  'wildfire-predictor': {
    className: 'bg-gradient-to-br from-[#991B1B] to-[#292524]',
    stops: { from: '#991B1B', to: '#292524' },
  },
  'asl-detector': {
    className: 'bg-gradient-to-br from-[#5B21B6] to-[#2E1065]',
    stops: { from: '#5B21B6', to: '#2E1065' },
  },
  'image-watermark-remover': {
    className: 'bg-gradient-to-br from-emerald-500 to-teal-400',
    stops: { from: '#10B981', to: '#2DD4BF' },
  },
  'new-game-plus': {
    className: 'bg-gradient-to-br from-indigo-600 to-purple-500',
    stops: { from: '#4F46E5', to: '#A855F7' },
  },
  'reddit-nlp': {
    className: 'bg-gradient-to-br from-[#1D4ED8] to-[#0E7490]',
    stops: { from: '#1D4ED8', to: '#0E7490' },
  },
  'islamic-prayer-time': {
    className: 'bg-gradient-to-br from-[#5EAFA3] to-[#1F6F63]',
    stops: { from: '#5EAFA3', to: '#1F6F63' },
  },
  'coast-guard-pilot-tracker': {
    className: 'bg-gradient-to-br from-orange-500 to-blue-600',
    stops: { from: '#F97316', to: '#2563EB' },
  },
  'coast-guard-inventory': {
    className: 'bg-gradient-to-br from-blue-700 to-orange-400',
    stops: { from: '#1D4ED8', to: '#FB923C' },
  },
  'cycloidal-drive-creator': {
    className: 'bg-gradient-to-br from-gray-600 to-blue-700',
    stops: { from: '#4B5563', to: '#1D4ED8' },
  },
};

// Web fallback preserves the prior inline default. OG fallback is a dark neutral
// so white card text stays legible (a light gray would wash it out).
const FALLBACK_CLASS = 'bg-gray-100';
const FALLBACK_STOPS: GradientStops = { from: '#1F2937', to: '#0A1A2F' };

export function getProjectGradientClass(id: string): string {
  return PROJECT_GRADIENTS[id]?.className ?? FALLBACK_CLASS;
}

export function getProjectGradientStops(id: string): GradientStops {
  return PROJECT_GRADIENTS[id]?.stops ?? FALLBACK_STOPS;
}
