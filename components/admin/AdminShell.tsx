import Link from "next/link";
import { Building2, ExternalLink, LogOut, Package } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { BlossomMark } from "@/components/site/Logo";

const NAV = [
  { href: "/admin", label: "Sản phẩm", icon: Package },
  { href: "/admin/thong-tin", label: "Thông tin hợp tác xã", icon: Building2 },
];

const linkCls =
  "flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl px-3 text-sm text-hoa/80 hover:bg-hoa/10 hover:text-hoa";

/** Khung trang quản trị: thanh ngang trên điện thoại, cột bên trái trên màn hình lớn. */
export function AdminShell({ email, children }: { email?: string | null; children: React.ReactNode }) {
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col gap-1 bg-rang px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 text-hoa lg:sticky lg:top-0 lg:h-dvh lg:gap-6 lg:px-5 lg:py-8">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex min-h-11 items-center gap-2.5 rounded-md pl-1">
            <BlossomMark className="size-8" />
            <span className="font-display text-lg font-medium">Quản trị</span>
          </Link>
          {/* Điện thoại: nút đăng xuất nằm ngay thanh trên */}
          <form action={signOut} className="lg:hidden">
            <button type="submit" className={linkCls}>
              <LogOut className="size-4" aria-hidden="true" /> Đăng xuất
            </button>
          </form>
        </div>
        <nav aria-label="Quản trị" className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={linkCls}>
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
          <a href="/" target="_blank" className={linkCls}>
            <ExternalLink className="size-4" aria-hidden="true" />
            Xem website
          </a>
        </nav>
        <div className="mt-auto hidden border-t border-hoa/10 pt-5 lg:block">
          <p className="truncate text-xs text-hoa/55">{email}</p>
          <form action={signOut} className="mt-2">
            <button type="submit" className="flex min-h-11 items-center gap-2 rounded-lg text-sm text-hoa/80 hover:text-hoa">
              <LogOut className="size-4" aria-hidden="true" /> Đăng xuất
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-6 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-10 lg:py-12">{children}</main>
    </div>
  );
}
