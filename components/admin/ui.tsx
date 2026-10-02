"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export const inputCls =
  "w-full rounded-xl border border-rang/15 bg-white px-3.5 py-2.5 font-ui text-[0.95rem] text-rang outline-none transition-[border-color,box-shadow] placeholder:text-rang/35 focus:border-la focus:ring-3 focus:ring-la/15 aria-invalid:border-qua";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-ui text-sm font-semibold text-rang">
        {label}
      </label>
      {hint && <p className="mt-0.5 font-ui text-xs text-rang-soft">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && (
        <p className="mt-1.5 font-ui text-sm text-qua" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingText,
  pending: pendingProp,
}: {
  children: React.ReactNode;
  pendingText: string;
  pending?: boolean;
}) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-la px-6 py-3 font-ui text-sm font-semibold text-hoa transition-[opacity,transform] active:scale-[0.97] disabled:opacity-70"
    >
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {pending ? pendingText : children}
    </button>
  );
}

export function FormMessage({ error, ok }: { error?: string; ok?: string }) {
  if (!error && !ok) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 font-ui text-sm ${error ? "bg-qua/10 text-qua" : "bg-la/10 text-la"}`}
    >
      {error ?? ok}
    </p>
  );
}

/**
 * Gửi form qua Server Action mà KHÔNG để React tự xoá dữ liệu đã nhập
 * (khi lưu lỗi, người dùng không phải gõ lại).
 */
export function submitKeepingValues(dispatch: (fd: FormData) => void, startTransition: (cb: () => void) => void) {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
}
