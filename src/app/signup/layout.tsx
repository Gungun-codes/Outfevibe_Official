import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Sign Up — Start Your Style Journey",
  description: "Create your free Outfevibe account and get AI-powered outfit recommendations tailored to your body type, skin tone, and style personality.",
  alternates:  { canonical: "https://www.outfevibe.com/signup" },
  robots:      { index: false, follow: false }, // ✅ noindex signup pages
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}