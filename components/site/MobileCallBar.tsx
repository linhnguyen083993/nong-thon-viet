"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { formatPhone, telHref } from "@/lib/format";

/**
 * Thanh gọi nhanh dính đáy màn hình, chỉ hiện trên điện thoại/tablet nhỏ.
 * Xuất hiện sau khi cuộn qua phần mở đầu, ẩn khi người xem đã tới khối "Liên hệ".
 */
export function MobileCallBar({ phone }: { phone: string }) {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    setAtContact(false);
    const el = document.getElementById("lien-he");
    let io: IntersectionObserver | undefined;
    if (el) {
      io = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), { threshold: 0.2 });
      io.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [pathname]);

  const show = pastHero && !atContact;
  const zalo = `https://zalo.me/${phone.replace(/\D/g, "")}`;

  return (
    <div
      data-call-bar
      aria-hidden={!show}
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-300 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center gap-1.5 rounded-full border border-ivory/10 bg-ink/90 p-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <a
          href={telHref(phone)}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brass text-[0.95rem] font-medium text-ink active:bg-brass-2"
        >
          <Phone className="size-4" aria-hidden="true" />
          Gọi {formatPhone(phone)}
        </a>
        <a
          href={zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center gap-2 rounded-full px-5 text-[0.95rem] text-ivory active:bg-ivory/10"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Zalo
        </a>
      </div>
    </div>
  );
}
