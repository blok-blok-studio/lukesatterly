import type { Metadata } from "next";

const siteUrl = "https://coachluki.com";

export const metadata: Metadata = {
  title: "Free Workout Template — Coach Luki",
  description:
    "Download a free 4-week workout template built by Coach Luki. The same programming used with 1-on-1 coaching clients in Berlin.",
  alternates: {
    canonical: `${siteUrl}/start`,
    languages: {
      "en-US": `${siteUrl}/start`,
      "de-DE": `${siteUrl}/start`,
      "x-default": `${siteUrl}/start`,
    },
  },
  openGraph: {
    title: "Free Workout Template — Coach Luki",
    description:
      "Download a free 4-week workout template. The same programming used with 1-on-1 coaching clients in Berlin.",
    url: `${siteUrl}/start`,
    images: [
      {
        url: "/coach-luki-og-personal-trainer-berlin.jpg",
        width: 1200,
        height: 630,
        alt: "Coach Luki — Free 4-Week Workout Template",
      },
    ],
  },
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
      name: "Get Started",
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
