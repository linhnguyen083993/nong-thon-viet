import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Thêm sản phẩm" };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin" className="inline-flex min-h-11 items-center text-sm text-rang-soft hover:text-rang">
        Sản phẩm
      </Link>
      <h1 className="display-tight mt-1 mb-8 text-4xl sm:mb-10 sm:text-5xl">Thêm sản phẩm</h1>
      <ProductForm />
    </div>
  );
}
