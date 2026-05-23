import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, GraduationCap, Users, Trophy, Building2, MapPin, Phone, ArrowRight, BookOpen, DollarSign, Briefcase, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'IIBS Bangalore - Admission 2025 | MBA, BBA, B.Com, BCA Courses & Fees',
  description: 'Get direct admission to International Institute of Business Studies (IIBS) Bangalore. Explore MBA, BBA, BCA, B.Com courses with fees, placements, ranking & eligibility. Apply free through Dreamkripa.',
  keywords: [
    'IIBS Bangalore', 'IIBS admission 2025', 'IIBS Bangalore MBA', 'IIBS BBA',
    'International Institute of Business Studies', 'IIBS courses', 'IIBS fees',
    'IIBS placements', 'IIBS ranking', 'IIBS Bangalore admission',
    'MBA admission Bangalore', 'BBA admission Bangalore', 'IIBS Bangalore reviews',
    'IIBS NAAC A grade', 'IIBS Bengaluru', 'IIBS hostel', 'IIBS scholarship',
  ],
  openGraph: {
    title: 'IIBS Bangalore Admission 2025 | MBA, BBA, B.Com, BCA — Apply Free',
    description: 'Get direct admission to IIBS Bangalore — NAAC A-Grade, AICTE approved. Explore courses, fees, placements & ranking. Free counseling from Dreamkripa.',
  },
  alternates: {
    canonical: 'https://www.dreamkripa.com/colleges/iibs-bangalore',
  },
};

const courses = [
  {
    name: 'MBA (Master of Business Administration)',
    duration: '2 Years',
    level: 'Postgraduate',
    specializations: 'Finance, Marketing, HR, Operations, International Business, Business Analytics',
    eligibility: 'Bachelor\'s degree with 50% + valid CAT/MAT/XAT/CMAT score',
    fees: '₹4.5 – ₹6.5 Lakhs (Total)',
    highlight: 'Most Popular',
  },
  {
    name: 'BBA (Bachelor of Business Administration)',
    duration: '3 Years',
    level: 'Undergraduate',
    specializations: 'General, Finance, Marketing, International Business',
    eligibility: '10+2 with 50% marks from any stream',
    fees: '₹1.5 – ₹2.5 Lakhs (Total)',
    highlight: 'Top UG Program',
  },
  {
    name: 'BCA (Bachelor of Computer Applications)',
    duration: '3 Years',
    level: 'Undergraduate',
    specializations: 'General, Data Science, Cloud Computing',
    eligibility: '10+2 with Mathematics from any stream',
    fees: '₹1.5 – ₹2.5 Lakhs (Total)',
    highlight: 'Tech + Business',
  },
  {
    name: 'B.Com (Bachelor of Commerce)',
    duration: '3 Years',
    level: 'Undergraduate',
    specializations: 'General, Accounting & Finance, Taxation',
    eligibility: '10+2 with Commerce or equivalent',
    fees: '₹1.2 – ₹2.0 Lakhs (Total)',
    highlight: 'Commerce Strong',
  },
  {
    name: 'BA (Bachelor of Arts)',
    duration: '3 Years',
    level: 'Undergraduate',
    specializations: 'General, Psychology, English',
    eligibility: '10+2 from any stream',
    fees: '₹1.0 – ₹1.8 Lakhs (Total)',
    highlight: 'Foundation Degree',
  },
];

const highlights = [
  { icon: Building2, label: 'NAAC A-Grade Accredited', desc: 'Recognized for academic excellence' },
  { icon: GraduationCap, label: 'AICTE Approved', desc: 'All programs nationally recognized' },
  { icon: Trophy, label: 'Ranked #66 in India (TOI 2025)', desc: 'Top 20 in Bangalore for Management' },
  { icon: Users, label: '5000+ Alumni Network', desc: 'Strong industry connections' },
  { icon: Briefcase, label: '90%+ Placement Rate', desc: 'Top recruiters: Deloitte, KPMG, Amazon' },
  { icon: DollarSign, label: 'Avg. Package ₹5.5 LPA', desc: 'Highest package ₹18 LPA' },
];

const iibsSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollegeOrUniversity',
  'name': 'International Institute of Business Studies (IIBS Bangalore)',
  'alternateName': ['IIBS', 'IIBS Bangalore', 'IIBS Bengaluru', 'International Institute of Business Studies'],
  'description': 'IIBS Bangalore is a NAAC A-Grade, AICTE approved business school affiliated with Bengaluru City University, offering MBA, BBA, BCA, B.Com, and BA programs.',
  'url': 'https://www.dreamkripa.com/colleges/iibs-bangalore',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Bangalore',
    'addressRegion': 'Karnataka',
    'addressCountry': 'IN',
  },
  'telephone': '+91-96065-80847',
  'foundingDate': '2009',
  'numberOfStudents': {
    '@type': 'QuantitativeValue',
    'value': 3000,
  },
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.2',
    'reviewCount': '850',
    'bestRating': '5',
  },
  'makesOffer': courses.map((course) => ({
    '@type': 'EducationalOccupationalProgram',
    'name': course.name,
    'programType': course.level,
    'timeToComplete': `P${course.duration === '2 Years' ? '2Y' : '3Y'}`,
    'offers': {
      '@type': 'Offer',
      'priceSpecification': {
        '@type': 'PriceSpecification',
        'priceCurrency': 'INR',
      },
    },
  })),
};

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': 'IIBS Bangalore Courses',
  'itemListElement': courses.map((course, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'item': {
      '@type': 'Course',
      'name': course.name,
      'description': `${course.level} program at IIBS Bangalore. Duration: ${course.duration}. Specializations: ${course.specializations}. Eligibility: ${course.eligibility}.`,
      'provider': {
        '@type': 'CollegeOrUniversity',
        'name': 'International Institute of Business Studies',
      },
    },
  })),
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'What is the admission process for IIBS Bangalore?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Admission to IIBS Bangalore requires filling out the application form, submitting academic documents, and appearing for a personal interview. For MBA, a valid CAT/MAT/XAT/CMAT score is needed. Dreamkripa provides free counseling and helps with the entire process.',
      },
    },
    {
      '@type': 'Question',
      'name': 'What are the fees for IIBS Bangalore MBA program?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'The total fees for the MBA program at IIBS Bangalore range from ₹4.5 to ₹6.5 Lakhs for the full 2-year program. Scholarships are available for meritorious students. Contact Dreamkripa for fee structure details and scholarship guidance.',
      },
    },
    {
      '@type': 'Question',
      'name': 'Is IIBS Bangalore a good college for MBA?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes. IIBS Bangalore is NAAC A-Grade accredited, AICTE approved, and ranked #66 in India by Times of India Ranking 2025. It has a 90%+ placement rate with an average package of ₹5.5 LPA and top recruiters including Deloitte, KPMG, and Amazon.',
      },
    },
    {
      '@type': 'Question',
      'name': 'What courses are offered at IIBS Bangalore?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'IIBS Bangalore offers MBA, BBA, BCA, B.Com, and BA programs at undergraduate and postgraduate levels. The institute is affiliated with Bengaluru City University (formerly Bangalore University).',
      },
    },
    {
      '@type': 'Question',
      'name': 'How is the placement at IIBS Bangalore?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'IIBS Bangalore has a strong placement record with 90%+ placement rate. The average package is ₹5.5 LPA and the highest package has reached ₹18 LPA. Top recruiters include Deloitte, KPMG, Amazon, Wipro, Infosys, HDFC Bank, and ICICI Bank.',
      },
    },
    {
      '@type': 'Question',
      'name': 'Does IIBS Bangalore provide hostel facilities?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, IIBS Bangalore provides separate hostel facilities for boys and girls with all modern amenities including Wi-Fi, mess, laundry, and 24/7 security.',
      },
    },
  ],
};

