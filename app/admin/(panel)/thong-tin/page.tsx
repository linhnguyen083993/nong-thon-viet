import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth";
import { SEED_SETTINGS } from "@/lib/seed";
import type { SiteSettings } from "@/lib/types";

export const metadata = { title: "Thông tin hợp tác xã" };

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const settings = { ...SEED_SETTINGS, ...(data ?? {}) } as SiteSettings;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="display-tight text-4xl sm:text-5xl">Thông tin hợp tác xã</h1>
      <p className="mt-2 mb-10 max-w-xl text-sm text-rang-soft">
        Hiển thị ở phần giới thiệu, liên hệ và chân trang của website.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
