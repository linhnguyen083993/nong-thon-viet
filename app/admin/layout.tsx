import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s · Quản trị Nông Thôn Việt" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-hoa font-ui">{children}</div>;
}
