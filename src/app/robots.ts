import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profile", "/login", "/api/"],
      },
    ],
    sitemap: "https://www.outfevibe.com/sitemap.xml",
    host: "https://www.outfevibe.com",
  };
}