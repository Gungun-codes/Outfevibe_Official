import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Navratri Outfit Ideas 2026 — 9 Days 9 Colours AI Picks",
  description: "Discover the best Navratri outfits 2026 for all 9 days. AI-curated lehengas, chaniya cholis and ethnic wear matched to your body shape and skin tone. Shop from Amazon India, Myntra & Meesho.",
  alternates:  { canonical: "https://www.outfevibe.com/navratri-outfits" },
  keywords: [
    "navratri outfit ideas 2026", "navratri outfit india",
    "navratri lehenga 2026", "chaniya choli navratri",
    "navratri 9 colours outfit", "navratri garba outfit",
    "navratri outfit for body shape", "navratri dandiya outfit",
    "chaitra navratri 2026 outfit", "navratri ethnic wear india",
  ],
  openGraph: {
    title:       "Navratri Outfit Ideas 2026 — 9 Days 9 Colours | Outfevibe",
    description: "Best Navratri outfits 2026 for all 9 days. AI picks for every body shape and skin tone.",
    url:         "https://www.outfevibe.com/navratri-outfits",
    images: [{ url: "https://www.outfevibe.com/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Navratri Outfit Ideas 2026 — 9 Days 9 Colours | Outfevibe",
    description: "AI-curated Navratri outfits for every body shape. Shop from Indian platforms ✨",
    images:      ["https://www.outfevibe.com/og-image.jpg"],
  },
};

export default function NavratriLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}