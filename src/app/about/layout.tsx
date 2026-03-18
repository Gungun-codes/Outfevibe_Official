import { Metadata } from "next";

export const aboutMetadata: Metadata = {
  title: "About — Built by Someone Who Couldn't Dress",
  description:
    "Outfevibe was built by Gungun Jain after struggling with fashion decisions. Learn our founding story, mission, and vision for the future of AI-powered styling.",
  openGraph: {
    title: "About Outfevibe — Our Story & Mission",
    description:
      "Built by someone who couldn't dress. Outfevibe is an AI-powered personal styling platform on a mission to make fashion accessible for everyone.",
    url: "https://www.outfevibe.com/about",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://www.outfevibe.com/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}