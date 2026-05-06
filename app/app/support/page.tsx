import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Phone, Mail, MessageSquare, Clock, Headphones, BookOpen, HelpCircle, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Student Support',
  description: 'Get help with your college admissions, application status, program queries, and more. Dreamkripa student support is available Mon-Sat.',
};

const supportChannels = [
  { icon: Phone, title: 'Call Us', desc: 'Speak directly with a counselor', value: '+91 96065 80847', action: 'tel:+919606580847', color: 'bg-green-100 text-green-600' },
  { icon: Mail, title: 'Email Support', desc: 'Send us a detailed query', value: 'support@dreamkripa.com', action: 'mailto:support@dreamkripa.com', color: 'bg-blue-100 text-blue-600' },
  { icon: MessageSquare, title: 'Live Chat', desc: 'Chat with us in real-time', value: 'Available 9 AM - 6 PM', action: '#', color: 'bg-violet-100 text-violet-600' },
  { icon: Clock, title: 'Working Hours', desc: 'Mon - Sat, 9:00 AM - 6:00 PM IST', value: 'Closed Sundays & Holidays', action: '#', color: 'bg-orange-100 text-orange-600' },
];

const commonIssues = [
  { title: 'Application Status', desc: 'Check the status of your submitted application' },
  { title: 'Program Information', desc: 'Get details about specific programs, fees, and eligibility' },
  { title: 'Document Upload Issues', desc: 'Facing trouble uploading documents? We can help' },
  { title: 'Fee Payment Help', desc: 'Payment failed or need refund information' },
  { title: 'Change Program Preference', desc: 'Want to change your selected program or specialization' },
  { title: 'Scholarship Queries', desc: 'Learn about available scholarships and eligibility criteria' },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Headphones className="h-12 w-12 mx-auto mb-4 text-violet-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Support</h1>
          <p className="text-xl text-violet-100 max-w-2xl mx-auto">
            We are here to help you at every step of your academic journey. Reach out through any channel below.
          </p>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((ch) => (
              <a key={ch.title} href={ch.action} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow text-center">
                <div className={`w-14 h-14 ${ch.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <ch.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{ch.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{ch.desc}</p>
                <p className="text-sm font-medium text-gray-900">{ch.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">How Can We Help?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Select a topic below or contact us directly. Our counselors typically respond within 2 hours during working hours.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {commonIssues.map((issue) => (
              <Link
                key={issue.title}
                href="/contact"
                className="bg-white rounded-xl border p-5 hover:shadow-md hover:border-violet-300 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">{issue.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{issue.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-violet-600 transition-colors flex-shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Raise a Ticket CTA */}
      <section className="py-16 bg-violet-50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <BookOpen className="h-10 w-10 mx-auto mb-4 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Personalized Help?</h2>
          <p className="text-gray-600 mb-6">
            Fill out the contact form with your query and our dedicated support team will get back to you within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors"
          >
            Contact Support <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}