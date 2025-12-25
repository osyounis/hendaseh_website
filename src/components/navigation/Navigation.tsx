'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HiMail, HiMenu, HiX } from 'react-icons/hi';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* TODO: Replace "Hendaseh" text with logo image once logo is ready */}
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            Hendaseh
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/capabilities"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Capabilities
            </Link>
            <Link
              href="/projects"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Projects
            </Link>
            <a
              href="https://github.com/osyounis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              GitHub
            </a>
            <a
              href="mailto:omar@hendaseh.com"
              className="text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Email Omar Younis"
              title="Email me"
            >
              <HiMail className="w-6 h-6" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-gray-900 transition-colors"
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
                href="/"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/capabilities"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Capabilities
              </Link>
              <Link
                href="/projects"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <a
                href="https://github.com/osyounis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                GitHub
              </a>
              <a
                href="mailto:omar@hendaseh.com"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium flex items-center gap-2"
              >
                <HiMail className="w-5 h-5" />
                Email Me
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
