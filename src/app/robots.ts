import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const shadowSlug = process.env.SHADOW_SLUG ?? "";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/quan-ly/", "/dang-nhap/", shadowSlug ? `/${shadowSlug}/` : "", "/api/"].filter(
        Boolean
      ),
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
