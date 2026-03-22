import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Terms of Service",
  description: "Read Outfevibe's terms of service to understand the rules and guidelines for using our platform.",
  alternates:  { canonical: "https://www.outfevibe.com/terms-of-service" },
  robots:      { index: true, follow: false },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}