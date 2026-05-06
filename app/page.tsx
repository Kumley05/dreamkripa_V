import Link from 'next/link';
import { ArrowRight, CheckCircle2, GraduationCap, Users, Trophy, BookOpen, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const stats = [
  { label: 'Students Guided', value: '50,000+', icon: Users },
  { label: 'Partner Universities', value: '200+', icon: GraduationCap },
  { label: 'Success Rate', value: '95%', icon: Trophy },
  { label: 'Programs Offered', value: '500+', icon: BookOpen },
];

const benefits = [
  {
    title: 'Expert Career Counseling',
    description: 'Get personalized guidance from experienced counselors who understand your aspirations and help you choose the right path.',
    icon: Sparkles,
  },
  {
    title: 'Wide Range of Programs',
    description: 'Explore 500+ programs across Engineering, Medical, Business, Arts, and more from top universities in India.',
    icon: BookOpen,
  },
  {
    title: 'Application Support',
    description: 'End-to-end assistance from application preparation to document verification and submission.',
    icon: CheckCircle2,
  },
  {
    title: 'Scholarship Assistance',
    description: 'Get information about scholarships and financial aid options to make your education affordable.',
    icon: Trophy,
  },
];

const featuredPrograms = [
  {
    title: 'B.Tech Computer Science',
    level: 'Undergraduate',
    duration: '4 Years',
    category: 'Engineering',
    slug: 'btech-cse',
  },
  {
    title: 'MBA',
    level: 'Postgraduate',
    duration: '2 Years',
    category: 'Business',
    slug: 'mba',
  },
  {
    title: 'MBBS',
    level: 'Undergraduate',
    duration: '5.5 Years',
    category: 'Medical',
    slug: 'mbbs',
  },
  {
    title: 'BCA',
    level: 'Undergraduate',
    duration: '3 Years',
    category: 'Computer Applications',
    slug: 'bca',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
                <span className="text-sm text-blue-100 font-medium">Your Dream Education Awaits</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Shape Your Future with
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                  Higher Education
                </span>
              </h1>

              <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Discover your dream program from India's top universities. Expert guidance,
                500+ programs, and a proven track record of helping students achieve their
                academic goals since 2010.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/apply"
                  className="w-full sm:w-auto bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Apply Now - It's Free
                  <ArrowRight className="inline ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/programs"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
                >
                  Explore Programs
                </Link>
              </div>

              <p className="mt-6 text-sm text-blue-200">
                ✓ No Registration Fees ✓ 100% Free Counseling ✓ Fast Response
              </p>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="block w-full h-16 md:h-24 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <stat.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Dreamkripa?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're committed to helping you achieve your academic dreams with personalized support and expert guidance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-600 transition-colors">
                    <benefit.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Programs */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Programs
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our most popular programs chosen by thousands of successful students.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPrograms.map((program) => (
                <div
                  key={program.slug}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-sm font-medium text-blue-600 mb-2">{program.category}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{program.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{program.level}</span>
                    <span>{program.duration}</span>
                  </div>
                  <Link
                    href={`/apply?program=${program.slug}`}
                    className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
                  >
                    Apply Now <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/programs"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Get free expert guidance and find the perfect program for your career goals.
            </p>
            <Link
              href="/apply"
              className="inline-flex items-center bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
