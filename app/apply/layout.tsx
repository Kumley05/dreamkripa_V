import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Free Counselling - Book Your Seat for College Admission',
  description:
    "Book your seat or get free counselling with Dreamkripa today. Expert counselors will guide you to the right college and program. No registration fees, fast response.",
  openGraph: {
    title: 'Get Free Counselling | Dreamkripa - Book Your Seat',
    description:
      "Book your seat or get free counselling with Dreamkripa today. Expert counselors will guide you to the right college and program. No registration fees, fast response.",
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