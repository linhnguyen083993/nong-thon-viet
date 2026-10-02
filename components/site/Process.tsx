import { Cherry, Package, Sprout, Sun } from "lucide-react";

const STEPS = [
  { icon: Sprout, title: "Chăm vườn", text: "Xã viên tự chăm vườn cà phê, hồ tiêu của gia đình trên đất đỏ bazan." },
  { icon: Cherry, title: "Thu hái khi chín", text: "Chỉ hái những chùm đã chín để hạt đủ hương vị." },
  { icon: Sun, title: "Phơi, sơ chế tại chỗ", text: "Hạt được phơi và sơ chế ngay tại vùng trồng, rút ngắn đường từ vườn đến xưởng." },
  { icon: Package, title: "Rang xay, đóng gói", text: "Hợp tác xã rang, xay và đóng gói tại địa phương." },
];

/** Quy trình từ vườn đến gói — các bước nối tiếp nhau nên được đánh số. */
export function Process() {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 md:items-end">
        <h2 className="serif-title text-[clamp(2.4rem,4.6vw,3.75rem)]">Từ vườn đến gói</h2>
        <p className="prose-body text-muted md:justify-self-end md:text-right">
          Mọi công đoạn diễn ra trong cùng một vùng trồng, do chính những người làm vườn đảm nhận.
        </p>
      </div>
      <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-leaf/15 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="relative bg-stone p-7 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-full bg-leaf/12 text-leaf">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="serif-title text-3xl text-leaf/40" aria-hidden="true">{i + 1}</span>
            </div>
            <h3 className="mt-8 serif-title text-2xl">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
            {i < STEPS.length - 1 && (
              <span aria-hidden="true" className="absolute top-1/2 -right-3 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full bg-stone text-leaf lg:grid">
                ›
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
