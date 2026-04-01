import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PushPermission from "@/components/PushPermission";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// ── Viewport (separate export — Next.js 14 requirement) ───────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

// ── Root metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://www.outfevibe.com"),

  title: {
    default:  "Outfevibe — India's First AI Stylist for Gen Z & Millennials",
    template: "%s | Outfevibe",
  },

  description:
    "Outfevibe is India's first AI-powered personal stylist for Gen Z & Millennials. Get outfit recommendations based on your body type, skin tone, and occasion. Free style quiz included.",

  keywords: [
    "AI stylist India", "outfit recommendations India", "Gen Z fashion app India",
    "millennial style app", "personal styling India", "fashion AI India",
    "body type outfits", "skin tone fashion", "style quiz India",
    "virtual wardrobe India", "AI fashion app India", "what to wear India",
    "outfit ideas Gen Z", "Outfevibe", "Indian fashion app",
    "outfit suggester India", "fashion for Indians", "best outfit app India",
    "AI fashion stylist free", "Eid outfit ideas India", "Diwali outfit AI",
  ],

  authors:   [{ name: "Outfevibe", url: "https://www.outfevibe.com" }],
  creator:   "Outfevibe",
  publisher: "Outfevibe",

  openGraph: {
    type:        "website",
    locale:      "en_IN",
    url:         "https://www.outfevibe.com",
    siteName:    "Outfevibe",
    title:       "Outfevibe — India's First AI Stylist for Gen Z & Millennials",
    description: "Upload your photo → get personalized outfit recs based on your body type, skin tone & occasion. Try India's free AI stylist now ✨",
    images: [{
      url:    "https://www.outfevibe.com/og-image.jpg",
      width:  1200,
      height: 630,
      alt:    "Outfevibe — India's First AI Stylist",
      type:   "image/jpeg",
    }],
  },

  twitter: {
    card:        "summary_large_image",
    site:        "@outfevibe",
    creator:     "@outfevibe",
    title:       "Outfevibe — India's First AI Stylist for Gen Z & Millennials",
    description: "Upload your photo → get AI outfit recs for your body type, skin tone & occasion. Try free ✨",
    images:      ["https://www.outfevibe.com/og-image.jpg"],
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:                true,
      follow:               true,
      "max-video-preview":  -1,
      "max-image-preview":  "large",
      "max-snippet":        -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico",  sizes: "any" },
      { url: "/icon0.svg",    type: "image/svg+xml" },
      { url: "/icon1.png",    sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple:    "/apple-icon.png",
  },

  manifest: "/manifest.webmanifest",

  alternates: {
    canonical: "https://www.outfevibe.com",
    languages: { "en-IN": "https://www.outfevibe.com" },
  },

  category: "fashion",

  // ✅ App store meta (for PWA discoverability)
  appLinks: {
    web: { url: "https://www.outfevibe.com", should_fallback: true },
  },

  // ✅ Verification tags — add yours from Google Search Console
  verification: {
    google: "add-your-google-verification-token-here",
  },
};

// ── JSON-LD Structured Data ───────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // WebSite schema — enables Google Sitelinks Search Box
    {
      "@type": "WebSite",
      "@id":   "https://www.outfevibe.com/#website",
      url:     "https://www.outfevibe.com",
      name:    "Outfevibe",
      description: "India's first AI-powered personal styling platform for Gen Z & Millennials",
      inLanguage: "en-IN",
      publisher: { "@id": "https://www.outfevibe.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type":       "EntryPoint",
          urlTemplate:   "https://www.outfevibe.com/outfit?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },

    // Organization schema — brand knowledge panel
    {
      "@type": "Organization",
      "@id":   "https://www.outfevibe.com/#organization",
      name:    "Outfevibe",
      url:     "https://www.outfevibe.com",
      logo: {
        "@type":  "ImageObject",
        url:      "https://www.outfevibe.com/outfevibe_logo.png",
        width:    512,
        height:   512,
      },
      foundingDate: "2026",
      description:  "India's first AI-powered personal styling platform for Gen Z & Millennials",
      sameAs: [
        "https://www.instagram.com/outfevibe",
        "https://www.linkedin.com/in/outfevibe-offical-14903a3a9",
        "https://youtube.com/@outfevibe",
      ],
      contactPoint: {
        "@type":       "ContactPoint",
        email:         "outfevibe@gmail.com",
        contactType:   "customer support",
        availableLanguage: ["English", "Hindi"],
      },
    },

    // SoftwareApplication schema — app store rich result
    {
      "@type":               "SoftwareApplication",
      name:                  "Outfevibe",
      operatingSystem:       "Web, Android, iOS",
      applicationCategory:   "LifestyleApplication",
      applicationSubCategory:"FashionApplication",
      description:
        "India's first AI-powered personal styling app for Gen Z & Millennials. Get outfit recommendations based on body type, skin tone, and occasion.",
      url:          "https://www.outfevibe.com",
      inLanguage:   "en-IN",
      offers: {
        "@type":         "Offer",
        price:           "0",
        priceCurrency:   "INR",
      },
      aggregateRating: {
        "@type":       "AggregateRating",
        ratingValue:   "4.8",
        reviewCount:   "5",
        bestRating:    "5",
        worstRating:   "1",
      },
      featureList: [
        "AI body shape analysis",
        "Skin tone matching",
        "Personalized outfit recommendations",
        "Style personality quiz",
        "Indian occasion outfits (Eid, Diwali, Wedding)",
        "Budget-aware recommendations",
        "Affiliate shopping links (Myntra, Amazon, Meesho)",
      ],
    },

    // ✅ FAQ schema — triggers Google featured snippets
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name:    "What is Outfevibe?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Outfevibe is India's first AI-powered personal styling platform built for Gen Z and Millennials. It analyses your body shape, skin tone, and occasion to recommend outfits tailored specifically for you.",
          },
        },
        {
          "@type": "Question",
          name:    "Is Outfevibe free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Yes, Outfevibe is completely free. You can take the style quiz, get AI outfit recommendations, and discover your style persona without paying anything.",
          },
        },
        {
          "@type": "Question",
          name:    "Which Indian occasions does Outfevibe support?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Outfevibe supports Eid, Diwali, Navratri, weddings, college, parties, dates, and work occasions with curated outfit recommendations tailored for Indian users.",
          },
        },
        {
          "@type": "Question",
          name:    "Which shopping platforms does Outfevibe link to?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Outfevibe recommends products from Myntra, Amazon India, Ajio, Flipkart, and Meesho with direct affiliate links so you can shop instantly.",
          },
        },
        {
          "@type": "Question",
          name:    "How does Outfevibe's AI analyse my body type?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Outfevibe uses MediaPipe Vision AI to detect your pose landmarks from a photo and classify your body shape as Hourglass, Pear, Apple, Rectangle, or Inverted Triangle. It also samples skin tone from your photo for colour-matched recommendations.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        {/* ✅ Preconnect for performance SEO */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://supabase.co" />

        {/* ✅ JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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