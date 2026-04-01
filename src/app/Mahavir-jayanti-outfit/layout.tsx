import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Mahavir Jayanti Outfits 2026 — Elegant & Spiritual Looks",
  description: "Discover the best Mahavir Jayanti 2026 outfit ideas. White, cream, ivory and pastel ethnic wear for men and women. AI-curated looks with body shape and skin tone matching.",
  alternates:  { canonical: "https://www.outfevibe.com/mahavir-jayanti-outfits" },
  keywords: [
    "mahavir jayanti outfit 2026", "mahavir jayanti dress india",
    "what to wear mahavir jayanti", "mahavir jayanti white outfit",
    "jain festival outfit india", "mahavir jayanti ethnic wear",
    "mahavir jayanti outfit women", "mahavir jayanti outfit men",
  ],
  openGraph: {
    title:       "Mahavir Jayanti Outfits 2026 — Elegant & Spiritual | Outfevibe",
    description: "Best Mahavir Jayanti 2026 outfits. White, cream and pastel ethnic wear for every body type.",
    url:         "https://www.outfevibe.com/mahavir-jayanti-outfits",
    images: [{ url: "https://www.outfevibe.com/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Mahavir Jayanti Outfits 2026 — Elegant & Spiritual | Outfevibe",
    description: "AI-curated Mahavir Jayanti outfits. White, cream and pastel ethnic wear ✨",
    images:      ["https://www.outfevibe.com/og-image.jpg"],
  },
};

export default function MahavirLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}