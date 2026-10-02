import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import type { Product } from "@/lib/types";

export const metadata = { title: "Sửa sản phẩm" };

export default async function EditProductPage({ params }: PageProps<"/admin/san-pham/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const product = data as Product;

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin" className="text-sm text-rang-soft hover:text-rang">
        Sản phẩm
      </Link>
      <div className="mt-2 mb-10 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display-tight text-5xl">{product.name}</h1>
        {product.is_published && (
          <a href={`/san-pham/${product.slug}`} target="_blank" className="text-sm font-semibold text-la hover:underline">
            Xem trên website
          </a>
        )}
      </div>
      <ProductForm product={product} />
    </div>
  );
}
