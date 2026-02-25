import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sample Nav Business - Shape Your Future with Higher Education",
    template: "%s | Sample Nav Business"
  },
  description: "Discover your dream higher education program in India. Explore undergraduate, postgraduate, and professional courses across Engineering, Business, Medical, Arts, and more. Get personalized guidance for your academic journey.",
  keywords: ["higher education India", "admission guidance", "career counseling", "university programs", "professional courses", "B.Tech", "MBA", "MBBS", "education consultant India"],
  authors: [{ name: "Sample Nav Business" }],
  creator: "Sample Nav Business",
  publisher: "Sample Nav Business",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ds521u300p80.drytis.ai",
    siteName: "Sample Nav Business",
    title: "Sample Nav Business - Shape Your Future with Higher Education",
    description: "Discover your dream higher education program in India. Get personalized guidance for your academic journey.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sample Nav Business"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sample Nav Business - Shape Your Future with Higher Education",
    description: "Discover your dream higher education program in India. Get personalized guidance for your academic journey.",
    images: ["/og-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Sample Nav Business",
              "description": "Leading education consultancy helping students find their dream higher education programs in India",
              "url": "https://ds521u300p80.drytis.ai",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "admissions",
                "availableLanguage": "English"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
