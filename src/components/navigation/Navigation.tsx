'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link
              href="/about"
              className="text-gray-700 hover:text-[#0A1A2F] transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/projects"
              className="text-gray-700 hover:text-[#0A1A2F] transition-colors font-medium"
            >
              Projects
            </Link>
            <Link
              href="/capabilities"
              className="text-gray-700 hover:text-[#0A1A2F] transition-colors font-medium"
            >
              Capabilities
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-[#0A1A2F] transition-colors font-medium"
            >
              Contact
            </Link>
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
              <Link
                href="/about"
                className="text-gray-700 hover:text-[#0A1A2F] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/projects"
                className="text-gray-700 hover:text-[#0A1A2F] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/capabilities"
                className="text-gray-700 hover:text-[#0A1A2F] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Capabilities
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-[#0A1A2F] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
