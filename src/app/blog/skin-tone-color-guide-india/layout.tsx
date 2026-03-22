import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Which Colours Suit Your Skin Tone? Complete Indian Guide 2026",
  description: "Find out which colours suit your skin tone best. Complete colour matching guide for Indian skin tones — fair, light, medium, tan, deep and dark — with outfit examples.",
  alternates:  { canonical: "https://www.outfevibe.com/blog/skin-tone-colour-guide-india" },
  keywords: [
    "which colour suits my skin tone india", "skin tone colour guide india",
    "best colours for tan skin india", "colours for fair skin indian",
    "colour matching indian skin tone", "what colour to wear for my skin tone",
    "skin tone fashion tips india", "colours for medium skin tone india",
    "best outfit colours for dark skin india", "indian skin tone colour palette 2026",
  ],
  openGraph: {
    title:       "Which Colours Suit Your Skin Tone? Indian Guide 2026 | Outfevibe",
    description: "Complete colour matching guide for all Indian skin tones — fair, light, medium, tan, deep and dark.",
    url:         "https://www.outfevibe.com/blog/skin-tone-colour-guide-india",
    type:        "article",
    images: [{ url: "https://www.outfevibe.com/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Which Colours Suit Your Skin Tone? Indian Guide | Outfevibe",
    description: "Complete colour guide for all Indian skin tones. Find your perfect palette ✨",
    images:      ["https://www.outfevibe.com/og-image.jpg"],
  },
};

export default function SkinToneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}