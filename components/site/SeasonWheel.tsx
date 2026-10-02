"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

type Ring = { key: string; label: string; months: [number, number]; color: string; outline?: boolean };

const RINGS: Ring[] = [
  { key: "hoa", label: "Cà phê ra hoa", months: [1, 3], color: "#efe9df" },
  { key: "mat", label: "Ong lấy mật hoa cà phê", months: [2, 3], color: "#b8893b" },
  { key: "tieu", label: "Thu hái hồ tiêu", months: [1, 4], color: "#120d0a", outline: true },
  { key: "caphe", label: "Thu hái cà phê", months: [10, 12], color: "#b4402f" },
];

const MONTHS: Record<number, { text: string; products: string[] }> = {
  1: { text: "Cuối mùa khô. Vườn tiêu vào vụ hái, cà phê được tưới đợt đầu để chuẩn bị ra hoa.", products: ["Tiêu đen", "Tiêu sọ"] },
  2: { text: "Sau đợt tưới, hoa cà phê nở trắng vườn chỉ trong vài ngày. Thùng ong được đặt giữa lô để lấy mật.", products: ["Mật ong hoa cà phê", "Tiêu đen"] },
  3: { text: "Những đợt hoa cuối, mùa mật ong hoa cà phê. Tiêu hái về được phơi và sàng hạt.", products: ["Mật ong hoa cà phê", "Tiêu đen", "Tiêu sọ"] },
  4: { text: "Quả cà phê non đậu kín cành. Vụ tiêu khép lại, hạt chín được ngâm, bóc vỏ làm tiêu sọ.", products: ["Tiêu sọ"] },
  5: { text: "Những cơn mưa đầu mùa. Xã viên bón phân, làm cỏ, chăm lại vườn sau vụ.", products: [] },
  6: { text: "Mùa mưa. Quả cà phê lớn dần, vườn tiêu ra chùm bông mới.", products: [] },
  7: { text: "Giữa mùa mưa. Tỉa cành, giữ gốc thông thoáng cho cà phê và tiêu.", products: [] },
  8: { text: "Quả cà phê căng, chuyển dần sang màu vàng xanh. Chùm tiêu non nuôi hạt.", products: [] },
  9: { text: "Cuối mùa mưa. Chuẩn bị sân phơi, kho và máy móc cho vụ thu hoạch.", products: [] },
  10: { text: "Cà phê bắt đầu chín đỏ. Vụ thu hái mở màn, chỉ hái những chùm đã chín.", products: ["Cà phê bột"] },
  11: { text: "Thu hoạch rộ. Hạt được phơi, sơ chế và cất kho ngay tại vùng trồng.", products: ["Cà phê bột"] },
  12: { text: "Cuối vụ cà phê. Mẻ hạt mới được rang xay, đóng gói cho mùa Tết.", products: ["Cà phê bột"] },
};

const C = 200;
const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};
const monthAngle = (m: number) => (m - 1) * 30 - 90;

function arc(r: number, from: number, to: number) {
  const [x0, y0] = polar(r, from);
  const [x1, y1] = polar(r, to);
  return `M${x0} ${y0} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x1} ${y1}`;
}
function wedge(rIn: number, rOut: number, from: number, to: number) {
  const [a, b] = polar(rOut, from);
  const [c, d] = polar(rOut, to);
  const [e, f] = polar(rIn, to);
  const [g, h] = polar(rIn, from);
  return `M${a} ${b} A${rOut} ${rOut} 0 0 1 ${c} ${d} L${e} ${f} A${rIn} ${rIn} 0 0 0 ${g} ${h} Z`;
}

