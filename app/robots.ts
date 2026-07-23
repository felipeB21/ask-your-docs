import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/new", "/recents", "/settings", "/upgrade", "/chat"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
