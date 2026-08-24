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

const LINK_CLASSNAME = 'text-gray-700 hover:text-[#0A1A2F] transition-colors font-medium';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Home matches only on an exact match with "/"; the other links match on
  // exact match or as a path prefix (e.g. /projects/brent-cuda still marks
  // Projects as current). This is semantic only (aria-current) — no visual
  // active-state styling is applied here; that is deferred to the redesign
  // sub-project per the no-visual-change constraint on this change.
  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - 40px icon with more padding */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/logos/hendaseh-logo-64.png"
              alt="Hendaseh"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={LINK_CLASSNAME}
                aria-current={isCurrent(href) ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-[#0A1A2F] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={LINK_CLASSNAME}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isCurrent(href) ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
