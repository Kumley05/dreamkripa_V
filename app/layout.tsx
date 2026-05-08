import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#A84296",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dreamkripa.com"),
  title: {
    default: "Dreamkripa - Your Gateway to Elite Colleges",
    template: "%s | Dreamkripa"
  },
  description: "Get free expert guidance for B.Tech, MBA, MBBS & 500+ programs from India's top universities. 50,000+ students guided since 2010. Apply now, it's free.",
  keywords: ["higher education India", "admission guidance", "career counseling", "university programs", "professional courses", "B.Tech", "MBA", "MBBS", "education consultant India", "Dreamkripa", "IIBS Bangalore", "IIBS admission", "International Institute of Business Studies", "MBA admission Bangalore", "BBA admission India", "college admission guidance"],
  authors: [{ name: "Dreamkripa" }],
  creator: "Dreamkripa",
  publisher: "Dreamkripa",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Dreamkripa",
    title: "Dreamkripa - Your Gateway to Elite Colleges",
    description: "Get free expert guidance for B.Tech, MBA, MBBS & 500+ programs from India's top universities. 50,000+ students guided since 2010. Apply now, it's free.",
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
    description: "Get free expert guidance for B.Tech, MBA, MBBS & 500+ programs from India's top universities. 50,000+ students guided since 2010. Apply now, it's free.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_MEASUREMENT_ID = "G-Q8PQHH99ME";

  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
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
              "url": "https://dreamkripa.com",
              "logo": "https://dreamkripa.com/logo.png",
              "image": "https://dreamkripa.com/og-image.jpg",
              "telephone": "+91-96065-80847",
              "email": "admissions@dreamkripa.com",
              "foundingDate": "2010",
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "minValue": 50,
                "maxValue": 200
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "admissions",
                "telephone": "+91-96065-80847",
                "email": "admissions@dreamkripa.com",
                "availableLanguage": ["English", "Hindi"],
                "areaServed": {
                  "@type": "Country",
                  "name": "India"
                }
              },
              "sameAs": [
                "https://www.facebook.com/dreamkripa",
                "https://twitter.com/dreamkripa",
                "https://www.linkedin.com/company/dreamkripa",
                "https://www.youtube.com/@dreamkripa"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Dreamkripa",
              "url": "https://dreamkripa.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://dreamkripa.com/programs?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  );
}