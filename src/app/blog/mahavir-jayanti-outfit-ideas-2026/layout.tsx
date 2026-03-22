import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Mahavir Jayanti Outfit Ideas 2026 — What to Wear",
  description: "Complete guide to Mahavir Jayanti 2026 outfits. White, cream and pastel ethnic wear for men and women. Best kurtas, lehengas and bandhgalas for this auspicious Jain festival.",
  alternates:  { canonical: "https://www.outfevibe.com/blog/mahavir-jayanti-outfit-ideas-2026" },
  keywords: [
    "mahavir jayanti outfit 2026", "what to wear mahavir jayanti",
    "mahavir jayanti dress ideas", "mahavir jayanti white kurta",
    "jain festival outfit 2026", "mahavir jayanti ethnic wear india",
    "mahavir jayanti april 2026", "mahavir jayanti outfit women men",
  ],
  openGraph: {
    title:       "Mahavir Jayanti Outfit Ideas 2026 — What to Wear | Outfevibe",
    description: "Complete Mahavir Jayanti 2026 outfit guide. White and ivory ethnic wear for men and women.",
    url:         "https://www.outfevibe.com/blog/mahavir-jayanti-outfit-ideas-2026",
    type:        "article",
    images: [{ url: "https://www.outfevibe.com/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function MahavirBlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}