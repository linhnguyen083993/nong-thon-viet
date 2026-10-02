import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Thêm sản phẩm" };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin" className="text-sm text-rang-soft hover:text-rang">
        Sản phẩm
      </Link>
      <h1 className="display-tight mt-2 mb-10 text-5xl">Thêm sản phẩm</h1>
      <ProductForm />
    </div>
  );
}
