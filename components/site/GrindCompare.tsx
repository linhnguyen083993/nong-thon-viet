"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MoveHorizontal } from "lucide-react";

export const PAIRS = {
  den: {
    label: "Tiêu đen",
    whole: { src: "/images/tieu-den.webp", alt: "Tiêu đen nguyên hạt trong chén đá", slug: "tieu-den" },
    ground: { src: "/images/tieu-den-xay.webp", alt: "Tiêu đen xay trong chén đá", slug: "tieu-den-xay" },
  },
  so: {
    label: "Tiêu sọ",
    whole: { src: "/images/tieu-so.webp", alt: "Tiêu sọ nguyên hạt trong chén gốm", slug: "tieu-so" },
    ground: { src: "/images/tieu-so-xay.webp", alt: "Tiêu sọ xay mịn trong chén gốm", slug: "tieu-so-xay" },
  },
} as const;
type Pair = keyof typeof PAIRS;

/** Thanh trượt so sánh cùng một chén tiêu: nguyên hạt ⟷ đã xay. */
export function GrindCompare() {
  const [pair, setPair] = useState<Pair>("den");
  const [pos, setPos] = useState(50);
  const p = PAIRS[pair];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div>
        <h2 className="serif-title text-[clamp(2.4rem,4.6vw,3.75rem)]">Nguyên hạt hay xay sẵn?</h2>
        <p className="prose-body mt-6 text-ivory/75">
          Tiêu nguyên hạt giữ tinh dầu và mùi thơm lâu hơn, hợp với cối xay ở bếp. Tiêu xay sẵn tiện dùng ngay mỗi
          ngày. Hợp tác xã làm cả hai dạng cho tiêu đen và tiêu sọ.
        </p>
        <div role="group" aria-label="Chọn loại tiêu" className="mt-8 inline-flex rounded-full bg-ivory/8 p-1">
          {(Object.keys(PAIRS) as Pair[]).map((k) => (
            <button
              key={k}
              type="button"
              data-pair={k}
              onClick={() => setPair(k)}
              aria-pressed={pair === k}
              className={`min-h-11 rounded-full px-5 py-2 text-sm transition-colors ${
                pair === k ? "bg-ivory text-ink" : "text-ivory/70 hover:text-ivory"
              }`}
            >
              {PAIRS[k].label}
            </button>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 text-sm">
          <Link data-link="whole" href={`/san-pham/${p.whole.slug}`} className="inline-flex min-h-11 items-center text-brass-2 underline-offset-4 hover:underline">
            Xem {p.label.toLowerCase()} hạt
          </Link>
          <Link data-link="ground" href={`/san-pham/${p.ground.slug}`} className="inline-flex min-h-11 items-center text-brass-2 underline-offset-4 hover:underline">
            Xem {p.label.toLowerCase()} xay
          </Link>
        </div>
      </div>

      <div data-compare className="relative aspect-[11/6] touch-pan-y overflow-hidden rounded-2xl bg-ink-2 select-none sm:rounded-3xl">
        <Image data-compare-img="ground" src={p.ground.src} alt={p.ground.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
        <div data-compare-top className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image data-compare-img="whole" src={p.whole.src} alt={p.whole.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
        </div>
        <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-ink/60 px-3 py-1.5 text-xs text-ivory backdrop-blur-md">
          Nguyên hạt
        </span>
        <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-ink/60 px-3 py-1.5 text-xs text-ivory backdrop-blur-md">
          Đã xay
        </span>
        <div data-compare-handle className="pointer-events-none absolute inset-y-0 w-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -left-px w-0.5 bg-ivory/90" />
          <div className="absolute top-1/2 left-0 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory text-ink shadow-lg">
            <MoveHorizontal className="size-5" aria-hidden="true" />
          </div>
        </div>
        <input
          data-compare-range
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Kéo để so sánh tiêu nguyên hạt và tiêu đã xay"
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
    </div>
  );
}
