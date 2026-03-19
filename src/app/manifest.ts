import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Outfevibe — AI-Powered Personal Stylist",
    short_name: "Outfevibe",
    description: "AI-powered styling that understands identity. Not just clothes.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#d4af7f",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}