import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "College Outfit Ideas for Indian Girls 2026 — Trendy & Budget Friendly",
  description: "The ultimate college outfit guide for Indian girls 2026. Trendy tops, co-ords, kurtas and casual looks all under ₹1,000. Tips for every body shape and style personality.",
  alternates:  { canonical: "https://www.outfevibe.com/blog/college-outfit-ideas-india" },
  keywords: [
    "college outfit ideas india", "college outfits for girls india",
    "what to wear to college india 2026", "trendy college looks india",
    "college outfit under 1000 india", "casual college fashion india",
    "college outfit body shape india", "college girl fashion india 2026",
  ],
  openGraph: {
    title:       "College Outfit Ideas for Indian Girls 2026 | Outfevibe",
    description: "Trendy, budget-friendly college outfits for Indian girls. Tips for every body shape.",
    url:         "https://www.outfevibe.com/blog/college-outfit-ideas-india",
    type:        "article",
    images: [{ url: "https://www.outfevibe.com/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function CollegeBlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}