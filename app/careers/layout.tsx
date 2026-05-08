import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers - Join the Dreamkripa Team',
  description: 'Join the Dreamkripa team and help shape the future of higher education in India. Explore open positions and grow your career with us.',
  openGraph: {
    title: 'Careers at Dreamkripa | Help Shape India\'s Education',
    description: 'Explore open positions at Dreamkripa. Grow your career in education consulting.',
  },
  alternates: {
    canonical: 'https://www.dreamkripa.com/careers',
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}