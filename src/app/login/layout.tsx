import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Login",
  description: "Sign in to your Outfevibe account to access your style profile, saved outfits, and personalized recommendations.",
  alternates:  { canonical: "https://www.outfevibe.com/login" },
  robots:      { index: false, follow: false }, // ✅ noindex login pages
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}