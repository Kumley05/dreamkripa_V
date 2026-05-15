import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Target,
  Lightbulb,
  Award,
  Users,
  BookOpen,
  Heart,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Quote,
} from 'lucide-react';

const milestones = [
  { year: '2010', title: 'Founded', description: 'Started with a vision to guide students' },
  { year: '2015', title: '5,000 Students', description: 'Crossed major milestone' },
  { year: '2018', title: '50+ Partners', description: 'Expanded university network' },
  { year: '2020', title: 'Digital Transformation', description: 'Launched online counseling' },
  { year: '2023', title: '50,000+ Students', description: 'Guided students to success' },
  { year: '2025', title: '200+ Universities', description: 'Pan-India presence' },
];

const values = [
  {
    icon: Heart,
    title: 'Student-First Approach',
    description: 'Every decision we make is centered on what\'s best for the student\'s future and career goals.',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: Target,
    title: 'Integrity & Transparency',
    description: 'Honest guidance with complete transparency about programs, fees, and career prospects.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Lightbulb,
    title: 'Innovation in Counseling',
    description: 'Modern, data-driven approach to match students with the most suitable programs.',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    icon: Users,
    title: 'Accessibility for All',
    description: 'Quality education guidance accessible to students from all backgrounds and regions.',
    color: 'bg-green-100 text-green-600',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    program: 'B.Tech Computer Science',
    university: 'IIT Delhi',
    image: 'PS',
    quote: 'Dreamkripa helped me discover my passion for Computer Science. Their counselors understood my strengths and guided me to the right program. Today, I\'m pursuing my dream at IIT!',
    year: 'Batch of 2023',
  },
  {
    name: 'Rahul Verma',
    program: 'MBA',
    university: 'IIM Ahmedabad',
    image: 'RV',
    quote: 'From a small town in UP to IIM Ahmedabad - this journey wouldn\'t have been possible without the expert guidance and continuous support from the team. They believed in me when I didn\'t.',
    year: 'Batch of 2022',
  },
  {
    name: 'Sneha Patel',
    program: 'MBBS',
    university: 'AIIMS Delhi',
    image: 'SP',
    quote: 'The medical admission process can be overwhelming. Their structured approach, NEET preparation guidance, and counseling support made all the difference. Forever grateful!',
    year: 'Batch of 2024',
  },
  {
    name: 'Arjun Kumar',
    program: 'BBA',
    university: 'NMIMS Mumbai',
    image: 'AK',
    quote: 'Coming from a business family, I was confused between B.Com and BBA. Their career assessment helped me choose BBA at NMIMS, and I couldn\'t be happier!',
    year: 'Batch of 2023',
  },
];

const differentiators = [
  {
    title: 'Deep Understanding of Indian Education',
    description: '15+ years of experience navigating JEE, NEET, CAT, and state-level entrance processes.',
    icon: '🎯',
  },
  {
    title: 'Personalized Career Assessment',
    description: 'Scientific aptitude tests and one-on-one counseling to identify your true potential.',
    icon: '🧠',
  },
  {
    title: 'Extensive Network',
    description: 'Relationships with 200+ universities across India for direct admissions and scholarships.',
    icon: '🤝',
  },
  {
    title: 'End-to-End Support',
    description: 'From career counseling to admission, documentation, and hostel assistance.',
    icon: '📋',
  },
  {
    title: 'Scholarship Guidance',
    description: 'Help students secure financial aid and scholarships worth crores annually.',
    icon: '💰',
  },
  {
    title: 'Regional Language Support',
    description: 'Counselors fluent in Hindi, Tamil, Telugu, Bengali, and more regional languages.',
    icon: '🗣️',
  },
];

const teamStats = [
  { label: 'Expert Counselors', value: '50+' },
  { label: 'Years of Experience', value: '15+' },
  { label: 'Cities Covered', value: '100+' },
  { label: 'Students Guided', value: '50,000+' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <GraduationCap className="h-4 w-4 text-yellow-300 mr-2" />
                <span className="text-sm font-medium">Since 2010</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Transforming Dreams Into
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                  Academic Success
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                For over 15 years, Dreamkripa has been the trusted partner for
                Indian students navigating their higher education journey. We've helped
                <span className="font-semibold text-white"> 50,000+ students </span>
                discover their true potential and achieve their academic dreams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/apply"
                  className="inline-flex items-center justify-center bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-yellow-300 transition-all shadow-lg"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                >
                  Talk to Counselor
                </a>
              </div>
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

        {/* Our Mission */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                To democratize access to quality higher education guidance for every student in India,
                regardless of their background or location. We believe that with the right guidance,
                every student can achieve their academic and career aspirations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Guidance</h3>
                <p className="text-gray-600">
                  Professional counselors with decades of combined experience in Indian education system
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Right Fit</h3>
                <p className="text-gray-600">
                  Scientific assessment to match students with programs aligned with their aptitude and goals
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Results</h3>
                <p className="text-gray-600">
                  95% success rate with students placed in top universities across India
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story - Timeline */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From a small counseling center to India's trusted education partner
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col md:flex-row items-center ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    <div className="flex-1 w-full md:w-1/2 md:px-8">
                      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-blue-600 font-bold text-lg mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="hidden md:flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full z-10 text-white font-bold">
                      {index + 1}
                    </div>

                    <div className="flex-1 hidden md:block"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Students Choose Us</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                What sets us apart in the crowded education counseling landscape
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {differentiators.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${value.color}`}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Stats */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {teamStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hear from students who transformed their futures with our guidance
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-8 relative">
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-200" />
                  <div className="flex items-start mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.image}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-blue-600">{testimonial.program}</p>
                      <p className="text-sm text-gray-500">{testimonial.university}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <div className="text-sm text-gray-500">{testimonial.year}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Expertise */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Expertise You Can Trust
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Our team comprises former admissions officers, experienced educationists,
                  and industry experts who understand the nuances of the Indian education landscape.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">IIT & NIT Experts</h4>
                      <p className="text-gray-600">Specialized counselors for engineering admissions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Medical Education Specialists</h4>
                      <p className="text-gray-600">NEET counseling and MBBS/BDS admission experts</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Management Gurus</h4>
                      <p className="text-gray-600">CAT, XAT, and MBA admission guidance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">State Entrance Experts</h4>
                      <p className="text-gray-600">Knowledge of all state-level admission processes</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Expert Guidance</h3>
                <p className="text-gray-600 mb-6">
                  Schedule a free counseling session with our experts to discuss your academic goals.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>+91 96065 80847</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>admissions@dreamkripa.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>Pan-India Presence</span>
                  </div>
                </div>

                <a
                  href="/apply"
                  className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Book Free Session
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Academic Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of students who have transformed their futures with our guidance.
              Your dream university is just a conversation away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/apply"
                className="inline-flex items-center justify-center bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-yellow-300 transition-all shadow-lg"
              >
                Apply Now - Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
