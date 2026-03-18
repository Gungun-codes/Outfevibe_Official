import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Style Quiz — Discover Your Fashion Persona",
  description:
    "Answer 6 quick questions and discover the style persona that defines you. Take Outfevibe's free AI-powered style quiz for personalized fashion insights.",
  openGraph: {
    title: "Style Quiz — Discover Your Fashion Persona | Outfevibe",
    description:
      "Answer 6 quick questions and discover the style persona that defines you.",
    url: "https://www.outfevibe.com/quiz",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://www.outfevibe.com/quiz" },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}