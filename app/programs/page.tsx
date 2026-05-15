'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, Clock, GraduationCap, IndianRupee, ArrowRight, Filter } from 'lucide-react';
import { programs as allPrograms, categories as allCategories } from '@/lib/program-data';

function ProgramsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const levels = ['Undergraduate', 'Postgraduate', 'Certificate', 'Diploma', 'Integrated'];

  // Filter programs client-side from static data
  const filteredPrograms = allPrograms.filter((p) => {
    if (selectedCategory && p.category_slug !== selectedCategory) return false;
    if (selectedLevel && p.level !== selectedLevel) return false;
    return true;
  });

  const getCategoryIcon = (slug: string) => {
    const cat = allCategories.find(c => c.slug === slug);
    return cat?.icon || '📚';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Programs</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Discover {allPrograms.length}+ programs across various disciplines from India's top universities
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Categories
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
              </div>

              {/* Level Filter */}
              <div className="flex flex-wrap gap-2 ml-auto">
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
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filteredPrograms.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Showing <span className="font-semibold">{filteredPrograms.length}</span> programs
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map((program) => (
                    <div
                      key={program.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-200"
                    >
                      {program.featured && (
                        <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full mb-3">
                          Featured
                        </div>
                      )}
                      <div className="flex items-center text-sm text-blue-600 mb-2">
                        <span className="mr-1">{getCategoryIcon(program.category_slug)}</span>
                        {program.category_name}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {program.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-700">
                          <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{program.level}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{program.duration}</span>
                        </div>
                        {program.fee_range && (
                          <div className="flex items-center text-gray-700">
                            <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{program.fee_range}</span>
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/apply?program=${program.slug}`}
                        className="mt-4 w-full inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              </>
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