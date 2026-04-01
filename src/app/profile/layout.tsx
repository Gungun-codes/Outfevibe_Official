import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile — Outfevibe",
  description: "View your style persona, outfit history, and manage your Outfevibe account.",
  robots: {
    index: false,  // don't let Google index private profile pages
    follow: false,
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}