import { Metadata } from "next";

export const careersMetadata: Metadata = {
  title: "Careers — Join the Outfevibe Team",
  description:
    "We're hiring! Join Outfevibe and help build the future of AI-powered fashion. Open roles in engineering, design, AI/ML, marketing, and fashion.",
  openGraph: {
    title: "Careers at Outfevibe — We're Hiring",
    description:
      "Join our small, ambitious team building AI-powered styling. Open roles in Frontend, Backend, UI/UX, AI/ML, Marketing, and Fashion.",
    url: "https://www.outfevibe.com/careers",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://www.outfevibe.com/careers" },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}