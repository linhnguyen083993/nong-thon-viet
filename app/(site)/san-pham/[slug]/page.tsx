import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Phone } from "lucide-react";
import { Header } from "@/components/site/Header";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductVisual } from "@/components/site/ProductVisual";
import { getProductBySlug, getPublishedProducts, getSettings } from "@/lib/data";
import { formatPhone, paragraphs, telHref } from "@/lib/format";
import { CATEGORY_LABEL } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/san-pham/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  return {
    title: product.name,
    description: product.short_description,
    openGraph: { title: product.name, description: product.short_description, images: product.image_url ? [product.image_url] : undefined },
  };
}

export default async function ProductPage({ params }: PageProps<"/san-pham/[slug]">) {
  const { slug } = await params;
  const [product, all, settings] = await Promise.all([getProductBySlug(slug), getPublishedProducts(), getSettings()]);
  if (!product) notFound();
  const others = all
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="px-5 pt-28 pb-24 sm:px-8 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Đường dẫn" className="text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-ink">Trang chủ</Link></li>
              <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
              <li><Link href="/#san-pham" className="hover:text-ink">Sản phẩm</Link></li>
              <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
              <li aria-current="page" className="text-ink">{product.name}</li>
            </ol>
          </nav>

          <article className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <ProductVisual
              product={product}
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="aspect-[4/3] rounded-[2rem] lg:sticky lg:top-28 lg:col-span-7 lg:self-start"
            />
            <div className="lg:col-span-5">
              <p className="text-sm text-muted">{CATEGORY_LABEL[product.category]}</p>
              <h1 className="mt-2 serif-title text-[clamp(2.6rem,5vw,4.25rem)]">{product.name}</h1>
              <p className="prose-body mt-5 text-lg text-ink/85">{product.short_description}</p>
              <div className="mt-6 space-y-4">
                {paragraphs(product.description).map((para, i) => (
                  <p key={i} className="prose-body text-muted">{para}</p>
                ))}
              </div>

              {product.specs.length > 0 && (
                <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
                  {product.specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3.5 text-[0.95rem]">
                      <dt className="text-muted">{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="grain mt-10 rounded-3xl bg-forest p-7 text-ivory">
                <p className="serif-title text-2xl">Muốn lấy hàng hoặc làm đại lý?</p>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">
                  Trang này chỉ giới thiệu sản phẩm. Liên hệ hợp tác xã để hỏi quy cách, số lượng và điểm bán gần bạn.
                </p>
                <a href={telHref(settings.phone)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink hover:bg-brass-2">
                  <Phone className="size-4" aria-hidden="true" /> Gọi {formatPhone(settings.phone)}
                </a>
              </div>
            </div>
          </article>

          {others.length > 0 && (
            <section className="mt-28">
              <h2 className="serif-title text-[clamp(2rem,3.6vw,2.75rem)]">Có thể bạn quan tâm</h2>
              <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((p) => (
                  <li key={p.id}><ProductCard product={p} /></li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
