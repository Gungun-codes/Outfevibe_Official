import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:    "/",
        disallow: [
          "/profile",
          "/login",
          "/signup",  // no SEO value — keep Google crawl budget focused
          "/api/",
          "/_next/",
        ],
      },
      // ✅ Block AI training crawlers
      { userAgent: "GPTBot",      disallow: "/" },
      { userAgent: "ChatGPT-User",disallow: "/" },
      { userAgent: "CCBot",       disallow: "/" },
      { userAgent: "anthropic-ai",disallow: "/" },
      { userAgent: "Claude-Web",  disallow: "/" },
    ],
    sitemap: "https://www.outfevibe.com/sitemap.xml",
    host:    "https://www.outfevibe.com",
  };
}