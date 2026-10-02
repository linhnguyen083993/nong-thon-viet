import type { MetadataRoute } from "next";
import { getPublishedProducts } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublishedProducts();
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...products.map((p) => ({
      url: `${SITE_URL}/san-pham/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
