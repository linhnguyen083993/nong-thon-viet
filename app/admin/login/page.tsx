import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { BlossomMark } from "@/components/site/Logo";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata = { title: "Đăng nhập" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;
  const initialError = error === "khong-co-quyen" ? "Tài khoản này chưa được cấp quyền quản trị." : undefined;

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="grain hidden flex-col justify-between bg-bazan p-12 text-hoa lg:flex">
        <BlossomMark className="size-12" />
        <p className="display-tight max-w-md text-6xl">Quản lý sản phẩm Nông Thôn Việt</p>
        <Link href="/" className="w-fit rounded-md text-sm text-hoa/70 hover:text-hoa">
          Về trang chủ
        </Link>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <BlossomMark className="size-10 text-bazan lg:hidden" />
          <h1 className="display-tight mt-6 text-4xl lg:mt-0">Đăng nhập</h1>
          <p className="mt-2 text-sm text-rang-soft">Dành cho quản trị viên của hợp tác xã.</p>
          <div className="mt-8">
            {isSupabaseConfigured ? (
              <LoginForm initialError={initialError} />
            ) : (
              <div className="rounded-2xl bg-mat-soft/60 p-5 text-sm leading-relaxed text-rang">
                <p className="font-semibold">Chưa kết nối cơ sở dữ liệu</p>
                <p className="mt-2">
                  Website đang chạy ở chế độ xem trước với dữ liệu mẫu. Để dùng trang quản trị, thêm{" "}
                  <code className="rounded bg-white/70 px-1">NEXT_PUBLIC_SUPABASE_URL</code> và{" "}
                  <code className="rounded bg-white/70 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> theo hướng dẫn trong README.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
