import React from 'react';

interface ScreenshotPlaceholderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function ScreenshotPlaceholder({
  icon,
  title,
  description,
}: ScreenshotPlaceholderProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[500px] shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Icon */}
      <div className="text-blue-600 mb-4 text-5xl">{icon}</div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-xs">
        {description}
      </p>

      {/* Badge */}
      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
        Screenshot Coming Soon
      </span>
    </div>
  );
}
