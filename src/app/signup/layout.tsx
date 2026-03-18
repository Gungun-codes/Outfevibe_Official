import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Join Outfevibe",
  description: "Create your free Outfevibe account and get AI-powered outfit recommendations based on your body type, skin tone, and occasion.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}