import { Metadata } from "next";

export const contactMetadata: Metadata = {
  title: "Contact — Get in Touch with Outfevibe",
  description:
    "Have a question, feedback, or partnership idea? Reach out to the Outfevibe team. We reply within 24-48 hours.",
  openGraph: {
    title: "Contact Outfevibe",
    description:
      "Have a question or partnership idea? Get in touch with the Outfevibe team.",
    url: "https://www.outfevibe.com/contact",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://www.outfevibe.com/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}