import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.outfevibe.com";

  // Use fixed dates — changing to new Date() every build confuses Google
  return [
    {
      url:             base,
      lastModified:    new Date("2026-03-21"),
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${base}/quiz`,
      lastModified:    new Date("2026-03-21"),
      changeFrequency: "weekly",
      priority:        0.95,
    },
    {
      url:             `${base}/outfit`,
      lastModified:    new Date("2026-03-21"),
      changeFrequency: "weekly",
      priority:        0.95,
    },
    {
      url:             `${base}/signup`,
      lastModified:    new Date("2026-02-10"),
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${base}/privacy-policy`,
      lastModified:    new Date("2026-02-10"),
      changeFrequency: "yearly",
      priority:        0.3,
    },
    {
      url:             `${base}/terms-of-service`,
      lastModified:    new Date("2026-02-10"),
      changeFrequency: "yearly",
      priority:        0.3,
    },
  ];
}