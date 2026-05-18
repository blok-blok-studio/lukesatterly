import type { Metadata } from "next";

const siteUrl = "https://coachluki.com";

export const metadata: Metadata = {
  title: "Free 4-Week Workout Template",
  description:
    "Download Coach Luki's free 4-week workout template — the same programming used with 1-on-1 personal training clients in Berlin. Instant PDF, no fluff, built for strength, fat loss, and sustainable progress.",
  keywords: [
    "free workout plan",
    "free workout template",
    "free fitness plan pdf",
    "4 week workout plan",
    "free strength training program",
    "free workout plan berlin",
    "kostenloser trainingsplan",
    "kostenloser fitnessplan berlin",
    "trainingsplan pdf",
    "krafttraining trainingsplan",
    "beginner workout plan",
    "personal trainer berlin free plan",
    "online coaching workout template",
    "coach luki workout",
    "luke satterly workout plan",
    "vegan workout plan",
    "calisthenics beginner plan",
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
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: `${siteUrl}/start`,
    languages: {
      "en-US": `${siteUrl}/start`,
      "de-DE": `${siteUrl}/start`,
      "x-default": `${siteUrl}/start`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "de_DE",
    url: `${siteUrl}/start`,
    siteName: "Coach Luki",
    title: "Free 4-Week Workout Template | Coach Luki",
    description:
      "Download a free 4-week workout template built by Coach Luki — the same programming used with 1-on-1 coaching clients in Berlin. Instant PDF download.",
    images: [
      {
        url: "/coach-luki-og-personal-trainer-berlin.jpg",
        width: 1200,
        height: 630,
        alt: "Coach Luki — Free 4-Week Workout Template for Personal Training Clients in Berlin",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 4-Week Workout Template | Coach Luki",
    description:
      "Free 4-week workout template from Berlin personal trainer Coach Luki. The same programming used with 1-on-1 clients. Instant PDF.",
    images: ["/coach-luki-og-personal-trainer-berlin.jpg"],
    creator: "@coachluki",
  },
  category: "fitness",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Free Workout Template",
      item: `${siteUrl}/start`,
    },
  ],
};

export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
