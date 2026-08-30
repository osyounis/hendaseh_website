'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The Copy button beside the email address, and the ONLY client component on
 * the Contact page.
 *
 * The client boundary is deliberately drawn around this button alone rather
 * than around the page: everything else on /contact is static markup, and the
 * address itself is server-rendered text, so a reader with no JavaScript still
 * sees it, can select it, and can reach every channel below.
 *
 * ---------------------------------------------------------------------------
 * `navigator.clipboard` NEEDS A SECURE CONTEXT.
 *
 * `https://` and `http://localhost` qualify; `http://192.168.x.x:8787` does
 * NOT. Testing the Worker build from a phone on the LAN therefore lands on the
 * catch below on every tap. That is the API behaving as specified, not a bug,
 * and it must NOT be "fixed" with a `document.execCommand('copy')` fallback --
 * that would change an approved contract decision to accommodate our own test
 * rig. Verify the copy behaviour on desktop over localhost; verify layout,
 * cascade, touch targets and reduced motion on the phone.
 *
 * ---------------------------------------------------------------------------
 * THE MORPH FOLLOWS THE WRITE, NOT THE CLICK.
 *
 * The mockup's demo script morphed unconditionally, inside a bare try/catch.
 * Here the confirmed state is only entered once the clipboard write has
 * actually resolved, because "Copied" on a device whose clipboard was never
 * written is a false confirmation -- the reader walks away believing they have
 * the address. On failure the button is a silent no-op: no error state, no
 * morph. That is what "graceful no-op on failure" has to mean for the state to
 * stay honest.
 *
 * ---------------------------------------------------------------------------
 * ACCESSIBLE NAME AND THE STATE CHANGE.
 *
 * The contract pins `aria-label="Copy email address"`, so the button's name is
 * stable and the visible "Copy" -> "Copied" swap is invisible to a screen
 * reader. The swap is therefore announced by a polite live region beside the
 * button instead of by renaming the control mid-press, which would move the
 * user's landmark under them.
 */

const EMAIL = 'omar@hendaseh.com';

/** How long the confirmed state holds before reverting, per the contract. */
const REVERT_MS = 2000;

export default function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A click landing just before unmount would otherwise set state on a gone
  // component; the same ref also collapses rapid repeat presses into one timer.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Insecure context, a denied permission, or no Clipboard API at all.
      // Nothing was copied, so nothing is confirmed.
      return;
    }

    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), REVERT_MS);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={copy}
        data-copied={copied}
        aria-label="Copy email address"
        className="pill pill-primary contact-copy"
      >
        {copied ? (
          <svg className="contact-copy-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12.5 9.5 18 20 6.5" />
          </svg>
        ) : (
          <svg className="contact-copy-icon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="9" y="9" width="12" height="12" rx="2.5" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        )}
        <span className="contact-copy-label">{copied ? 'Copied' : 'Copy'}</span>
      </button>

      {/* Outside the button: `aria-label` above would swallow it, and a live
          region nested in the control it describes is announced twice by some
          screen readers. Rendered empty rather than conditionally mounted, so
          the region is already in the accessibility tree when its text
          arrives -- a region that appears WITH its content is often missed. */}
      <span role="status" aria-live="polite" className="sr-only contact-copy-status">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </>
  );
}
