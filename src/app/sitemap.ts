import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.outfevibe.com";

  return [
    // ── Core ──────────────────────────────────────────────────────────────
    { url: base,                                              lastModified: new Date("2026-03-22"), changeFrequency: "weekly",  priority: 1.0  },
    { url: `${base}/quiz`,                                    lastModified: new Date("2026-03-21"), changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/outfit`,                                  lastModified: new Date("2026-03-21"), changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/signup`,                                  lastModified: new Date("2026-02-10"), changeFrequency: "monthly", priority: 0.7  },

    // ── Festival landing pages ────────────────────────────────────────────
    { url: `${base}/navratri-outfits`,                        lastModified: new Date("2026-03-22"), changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/mahavir-jayanti-outfits`,                 lastModified: new Date("2026-03-27"), changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/eid-outfits`,                             lastModified: new Date("2026-03-20"), changeFrequency: "weekly",  priority: 0.85 },

    // ── Category landing pages ────────────────────────────────────────────
    { url: `${base}/college-outfits`,                         lastModified: new Date("2026-03-22"), changeFrequency: "weekly",  priority: 0.88 },

    // ── Blog index ────────────────────────────────────────────────────────
    { url: `${base}/blog`,                                    lastModified: new Date("2026-03-22"), changeFrequency: "weekly",  priority: 0.85 },

    // ── Blog posts ────────────────────────────────────────────────────────
    { url: `${base}/blog/navratri-outfit-ideas-2026`,         lastModified: new Date("2026-03-22"), changeFrequency: "monthly", priority: 0.92 },
    { url: `${base}/blog/mahavir-jayanti-outfit-ideas-2026`,  lastModified: new Date("2026-03-27"), changeFrequency: "monthly", priority: 0.88 },
    { url: `${base}/blog/eid-outfit-ideas-2026`,              lastModified: new Date("2026-03-20"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/blog/college-outfit-ideas-india`,         lastModified: new Date("2026-03-15"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/blog/body-shape-outfit-guide-india`,      lastModified: new Date("2026-03-10"), changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/blog/skin-tone-colour-guide-india`,       lastModified: new Date("2026-03-05"), changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/blog/ai-stylist-vs-personal-stylist`,     lastModified: new Date("2026-02-28"), changeFrequency: "monthly", priority: 0.78 },

    // ── Legal ─────────────────────────────────────────────────────────────
    { url: `${base}/privacy-policy`,                          lastModified: new Date("2026-02-10"), changeFrequency: "yearly",  priority: 0.3  },
    { url: `${base}/terms-of-service`,                        lastModified: new Date("2026-02-10"), changeFrequency: "yearly",  priority: 0.3  },
  ];
}