import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Support - Get Help With Your Admission',
  description: 'Get help with your college admissions, application status, program queries, and more. Dreamkripa student support is available Mon-Sat.',
  openGraph: {
    title: 'Student Support | Dreamkripa',
    description: 'Get help with your college admissions, application status, program queries, and more.',
  },
  alternates: {
    canonical: 'https://dreamkripa.com/support',
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}