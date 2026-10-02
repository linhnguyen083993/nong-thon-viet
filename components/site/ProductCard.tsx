import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product: p, tone = "light" }: { product: Product; tone?: "light" | "dark" }) {
  const muted = tone === "light" ? "text-muted" : "text-ivory/55";
  return (
    <Link href={`/san-pham/${p.slug}`} className="group block rounded-3xl">
      <ProductVisual
        product={p}
        className="aspect-[4/3] rounded-3xl"
        imgClassName="transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.05]"
      />
      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <p className={`text-xs ${muted}`}>{CATEGORY_LABEL[p.category]}</p>
          <h3 className="mt-1.5 serif-title text-[1.65rem]">{p.name}</h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-relaxed ${muted}`}>{p.short_description}</p>
        </div>
        <span
          aria-hidden="true"
          className={`mt-1 grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 group-hover:border-forest group-hover:bg-forest group-hover:text-ivory ${
            tone === "light" ? "border-ink/15" : "border-ivory/20"
          }`}
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
