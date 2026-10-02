"use client";

import { startTransition, useActionState } from "react";
import { signIn } from "@/app/admin/actions";
import { Field, FormMessage, SubmitButton, inputCls, submitKeepingValues } from "./ui";

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, action, pending] = useActionState(signIn, initialError ? { error: initialError } : undefined);
  return (
    <form onSubmit={submitKeepingValues(action, startTransition)} className="space-y-5">
      <FormMessage error={state?.error} />
      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="username" required className={inputCls} />
      </Field>
      <Field label="Mật khẩu" htmlFor="password">
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </Field>
      <SubmitButton pending={pending} pendingText="Đang đăng nhập…">Đăng nhập</SubmitButton>
    </form>
  );
}
