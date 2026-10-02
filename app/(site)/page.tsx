import { MapPin, MessageCircle, Phone } from "lucide-react";
import { GrindCompare } from "@/components/site/GrindCompare";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Process } from "@/components/site/Process";
import { ProductGrid } from "@/components/site/ProductGrid";
import { SeasonWheel } from "@/components/site/SeasonWheel";
import { getPublishedProducts, getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { formatPhone, telHref } from "@/lib/format";

export const revalidate = 3600;

export default async function HomePage() {
  const [products, settings] = await Promise.all([getPublishedProducts(), getSettings()]);
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
  const zaloHref = `https://zalo.me/${settings.phone.replace(/\D/g, "")}`;
  const hasPepperPhotos = ["tieu-den", "tieu-den-xay", "tieu-so", "tieu-so-xay"].every((s) =>
    products.some((p) => p.slug === s),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.full_name,
    alternateName: settings.short_name,
    url: SITE_URL,
    taxID: settings.tax_code,
    telephone: settings.phone,
    address: { "@type": "PostalAddress", streetAddress: settings.address, addressRegion: "Đắk Lắk", addressCountry: "VN" },
  };

  const registry = [
    ["Tên đầy đủ", settings.full_name],
    ["Mã số thuế", settings.tax_code],
    ["Ngày thành lập", settings.founded_on],
    ["Đại diện pháp luật", settings.legal_representative],
    ["Trụ sở", settings.address],
    ["Lĩnh vực", "Trồng cà phê, hồ tiêu; chế biến và bảo quản nông sản; xay xát; bán buôn nông sản"],
  ].filter(([, v]) => v);

  return (
    <>
      <Header />
      <main>
        <Hero phone={settings.phone} taxCode={settings.tax_code} founded={settings.founded_on} />

        <section id="san-pham" className="px-5 py-16 sm:px-8 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 grid gap-4 md:mb-12 md:grid-cols-2 md:items-end md:gap-6">
              <h2 className="serif-title text-[clamp(2.1rem,4.6vw,3.75rem)]">Sản phẩm</h2>
              <p className="prose-body text-muted md:justify-self-end md:text-right">
                Cà phê rang xay, mật ong từ mùa hoa cà phê, tiêu đen và tiêu sọ — sơ chế và đóng gói tại vùng trồng.
              </p>
            </div>
            <ProductGrid products={products} />
          </div>
        </section>

        <section id="quy-trinh" className="bg-stone-2 px-5 py-16 sm:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <Process />
          </div>
        </section>

        {hasPepperPhotos && (
          <section id="hat-va-xay" className="grain bg-ink px-5 py-16 text-ivory sm:px-8 md:py-32">
            <div className="mx-auto max-w-7xl">
              <GrindCompare />
            </div>
          </section>
        )}

        <section id="hop-tac-xa" className="px-5 py-16 sm:px-8 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 className="serif-title text-[clamp(2.1rem,4.6vw,3.75rem)]">Một hợp tác xã, nhiều vườn nhà</h2>
              <p className="prose-body mt-6 text-lg text-ink/80">{settings.intro}</p>
            </div>
            <div className="rounded-2xl border border-leaf/20 bg-stone-2/60 p-5 sm:rounded-3xl sm:p-9 lg:col-span-5 lg:col-start-8">
              <h3 className="text-sm font-medium text-muted">Hồ sơ đăng ký</h3>
              <dl className="mt-4 divide-y divide-ink/10">
                {registry.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 py-3 text-[0.95rem] sm:grid-cols-[8.5rem_1fr] sm:gap-4 sm:py-3.5">
                    <dt className="text-muted">{k}</dt>
                    <dd className="tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="mua-vu" className="bg-forest px-5 py-16 text-ivory sm:px-8 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 max-w-2xl">
              <h2 className="serif-title text-[clamp(2.1rem,4.6vw,3.75rem)]">Một năm ở vườn</h2>
              <p className="prose-body mt-5 text-ivory/75">
                Mỗi sản phẩm gắn với một mùa. Chọn một tháng để xem vườn cà phê và hồ tiêu ở Ea Nuôl đang ra sao.
              </p>
            </div>
            <SeasonWheel />
            <p className="mt-12 text-xs text-ivory/45">Lịch mang tính tham khảo, có thể sớm hoặc muộn hơn tuỳ thời tiết từng năm.</p>
          </div>
        </section>

        <section id="lien-he" className="px-5 py-16 sm:px-8 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <h2 className="serif-title text-[clamp(2.1rem,4.6vw,3.75rem)]">Hợp tác phân phối</h2>
              <p className="prose-body mt-6 text-lg text-ink/80">{settings.distribution}</p>
              <p className="prose-body mt-4 text-muted">
                Hỏi về quy cách đóng gói, số lượng hay điểm bán gần bạn — gọi trực tiếp cho hợp tác xã.
              </p>
            </div>
            <div className="grain rounded-3xl bg-forest p-6 text-ivory sm:rounded-[2rem] sm:p-12 lg:col-span-6 lg:col-start-7">
              <p className="text-sm text-ivory/55">Điện thoại</p>
              <a href={telHref(settings.phone)} className="mt-2 block w-fit serif-title text-[clamp(2.5rem,5vw,4.25rem)] tabular-nums hover:text-brass-2">
                {formatPhone(settings.phone)}
              </a>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={telHref(settings.phone)} className="inline-flex items-center gap-2 rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink hover:bg-brass-2">
                  <Phone className="size-4" aria-hidden="true" /> Gọi điện
                </a>
                <a href={zaloHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-6 py-3 text-sm hover:bg-ivory/8">
                  <MessageCircle className="size-4" aria-hidden="true" /> Nhắn Zalo
                </a>
              </div>
              <div className="mt-10 border-t border-ivory/12 pt-8">
                <p className="text-sm text-ivory/55">Địa chỉ</p>
                <p className="mt-2 text-lg leading-relaxed">{settings.address}</p>
                <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="-ml-1 mt-2 inline-flex min-h-11 items-center gap-2 px-1 text-sm text-leaf-2 underline-offset-4 hover:underline">
                  <MapPin className="size-4" aria-hidden="true" /> Mở bản đồ chỉ đường
                </a>
                {settings.email && (
                  <>
                    <p className="mt-6 text-sm text-ivory/55">Email</p>
                    <a href={`mailto:${settings.email}`} className="mt-2 block text-lg hover:text-brass-2">{settings.email}</a>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
