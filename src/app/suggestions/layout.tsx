import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Style Persona — Outfevibe",
  description: "Your AI-powered style persona has been revealed. Discover your unique fashion identity and get personalized outfit recommendations on Outfevibe.",
  openGraph: {
    title: "I just discovered my Style Persona on Outfevibe ✨",
    description: "Take the free style quiz and discover the fashion identity that's truly yours.",
    url: "https://www.outfevibe.com/suggestion",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  robots: {
    index: false, // personal result — don't index
    follow: false,
  },
};

export default function SuggestionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}