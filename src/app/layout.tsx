import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    // Rich Q&A snippet for the FAQ section — Google can render expandable
    // Q&A directly in search results when this is present.
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Is personal training right for me and my goals?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Personal training is right for you if you want a clear plan, structure, and measurable progress. Most people don't struggle because they're lazy — they're guessing. I remove that guesswork and give you a system tailored to your body, your schedule, and your goals.",
          },
        },
        {
          "@type": "Question",
          name: "Is online coaching effective for achieving real results?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, if it's done properly. Online coaching is ongoing guidance, structured programming, and regular adjustments based on your progress. For many clients online coaching actually works better because it integrates into real life instead of depending on fixed appointments.",
          },
        },
        {
          "@type": "Question",
          name: "Why should I work with a coach instead of training on my own?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Results come from consistency and direction, not just effort. A coach gives you structure, holds you accountable, and makes sure every session moves you closer to your goal. It's the difference between being busy and actually making progress.",
          },
        },
        {
          "@type": "Question",
          name: "What makes you different from other personal trainers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "I don't just coach workouts. I build systems that fit into your life. My approach is focused on long-term results, not quick fixes. I place a strong emphasis on technique, injury prevention, and sustainable habits.",
          },
        },
        {
          "@type": "Question",
          name: "How do you help me stay consistent and accountable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Motivation comes and goes. Structure is what keeps you moving. I build your training to fit your schedule, with regular check-ins, clear targets, and ongoing adjustments so you always know where you stand.",
          },
        },
        {
          "@type": "Question",
          name: "I'm vegan. Can you work with that?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. I'm vegan myself, so plant-based nutrition is one of my specialties. I'll help you hit your protein targets, optimize your meals, and build a sustainable plant-based approach.",
          },
        },
        {
          "@type": "Question",
          name: "What gyms do you train at?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "I train clients at Holmes Place and John Reed in Berlin. You pick whichever location is more convenient for you.",
          },
        },
      ],
    },
    // Aggregate rating + testimonials for star-rating rich result.
    // Review count reflects the 8 testimonials shown on the page.
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business-reviews`,
      name: "Coach Luki - Personal Training & Nutrition",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        bestRating: "5",
        worstRating: "1",
        reviewCount: "8",
      },
      review: [
        {
          "@type": "Review",
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          author: { "@type": "Person", name: "Rasmus" },
          reviewBody:
            "Luke is what a personal trainer should be. He encourages, motivates and pushes you. He has extensive physiological knowledge and has not left a question unanswered. I can only recommend working with him.",
        },
        {
          "@type": "Review",
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          author: { "@type": "Person", name: "Andreea" },
          reviewBody:
            "Starting my training journey with Luke as my PT a year ago has been the best investment I ever made for my health and fitness. He knows just when to push me harder and when to take a step back.",
        },
        {
          "@type": "Review",
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          author: { "@type": "Person", name: "Ali" },
          reviewBody:
            "Luke was very curious about my goals and tailored a great coaching program for me where I started seeing results quickly. He provided great advice and motivated me to keep going.",
        },
      ],
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
        {/* Skip link for keyboard and screen reader users (WCAG 2.4.1) */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <div className="noise-overlay" aria-hidden="true" />
        <main id="main">{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
