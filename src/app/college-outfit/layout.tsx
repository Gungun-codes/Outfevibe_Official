import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "College Outfit Ideas India 2026 — Girls & Boys AI Picks",
  description: "Trendy college outfit ideas for Indian girls and boys 2026. AI-curated looks based on your body shape and style. Shop from Myntra, Amazon, Meesho under ₹1,000.",
  alternates:  { canonical: "https://www.outfevibe.com/college-outfits" },
  keywords: [
    "college outfit ideas india", "college outfits for girls india 2026",
    "college fashion india", "what to wear to college india",
    "casual outfits for college girls", "college boys outfit india",
    "trendy college looks india", "college outfit under 1000 india",
    "college outfit body shape", "indian college fashion 2026",
  ],
  openGraph: {
    title:       "College Outfit Ideas India 2026 — Girls & Boys | Outfevibe",
    description: "Trendy college outfits for Indian students. AI picks based on your body type and style.",
    url:         "https://www.outfevibe.com/college-outfits",
    images: [{ url: "https://www.outfevibe.com/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "College Outfit Ideas India 2026 — Girls & Boys | Outfevibe",
    description: "AI-curated college outfits for Indian students. Budget-friendly picks ✨",
    images:      ["https://www.outfevibe.com/og-image.jpg"],
  },
};

export default function CollegeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}