import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Users, TrendingUp, Heart } from 'lucide-react';

export const metadata = {
  title: 'Careers at Dreamkripa',
  description: 'Join the Dreamkripa team and help shape the future of higher education in India. Explore open positions and grow your career with us.',
};

const openings = [
  {
    title: 'Senior Education Counselor',
    department: 'Admissions',
    location: 'Bangalore / Remote',
    type: 'Full-time',
    description: 'Guide students through program selection, admissions process, and career planning. Requires 3+ years in education consulting.',
  },
  {
    title: 'Telecaller — Admissions',
    department: 'Sales',
    location: 'Bangalore / Remote',
    type: 'Full-time',
    description: 'Reach out to prospective students, understand their goals, and help them find the right program. Excellent communication skills required.',
  },
  {
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    description: 'Manage SEO, social media, and paid campaigns to drive student leads. Experience with Google Ads and Meta Ads preferred.',
  },
  {
    title: 'Content Writer — Education',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time / Freelance',
    description: 'Write engaging blogs, program guides, and student success stories. Strong research and writing skills in English required.',
  },
  {
    title: 'Full Stack Developer',
    department: 'Technology',
    location: 'Bangalore / Remote',
    type: 'Full-time',
    description: 'Build and maintain our web platform, CRM, and student portal. React/Next.js + Node.js experience required.',
  },
];

const perks = [
  { icon: TrendingUp, title: 'Growth Opportunities', desc: 'Fast-track your career with mentorship and leadership programs' },
  { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive health insurance and wellness benefits for you and your family' },
  { icon: Clock, title: 'Flexible Working', desc: 'Remote-friendly culture with flexible hours to maintain work-life balance' },
  { icon: Users, title: 'Collaborative Team', desc: 'Work alongside passionate educators, marketers, and technologists' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Team Dreamkripa</h1>
            <p className="text-xl text-violet-100">
              Help millions of Indian students find their dream college. Build a meaningful career in education technology and consulting.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Join Dreamkripa?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk) => (
              <div key={perk.title} className="bg-white rounded-xl p-6 shadow-sm border text-center">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <perk.icon className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{perk.title}</h3>
                <p className="text-sm text-gray-600">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Open Positions</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We are always looking for talented individuals who share our passion for transforming higher education in India.
          </p>

          <div className="space-y-4">
            {openings.map((job) => (
              <div key={job.title} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Briefcase className="h-3.5 w-3.5 mr-1" /> {job.department}
                      </span>
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <MapPin className="h-3.5 w-3.5 mr-1" /> {job.location}
                      </span>
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5 mr-1" /> {job.type}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`mailto:careers@dreamkripa.com?subject=Application for ${job.title}`}
                    className="flex-shrink-0 inline-flex items-center px-5 py-2.5 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors text-sm"
                  >
                    Apply Now <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Don&apos;t See Your Role?</h2>
          <p className="text-gray-600 mb-6">
            We are always open to hearing from passionate people. Send us your resume and we will reach out when there is a fit.
          </p>
          <a
            href="mailto:careers@dreamkripa.com?subject=General Application"
            className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors"
          >
            Send Your Resume <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}