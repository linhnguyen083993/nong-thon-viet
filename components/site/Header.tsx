"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./Logo";

export const NAV = [
  { href: "/#san-pham", label: "Sản phẩm" },
  { href: "/#quy-trinh", label: "Quy trình" },
  { href: "/#hat-va-xay", label: "Hạt & xay" },
  { href: "/#mua-vu", label: "Mùa vụ" },
  { href: "/#hop-tac-xa", label: "Về hợp tác xã" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border border-ivory/10 bg-ink/85 pr-1.5 pl-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:pr-2 sm:pl-5">
        <Link href="/" aria-label="Trang chủ Nông Thôn Việt" className="flex min-h-11 items-center rounded-full">
          <Wordmark />
        </Link>
        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-sm text-ivory/75">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="rounded-full px-4 py-2 transition-colors hover:bg-ivory/8 hover:text-ivory">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1.5">
          <a
            href="/#lien-he"
            className="hidden rounded-full bg-brass px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-brass-2 sm:inline-block lg:inline-block"
          >
            Liên hệ hợp tác
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid size-11 place-items-center rounded-full text-ivory hover:bg-ivory/10 lg:hidden"
            aria-label="Mở menu"
            aria-expanded={open}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-ivory lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-14 shrink-0 items-center justify-between pl-2">
              <Wordmark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-11 place-items-center rounded-full hover:bg-ivory/10"
                aria-label="Đóng menu"
                autoFocus
              >
                <X className="size-5" />
              </button>
            </div>
            <ul className="mt-8 space-y-0.5 pl-2">
              {[...NAV, { href: "/#lien-he", label: "Liên hệ" }].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a href={item.href} onClick={() => setOpen(false)} className="block py-2 serif-title text-[2.25rem] sm:text-[2.6rem]">
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
