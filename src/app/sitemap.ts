import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

/**
 * Static routes only for now. Individual forecast pages are user-generated and
 * are surfaced through sharing rather than crawling.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE.url, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/predict`, lastModified, changeFrequency: "daily", priority: 0.9 },
  ];
}
