import type { MetadataRoute } from "next";
import { ClassService } from "@/lib/services/class.service";
import { CLASSES_LIST } from "@/lib/classes-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://codevas.dev";
  const now = new Date();

  // Static high-priority landing & catalog routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/classes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic course routes
  let dynamicClassRoutes: MetadataRoute.Sitemap = [];

  try {
    const dbClasses = await ClassService.getAllClasses();
    if (dbClasses && dbClasses.length > 0) {
      dynamicClassRoutes = dbClasses.map((item) => ({
        url: `${baseUrl}/classes/${item.id}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
    }
  } catch {
    // Fallback to static CLASSES_LIST if DB is temporarily unreachable during build
    dynamicClassRoutes = CLASSES_LIST.map((item) => ({
      url: `${baseUrl}/classes/${item.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  }

  // Ensure unique URLs
  const urlMap = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const item of [...staticRoutes, ...dynamicClassRoutes]) {
    urlMap.set(item.url, item);
  }

  return Array.from(urlMap.values());
}
