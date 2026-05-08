import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Thank you for your application. A Dreamkripa counselor will contact you within 24 hours.',
  robots: 'noindex, follow',
  alternates: {
    canonical: 'https://dreamkripa.com/thank-you',
  },
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              A counselor will contact you within 24 hours.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Our counselor will call you to understand your goals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>You&apos;ll receive personalized program recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Get step-by-step guidance on application and admission</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}