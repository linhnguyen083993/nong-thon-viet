"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { saveProduct } from "@/app/admin/actions";
import { ProductArt } from "@/components/site/ProductArt";
import { ART_BG } from "@/components/site/ProductArt";
import { slugify } from "@/lib/format";
import type { Product, ProductSpec } from "@/lib/types";
import { ART_LABEL, CATEGORY_LABEL } from "@/lib/types";
import { Field, FormMessage, SubmitButton, inputCls, submitKeepingValues } from "./ui";

const EMPTY: Product = {
  id: "",
  slug: "",
  name: "",
  category: "ca-phe",
  art: "coffee",
  short_description: "",
  description: "",
  specs: [{ label: "Nguồn gốc", value: "Ea Nuôl, Đắk Lắk" }],
  image_url: null,
  sort_order: 0,
  is_published: true,
};

export function ProductForm({ product }: { product?: Product }) {
  const p = product ?? EMPTY;
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [name, setName] = useState(p.name);
  const [slug, setSlug] = useState(p.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(p.slug));
  const [art, setArt] = useState(p.art);
  const [specs, setSpecs] = useState<ProductSpec[]>(p.specs);
  const [preview, setPreview] = useState<string | null>(p.image_url);
  const [removeImage, setRemoveImage] = useState(false);
  const fe = state?.fieldErrors ?? {};

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const updateSpec = (i: number, key: keyof ProductSpec, value: string) =>
    setSpecs((s) => s.map((row, j) => (j === i ? { ...row, [key]: value } : row)));

  return (
    <form onSubmit={submitKeepingValues(action, startTransition)} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <input type="hidden" name="id" value={p.id} />
      <input type="hidden" name="current_image_url" value={p.image_url ?? ""} />
      <input type="hidden" name="specs" value={JSON.stringify(specs)} />

      <div className="space-y-6">
        <FormMessage error={state?.error} />

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Tên sản phẩm" htmlFor="name" error={fe.name}>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(fe.name)}
              className={inputCls}
              placeholder="Ví dụ: Cà phê bột"
            />
          </Field>
          <Field label="Đường dẫn" htmlFor="slug" hint={`Trang sẽ ở /san-pham/${slug || "…"}`} error={fe.slug}>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              aria-invalid={Boolean(fe.slug)}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Nhóm sản phẩm" htmlFor="category" error={fe.category}>
            <select id="category" name="category" defaultValue={p.category} className={inputCls}>
              {Object.entries(CATEGORY_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Thứ tự hiển thị" htmlFor="sort_order" hint="Số nhỏ hiển thị trước">
            <input id="sort_order" name="sort_order" type="number" defaultValue={p.sort_order} className={inputCls} />
          </Field>
          <div className="flex items-end pb-2.5">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 font-ui text-sm font-semibold">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={p.is_published}
                className="size-5 rounded accent-[var(--color-la)]"
              />
              Hiển thị trên website
            </label>
          </div>
        </div>

        <Field label="Mô tả ngắn" htmlFor="short_description" hint="Một câu, hiện ở trang chủ" error={fe.short_description}>
          <textarea
            id="short_description"
            name="short_description"
            rows={2}
            defaultValue={p.short_description}
            aria-invalid={Boolean(fe.short_description)}
            className={inputCls}
          />
        </Field>

        <Field label="Giới thiệu chi tiết" htmlFor="description" hint="Để một dòng trống giữa các đoạn">
          <textarea id="description" name="description" rows={8} defaultValue={p.description} className={inputCls} />
        </Field>

        <fieldset>
          <legend className="font-ui text-sm font-semibold">Thông số</legend>
          <p className="mt-0.5 font-ui text-xs text-rang-soft">
            Ví dụ: Quy cách đóng gói, Bảo quản, Hạn dùng. Hai dòng đầu hiện ở trang chủ.
          </p>
          <ul className="mt-3 space-y-4 sm:space-y-2.5">
            {specs.map((s, i) => (
              <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-1.5 sm:gap-y-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto]">
                <input
                  aria-label={`Tên thông số ${i + 1}`}
                  value={s.label}
                  onChange={(e) => updateSpec(i, "label", e.target.value)}
                  placeholder="Tên"
                  className={inputCls}
                />
                <input
                  aria-label={`Giá trị thông số ${i + 1}`}
                  value={s.value}
                  onChange={(e) => updateSpec(i, "value", e.target.value)}
                  placeholder="Nội dung"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setSpecs((rows) => rows.filter((_, j) => j !== i))}
                  className="grid size-11 place-items-center rounded-xl text-rang-soft hover:bg-qua/10 hover:text-qua max-sm:col-start-2 max-sm:row-span-2 max-sm:row-start-1 max-sm:self-center"
                  aria-label={`Xoá thông số ${s.label || i + 1}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setSpecs((rows) => [...rows, { label: "", value: "" }])}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-ui text-sm font-semibold text-la hover:bg-la/10"
          >
            <Plus className="size-4" aria-hidden="true" /> Thêm thông số
          </button>
        </fieldset>

        <div className="sticky bottom-0 z-10 -mx-5 flex items-center gap-3 border-t border-rang/10 bg-hoa/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:mx-0 sm:flex-wrap sm:bg-transparent sm:px-0 sm:pt-6 sm:pb-0 sm:backdrop-blur-none">
          <SubmitButton pending={pending} pendingText="Đang lưu…">{p.id ? "Lưu thay đổi" : "Thêm sản phẩm"}</SubmitButton>
          <Link href="/admin" className="inline-flex min-h-11 items-center rounded-full px-5 font-ui text-sm font-semibold text-rang-soft hover:bg-rang/5">
            Huỷ
          </Link>
        </div>
      </div>

      <aside className="order-first space-y-6 lg:order-none">
        <Field label="Ảnh sản phẩm" htmlFor="image" hint="JPG, PNG hoặc WebP, tối đa 5 MB. Tỉ lệ 4:5 hiển thị đẹp nhất." error={fe.image}>
          <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[4/5] ${ART_BG[art]}`}>
            {preview && !removeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Xem trước ảnh sản phẩm" className="absolute inset-0 size-full object-cover" />
            ) : (
              <ProductArt art={art} className="absolute inset-0 m-auto size-[86%]" />
            )}
          </div>
          <label
            htmlFor="image"
            className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-rang/25 px-4 py-3 font-ui text-sm font-semibold hover:border-la hover:text-la"
          >
            <ImagePlus className="size-4" aria-hidden="true" />
            {preview ? "Chọn ảnh khác" : "Tải ảnh lên"}
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setPreview(URL.createObjectURL(f));
                setRemoveImage(false);
              }
            }}
          />
          {p.image_url && (
            <label className="mt-1 flex min-h-11 items-center gap-2 font-ui text-sm">
              <input
                type="checkbox"
                name="remove_image"
                checked={removeImage}
                onChange={(e) => setRemoveImage(e.target.checked)}
                className="size-4 accent-[var(--color-qua)]"
              />
              Xoá ảnh, dùng hình minh hoạ
            </label>
          )}
        </Field>

        <Field label="Hình minh hoạ khi chưa có ảnh" htmlFor="art" error={fe.art}>
          <select id="art" name="art" value={art} onChange={(e) => setArt(e.target.value as Product["art"])} className={inputCls}>
            {Object.entries(ART_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
      </aside>
    </form>
  );
}
