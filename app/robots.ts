import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/classes", "/classes/*"],
        disallow: [
          "/api/",
          "/admin/",
          "/login",
          "/register",
          "/dashboard",
          "/profile",
          "/demo/",
        ],
      },
    ],
  };
}
