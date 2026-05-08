import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programs - Explore 500+ Courses in Top Indian Universities',
  description:
    "Explore 500+ undergraduate and postgraduate programs in Engineering, Medical, Business & more. Free admission counseling from Dreamkripa's expert team.",
  openGraph: {
    title: 'Explore Programs | Dreamkripa - 500+ Courses',
    description:
      "Explore 500+ undergraduate and postgraduate programs in Engineering, Medical, Business & more. Free admission counseling from Dreamkripa's expert team.",
  },
  alternates: {
    canonical: 'https://dreamkripa.com/programs',
  },
};

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}