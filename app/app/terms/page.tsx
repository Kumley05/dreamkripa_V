import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using Dreamkripa website and services. By using our site, you agree to these terms.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FileText className="h-10 w-10 mb-4 text-violet-200" />
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-violet-100">Last updated: May 2025</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">

          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-8 text-sm text-violet-800">
            By accessing and using the Dreamkripa website (dreamkripa.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Services Description</h2>
              <p className="mb-3">Dreamkripa provides educational consulting services including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>College and program discovery and recommendation</li>
                <li>Admission guidance and application support</li>
                <li>Career counseling and planning assistance</li>
                <li>Scholarship and financial aid information</li>
                <li>Connecting students with partner colleges and universities</li>
              </ul>
              <p className="mt-3">Dreamkripa acts as a bridge between students and educational institutions. We do not grant admissions directly — final admission decisions are made solely by the respective colleges/universities.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. User Responsibilities</h2>
              <p className="mb-3">By using our services, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, complete, and truthful information in all forms and communications.</li>
                <li>Not impersonate any other person or use false identity.</li>
                <li>Not use the website for any unlawful or unauthorized purpose.</li>
                <li>Not attempt to access restricted areas of our systems or compromise security.</li>
                <li>Respond promptly to communications from our counselors and partner colleges.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Free Service</h2>
              <p>Dreamkripa&apos;s counseling and guidance services are completely free for students. We do not charge any application fees, consultation fees, or hidden charges. Our revenue comes from partner colleges, not students.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. No Guarantee of Admission</h2>
              <p>While we strive to provide the best guidance, Dreamkripa does not guarantee admission to any college or program. Admission decisions are made by the respective educational institutions based on their own criteria, including academic performance, entrance exam scores, and availability of seats.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
              <p>All content on the Dreamkripa website — including text, graphics, logos, images, and software — is the property of Dreamkripa or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. User-Submitted Content</h2>
              <p>By submitting information through our forms, you grant Dreamkripa a non-exclusive, royalty-free license to use this information for the purpose of providing our services, including sharing relevant details with partner colleges for admission processing.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
              <p className="mb-3">The website and services are provided &quot;as is&quot; without warranties of any kind. We do not warrant that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The website will be uninterrupted, error-free, or secure at all times.</li>
                <li>Information about colleges, programs, or fees is 100% accurate at all times (details may change).</li>
                <li>Our recommendations will result in successful admission.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p>Dreamkripa shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services, including but not limited to loss of opportunity, admission decisions, or financial implications. Our total liability shall not exceed the amount paid by you to Dreamkripa (which is zero, as our service is free).</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Third-Party Links</h2>
              <p>Our website may contain links to third-party websites (colleges, payment gateways, etc.). We are not responsible for the content, privacy practices, or terms of these external sites. Accessing third-party links is at your own risk.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Termination</h2>
              <p>We reserve the right to restrict or terminate access to our services for any user who violates these terms, engages in fraudulent activity, or misuses our platform. You may stop using our services at any time by contacting us to delete your account.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Governing Law</h2>
              <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">12. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of our services after changes constitutes acceptance of the revised terms.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">13. Contact</h2>
              <p>For questions about these Terms of Service, please contact us:</p>
              <ul className="list-none mt-3 space-y-1">
                <li>📧 Email: <a href="mailto:legal@dreamkripa.com" className="text-violet-600 hover:underline">legal@dreamkripa.com</a></li>
                <li>📞 Phone: +91 98765 43210</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}