export default function IIBSPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">NAAC A-Grade</span>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">AICTE Approved</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              International Institute of Business Studies (IIBS), Bangalore
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Admission Open 2025 — Get free expert guidance for MBA, BBA, BCA, B.Com & BA admissions at IIBS Bangalore. Ranked #66 in India, NAAC A-Grade, 90%+ placements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors"
              >
                Get Free Counselling
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <a
                href="tel:+919606580847"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call: +91 96065 80847
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {highlights.map((item) => (
              <div key={item.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-3">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{item.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About IIBS */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About IIBS Bangalore</h2>
              <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The <strong>International Institute of Business Studies (IIBS)</strong> is a premier management and business school located in Bangalore, Karnataka. Established in 2009, IIBS has rapidly grown into one of India&apos;s most respected B-Schools, earning <strong>NAAC A-Grade accreditation</strong> and <strong>AICTE approval</strong>.
                </p>
                <p>
                  Affiliated with <strong>Bengaluru City University</strong> (formerly Bangalore University), IIBS offers a future-ready curriculum designed to meet global standards. The institute focuses on academic excellence, industry-integrated programs, and holistic student development.
                </p>
                <p>
                  With a sprawling campus in Bangalore&apos;s tech corridor, IIBS provides state-of-the-art infrastructure including smart classrooms, a well-stocked library, computer labs, seminar halls, and dedicated placement cells. The institute has been ranked <strong>#66 in India</strong> and <strong>#18 in Bangalore</strong> by the Times of India Ranking 2025.
                </p>
                <p>
                  IIBS Bangalore has academic and industry associations with <strong>AIMA, AIMS, CII, and ASSOCHAM</strong>, ensuring students get exposure to real-world business practices and networking opportunities throughout their academic journey.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 border">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Quick Facts
              </h3>
              <div className="space-y-4">
                {[
                  ['Full Name', 'International Institute of Business Studies'],
                  ['Location', 'Bangalore, Karnataka'],
                  ['Established', '2009'],
                  ['Affiliation', 'Bengaluru City University'],
                  ['Approvals', 'AICTE, UGC, AIU'],
                  ['Accreditation', 'NAAC A-Grade, AACSB, NBA'],
                  ['Ranking', '#66 India, #18 Bangalore (TOI 2025)'],
                  ['Courses', 'MBA, BBA, BCA, B.Com, BA'],
                  ['Campus', 'Modern campus with hostel facilities'],
                  ['Top Recruiters', 'Deloitte, KPMG, Amazon, Wipro'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="font-medium text-gray-900 text-sm text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Courses Offered at IIBS Bangalore
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore all UG and PG programs at IIBS. Apply free through Dreamkripa for expert admission guidance.
            </p>
          </div>

          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.name} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                        {course.highlight}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                        <p className="font-semibold text-gray-900">{course.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Level</p>
                        <p className="font-semibold text-gray-900">{course.level}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Fees (Approx.)</p>
                        <p className="font-semibold text-green-700">{course.fees}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Eligibility</p>
                        <p className="font-semibold text-gray-900 text-sm">{course.eligibility}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Specializations</p>
                      <p className="text-sm text-gray-700">{course.specializations}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      href="/apply"
                      className="inline-flex items-center bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                    >
                      Book Seat
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placements */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Placements at IIBS Bangalore</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Strong industry connections ensure excellent career outcomes for IIBS graduates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
              <div className="text-4xl font-bold text-blue-600 mb-2">₹5.5 LPA</div>
              <p className="text-gray-600">Average Package</p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
              <div className="text-4xl font-bold text-green-600 mb-2">₹18 LPA</div>
              <p className="text-gray-600">Highest Package</p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
              <div className="text-4xl font-bold text-purple-600 mb-2">90%+</div>
              <p className="text-gray-600">Placement Rate</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 border">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top Recruiters</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {['Deloitte', 'KPMG', 'Amazon', 'Wipro', 'Infosys', 'HDFC Bank', 'ICICI Bank', 'TCS', 'Byju\'s', 'EY', 'PwC', 'Reliance'].map((company) => (
                <div key={company} className="bg-gray-50 rounded-lg p-3 text-center text-sm font-medium text-gray-700">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Get Admission in IIBS Bangalore
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps. Dreamkripa guides you at every stage — completely free.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Apply Free', desc: 'Fill out the Dreamkripa application form. Select IIBS Bangalore as your preferred college.' },
              { step: '2', title: 'Counseling', desc: 'Our expert counselor will assess your profile and confirm your eligibility for IIBS.' },
              { step: '3', title: 'Documents', desc: 'Submit mark sheets, ID proof, photos, and entrance scores. We handle verification.' },
              { step: '4', title: 'Admission Confirmed', desc: 'Get your admission letter and join IIBS Bangalore. Scholarship guidance included.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/apply"
              className="inline-flex items-center bg-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Start Your IIBS Application — Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">IIBS Bangalore — Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'What is the admission process for IIBS Bangalore?', a: 'Admission to IIBS Bangalore requires filling out the application form, submitting academic documents, and appearing for a personal interview. For MBA, a valid CAT/MAT/XAT/CMAT score is needed. Dreamkripa provides free counseling and helps with the entire process.' },
              { q: 'What are the fees for IIBS Bangalore MBA program?', a: 'The total fees for the MBA program at IIBS Bangalore range from ₹4.5 to ₹6.5 Lakhs for the full 2-year program. Scholarships are available for meritorious students. Contact Dreamkripa for fee structure details and scholarship guidance.' },
              { q: 'Is IIBS Bangalore a good college for MBA?', a: 'Yes. IIBS Bangalore is NAAC A-Grade accredited, AICTE approved, and ranked #66 in India by Times of India Ranking 2025. It has a 90%+ placement rate with an average package of ₹5.5 LPA and top recruiters including Deloitte, KPMG, and Amazon.' },
              { q: 'What courses are offered at IIBS Bangalore?', a: 'IIBS Bangalore offers MBA, BBA, BCA, B.Com, and BA programs at undergraduate and postgraduate levels. The institute is affiliated with Bengaluru City University (formerly Bangalore University).' },
              { q: 'How is the placement at IIBS Bangalore?', a: 'IIBS Bangalore has a strong placement record with 90%+ placement rate. The average package is ₹5.5 LPA and the highest package has reached ₹18 LPA. Top recruiters include Deloitte, KPMG, Amazon, Wipro, Infosys, HDFC Bank, and ICICI Bank.' },
              { q: 'Does IIBS Bangalore provide hostel facilities?', a: 'Yes, IIBS Bangalore provides separate hostel facilities for boys and girls with all modern amenities including Wi-Fi, mess, laundry, and 24/7 security.' },
            ].map((faq) => (
              <details key={faq.q} className="bg-white rounded-xl border p-6 group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-blue-600 text-xl font-bold group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join IIBS Bangalore?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Apply through Dreamkripa for free expert guidance. No fees, no hidden charges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-yellow-400 text-blue-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors"
            >
              Get Free Counselling
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <a
              href="tel:+919606580847"
              className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Us: +91 96065 80847
            </a>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(iibsSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <Footer />
    </div>
  );
}