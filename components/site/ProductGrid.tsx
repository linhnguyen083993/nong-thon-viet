"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product, ProductCategory } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type Filter = "all" | ProductCategory;

export function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const cats = useMemo(
    () => (Object.keys(CATEGORY_LABEL) as ProductCategory[]).filter((c) => products.some((p) => p.category === c)),
    [products],
  );
  const shown = filter === "all" ? products : products.filter((p) => p.category === filter);

  if (products.length === 0) return <p className="text-muted">Danh mục sản phẩm đang được cập nhật.</p>;

  const chip = (value: Filter, label: string, count: number) => (
    <button
      key={value}
      type="button"
      data-filter={value}
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={`h-11 shrink-0 rounded-full px-5 text-sm transition-colors ${
        filter === value ? "bg-forest text-ivory" : "bg-stone-2 text-ink/75 hover:bg-leaf/15"
      }`}
    >
      {label} <span className="opacity-50">{count}</span>
    </button>
  );

  return (
    <div data-product-grid>
      {cats.length > 1 && (
        <div
          role="group"
          aria-label="Lọc theo nhóm sản phẩm"
          className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:mb-10 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {chip("all", "Tất cả", products.length)}
          {cats.map((c) => chip(c, CATEGORY_LABEL[c], products.filter((p) => p.category === c).length))}
        </div>
      )}
      <motion.ul layout className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <motion.li
              key={p.id}
              data-cat={p.category}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
