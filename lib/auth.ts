import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isSupabaseConfigured } from "./env";
import { createAuthClient } from "./supabase/server";

/** Bảo vệ mọi trang/thao tác quản trị: phải đăng nhập và có tên trong bảng admins. */
export async function requireAdmin() {
  await connection(); // luôn render theo từng request
  if (!isSupabaseConfigured) redirect("/admin/login");
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=khong-co-quyen");
  }
  return { supabase, user };
}
