import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Style Blog — Outfit Ideas, Fashion Tips & Trends India",
  description: "Outfevibe's style blog covers outfit ideas for every occasion, body type tips, skin tone colour guides, festive fashion and the latest Indian trends for Gen Z and Millennials.",
  alternates:  { canonical: "https://www.outfevibe.com/blog" },
  keywords: [
    "indian fashion blog", "outfit ideas india", "style tips india",
    "fashion for gen z india", "body type fashion tips", "skin tone colour guide india",
    "navratri outfit ideas", "college fashion india", "eid outfit ideas",
    "ai stylist india blog",
  ],
  openGraph: {
    title:       "Style Blog — Outfit Ideas & Fashion Tips India | Outfevibe",
    description: "Outfit ideas, body type tips, skin tone guides and Indian fashion trends for Gen Z.",
    url:         "https://www.outfevibe.com/blog",
    images: [{ url: "https://www.outfevibe.com/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Style Blog — Outfit Ideas & Fashion Tips India | Outfevibe",
    description: "Indian fashion blog for Gen Z & Millennials. Outfit ideas, style guides and festive fashion ✨",
    images:      ["https://www.outfevibe.com/og-image.jpg"],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}