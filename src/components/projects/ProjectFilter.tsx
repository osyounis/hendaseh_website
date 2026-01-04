'use client';

import { useState } from 'react';

interface ProjectFilterProps {
  categories: string[];
  onFilterChange: (category: string | null) => void;
  onSearchChange: (search: string) => void;
}

export default function ProjectFilter({
  categories,
  onFilterChange,
  onSearchChange
}: ProjectFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategoryChange = (category: string) => {
    const newCategory = category === 'all' ? null : category;
    setSelectedCategory(newCategory);
    onFilterChange(newCategory);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearchChange(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    onFilterChange(null);
    onSearchChange('');
  };

  const hasActiveFilters = selectedCategory !== null || searchTerm !== '';

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Category Filter */}
        <select
          value={selectedCategory || 'all'}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {formatCategory(cat)}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by technology (Python, Swift, PyTorch...)"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

function formatCategory(category: string): string {
  const formatted = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return formatted;
}
