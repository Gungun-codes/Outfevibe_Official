import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PushPermission from "@/components/PushPermission";

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
    default: "Outfevibe — India's First AI Stylist for Gen Z & Millennials", // ✅ 57 chars
    template: "%s | Outfevibe",
  },

  description:
    "Outfevibe is India's first AI-powered personal stylist built for Gen Z & Millennials. Get outfit recommendations based on your body type, skin tone, and occasion. Free style quiz included.",

  keywords: [
    "AI stylist India",
    "outfit recommendations India",
    "Gen Z fashion app India",
    "millennial style app",
    "personal styling India",
    "fashion AI India",
    "body type outfits",
    "skin tone fashion",
    "style quiz India",
    "virtual wardrobe India",
    "AI fashion app India",
    "what to wear India",
    "outfit ideas Gen Z",
    "Outfevibe",
    "Indian fashion app",
    "outfit suggester India",
  ],

  authors: [{ name: "Outfevibe", url: "https://www.outfevibe.com" }],
  creator: "Outfevibe",
  publisher: "Outfevibe",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.outfevibe.com",
    siteName: "Outfevibe",
    title: "Outfevibe — India's First AI Stylist for Gen Z & Millennials", // ✅ 57 chars
    description:
      "Upload your photo → get personalized outfit recs based on your body type, skin tone & occasion. Try India's free AI stylist now ✨", // ✅ CTA added
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Outfevibe — India's First AI Stylist for Gen Z & Millennials",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@outfevibe",
    creator: "@outfevibe",
    title: "Outfevibe — India's First AI Stylist for Gen Z & Millennials", // ✅ updated
    description:
      "Upload your photo → get AI outfit recs for your body type, skin tone & occasion. Try free ✨", // ✅ CTA added
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  manifest: "/manifest.webmanifest",

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
        "India's first AI-powered personal styling app for Gen Z & Millennials. Get outfit recommendations based on body type, skin tone, and occasion.",
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
        <AuthProvider>
          {children}
          <PushPermission />
        </AuthProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}