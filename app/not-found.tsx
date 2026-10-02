import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grain grid min-h-dvh place-items-center bg-bazan px-6 text-center text-hoa">
      <div>
        <p className="display-tight text-[clamp(5rem,18vw,12rem)] text-mat">404</p>
        <p className="prose-body mx-auto mt-4 text-lg text-hoa/80">Trang này không tồn tại hoặc sản phẩm đã ngừng giới thiệu.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-hoa px-6 py-3 font-ui font-semibold text-rang">
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
