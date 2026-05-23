'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, GraduationCap, Users, Trophy, BookOpen, Sparkles, Quote, ChevronDown } from 'lucide-react';
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

const testimonials = [
  {
    name: 'Priya S.',
    college: 'VIT Vellore',
    program: 'B.Tech CSE',
    initials: 'PS',
    quote: 'Dreamkripa handled everything from application to admission. I got into my dream college stress-free.',
    color: 'bg-blue-600',
  },
  {
    name: 'Rahul M.',
    college: 'Amity University',
    program: 'MBA',
    initials: 'RM',
    quote: 'The counselors knew exactly which colleges matched my profile. Highly recommend!',
    color: 'bg-indigo-600',
  },
  {
    name: 'Anjali K.',
    college: 'Manipal University',
    program: 'MBBS',
    initials: 'AK',
    quote: 'Got MBBS admission with scholarship help from Dreamkripa. Life-changing guidance.',
    color: 'bg-purple-600',
  },
  {
    name: 'Arjun T.',
    college: 'SRM Institute',
    program: 'B.Tech ECE',
    initials: 'AT',
    quote: 'Applied to 5 colleges, got into 3. Dreamkripa made the process so simple.',
    color: 'bg-blue-700',
  },
  {
    name: 'Sneha R.',
    college: 'Symbiosis',
    program: 'BCA',
    initials: 'SR',
    quote: 'Fast response, genuine advice, zero fees. Exactly what a student needs.',
    color: 'bg-indigo-700',
  },
  {
    name: 'Karan D.',
    college: 'Christ University',
    program: 'MBA',
    initials: 'KD',
    quote: 'They helped me compare programs and pick the right MBA specialization for my goals.',
    color: 'bg-purple-700',
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

const faqs = [
  {
    question: 'Is Dreamkripa\'s counseling really free?',
    answer: 'Yes, 100%. We charge absolutely no registration or counseling fees. Our goal is to make quality education guidance accessible to every student.',
  },
  {
    question: 'Which universities do you work with?',
    answer: 'We are partnered with 200+ top universities across India including VIT, Amity, Manipal, SRM, Symbiosis, Christ University, and many more.',
  },
  {
    question: 'How long does the admission process take?',
    answer: 'It depends on the program and university, but most admissions are completed within 2–4 weeks with our guidance.',
  },
  {
    question: 'Do you help with scholarship applications?',
    answer: 'Yes! We help students identify and apply for scholarships and financial aid options at our partner universities.',
  },
  {
    question: 'What documents do I need to apply?',
    answer: 'Typically you\'ll need your 10th and 12th mark sheets, ID proof, passport-size photos, and entrance exam scores (if applicable). Our counselors will give you a full checklist.',
  },
  {
    question: 'Can students from any state in India apply?',
    answer: 'Absolutely. We guide students from all states across India.',
  },
  {
    question: 'What is the minimum eligibility for B.Tech?',
    answer: 'Generally, 10+2 with Physics, Chemistry, and Mathematics with at least 45–50% marks. Eligibility varies by university, our counselors will assess your profile.',
  },
  {
    question: 'How do I get started?',
    answer: 'Simply click "Get Counselling" on our website. It\'s free, takes 2 minutes, and a counselor will reach out within 24 hours.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map((faq) => ({
    '@type': 'Question',
    'name': faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer,
    },
  })),
};

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
                  Get Free Counselling
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

        {/* Student Success Stories */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Students Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                50,000+ students guided. Here are a few of their stories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((student) => (
                <div
                  key={student.name}
                  className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow relative"
                >
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-yellow-400/30" />
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`flex-shrink-0 w-14 h-14 ${student.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                      {student.initials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-blue-600 font-medium">{student.program}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    &ldquo;{student.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>{student.college}</span>
                  </div>
                  <div className="mt-3 h-1 w-10 bg-yellow-400 rounded-full" />
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
                    Book Seat <ArrowRight className="ml-1 h-4 w-4" />
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

        {/* Featured College - IIBS */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-100">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    Featured College
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    International Institute of Business Studies (IIBS), Bangalore
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    NAAC A-Grade, AICTE approved, ranked #66 in India. Offering MBA, BBA, BCA, B.Com & BA programs with 90%+ placements and average package of ₹5.5 LPA.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-medium border">MBA</span>
                    <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-medium border">BBA</span>
                    <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-medium border">BCA</span>
                    <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-medium border">B.Com</span>
                    <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-medium border">BA</span>
                  </div>
                  <Link
                    href="/colleges/iibs-bangalore"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View Courses, Fees & Admission Details
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">NAAC A</div>
                    <div className="text-xs text-gray-500">Grade</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-green-600">90%+</div>
                    <div className="text-xs text-gray-500">Placements</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">#66</div>
                    <div className="text-xs text-gray-500">India Rank</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-orange-600">₹13.5L</div>
                    <div className="text-xs text-gray-500">Avg Package</div>
                  </div>
                </div>
              </div>
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

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got questions? We&apos;ve got answers. Here are the things students ask us most.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </section>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`flex-shrink-0 h-5 w-5 text-blue-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {answer}
        </div>
      </div>
    </div>
  );
}
