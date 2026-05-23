'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, Clock, GraduationCap, IndianRupee, ArrowRight, Filter, ChevronDown, X } from 'lucide-react';
import { programs as allPrograms, categories as allCategories } from '@/lib/program-data';

function ProgramsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const levels = ['Undergraduate', 'Postgraduate', 'Certificate', 'Diploma', 'Integrated'];

  const filteredPrograms = allPrograms.filter((p) => {
    if (selectedCategory && p.category_slug !== selectedCategory) return false;
    if (selectedLevel && p.level !== selectedLevel) return false;
    return true;
  });

  const getCategoryIcon = (slug: string) => {
    const cat = allCategories.find(c => c.slug === slug);
    return cat?.icon || '📚';
  };

  const activeFilters = [
    selectedCategory ? allCategories.find(c => c.slug === selectedCategory)?.name : null,
    selectedLevel,
  ].filter(Boolean);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedLevel(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">Explore Programs</h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Discover {allPrograms.length}+ programs across various disciplines from India&apos;s top universities
            </p>
          </div>
        </section>

        {/* Mobile Filter Toggle + Active Filters */}
        <section className="bg-white border-b shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            {/* Mobile: toggle button | Desktop: always visible inline filters */}
            <div className="flex items-center justify-between lg:justify-start lg:gap-6">
              {/* Mobile toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg font-medium text-gray-700"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Desktop: always show filters inline */}
              <div className="hidden lg:flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Filters:</span>
                </div>

                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {allCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.slug
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </button>
                ))}

                <div className="h-6 w-px bg-gray-300 mx-1" />

                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedLevel === level
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              {/* Showing count */}
              <span className="text-sm text-gray-500">
                {filteredPrograms.length} programs
              </span>
            </div>

            {/* Active filter chips (mobile) */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 lg:hidden">
                {activeFilters.map((filter) => (
                  <span key={filter} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {filter}
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-600 font-medium underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Mobile: expandable filter panel */}
          {showFilters && (
            <div className="lg:hidden border-t bg-gray-50 px-4 pb-4 pt-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Filter by Category</h3>
                {activeFilters.length > 0 && (
                  <button onClick={clearFilters} className="text-xs text-red-600 font-medium">
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => { setSelectedCategory(null); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  All Categories
                </button>
                {allCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => { setSelectedCategory(category.slug); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.slug
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              <h3 className="font-semibold text-gray-900 text-sm mb-3">Filter by Level</h3>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedLevel === level
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Programs Grid */}
        <section className="py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filteredPrograms.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-5 border border-gray-200"
                  >
                    {program.featured && (
                      <div className="inline-block px-2.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full mb-2">
                        Featured
                      </div>
                    )}
                    <div className="flex items-center text-sm text-blue-600 mb-1.5">
                      <span className="mr-1">{getCategoryIcon(program.category_slug)}</span>
                      {program.category_name}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {program.description}
                    </p>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center text-gray-700">
                        <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{program.level}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{program.duration}</span>
                      </div>
                      {program.fee_range && (
                        <div className="flex items-center text-gray-700">
                          <IndianRupee className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{program.fee_range}</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/apply?program=${program.slug}`}
                      className="mt-4 w-full inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                    >
                      Book Seat
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProgramsPageContent />
    </Suspense>
  );
}