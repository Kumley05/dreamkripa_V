import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

// Metadata moved to app/privacy/layout.tsx

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Shield className="h-10 w-10 mb-4 text-violet-200" />
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-violet-100">Last updated: May 2025</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="mb-3">When you use Dreamkripa&apos;s website or services, we may collect the following information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, city, state, and education level that you provide through our application forms.</li>
                <li><strong>Program Preferences:</strong> Your selected field of interest, program choices, and preferred intake year.</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on site, browser type, device information, and IP address collected automatically through cookies and analytics.</li>
                <li><strong>Communication Data:</strong> Records of emails, phone calls, and chat messages between you and our counselors.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide personalized college and program recommendations based on your profile.</li>
                <li>To connect you with our counselors for admission guidance and support.</li>
                <li>To send you relevant updates about programs, admission deadlines, and scholarship opportunities.</li>
                <li>To improve our website, services, and user experience through analytics.</li>
                <li>To comply with legal obligations and prevent fraudulent activities.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
              <p className="mb-3">We respect your privacy and do not sell your personal information. We may share your data with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Partner Colleges:</strong> Your application details are shared with colleges you express interest in, solely for the purpose of processing your admission inquiry.</li>
                <li><strong>Service Providers:</strong> Trusted third-party services that help us operate our platform (email providers, analytics tools, hosting services) under strict confidentiality agreements.</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
              <p>We implement industry-standard security measures including encrypted data transmission (SSL/TLS), secure password storage (bcrypt hashing), access-controlled databases, and regular security audits to protect your information from unauthorized access, alteration, or disclosure.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies</h2>
              <p>We use cookies and similar tracking technologies to analyze website traffic, remember your preferences, and improve your browsing experience. You can control cookie settings through your browser preferences. Disabling cookies may affect certain website features.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal information we hold about you.</li>
                <li>Request correction of inaccurate information.</li>
                <li>Request deletion of your data (subject to legal retention requirements).</li>
                <li>Opt out of marketing communications at any time by clicking &quot;Unsubscribe&quot; or contacting us.</li>
                <li>Withdraw consent for data processing where applicable.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. You can request deletion of your data at any time by contacting us.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
              <p>Our services are intended for students who are at least in the 10th standard (typically 15+ years). We do not knowingly collect information from children under 13. If we learn that we have collected data from a child under 13, we will delete it promptly.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
              <p>We may update this privacy policy periodically. Any changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this page regularly.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
              <p>If you have any questions or concerns about this privacy policy or your data, please contact us:</p>
              <ul className="list-none mt-3 space-y-1">
                <li>📧 Email: <a href="mailto:privacy@dreamkripa.com" className="text-violet-600 hover:underline">privacy@dreamkripa.com</a></li>
                <li>📞 Phone: +91 96065 80847</li>
                <li>🕐 Response time: Within 48 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}