import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Education Tips, Admission Guides & Student Stories',
  description: 'Read the latest articles on higher education, career guidance, college admissions, entrance exams, and student success stories from Dreamkripa.',
  openGraph: {
    title: 'Dreamkripa Blog | Education Tips & Admission Guides',
    description: 'Expert articles on higher education, career guidance, college admissions, and entrance exams in India.',
  },
  alternates: {
    canonical: 'https://dreamkripa.com/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}