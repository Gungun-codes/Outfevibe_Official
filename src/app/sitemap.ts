// this remove the index of/ problem 

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://www.outfevibe.com",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
    ];
}