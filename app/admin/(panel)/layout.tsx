import Link from "next/link";
import { ExternalLink, LogOut, Package, Building2 } from "lucide-react";
import { signOut } from "../actions";
import { requireAdmin } from "@/lib/auth";
import { BlossomMark } from "@/components/site/Logo";

const NAV = [
  { href: "/admin", label: "Sản phẩm", icon: Package },
  { href: "/admin/thong-tin", label: "Thông tin hợp tác xã", icon: Building2 },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col gap-6 bg-rang px-5 py-5 text-hoa lg:sticky lg:top-0 lg:h-dvh lg:py-8">
        <Link href="/admin" className="flex items-center gap-2.5 rounded-md">
          <BlossomMark className="size-8" />
          <span className="font-display text-lg font-bold [font-stretch:85%]">Quản trị</span>
        </Link>
        <nav aria-label="Quản trị" className="-mx-2 flex gap-1 overflow-x-auto lg:flex-col">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-hoa/80 hover:bg-hoa/10 hover:text-hoa"
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
          <a
            href="/"
            target="_blank"
            className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-hoa/80 hover:bg-hoa/10 hover:text-hoa"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Xem website
          </a>
        </nav>
        <div className="mt-auto hidden border-t border-hoa/10 pt-5 lg:block">
          <p className="truncate text-xs text-hoa/55">{user.email}</p>
          <form action={signOut} className="mt-2">
            <button type="submit" className="flex items-center gap-2 rounded-lg py-1.5 text-sm text-hoa/80 hover:text-hoa">
              <LogOut className="size-4" aria-hidden="true" /> Đăng xuất
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-8 sm:px-10 lg:py-12">{children}</main>
    </div>
  );
}
