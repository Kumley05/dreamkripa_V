import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dreamkripa - Your Gateway to Elite Colleges",
    template: "%s | Dreamkripa"
  },
  description: "Discover your dream higher education program in India. Explore undergraduate, postgraduate, and professional courses across Engineering, Business, Medical, Arts, and more. Get personalized guidance for your academic journey.",
  keywords: ["higher education India", "admission guidance", "career counseling", "university programs", "professional courses", "B.Tech", "MBA", "MBBS", "education consultant India", "Dreamkripa"],
  authors: [{ name: "Dreamkripa" }],
  creator: "Dreamkripa",
  publisher: "Dreamkripa",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Dreamkripa",
    title: "Dreamkripa - Your Gateway to Elite Colleges",
    description: "Discover your dream higher education program in India. Get personalized guidance for your academic journey.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dreamkripa - Your Gateway to Elite Colleges"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dreamkripa - Your Gateway to Elite Colleges",
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
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#A84296" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Dreamkripa",
              "description": "Your Gateway to Elite Colleges. Leading education consultancy helping students find their dream higher education programs in India",
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