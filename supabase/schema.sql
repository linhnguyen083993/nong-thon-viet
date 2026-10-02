-- =====================================================================
--  Nông Thôn Việt — cơ sở dữ liệu
--  Chạy toàn bộ file này một lần trong Supabase Dashboard → SQL Editor.
-- =====================================================================

-- ---------- Quản trị viên ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ---------- Sản phẩm ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('ca-phe', 'mat-ong', 'ho-tieu')),
  art text not null default 'coffee' check (art in ('coffee', 'honey', 'pepper-black', 'pepper-white')),
  short_description text not null default '',
  description text not null default '',
  specs jsonb not null default '[]'::jsonb,
  image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;

drop policy if exists "public read published products" on public.products;
create policy "public read published products" on public.products
  for select using (is_published or public.is_admin());

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Thông tin hợp tác xã (1 dòng duy nhất) ----------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  full_name text not null default '',
  short_name text not null default '',
  tax_code text not null default '',
  founded_on text not null default '',
  legal_representative text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  distribution text not null default '',
  intro text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select using (true);

drop policy if exists "admin write settings" on public.site_settings;
create policy "admin write settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Tự cập nhật updated_at ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists settings_touch on public.site_settings;
create trigger settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ---------- Kho ảnh sản phẩm ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

-- ---------- Dữ liệu khởi tạo ----------
insert into public.site_settings (id, full_name, short_name, tax_code, founded_on, legal_representative, address, phone, email, distribution, intro)
values (
  1,
  'Hợp Tác Xã Nông Nghiệp Và Dịch Vụ Nông Thôn Việt',
  'Nông Thôn Việt',
  '6001548209',
  '28/07/2016',
  'Hoàng Thị Ngọc Trai',
  '57 Thôn 5, Xã Ea Nuôl, Đắk Lắk',
  '0936318438',
  '',
  'Sản phẩm của hợp tác xã từng có mặt trên kệ hệ thống siêu thị Co.opmart và nhiều cửa hàng bán lẻ. Chúng tôi sẵn sàng làm việc với đại lý, cửa hàng đặc sản và đơn vị phân phối trên cả nước.',
  'Hợp tác xã ra đời năm 2016 trên vùng đất đỏ bazan Buôn Đôn bên dòng Sêrêpốk, nay thuộc xã Ea Nuôl, Đắk Lắk. Các xã viên trồng cà phê, hồ tiêu, nuôi ong lấy mật trong mùa hoa cà phê, rồi cùng nhau sơ chế, rang xay và đóng gói ngay tại địa phương.'
)
on conflict (id) do nothing;

