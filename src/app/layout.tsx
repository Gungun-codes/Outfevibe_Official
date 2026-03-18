import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { Analytics } from '@vercel/analytics/react';
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.outfevibe.com"),
  title: {
    default: "Outfevibe — AI-Powered Personal Stylist",
    template: "%s | Outfevibe",
  },
  description:
    "Discover outfits made for your body type, skin tone, and occasion. AI-powered styling that understands identity — not just clothes.",
  keywords: [
    "AI stylist",
    "outfit recommendations",
    "personal styling",
    "fashion AI",
    "body type outfits",
    "skin tone fashion",
    "Outfevibe",
  ],
  authors: [{ name: "Outfevibe", url: "https://www.outfevibe.com" }],
  creator: "Outfevibe",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.outfevibe.com",
    siteName: "Outfevibe",
    title: "Outfevibe — AI-Powered Personal Stylist",
    description:
      "Upload your photo and get outfit ideas based on your body type, skin tone, and occasion. Styling made simple.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Outfevibe — AI-Powered Personal Stylist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Outfevibe — AI-Powered Personal Stylist",
    description:
      "Upload your photo and get outfit ideas based on your body type, skin tone, and occasion.",
    images: ["/og-image.jpg"],
    creator: "@outfevibe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}