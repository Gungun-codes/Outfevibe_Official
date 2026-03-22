import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "AI Stylist vs Personal Stylist — Which is Better for Indians?",
  description: "Honest comparison of AI stylists vs personal stylists for Indian users. Cost, accuracy, availability and what each does best. Includes Outfevibe review.",
  alternates:  { canonical: "https://www.outfevibe.com/blog/ai-stylist-vs-personal-stylist" },
  keywords: [
    "ai stylist vs personal stylist india", "best ai stylist app india",
    "is ai stylist accurate", "outfevibe review", "ai fashion app india",
    "personal stylist cost india", "free ai outfit recommendation india",
    "ai vs human stylist fashion", "best styling app india 2026",
  ],
  openGraph: {
    title:       "AI Stylist vs Personal Stylist — Which is Better for Indians? | Outfevibe",
    description: "Honest comparison. AI stylists are free, available 24/7 and improve with data. Personal stylists offer human judgment. Here's what each does best.",
    url:         "https://www.outfevibe.com/blog/ai-stylist-vs-personal-stylist",
    type:        "article",
    images: [{ url: "https://www.outfevibe.com/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "AI Stylist vs Personal Stylist — Which is Better? | Outfevibe",
    description: "Free AI vs paid human stylist. Honest comparison for Indian users ✨",
    images:      ["https://www.outfevibe.com/og-image.jpg"],
  },
};

export default function AiStylistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}