import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { Analytics } from "@vercel/analytics/react";
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
    "Outfevibe is your AI-powered personal stylist. Upload your photo and get outfit recommendations based on your body type, skin tone, and occasion. Discover your style persona with our free quiz.",

  keywords: [
    "AI stylist",
    "outfit recommendations",
    "personal styling",
    "fashion AI",
    "body type outfits",
    "skin tone fashion",
    "style quiz",
    "virtual wardrobe",
    "outfit ideas India",
    "AI fashion app",
    "Outfevibe",
    "personalized fashion",
    "what to wear",
    "outfit suggester",
  ],

  authors: [{ name: "Outfevibe", url: "https://www.outfevibe.com" }],
  creator: "Outfevibe",
  publisher: "Outfevibe",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.outfevibe.com",
    siteName: "Outfevibe",
    title: "Outfevibe — AI-Powered Personal Stylist",
    description:
      "Upload your photo and get outfit ideas based on your body type, skin tone, and occasion. AI-powered styling that understands identity — not just clothes.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Outfevibe — AI-Powered Personal Stylist",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@outfevibe",
    creator: "@outfevibe",
    title: "Outfevibe — AI-Powered Personal Stylist",
    description:
      "Upload your photo and get outfit ideas based on your body type, skin tone, and occasion.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.json",

  alternates: {
    canonical: "https://www.outfevibe.com",
  },

  category: "fashion",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.outfevibe.com/#website",
      url: "https://www.outfevibe.com",
      name: "Outfevibe",
      description: "AI-powered personal styling platform",
      publisher: {
        "@id": "https://www.outfevibe.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://www.outfevibe.com/outfit?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://www.outfevibe.com/#organization",
      name: "Outfevibe",
      url: "https://www.outfevibe.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.outfevibe.com/outfevibe_logo.png",
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://www.instagram.com/outfevibe",
        "https://www.linkedin.com/in/outfevibe-offical-14903a3a9",
        "https://youtube.com/@outfevibe",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "outfevibe@gmail.com",
        contactType: "customer support",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Outfevibe",
      operatingSystem: "Web",
      applicationCategory: "LifestyleApplication",
      description:
        "AI-powered personal styling app that recommends outfits based on body type, skin tone, and occasion.",
      url: "https://www.outfevibe.com",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "5",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}