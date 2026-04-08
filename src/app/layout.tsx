import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = "https://coachluki.com"; // Update when domain is live

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Coach Luki | Personal Trainer & Nutritionist in Berlin",
    template: "%s | Coach Luki",
  },
  description:
    "Personal training and nutrition coaching in Berlin with Coach Luki. In-person sessions at John Reed Bötzow and EVO Spittelmarkt, plus online coaching. Vegan-friendly, bilingual (EN/DE).",
  keywords: [
    "personal trainer berlin",
    "personal training berlin",
    "fitness coach berlin",
    "nutritionist berlin",
    "ernährungsberater berlin",
    "personaltrainer berlin",
    "john reed bötzow trainer",
    "evo spittelmarkt trainer",
    "vegan fitness coach",
    "vegan personal trainer berlin",
    "online fitness coach germany",
    "coach luki",
    "luke satterly",
    "calisthenics berlin",
    "ring training berlin",
    "plant based fitness",
    "körpergewichtstraining berlin",
    "fitness trainer prenzlauer berg",
    "fitness trainer mitte berlin",
  ],
  authors: [{ name: "Luke Satterly", url: siteUrl }],
  creator: "Coach Luki",
  publisher: "Coach Luki",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "de_DE",
    url: siteUrl,
    siteName: "Coach Luki",
    title: "Coach Luki | Personal Trainer & Nutritionist in Berlin",
    description:
      "Train in person at John Reed Bötzow or EVO Spittelmarkt, or work with me online from anywhere. Custom training programs, nutrition coaching, and real results.",
    images: [
      {
        url: "/luke.jpg",
        width: 1200,
        height: 630,
        alt: "Coach Luki - Personal Trainer and Nutritionist in Berlin",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coach Luki | Personal Trainer & Nutritionist in Berlin",
    description:
      "Personal training and nutrition coaching in Berlin. In-person at John Reed Bötzow & EVO Spittelmarkt, plus online coaching worldwide.",
    images: ["/luke.jpg"],
    creator: "@coachluki",
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  category: "fitness",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business`,
      name: "Coach Luki - Personal Training & Nutrition",
      alternateName: "Coach Luki",
      description:
        "Personal training and nutrition coaching in Berlin. In-person sessions at John Reed Bötzow and EVO Spittelmarkt, plus online coaching worldwide.",
      url: siteUrl,
      image: `${siteUrl}/luke.jpg`,
      telephone: "+4915129633927",
      email: "luke.satterly@icloud.com",
      address: [
        {
          "@type": "PostalAddress",
          streetAddress: "Bötzowstraße",
          addressLocality: "Berlin",
          addressRegion: "Berlin",
          postalCode: "10407",
          addressCountry: "DE",
          name: "John Reed Bötzow",
        },
        {
          "@type": "PostalAddress",
          streetAddress: "Spittelmarkt",
          addressLocality: "Berlin",
          addressRegion: "Berlin",
          postalCode: "10117",
          addressCountry: "DE",
          name: "EVO Spittelmarkt",
        },
      ],
      geo: {
        "@type": "GeoCoordinates",
        latitude: 52.5328,
        longitude: 13.4253,
      },
      areaServed: [
        {
          "@type": "City",
          name: "Berlin",
        },
        {
          "@type": "Country",
          name: "Germany",
        },
      ],
      serviceType: [
        "Personal Training",
        "Nutrition Coaching",
        "Online Fitness Coaching",
        "Calisthenics Training",
      ],
      priceRange: "€€",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "07:00",
        closes: "21:00",
      },
      sameAs: [
        "https://www.instagram.com/coachluki/",
        "https://www.threads.com/@coachluki",
        "https://linktr.ee/coachluki",
      ],
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Luke Satterly",
      alternateName: "Coach Luki",
      description:
        "Certified personal trainer and nutritionist based in Berlin, Germany. Specializing in strength training, calisthenics, ring training, and plant-based nutrition.",
      url: siteUrl,
      image: `${siteUrl}/luke.jpg`,
      jobTitle: "Personal Trainer & Nutritionist",
      worksFor: {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
      },
      knowsLanguage: ["en", "de"],
      sameAs: [
        "https://www.instagram.com/coachluki/",
        "https://www.threads.com/@coachluki",
        "https://linktr.ee/coachluki",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Coach Luki",
      publisher: {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
      },
    },
    {
      "@type": "Service",
      name: "Essentials - In-Person Training",
      description:
        "4 in-person personal training sessions per month with custom programming and nutrition guidance.",
      provider: {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
      },
      areaServed: { "@type": "City", name: "Berlin" },
      offers: {
        "@type": "Offer",
        price: "240",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Service",
      name: "All In - Premium Personal Training",
      description:
        "8 in-person personal training sessions per month with full nutrition coaching, weekly check-ins, and WhatsApp support.",
      provider: {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
      },
      areaServed: { "@type": "City", name: "Berlin" },
      offers: {
        "@type": "Offer",
        price: "480",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#0C0C0C" />
        <meta name="geo.region" content="DE-BE" />
        <meta name="geo.placename" content="Berlin" />
        <meta name="geo.position" content="52.5328;13.4253" />
        <meta name="ICBM" content="52.5328, 13.4253" />
      </head>
      <body
        className={`${syne.variable} ${outfit.variable} antialiased`}
      >
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
