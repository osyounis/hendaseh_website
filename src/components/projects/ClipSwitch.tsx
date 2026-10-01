'use client';

import { useRef, type CSSProperties, type KeyboardEvent } from 'react';

export interface ClipSwitchOption {
  readonly id: string;
  readonly label: string;
}

interface ClipSwitchProps {
  /**
   * `tabs`: a WAI-ARIA tablist with MANUAL activation, for the axis that decides
   * what the panel IS. `toggle`: a group of `aria-pressed` buttons, for a second
   * axis that only changes the camera on the same panel. Two tablists pointing at
   * one panel is a broken tabs pattern, which is why the second axis is not one.
   */
  mode: 'tabs' | 'toggle';
  options: readonly ClipSwitchOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** The visible element that names this switch. Preferred over `label`. */
  labelledBy?: string;
  /** Accessible name when nothing on screen names the switch. */
  label?: string;
  /** Tabs mode only: the DOM id of an option's tab. */
  tabId?: (id: string) => string;
  /** Tabs mode only: the panel the tabs control. */
  panelId?: string;
}

/**
 * THE PILL, ON apple.com/mac's "Explore the lineup." PATTERN. Extracted from
 * `CaseStudyClips` when a second axis arrived; everything below about the
 * indicator and the keys is unchanged from there.
 *
 * The indicator is decorative (`aria-selected` / `aria-pressed` state the
 * selection) and travels by a CSS transition on `transform`, set inline from the
 * selected index. A transition retargets from the value on screen, so a second
 * press mid-travel turns it round instead of snapping or queueing. Equal-width
 * columns (case-study.css) are what let it step by exactly 100% of itself.
 *
 * In tabs mode the control is ONE tab stop (roving tabindex), arrows move focus,
 * and Enter or Space commits: manual activation, because every activation starts
 * a video download. In toggle mode each button is its own tab stop, as any pair
 * of buttons is.
 */
export default function ClipSwitch({
  mode,
  options,
  selectedId,
  onSelect,
  labelledBy,
  label,
  tabId,
  panelId,
}: ClipSwitchProps) {
  const tabs = mode === 'tabs';
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.id === selectedId)
  );

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = options.length - 1;
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? index === last
          ? 0
          : index + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? index === 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    buttons.current[next]?.focus();
  };

  return (
    <div
      className="case-clip-switch"
      role={tabs ? 'tablist' : 'group'}
      // Named by the visible sentence above it when there is one, so the name a
      // screen reader hears is the one on screen.
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      style={{ '--tab-count': options.length } as CSSProperties}
    >
      <span
        className="case-clip-indicator"
        aria-hidden="true"
        style={{ transform: `translateX(${selectedIndex * 100}%)` }}
      />
      {options.map((option, index) => {
        const selected = option.id === selectedId;
        return (
          <button
            key={option.id}
            ref={(el) => {
              buttons.current[index] = el;
            }}
            type="button"
            className="case-clip-tab"
            role={tabs ? 'tab' : undefined}
            id={tabs ? tabId?.(option.id) : undefined}
            aria-selected={tabs ? selected : undefined}
            aria-controls={tabs ? panelId : undefined}
            aria-pressed={tabs ? undefined : selected}
            tabIndex={tabs ? (selected ? 0 : -1) : undefined}
            onClick={() => onSelect(option.id)}
            onKeyDown={tabs ? (event) => onKeyDown(event, index) : undefined}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
