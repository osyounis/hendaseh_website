import type { CSSProperties, ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  /** Per-card stagger for the scroll reveal, in seconds. */
  revealDelay?: number;
}

/**
 * One tile in "Everything You Need for Salat".
 *
 * IT WEARS `.home-tile`, which is the sitewide shared card: ground, hairline,
 * shadow, hover lift, press and focus ring all come from there and NONE of
 * them is re-implemented in `.nh-fcard`. That is the standing rule — the
 * Projects contract states it as "Card hover is SHARED CODE ... never
 * re-implement the hover" — and it is why this card animates identically to
 * every other card on the site without anyone maintaining a second copy.
 * `.nh-fcard` adds only radius, padding, the icon chip and type.
 *
 * The card is NOT a link. It has no destination, so it takes no press
 * affordance (`a.home-tile:active` is scoped to the anchor case precisely so
 * a non-interactive tile does not advertise a tap that does nothing).
 */
export default function FeatureCard({
  icon,
  title,
  description,
  revealDelay = 0,
}: FeatureCardProps) {
  return (
    // The stagger is a custom property read by `[data-reveal="in"]`'s
    // transition-delay, so the grid expresses a cascade without the stylesheet
    // needing to know how many cards there are.
    <div
      className="nh-fcard home-tile"
      data-reveal
      style={{ '--reveal-delay': `${revealDelay}s` } as CSSProperties}
    >
      <div className="nh-ico">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
