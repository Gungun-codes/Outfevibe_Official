import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Style Quiz — Find Your Fashion Persona",
  description: "Take Outfevibe's free 6-question style quiz and discover your unique fashion persona. Are you a Minimalist Maven, Streetwear Icon, or Romantic Softie? Find out in 2 minutes.",
  alternates:  { canonical: "https://www.outfevibe.com/quiz" },
  openGraph: {
    title:       "Style Quiz — Find Your Fashion Persona | Outfevibe",
    description: "6 questions. 1 persona. Discover your unique style identity with India's first AI stylist.",
    url:         "https://www.outfevibe.com/quiz",
    images: [{
      url:    "https://www.outfevibe.com/og-image.jpg",
      width:  1200,
      height: 630,
      alt:    "Outfevibe Style Quiz",
    }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Style Quiz — Find Your Fashion Persona | Outfevibe",
    description: "6 questions. 1 persona. Find your style identity free ✨",
    images:      ["https://www.outfevibe.com/og-image.jpg"],
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}