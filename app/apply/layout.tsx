import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply Now - Free Application for College Admission',
  description:
    "Start your free application with Dreamkripa today. Expert counselors will guide you to the right college and program. No registration fees, fast response.",
  openGraph: {
    title: 'Apply Now | Dreamkripa - Free College Application',
    description:
      "Start your free application with Dreamkripa today. Expert counselors will guide you to the right college and program. No registration fees, fast response.",
  },
  alternates: {
    canonical: 'https://www.dreamkripa.com/apply',
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}