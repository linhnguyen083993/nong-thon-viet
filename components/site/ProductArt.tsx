import type { ProductArt as Art } from "@/lib/types";
import { Blossom } from "./Logo";

/** Nền thay thế khi sản phẩm chưa có ảnh chụp (đặt cùng ProductArt). */
export const ART_BG: Record<Art, string> = {
  coffee: "bg-[radial-gradient(circle_at_30%_25%,#4a3528,#2a201a_70%)]",
  honey: "bg-[radial-gradient(circle_at_30%_25%,#8a6224,#4a3214_75%)]",
  "pepper-black": "bg-[radial-gradient(circle_at_30%_25%,#3a2d24,#1d1612_70%)]",
  "pepper-white": "bg-[radial-gradient(circle_at_30%_25%,#f2efe8,#dcd7cc_75%)]",
};

const LIGHT: Art[] = ["pepper-white"];

/** Dấu hoa mờ ở giữa khung — tinh gọn, không cạnh tranh với ảnh chụp thật của sản phẩm khác. */
export function ProductArt({ art, className = "" }: { art: Art; className?: string }) {
  const light = LIGHT.includes(art);
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Ảnh sản phẩm đang được cập nhật">
      <g transform="translate(200 150) scale(1.15)" opacity={light ? 0.35 : 0.5}>
        <Blossom petal={light ? "#b8893b" : "#d6b06a"} core={light ? "#6f625a" : "#efe9df"} />
      </g>
    </svg>
  );
}