insert into public.products (slug, name, category, art, short_description, description, specs, image_url, sort_order) values
(
  'ca-phe-bot', 'Cà phê bột', 'ca-phe', 'coffee',
  'Cà phê rang xay từ hạt trồng trên đất đỏ Buôn Đôn, đậm vị, hậu ngọt, hợp pha phin.',
  E'Hạt cà phê được thu hái khi chín, phơi và sơ chế tại vườn của xã viên, sau đó rang và xay ngay tại hợp tác xã để giữ hương.\n\nVị đậm, đắng dịu và hậu ngọt đặc trưng của cà phê Tây Nguyên. Pha phin với nước sôi khoảng 90–95°C, uống đen đá hoặc thêm sữa đặc đều hợp.',
  '[{"label": "Nguồn gốc", "value": "Xã Ea Nuôl, Đắk Lắk"}, {"label": "Dạng", "value": "Bột rang xay"}, {"label": "Cách dùng", "value": "Pha phin, pha máy hoặc ủ lạnh"}, {"label": "Bảo quản", "value": "Nơi khô ráo, đóng kín miệng túi sau khi mở"}]',
  '/images/ca-phe-bot.webp', 1
),
(
  'mat-ong-hoa-ca-phe', 'Mật ong hoa cà phê', 'mat-ong', 'honey',
  'Mật ong nguyên chất ong lấy từ mùa hoa cà phê nở trắng vườn mỗi đầu năm.',
  E'Mỗi năm cà phê chỉ nở hoa một mùa, kéo dài vài tuần. Đó cũng là lúc các thùng ong được đặt giữa vườn để lấy mật.\n\nMật có màu vàng hổ phách, mùi thơm nhẹ của hoa cà phê, vị ngọt thanh. Dùng pha nước ấm, chanh mật ong, hoặc ăn kèm bánh mì, sữa chua.',
  '[{"label": "Nguồn hoa", "value": "Hoa cà phê"}, {"label": "Mùa lấy mật", "value": "Đầu năm, theo mùa hoa"}, {"label": "Cách dùng", "value": "Pha nước ấm (dưới 60°C), dùng trực tiếp"}, {"label": "Bảo quản", "value": "Nhiệt độ phòng, tránh ánh nắng trực tiếp"}]',
  '/images/mat-ong-hoa-ca-phe.webp', 2
),
(
  'tieu-den', 'Tiêu đen hạt', 'ho-tieu', 'pepper-black',
  'Hạt tiêu phơi khô nguyên vỏ, cay nồng, thơm rõ — xay ngay trước khi nấu để giữ trọn hương.',
  E'Tiêu được hái khi chùm bắt đầu chín, tuốt hạt rồi phơi khô tự nhiên đến khi vỏ chuyển đen và nhăn.\n\nHạt chắc, cay nồng và thơm. Để nguyên hạt, tiêu giữ hương lâu hơn tiêu xay sẵn — hợp với món kho, ướp thịt, súp và các món nướng.',
  '[{"label": "Nguồn gốc", "value": "Vườn tiêu xã viên, Ea Nuôl"}, {"label": "Dạng", "value": "Hạt nguyên"}, {"label": "Cách dùng", "value": "Xay hoặc giã trước khi dùng"}, {"label": "Bảo quản", "value": "Hũ kín, nơi khô thoáng"}]',
  '/images/tieu-den.webp', 3
),
(
  'tieu-den-xay', 'Tiêu đen xay', 'ho-tieu', 'pepper-black',
  'Tiêu đen xay sẵn từ hạt phơi khô, độ mịn vừa, tiện nêm nếm mỗi ngày.',
  E'Hạt tiêu đen của xã viên được làm sạch rồi xay ở độ mịn vừa, vẫn thấy rõ những mảnh vỏ đen xen lõi ngà.\n\nVị cay nồng, mùi thơm ấm. Rắc trực tiếp lên món ăn, dùng ướp thịt cá hoặc pha muối tiêu chanh.',
  '[{"label": "Nguồn gốc", "value": "Vườn tiêu xã viên, Ea Nuôl"}, {"label": "Dạng", "value": "Bột xay, độ mịn vừa"}, {"label": "Cách dùng", "value": "Nêm trực tiếp, ướp, chấm"}, {"label": "Bảo quản", "value": "Đậy kín ngay sau khi dùng, tránh ẩm"}]',
  '/images/tieu-den-xay.webp', 4
),
(
  'tieu-so', 'Tiêu sọ hạt', 'ho-tieu', 'pepper-white',
  'Tiêu trắng đã bóc vỏ, hạt tròn màu ngà, vị cay sạch và mùi dịu.',
  E'Tiêu sọ (tiêu trắng) được làm từ hạt tiêu chín, ngâm và bóc lớp vỏ ngoài rồi phơi khô, để lại lõi hạt tròn màu ngà.\n\nVị cay sạch, mùi dịu hơn tiêu đen. Thường dùng cho cháo, súp, phở, các món hấp và nước sốt màu sáng.',
  '[{"label": "Nguồn gốc", "value": "Vườn tiêu xã viên, Ea Nuôl"}, {"label": "Dạng", "value": "Hạt nguyên đã bóc vỏ"}, {"label": "Cách dùng", "value": "Xay mịn, rắc khi món đã chín"}, {"label": "Bảo quản", "value": "Hũ kín, nơi khô thoáng"}]',
  '/images/tieu-so.webp', 5
),
(
  'tieu-so-xay', 'Tiêu sọ xay', 'ho-tieu', 'pepper-white',
  'Tiêu sọ xay mịn màu ngà, cay sạch — không để lại vệt đen trên món màu sáng.',
  E'Lõi hạt tiêu sọ được xay mịn thành bột màu ngà xám.\n\nVì không còn vỏ đen, bột tiêu sọ giữ cho cháo, súp kem, trứng hấp và các loại sốt trắng sạch màu mà vẫn đủ cay thơm.',
  '[{"label": "Nguồn gốc", "value": "Vườn tiêu xã viên, Ea Nuôl"}, {"label": "Dạng", "value": "Bột xay mịn"}, {"label": "Cách dùng", "value": "Rắc khi món đã chín, nêm sốt"}, {"label": "Bảo quản", "value": "Đậy kín ngay sau khi dùng, tránh ẩm"}]',
  '/images/tieu-so-xay.webp', 6
)
on conflict (slug) do nothing;

-- =====================================================================
--  SAU KHI tạo tài khoản quản trị (Authentication → Users → Add user),
--  chạy lệnh sau, thay email cho đúng:
--
--  insert into public.admins (user_id)
--  select id from auth.users where email = 'admin@nongthonviet.vn';
-- =====================================================================
