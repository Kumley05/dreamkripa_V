import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Get Free Education Counseling',
  description: 'Reach out to Dreamkripa for free expert guidance on higher education programs in India. Call, email, or fill out our contact form. We respond within 24 hours.',
  openGraph: {
    title: 'Contact Dreamkripa | Free Education Counseling',
    description: 'Get in touch with our expert counselors for free guidance on admissions, programs, and career planning.',
  },
  alternates: {
    canonical: 'https://www.dreamkripa.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}