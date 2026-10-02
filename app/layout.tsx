import type { Metadata, Viewport } from "next";
import "@fontsource-variable/noto-serif-display/wdth.css";
import "@fontsource/be-vietnam-pro/300.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "./globals.css";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nông Thôn Việt — Cà phê, mật ong, hồ tiêu Buôn Đôn",
    template: "%s · Nông Thôn Việt",
  },
  description:
    "Hợp Tác Xã Nông Nghiệp Và Dịch Vụ Nông Thôn Việt: cà phê bột, mật ong hoa cà phê, tiêu đen và tiêu sọ từ xã Ea Nuôl (vùng Buôn Đôn), Đắk Lắk.",
  openGraph: { type: "website", locale: "vi_VN", siteName: "Nông Thôn Việt" },
};

export const viewport: Viewport = {
  themeColor: "#1d1612",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
