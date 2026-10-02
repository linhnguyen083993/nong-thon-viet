import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { togglePublish } from "../actions";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ProductVisual } from "@/components/site/ProductVisual";
import type { Product } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/types";

export const metadata = { title: "Sản phẩm" };

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin">) {
  const { supabase } = await requireAdmin();
  const { "da-luu": saved } = await searchParams;
  const { data, error } = await supabase.from("products").select("*").order("sort_order", { ascending: true });
  const products = (data ?? []) as Product[];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-tight text-4xl sm:text-5xl">Sản phẩm</h1>
          <p className="mt-2 text-sm text-rang-soft">
            {products.length} sản phẩm · {products.filter((p) => p.is_published).length} đang hiển thị
          </p>
        </div>
        <Link
          href="/admin/san-pham/moi"
          className="inline-flex items-center gap-2 rounded-full bg-la px-5 py-3 text-sm font-semibold text-hoa"
        >
          <Plus className="size-4" aria-hidden="true" /> Thêm sản phẩm
        </Link>
      </div>

      {saved && (
        <p role="status" className="mt-6 rounded-xl bg-la/10 px-4 py-3 text-sm text-la">
          Đã lưu sản phẩm. Website đã được cập nhật.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-qua/10 px-4 py-3 text-sm text-qua">
          Không tải được danh sách: {error.message}
        </p>
      )}

      {products.length === 0 && !error ? (
        <div className="mt-10 rounded-3xl border border-dashed border-rang/20 p-12 text-center">
          <p className="font-display text-xl font-semibold">Chưa có sản phẩm nào</p>
          <p className="mt-2 text-sm text-rang-soft">Thêm sản phẩm đầu tiên để hiển thị trên trang chủ.</p>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-rang/10 rounded-3xl border border-rang/10 bg-white">
          {products.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4 sm:flex-nowrap sm:gap-5 sm:p-5">
              <ProductVisual product={p} sizes="64px" className="size-16 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1 basis-40 sm:basis-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/san-pham/${p.id}`} className="truncate font-display text-lg font-semibold hover:underline">
                    {p.name}
                  </Link>
                  {!p.is_published && (
                    <span className="rounded-full bg-rang/8 px-2.5 py-0.5 text-xs text-rang-soft">Đang ẩn</span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm text-rang-soft">
                  {CATEGORY_LABEL[p.category]} · /san-pham/{p.slug}
                </p>
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-1">
                <form action={togglePublish}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="next" value={String(!p.is_published)} />
                  <button
                    type="submit"
                    className="grid size-11 place-items-center rounded-xl sm:size-10 text-rang-soft hover:bg-rang/5 hover:text-rang"
                    aria-label={p.is_published ? `Ẩn ${p.name} khỏi website` : `Hiển thị ${p.name} trên website`}
                    title={p.is_published ? "Ẩn khỏi website" : "Hiển thị trên website"}
                  >
                    {p.is_published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>
                </form>
                <Link
                  href={`/admin/san-pham/${p.id}`}
                  className="grid size-11 place-items-center rounded-xl sm:size-10 text-rang-soft hover:bg-rang/5 hover:text-rang"
                  aria-label={`Sửa ${p.name}`}
                >
                  <Pencil className="size-4" />
                </Link>
                <DeleteProductButton id={p.id} name={p.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
