import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://codevas.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/classes", "/classes/*", "/login", "/register"],
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/profile/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/classes", "/classes/*"],
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/profile/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
