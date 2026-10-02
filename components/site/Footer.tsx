import type { SiteSettings } from "@/lib/types";
import { formatPhone, telHref } from "@/lib/format";
import { Wordmark } from "./Logo";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-forest text-ivory/65">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-16 pb-12 text-sm sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-6 max-w-sm leading-relaxed">{settings.full_name}</p>
          <p className="mt-1">
            Mã số thuế: <span className="tabular-nums">{settings.tax_code}</span>
          </p>
        </div>
        <div>
          <p className="text-ivory">Địa chỉ</p>
          <p className="mt-2 max-w-xs leading-relaxed">{settings.address}</p>
        </div>
        <div>
          <p className="text-ivory">Điện thoại</p>
          <a href={telHref(settings.phone)} className="mt-2 inline-block tabular-nums hover:text-ivory">
            {formatPhone(settings.phone)}
          </a>
          {settings.email && (
            <>
              <p className="mt-5 text-ivory">Email</p>
              <a href={`mailto:${settings.email}`} className="mt-2 inline-block hover:text-ivory">
                {settings.email}
              </a>
            </>
          )}
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-ivory/40 sm:px-8">
          © {new Date().getFullYear()} {settings.short_name}. Trang giới thiệu sản phẩm, không bán hàng trực tuyến.
        </p>
      </div>
    </footer>
  );
}
