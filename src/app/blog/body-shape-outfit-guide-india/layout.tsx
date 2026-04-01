import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Body Shape Outfit Guide for Indian Women — Complete 2026",
  description: "The complete body shape outfit guide for Indian women. Hourglass, pear, apple, rectangle and inverted triangle — what to wear for every body type with Indian outfit examples.",
  alternates:  { canonical: "https://www.outfevibe.com/blog/body-shape-outfit-guide-india" },
  keywords: [
    "body shape outfit guide india", "what to wear for pear body shape india",
    "hourglass body outfit india", "apple body shape clothes india",
    "rectangle body shape fashion", "inverted triangle body outfits india",
    "how to dress for body shape india", "body type fashion tips india 2026",
    "best outfits for body shape indian women", "body shape style guide",
  ],
  openGraph: {
    title:       "Body Shape Outfit Guide for Indian Women 2026 | Outfevibe",
    description: "Complete guide on what to wear for every body shape — hourglass, pear, apple, rectangle, inverted triangle.",
    url:         "https://www.outfevibe.com/blog/body-shape-outfit-guide-india",
    type:        "article",
    images: [{ url: "https://www.outfevibe.com/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Body Shape Outfit Guide for Indian Women 2026 | Outfevibe",
    description: "What to wear for every body type — hourglass, pear, apple, rectangle, inverted triangle ✨",
    images:      ["https://www.outfevibe.com/og-image.jpg"],
  },
};

export default function BodyShapeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}