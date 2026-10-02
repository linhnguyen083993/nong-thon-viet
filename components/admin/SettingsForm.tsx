"use client";

import { startTransition, useActionState } from "react";
import { saveSettings } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/types";
import { Field, FormMessage, SubmitButton, inputCls, submitKeepingValues } from "./ui";

const FIELDS: Array<{ key: keyof SiteSettings; label: string; hint?: string; rows?: number; type?: string }> = [
  { key: "full_name", label: "Tên đầy đủ" },
  { key: "short_name", label: "Tên ngắn", hint: "Hiện ở chân trang" },
  { key: "tax_code", label: "Mã số thuế" },
  { key: "founded_on", label: "Ngày thành lập", hint: "Dạng dd/mm/yyyy" },
  { key: "legal_representative", label: "Đại diện pháp luật", hint: "Để trống nếu không muốn hiển thị" },
  { key: "phone", label: "Số điện thoại", type: "tel" },
  { key: "email", label: "Email", type: "email", hint: "Để trống nếu chưa có" },
  { key: "address", label: "Địa chỉ", rows: 2 },
  { key: "intro", label: "Giới thiệu hợp tác xã", rows: 5 },
  { key: "distribution", label: "Phân phối và đại lý", rows: 4 },
];

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  const fe = state?.fieldErrors ?? {};
  return (
    <form onSubmit={submitKeepingValues(action, startTransition)} className="max-w-3xl space-y-6">
      <FormMessage error={state?.error} ok={state?.ok} />
      <div className="grid gap-6 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.rows ? "sm:col-span-2" : ""}>
            <Field label={f.label} htmlFor={f.key} hint={f.hint} error={fe[f.key]}>
              {f.rows ? (
                <textarea id={f.key} name={f.key} rows={f.rows} defaultValue={settings[f.key]} className={inputCls} />
              ) : (
                <input
                  id={f.key}
                  name={f.key}
                  type={f.type ?? "text"}
                  defaultValue={settings[f.key]}
                  aria-invalid={Boolean(fe[f.key])}
                  className={inputCls}
                />
              )}
            </Field>
          </div>
        ))}
      </div>
      <div className="border-t border-rang/10 pt-6">
        <SubmitButton pending={pending} pendingText="Đang lưu…">Lưu thông tin</SubmitButton>
      </div>
    </form>
  );
}
