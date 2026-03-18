import { Metadata } from "next";

export const outfitMetadata: Metadata = {
  title: "AI Outfit Suggestions — Get Styled by AI",
  description:
    "Upload your photo and let Outfevibe's AI analyze your body shape, skin tone, and style preferences to recommend outfits perfectly matched to your personality and occasion.",
  openGraph: {
    title: "AI Outfit Suggestions | Outfevibe",
    description:
      "Upload your photo and get AI-powered outfit recommendations based on your body type, skin tone, and occasion.",
    url: "https://www.outfevibe.com/outfit",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://www.outfevibe.com/outfit" },
};

export default function OutfitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}