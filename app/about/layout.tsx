import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Your Trusted Education Partner Since 2010',
  description: 'Learn about Dreamkripa\'s 15+ year journey helping 50,000+ Indian students achieve their academic dreams. Expert counselors, proven results, and personalized guidance for higher education success.',
  keywords: ['education consultancy India', 'career counseling', 'admission guidance', 'higher education consultant', 'IIT counseling', 'NEET guidance', 'MBA admission', 'study in India', 'education partner'],
  openGraph: {
    title: 'About Dreamkripa | 15+ Years of Excellence',
    description: 'Trusted by 50,000+ students across India. Expert education counseling with a 95% success rate in university admissions.',
    url: 'https://dreamkripa.com/about',
    type: 'website',
  },
  alternates: {
    canonical: 'https://dreamkripa.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
