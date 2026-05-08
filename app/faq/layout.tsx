import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions About Admissions',
  description: 'Find answers to common questions about Dreamkripa programs, admissions, fees, scholarships, and the application process.',
  openGraph: {
    title: 'FAQ | Dreamkripa - Admissions & Programs Questions',
    description: 'Find answers to common questions about Dreamkripa programs, admissions, fees, scholarships, and the application process.',
  },
  alternates: {
    canonical: 'https://dreamkripa.com/faq',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}