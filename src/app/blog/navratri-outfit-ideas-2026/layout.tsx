import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Navratri Outfit Ideas 2026 — Complete 9 Day Colour Guide",
  description: "The complete Navratri 2026 outfit guide for Indian women. Day-by-day colour guide, best lehengas and chaniya cholis for every body shape and skin tone. Chaitra Navratri March 19–27.",
  alternates:  { canonical: "https://www.outfevibe.com/blog/navratri-outfit-ideas-2026" },
  keywords: [
    "navratri outfit ideas 2026", "chaitra navratri 2026 outfit",
    "navratri 9 days colour guide", "navratri lehenga ideas",
    "navratri outfit for pear shape", "navratri garba outfit india",
    "what to wear navratri 2026", "navratri chaniya choli 2026",
    "navratri outfit colours day wise", "navratri fashion india 2026",
  ],
  openGraph: {
    title:       "Navratri Outfit Ideas 2026 — Complete 9 Day Guide | Outfevibe",
    description: "Day-by-day Navratri colour guide with outfit recommendations for every body shape.",
    url:         "https://www.outfevibe.com/blog/navratri-outfit-ideas-2026",
    type:        "article",
    images: [{ url: "https://www.outfevibe.com/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Navratri Outfit Ideas 2026 — 9 Day Colour Guide | Outfevibe",
    description: "Complete Navratri 2026 outfit guide. 9 days, 9 colours, every body shape covered ✨",
    images:      ["https://www.outfevibe.com/og-image.jpg"],
  },
};

export default function NavratriBlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}