import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://coachluki.com";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          de: baseUrl,
        },
      },
      images: [
        `${baseUrl}/coach-luki-personal-trainer-berlin-rings.webp`,
        `${baseUrl}/coach-luki-personal-trainer-berlin-smiling-portrait.webp`,
        `${baseUrl}/coach-luki-conditioning-running-berlin.webp`,
        `${baseUrl}/coach-luki-running-berlin-streets-night.webp`,
        `${baseUrl}/coach-luki-personal-trainer-berlin-back-portrait.webp`,
        `${baseUrl}/coach-luki-back-muscles-strength-training-berlin.webp`,
        `${baseUrl}/coach-luki-athletic-training-berlin-studio.webp`,
        `${baseUrl}/hayley-fitness-transformation-before.webp`,
        `${baseUrl}/hayley-fitness-transformation-after.webp`,
        `${baseUrl}/diren-fitness-transformation-before.webp`,
        `${baseUrl}/diren-fitness-transformation-after.webp`,
        `${baseUrl}/james-fitness-transformation-before.webp`,
        `${baseUrl}/james-fitness-transformation-after.webp`,
      ],
    },
    {
      url: `${baseUrl}/start`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/start`,
          de: `${baseUrl}/start`,
        },
      },
      images: [
        `${baseUrl}/hayley-fitness-transformation-before.webp`,
        `${baseUrl}/hayley-fitness-transformation-after.webp`,
        `${baseUrl}/diren-fitness-transformation-before.webp`,
        `${baseUrl}/diren-fitness-transformation-after.webp`,
        `${baseUrl}/james-fitness-transformation-before.webp`,
        `${baseUrl}/james-fitness-transformation-after.webp`,
      ],
    },
  ];
}
