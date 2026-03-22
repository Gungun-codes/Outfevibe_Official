import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Steal the Look — AI Outfit Suggestions",
  description: "Upload your photo and get AI-powered outfit recommendations based on your body shape, skin tone, and occasion. Shop from Myntra, Amazon, Ajio, Meesho & Flipkart.",
  alternates:  { canonical: "https://www.outfevibe.com/outfit" },
  openGraph: {
    title:       "Steal the Look — AI Outfit Suggestions | Outfevibe",
    description: "Upload your photo → AI detects your body shape & skin tone → get personalized outfits. Shop from Indian platforms instantly.",
    url:         "https://www.outfevibe.com/outfit",
    images: [{
      url:    "https://www.outfevibe.com/og-image.jpg",
      width:  1200,
      height: 630,
      alt:    "Outfevibe AI Outfit Suggestions",
    }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Steal the Look — AI Outfit Suggestions | Outfevibe",
    description: "Upload photo → AI detects body shape & skin tone → get outfits. Free ✨",
    images:      ["https://www.outfevibe.com/og-image.jpg"],
  },
};

export default function OutfitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100dvh", background: "#0a0a0a" }}>
      {children}
    </div>
  );
}