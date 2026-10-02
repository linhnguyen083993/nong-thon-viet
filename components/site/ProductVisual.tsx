import Image from "next/image";
import type { Product } from "@/lib/types";
import { ART_BG, ProductArt } from "./ProductArt";

export function ProductVisual({
  product,
  className = "",
  imgClassName = "",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  product: Product;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${product.image_url ? "bg-ink-2" : ART_BG[product.art]} ${className}`}>
      {product.image_url ? (
        <Image src={product.image_url} alt={product.name} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} />
      ) : (
        <ProductArt art={product.art} className="absolute inset-0 m-auto size-1/2" />
      )}
    </div>
  );
}
