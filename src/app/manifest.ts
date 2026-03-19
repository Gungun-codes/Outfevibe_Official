import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Outfevibe — AI-Powered Personal Stylist",
    short_name: "Outfevibe",
    description: "AI-powered styling that understands identity. Not just clothes.",
    id: "/",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#d4af7f",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile.png",
        sizes: "1072x2385",   // ✅ matches actual size
        type: "image/png",
      },
      {
        src: "/screenshots/desktop.png",
        sizes: "1358x644",    // ✅ matches actual size
        type: "image/png",
        // @ts-ignore
        form_factor: "wide",
      },
    ],
  };
}