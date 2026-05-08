import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';

// Metadata moved to app/blog/layout.tsx

const posts = [
  {
    slug: 'iibs-bangalore-admission-2025',
    title: 'IIBS Bangalore Admission 2025: Courses, Fees, Placements & How to Apply',
    excerpt: 'Complete guide to International Institute of Business Studies (IIBS) Bangalore — MBA, BBA, BCA, B.Com courses, fee structure, placement records, ranking, and step-by-step admission process.',
    author: 'Dreamkripa Team',
    date: '2025-05-08',
    category: 'Admissions',
    readTime: '10 min read',
    image: '🏫',
  },
  {
    slug: 'top-engineering-colleges-india-2025',
    title: 'Top 25 Engineering Colleges in India for 2025 Admissions',
    excerpt: 'A comprehensive guide to the best engineering colleges in India, covering IITs, NITs, and top private institutions. Learn about cutoffs, placements, and specializations.',
    author: 'Dreamkripa Team',
    date: '2025-04-28',
    category: 'Engineering',
    readTime: '8 min read',
    image: '🔗',
  },
  {
    slug: 'mba-vs-bba-which-is-right',
    title: 'MBA vs BBA: Which Business Degree is Right for You?',
    excerpt: 'Confused between BBA and MBA? Understand the key differences, career paths, salary expectations, and when to pursue each degree for maximum career growth.',
    author: 'Priya Sharma',
    date: '2025-04-20',
    category: 'Business',
    readTime: '6 min read',
    image: '📊',
  },
  {
    slug: 'neet-2025-complete-guide',
    title: 'NEET 2025: Complete Preparation Guide & College Predictor',
    excerpt: 'Everything you need to know about NEET 2025 — syllabus, important dates, preparation strategy, top medical colleges, and expected cutoffs for MBBS admissions.',
    author: 'Dr. Rajesh Kumar',
    date: '2025-04-15',
    category: 'Medical',
    readTime: '10 min read',
    image: '🏥',
  },
  {
    slug: 'career-options-after-12th-science',
    title: '20 Best Career Options After 12th Science (Beyond Engineering)',
    excerpt: 'Not interested in engineering? Discover 20 exciting career paths in pure sciences, research, data science, biotechnology, pharmacy, and more.',
    author: 'Dreamkripa Team',
    date: '2025-04-10',
    category: 'Career Guidance',
    readTime: '7 min read',
    image: '🎯',
  },
  {
    slug: 'how-to-choose-right-college',
    title: 'How to Choose the Right College: A Student\'s Decision Framework',
    excerpt: 'A step-by-step framework to evaluate colleges based on faculty, placements, infrastructure, location, fees, and culture. Make an informed decision.',
    author: 'Ankit Verma',
    date: '2025-04-05',
    category: 'Admissions',
    readTime: '5 min read',
    image: '🎓',
  },
  {
    slug: 'scholarships-indian-students-2025',
    title: 'Top 50 Scholarships for Indian Students in 2025',
    excerpt: 'A curated list of government and private scholarships for undergraduate and postgraduate students. Eligibility, deadlines, and application tips included.',
    author: 'Dreamkripa Team',
    date: '2025-03-28',
    category: 'Scholarships',
    readTime: '9 min read',
    image: '💰',
  },
];

const categories = ['All', 'Engineering', 'Business', 'Medical', 'Career Guidance', 'Admissions', 'Scholarships'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dreamkripa Blog</h1>
          <p className="text-xl text-violet-100 max-w-2xl">
            Expert insights on college admissions, career planning, entrance exams, and student success strategies.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b bg-white sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  cat === 'All' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-violet-100 to-indigo-100 p-12 flex items-center justify-center">
                <span className="text-8xl">📚</span>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="text-sm font-medium text-violet-600 mb-2">Featured Article</span>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{posts[0].title}</h2>
                <p className="text-gray-600 mb-4">{posts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1"><User className="h-4 w-4" /> {posts[0].author}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(posts[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>{posts[0].readTime}</span>
                </div>
                <Link href={`/blog/${posts[0].slug}`} className="inline-flex items-center text-violet-600 font-semibold hover:text-violet-800">
                  Read Article <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <article key={post.slug} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
                  <span className="text-5xl">{post.image}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded">{post.category}</span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <Link href={`/blog/${post.slug}`} className="text-violet-600 text-sm font-medium hover:text-violet-800 flex items-center">
                      Read <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}