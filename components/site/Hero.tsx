"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, Phone } from "lucide-react";
import { formatPhone, telHref } from "@/lib/format";

const STATIC = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";
const LINES = ["Cà phê, mật ong", "và hồ tiêu từ", "đất đỏ Buôn Đôn"];

export function Hero({ phone, taxCode, founded }: { phone: string; taxCode: string; founded: string }) {
  const reduce = useReducedMotion() || STATIC;
  const year = founded.split("/").pop();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative isolate flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-ink text-ivory">
      {/* Mobile: ảnh chiếm nửa trên và tan dần vào nền tối; desktop: ảnh phủ kín */}
      <motion.div
        data-hero-img
        className="absolute inset-x-0 top-0 -z-10 h-[56%] md:inset-0 md:h-auto"
        initial={reduce ? false : { scale: 1.14 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease }}
      >
        <Image
          src="/images/tieu-den.webp"
          alt="Chén tiêu đen nguyên hạt trên bàn gỗ, bên cạnh cối xay tiêu bằng đồng"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_center] md:object-[64%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/45 md:hidden" />
      </motion.div>
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-ink via-ink/75 to-ink/10 md:block" />
      <div className="absolute inset-x-0 bottom-0 -z-10 hidden h-2/3 bg-gradient-to-t from-ink via-ink/50 to-transparent md:block" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pt-28 pb-8 sm:px-8 md:pt-32 md:pb-20">
        <h1 className="serif-title text-[clamp(2.5rem,6.6vw,6.25rem)]">
          {LINES.map((line, i) => (
            <span key={line} className="-mt-[0.2em] block overflow-hidden pt-[0.2em] pb-[0.05em] first:mt-0">
              <motion.span
                data-line={i}
                className="block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.25 + i * 0.12, duration: 1, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          data-hero-copy
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease }}
        >
          <p className="prose-body mt-5 max-w-[44ch] text-base text-ivory/80 sm:mt-7 sm:text-lg">
            Hợp tác xã của những người trồng cà phê, hồ tiêu và nuôi ong ở xã Ea Nuôl, Đắk Lắk. Thu hái, sơ chế và
            đóng gói ngay tại vùng trồng.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 sm:mt-9">
            <a
              href="#san-pham"
              className="inline-flex items-center gap-2 rounded-full bg-brass px-7 py-3.5 text-[0.95rem] font-medium text-ink transition-colors hover:bg-brass-2"
            >
              Xem sản phẩm <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <a
              href={telHref(phone)}
              className="inline-flex items-center gap-2 rounded-full border border-ivory/25 bg-ivory/5 px-6 py-3.5 text-[0.95rem] backdrop-blur-sm transition-colors hover:bg-ivory/10"
            >
              <Phone className="size-4" aria-hidden="true" />
              {formatPhone(phone)}
            </a>
          </div>
        </motion.div>
      </div>

      <dl className="border-t border-ivory/12 bg-ink/40 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-3 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-xs sm:gap-4 sm:px-8 sm:py-5 sm:text-sm">
          <div>
            <dt className="text-ivory/50">Vùng trồng</dt>
            <dd className="mt-1 text-ivory">Ea Nuôl, Đắk Lắk</dd>
          </div>
          <div>
            <dt className="text-ivory/50">Thành lập</dt>
            <dd className="mt-1 text-ivory">Năm {year}</dd>
          </div>
          <div>
            <dt className="text-ivory/50">Mã số thuế</dt>
            <dd className="mt-1 tabular-nums text-ivory">{taxCode}</dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
