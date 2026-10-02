/** Dấu hiệu: một bông hoa cà phê năm cánh. */
export function BlossomMark({ className = "", petal = "currentColor", core = "#b8893b" }: { className?: string; petal?: string; core?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      <Blossom petal={petal} core={core} />
    </svg>
  );
}

/** Bông hoa vẽ quanh gốc toạ độ, bán kính ~46 — dùng bên trong SVG khác. */
export function Blossom({ petal = "currentColor", core = "#b8893b" }: { petal?: string; core?: string }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((r) => (
        <path key={r} d="M0 -6 C 9 -18, 10 -36, 0 -46 C -10 -36, -9 -18, 0 -6 Z" fill={petal} transform={`rotate(${r})`} />
      ))}
      <circle r="7" fill={core} />
    </g>
  );
}

export function Wordmark({ tone = "light" }: { tone?: "dark" | "light" }) {
  return (
    <span className={`flex items-center gap-2.5 ${tone === "light" ? "text-ivory" : "text-ink"}`}>
      <BlossomMark className="size-7 shrink-0" />
      <span className="leading-none">
        <span className="block font-display text-[1.05rem] font-medium tracking-tight">Nông Thôn Việt</span>
        <span className="mt-1 block font-ui text-[0.68rem] opacity-60">Hợp tác xã · Ea Nuôl, Đắk Lắk</span>
      </span>
    </span>
  );
}
