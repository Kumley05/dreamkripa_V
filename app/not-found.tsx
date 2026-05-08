import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let us help you find what you need.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Homepage
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" />
              Browse Programs
            </Link>
          </div>

          <div className="mt-12 bg-blue-50 rounded-xl p-6">
            <p className="text-gray-700 mb-4">
              Looking to apply? Start your free application today.
            </p>
            <Link
              href="/apply"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
            >
              Apply Now — It&apos;s Free
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}