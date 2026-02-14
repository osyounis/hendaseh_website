'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Screenshot {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
}

export default function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Check scroll position
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check if at the start (within 10px threshold)
    const atStart = container.scrollLeft <= 10;
    setIsAtStart(atStart);

    // Check if at the end (within 10px threshold)
    const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
    setIsAtEnd(atEnd);
  };

  // Set up scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check initial position
    checkScrollPosition();

    // Add scroll listener
    container.addEventListener('scroll', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Scroll left by the width of one screenshot plus gap (~280px)
    container.scrollBy({
      left: -280,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Scroll right by the width of one screenshot plus gap (~280px)
    container.scrollBy({
      left: 280,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      {/* Scroll Left Button */}
      <button
        onClick={scrollLeft}
        disabled={isAtStart}
        aria-label="Scroll left"
        className={`absolute left-0 top-1/2 -translate-y-1/2 translate-x-4 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-10 ${
          isAtStart
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:scale-110 active:scale-95'
        }`}
        style={{ backgroundColor: isAtStart ? '#CCCCCC' : '#0093FF' }}
        onMouseEnter={(e) => {
          if (!isAtStart) e.currentTarget.style.backgroundColor = '#0080E0';
        }}
        onMouseLeave={(e) => {
          if (!isAtStart) e.currentTarget.style.backgroundColor = '#0093FF';
        }}
      >
        <FaChevronLeft className="w-6 h-6" />
      </button>

      {/* Horizontal Scrolling Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-hidden pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
      >
        <div className="flex gap-6 sm:gap-8 lg:gap-10" style={{ scrollSnapType: 'x mandatory' }}>
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[220px] sm:w-[240px] lg:w-[260px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Screenshot - iPhone 17 Pro Style */}
              <div className="relative aspect-[9/19.5] mb-4 rounded-[2.75rem] overflow-hidden shadow-2xl ring-1 ring-gray-900/10">
                <Image
                  src={`/images/nahtadi/screenshot-${index + 1}.png`}
                  alt={screenshot.title}
                  fill
                  className="object-contain bg-white"
                  sizes="260px"
                />
              </div>

              {/* Screenshot Info - Enhanced */}
              <div className="text-center px-3 bg-white rounded-xl py-4 shadow-md border border-gray-200 min-h-[120px] flex flex-col justify-center">
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {screenshot.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {screenshot.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={scrollRight}
        disabled={isAtEnd}
        aria-label="Scroll right"
        className={`absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-10 ${
          isAtEnd
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:scale-110 active:scale-95'
        }`}
        style={{ backgroundColor: isAtEnd ? '#CCCCCC' : '#0093FF' }}
        onMouseEnter={(e) => {
          if (!isAtEnd) e.currentTarget.style.backgroundColor = '#0080E0';
        }}
        onMouseLeave={(e) => {
          if (!isAtEnd) e.currentTarget.style.backgroundColor = '#0093FF';
        }}
      >
        <FaChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
