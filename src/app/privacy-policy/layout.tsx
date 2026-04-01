import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Privacy Policy",
  description: "Read Outfevibe's privacy policy to understand how we collect, use, and protect your personal data.",
  alternates:  { canonical: "https://www.outfevibe.com/privacy-policy" },
  robots:      { index: true, follow: false },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}