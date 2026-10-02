import "server-only";
import { isSupabaseConfigured } from "./env";
import { SEED_PRODUCTS, SEED_SETTINGS } from "./seed";
import { createPublicClient } from "./supabase/public";
import type { Product, SiteSettings } from "./types";

export async function getPublishedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return SEED_PRODUCTS;
  const { data, error } = await createPublicClient()
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[getPublishedProducts]", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured) return SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
  const { data, error } = await createPublicClient()
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) console.error("[getProductBySlug]", error.message);
  return (data as Product) ?? null;
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return SEED_SETTINGS;
  const { data, error } = await createPublicClient()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) console.error("[getSettings]", error.message);
  return { ...SEED_SETTINGS, ...(data ?? {}) } as SiteSettings;
}
