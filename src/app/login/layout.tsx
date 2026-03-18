import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Outfevibe",
  description: "Sign in to your Outfevibe account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}