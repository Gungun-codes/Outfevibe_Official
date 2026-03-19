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
        purpose: "any",            // ✅ fixes the install criteria error
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",            // ✅ fixes the install criteria error
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",       // ✅ keep maskable separately
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile.png",
        sizes: "390x844",
        type: "image/png",
        // no form_factor = mobile screenshot ✅
      },
      {
        src: "/screenshots/desktop.png",
        sizes: "1280x720",
        type: "image/png",
        // @ts-ignore — Next.js types lag behind, this is valid
        form_factor: "wide",       // ✅ fixes desktop richer UI warning
      },
    ],
  };
}