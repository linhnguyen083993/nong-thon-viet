"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { IMAGE_BUCKET, isSupabaseConfigured } from "@/lib/env";
import { slugify } from "@/lib/format";
import { createAuthClient } from "@/lib/supabase/server";
import type { ProductArt, ProductCategory, ProductSpec } from "@/lib/types";

export type FormState = { error?: string; fieldErrors?: Record<string, string>; ok?: string } | undefined;

const CATEGORIES: ProductCategory[] = ["ca-phe", "mat-ong", "ho-tieu"];
const ARTS: ProductArt[] = ["coffee", "honey", "pepper-black", "pepper-white"];
const MAX_IMAGE = 5 * 1024 * 1024;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

/* ---------------- Đăng nhập ---------------- */

export async function signIn(_: FormState, fd: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return { error: "Chưa kết nối Supabase. Xem hướng dẫn trong README." };
  const email = str(fd, "email");
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Nhập email và mật khẩu." };

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email hoặc mật khẩu không đúng." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------------- Sản phẩm ---------------- */

function revalidateSite(...slugs: string[]) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  slugs.filter(Boolean).forEach((s) => revalidatePath(`/san-pham/${s}`));
}

function storagePathFromUrl(url: string | null) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

export async function saveProduct(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = str(fd, "id");
  const name = str(fd, "name");
  const slug = slugify(str(fd, "slug") || name);
  const category = str(fd, "category") as ProductCategory;
  const art = str(fd, "art") as ProductArt;
  const short_description = str(fd, "short_description");
  const description = str(fd, "description");
  const sort_order = Number.parseInt(str(fd, "sort_order") || "0", 10) || 0;
  const is_published = fd.get("is_published") === "on";

  let specs: ProductSpec[] = [];
  try {
    specs = (JSON.parse(String(fd.get("specs") ?? "[]")) as ProductSpec[])
      .map((s) => ({ label: String(s.label ?? "").trim(), value: String(s.value ?? "").trim() }))
      .filter((s) => s.label && s.value);
  } catch {
    return { error: "Thông số không hợp lệ." };
  }

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Nhập tên sản phẩm.";
  if (!slug) fieldErrors.slug = "Đường dẫn không hợp lệ.";
  if (!CATEGORIES.includes(category)) fieldErrors.category = "Chọn nhóm sản phẩm.";
  if (!ARTS.includes(art)) fieldErrors.art = "Chọn hình minh hoạ.";
  if (!short_description) fieldErrors.short_description = "Nhập mô tả ngắn.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, error: "Kiểm tra lại các ô được đánh dấu." };

  // Ảnh hiện có / ảnh mới
  let image_url: string | null = str(fd, "current_image_url") || null;
  const oldImagePath = storagePathFromUrl(image_url);
  const removeImage = fd.get("remove_image") === "on";
  const file = fd.get("image");
  let replacedImage = false;

  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { fieldErrors: { image: "Chỉ nhận tệp ảnh (JPG, PNG, WebP)." } };
    if (file.size > MAX_IMAGE) return { fieldErrors: { image: "Ảnh tối đa 5 MB." } };
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${slug}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
    });
    if (upErr) return { fieldErrors: { image: `Tải ảnh thất bại: ${upErr.message}` } };
    image_url = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
    replacedImage = true;
  } else if (removeImage) {
    image_url = null;
    replacedImage = true;
  }

  const row = { name, slug, category, art, short_description, description, specs, image_url, sort_order, is_published };

  let previousSlug = "";
  if (id) {
    const { data: prev } = await supabase.from("products").select("slug").eq("id", id).maybeSingle();
    previousSlug = prev?.slug ?? "";
    const { error } = await supabase.from("products").update(row).eq("id", id);
    if (error) return dbError(error);
  } else {
    const { error } = await supabase.from("products").insert(row);
    if (error) return dbError(error);
  }

  if (replacedImage && oldImagePath) {
    await supabase.storage.from(IMAGE_BUCKET).remove([oldImagePath]);
  }

  revalidateSite(slug, previousSlug);
  redirect("/admin?da-luu=1");
}

function dbError(error: { code?: string; message: string }): FormState {
  if (error.code === "23505") return { fieldErrors: { slug: "Đường dẫn này đã được dùng cho sản phẩm khác." } };
  return { error: `Không lưu được: ${error.message}` };
}

export async function deleteProduct(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id");
  const { data } = await supabase.from("products").select("slug, image_url").eq("id", id).maybeSingle();
  await supabase.from("products").delete().eq("id", id);
  const path = storagePathFromUrl(data?.image_url ?? null);
  if (path) await supabase.storage.from(IMAGE_BUCKET).remove([path]);
  revalidateSite(data?.slug ?? "");
  revalidatePath("/admin");
}

export async function togglePublish(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id");
  const next = fd.get("next") === "true";
  const { data } = await supabase.from("products").update({ is_published: next }).eq("id", id).select("slug").maybeSingle();
  revalidateSite(data?.slug ?? "");
  revalidatePath("/admin");
}

/* ---------------- Thông tin hợp tác xã ---------------- */

const SETTING_KEYS = [
  "full_name",
  "short_name",
  "tax_code",
  "founded_on",
  "legal_representative",
  "address",
  "phone",
  "email",
  "distribution",
  "intro",
] as const;

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const row = Object.fromEntries(SETTING_KEYS.map((k) => [k, str(fd, k)]));
  const fieldErrors: Record<string, string> = {};
  if (!row.full_name) fieldErrors.full_name = "Nhập tên đầy đủ.";
  if (!row.phone) fieldErrors.phone = "Nhập số điện thoại.";
  if (row.email && !/^\S+@\S+\.\S+$/.test(row.email)) fieldErrors.email = "Email không hợp lệ.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, error: "Kiểm tra lại các ô được đánh dấu." };

  const { error } = await supabase.from("site_settings").upsert({ id: 1, ...row });
  if (error) return { error: `Không lưu được: ${error.message}` };
  revalidatePath("/", "layout");
  return { ok: "Đã lưu thông tin. Website sẽ hiển thị nội dung mới ngay." };
}
