'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

const MOBILE_MENU_ID = 'site-nav-mobile-menu';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Home matches only on an exact match with "/"; the other links match on
  // exact match or as a path prefix (e.g. /projects/brent-cuda still marks
  // Projects as current).
  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  // The mockup only draws the resting and active states; the hover shift is the
  // affordance the previous nav had and is kept so links still feel live.
  const linkClassName = (href: string) =>
    'transition-colors hover:text-[color:var(--nav-fg-active)] ' +
    (isCurrent(href) ? 'text-[color:var(--nav-fg-active)]' : 'text-[color:var(--nav-fg)]');

  return (
    // Transparent and static, with no bottom hairline: the home hero's sky
    // reaches up under it (see .home-sky's negative top margin) and the mockup
    // shows the nav floating on that sky. `relative z-50` keeps it above the
    // sky's aurora and starfield layers.
    <nav className="relative z-50 h-[var(--nav-h)]">
      <div className="page-wrap flex h-full items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[16px] font-bold text-primary transition-opacity hover:opacity-80"
        >
          {/* Decorative: the wordmark beside it already names the link. */}
          <Image
            src="/logos/hendaseh-mark.svg"
            alt=""
            width={24}
            height={26}
            className="h-[26px] w-auto"
            priority
          />
          Hendaseh
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 text-[14px] font-semibold md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={linkClassName(href)}
              aria-current={isCurrent(href) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        {/* The 24px icon carried the whole hit box until the 2026-08-26 phone
            review: a 24x24 target in the top-right corner, where thumb accuracy
            is worst. The first fix (2026-08-26) grew the target to 44x44 with
            symmetric padding, but that pulled its RIGHT edge from 20px of
            clearance from the screen edge down to 10px -- reaching into iOS's
            own ~20px edge-swipe-gesture strip instead of staying clear of it.
            The padding is therefore asymmetric: 20px on the left only (so the
            right edge, and its clearance from the gesture strip, never moves)
            plus 10px top/bottom to reach 44px height. The matching negative
            margin cancels the padding on every side, so the icon does not move
            a pixel while the hit box grows. `:active` feedback lands on
            pointer-down, not on release. */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="-mt-2.5 -mb-2.5 -ml-5 pt-2.5 pb-2.5 pl-5 text-[color:var(--nav-fg)] transition-transform duration-100 ease-out active:scale-95 md:hidden"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
          aria-controls={MOBILE_MENU_ID}
        >
          {mobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu. Absolutely positioned so opening it never
          changes --nav-h, which the home hero's overlap depends on. */}
      {mobileMenuOpen && (
        <div id={MOBILE_MENU_ID} className="page-wrap absolute inset-x-0 top-full md:hidden">
          {/* Each link is a full-width row, not a 22px-tall line of text. The
              panel's inset moves onto the rows themselves (p-2 + px-3 = the
              same 20px text inset as before) so the rows can carry the 44px
              height a thumb needs. */}
          <div className="bg-surface-raised border-edge flex flex-col gap-1 rounded-2xl border p-2 text-[15px] font-semibold shadow-lg">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex min-h-11 items-center rounded-xl px-3 py-3 transition-opacity duration-100 ease-out active:opacity-60 ${linkClassName(href)}`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isCurrent(href) ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
