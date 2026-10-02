"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(`Xoá "${name}"? Sản phẩm và ảnh sẽ bị xoá vĩnh viễn.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="grid size-11 place-items-center rounded-xl sm:size-10 text-rang-soft hover:bg-qua/10 hover:text-qua"
        aria-label={`Xoá ${name}`}
      >
        <Trash2 className="size-4" />
      </button>
    </form>
  );
}