export function SeasonWheel() {
  const [month, setMonth] = useState(2);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  // Khi người xem cuộn tới, kim quay về tháng hiện tại.
  useEffect(() => {
    if (inView) setMonth(new Date().getMonth() + 1);
  }, [inView]);

  const info = MONTHS[month];
  const active = RINGS.filter((r) => month >= r.months[0] && month <= r.months[1]);

  return (
    <div ref={ref} data-season-wheel className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <div className="relative mx-auto w-full max-w-[520px]">
        <svg viewBox="0 0 400 400" className="w-full" role="img" aria-label="Lịch mùa vụ 12 tháng">
          {/* nền tháng */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <path
              key={m}
              d={wedge(70, 176, monthAngle(m), monthAngle(m) + 30)}
              fill={m === month ? "rgba(239,233,223,0.12)" : "transparent"}
              stroke="rgba(239,233,223,0.12)"
              strokeWidth="1"
              className="cursor-pointer transition-[fill] duration-300"
              onClick={() => setMonth(m)}
            />
          ))}
          {/* vòng mùa vụ */}
          {RINGS.map((ring, i) => {
            const r = 160 - i * 24;
            const from = monthAngle(ring.months[0]) + 2;
            const to = monthAngle(ring.months[1]) + 28;
            return (
              <g key={ring.key} pointerEvents="none">
                {ring.outline && <path d={arc(r, from, to)} stroke="rgba(239,233,223,0.45)" strokeWidth="18" strokeLinecap="round" fill="none" />}
                <path d={arc(r, from, to)} stroke={ring.color} strokeWidth={ring.outline ? 15 : 16} strokeLinecap="round" fill="none" />
              </g>
            );
          })}
          {/* nhãn tháng */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
            const [x, y] = polar(190, monthAngle(m) + 15);
            return (
              <text
                key={m}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-ui"
                fontSize="12"
                fontWeight={m === month ? 700 : 500}
                fill={m === month ? "#d6b06a" : "rgba(239,233,223,0.6)"}
                pointerEvents="none"
              >
                {m}
              </text>
            );
          })}
          {/* kim */}
          <motion.g
            animate={{ rotate: (month - 1) * 30 + 15 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 14 }}
            style={{ originX: 0.5, originY: 0.5 }}
            initial={false}
          >
            <rect width="400" height="400" fill="none" />
            <line x1="200" y1="200" x2="200" y2="30" stroke="#d6b06a" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="200" cy="30" r="5" fill="#d6b06a" />
          </motion.g>
          <circle cx="200" cy="200" r="62" fill="#1f3327" />
          <text x="200" y="186" textAnchor="middle" className="font-ui" fontSize="14" fill="rgba(239,233,223,0.65)">
            Tháng
          </text>
          <text x="200" y="222" textAnchor="middle" className="serif-title" fontSize="48" fill="#efe9df">
            {month}
          </text>
        </svg>
      </div>

      <div>
        <div aria-live="polite" className="min-h-[13rem]">
          <p className="serif-title text-5xl sm:text-6xl">Tháng {month}</p>
          <p className="prose-body mt-5 text-lg text-ivory/80">{info.text}</p>
          {info.products.length > 0 && (
            <p className="mt-5 font-ui text-sm text-ivory/65">
              Sản phẩm từ mùa này: <span className="text-ivory">{info.products.join(", ")}</span>
            </p>
          )}
        </div>

        <div role="group" aria-label="Chọn tháng" className="mt-8 grid grid-cols-6 gap-2 font-ui">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonth(m)}
              aria-pressed={m === month}
              className={`h-11 rounded-xl text-sm font-medium transition-colors ${
                m === month ? "bg-brass text-ink" : "bg-ivory/8 text-ivory/80 hover:bg-ivory/15"
              }`}
            >
              T{m}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-2.5 font-ui text-sm sm:grid-cols-2">
          {RINGS.map((ring) => {
            const on = active.includes(ring);
            return (
              <li key={ring.key} className={`flex items-center gap-3 transition-opacity ${on ? "opacity-100" : "opacity-55"}`}>
                <span
                  className="h-2.5 w-7 shrink-0 rounded-full"
                  style={{ background: ring.color, boxShadow: ring.outline ? "0 0 0 1.5px rgba(239,233,223,.45)" : undefined }}
                />
                <span>
                  {ring.label}
                  <span className="text-ivory/50">
                    {" "}
                    (T{ring.months[0]}–T{ring.months[1]})
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
