import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { listedCaseSlugs } from "./_home/render";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...["cases", "contacts"].map((page) => ({
      url: `${siteConfig.url}/${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...listedCaseSlugs().map((slug) => ({
      url: `${siteConfig.url}/cases/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
