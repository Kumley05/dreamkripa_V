import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown, ChevronUp, GraduationCap, HelpCircle } from 'lucide-react';
import { FAQItem } from './FAQItem';

// Metadata moved to app/faq/layout.tsx

const faqCategories = [
  {
    category: 'Admissions & Application',
    icon: '📋',
    questions: [
      {
        q: 'How do I apply for a program through Dreamkripa?',
        a: 'Simply fill out the application form on our website. Select your education level, field of interest, and preferred program. Our counselor will contact you within 24 hours to guide you through the next steps.',
      },
      {
        q: 'Is there any application fee?',
        a: 'No, applying through Dreamkripa is completely free. We do not charge any application or consultation fees. Our counseling services are complimentary for all students.',
      },
      {
        q: 'What documents do I need to apply?',
        a: 'For the initial inquiry, you only need your basic details (name, email, phone). During the admission process, you will need: 10th/12th mark sheets, ID proof (Aadhaar/PAN), passport-size photos, and any entrance exam scorecards.',
      },
      {
        q: 'Can I apply for multiple programs?',
        a: 'Yes, you can express interest in multiple programs. Our counselor will help you understand the options and guide you toward the best fit based on your profile and goals.',
      },
    ],
  },
  {
    category: 'Programs & Courses',
    icon: '🎓',
    questions: [
      {
        q: 'What programs are available through Dreamkripa?',
        a: 'We offer guidance for programs across Engineering (B.Tech, M.Tech), Business (BBA, MBA), Medical (MBBS, BDS, Nursing), Science (B.Sc, M.Sc), Arts (BA), Commerce (B.Com), Computer Applications (BCA, MCA), Law (LL.B, BA LL.B), and Education (B.Ed, M.Ed).',
      },
      {
        q: 'Are the colleges affiliated and recognized?',
        a: 'Yes, we only recommend colleges that are recognized by UGC, AICTE, or relevant regulatory bodies. We verify affiliations, NAAC ratings, and placement records before recommending any institution.',
      },
      {
        q: 'Can I get admission without an entrance exam?',
        a: 'Many private colleges offer direct admission based on 12th marks. Some programs require entrance exams (JEE for engineering, NEET for medical, CAT/MAT for MBA). Our counselors will guide you based on your specific situation.',
      },
    ],
  },
  {
    category: 'Fees & Scholarships',
    icon: '💰',
    questions: [
      {
        q: 'What are the typical fee ranges?',
        a: 'Fees vary widely: Government colleges range from ₹10,000 - ₹2 Lakhs/year, while private colleges range from ₹1 - 10 Lakhs/year. We help you find options that fit your budget and may negotiate better fee structures.',
      },
      {
        q: 'Are scholarships available?',
        a: 'Yes! Many colleges offer merit-based scholarships (up to 100% tuition waiver). Government scholarships are available for SC/ST/OBC/minority students. We help you identify and apply for all eligible scholarships.',
      },
      {
        q: 'Can I get an education loan?',
        a: 'Absolutely. Education loans are available from all major banks for recognized programs. We can connect you with banks offering the best interest rates and help with the loan application process.',
      },
      {
        q: 'Is there any hidden cost in Dreamkripa\'s service?',
        a: 'No. Dreamkripa does not charge students any fees. Our counseling, guidance, and application support are 100% free. We are compensated by partner colleges, not students.',
      },
    ],
  },
  {
    category: 'Support & Contact',
    icon: '🤝',
    questions: [
      {
        q: 'How can I contact a counselor?',
        a: 'You can reach us by phone (+91 96065 80847), email (support@dreamkripa.com), or fill out the contact form on our website. Our counselors are available Monday to Saturday, 9 AM to 6 PM IST.',
      },
      {
        q: 'How long does it take to get a response?',
        a: 'We typically respond within 2 hours during working hours (Mon-Sat, 9 AM-6 PM). For inquiries submitted after hours, we respond the next business day morning.',
      },
      {
        q: 'Can I visit the Dreamkripa office?',
        a: 'Yes, you can visit us by appointment. Please call or email to schedule a visit. We also offer virtual counseling sessions via video call for students who cannot visit in person.',
      },
      {
        q: 'What if I am not satisfied with the guidance?',
        a: 'Your satisfaction is our priority. If you feel the guidance was not helpful, please contact us at support@dreamkripa.com and we will assign a senior counselor to assist you further.',
      },
    ],
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqCategories.flatMap((section) =>
    section.questions.map((faq) => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a,
      },
    }))
  ),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-violet-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-violet-100 max-w-2xl mx-auto">
            Find quick answers to common questions about admissions, programs, fees, and our services.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqCategories.map((section) => (
              <div key={section.category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  {section.category}
                </h2>
                <div className="bg-white rounded-xl border px-6">
                  {section.questions.map((faq) => (
                    <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <GraduationCap className="h-10 w-10 mx-auto mb-4 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Our counselors are happy to help. Get in touch and we will answer all your queries.
          </p>
          <a href="/contact" className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors">
            Contact Us
          </a>
        </div>
      </section>

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