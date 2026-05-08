import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using Dreamkripa website and services. By using our site, you agree to these terms.',
  alternates: {
    canonical: 'https://www.dreamkripa.com/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}