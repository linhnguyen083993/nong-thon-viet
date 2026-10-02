# Website Hợp Tác Xã Nông Thôn Việt

Website giới thiệu sản phẩm (cà phê bột, mật ong hoa cà phê, tiêu đen, tiêu sọ) và trang quản trị sản phẩm.

- **Công nghệ:** Next.js 16 (App Router, React 19) · Tailwind CSS 4 · Motion · Supabase (cơ sở dữ liệu, đăng nhập, lưu ảnh)
- **Website:** `/` (trang chủ), `/san-pham/<đường-dẫn>` (chi tiết sản phẩm)
- **Quản trị:** `/admin` — thêm/sửa/xoá/ẩn sản phẩm, tải ảnh, sửa thông tin hợp tác xã

Khi chưa cấu hình Supabase, website vẫn chạy với dữ liệu mẫu (trang quản trị sẽ báo chưa kết nối).

---

## 1. Chạy thử trên máy

Cần Node.js 20.9 trở lên.

```bash
npm install
cp .env.example .env.local   # điền thông tin Supabase (bước 2)
npm run dev                  # mở http://localhost:3000
```

## 2. Tạo cơ sở dữ liệu Supabase (miễn phí)

1. Đăng ký tại https://supabase.com → **New project** (chọn vùng Singapore cho nhanh).
2. Vào **SQL Editor** → dán toàn bộ nội dung `supabase/schema.sql` → **Run**.
   Lệnh này tạo bảng, phân quyền, kho ảnh và nhập sẵn 4 sản phẩm + thông tin hợp tác xã.
3. Vào **Authentication → Sign In / Providers**, tắt **Allow new users to sign up** (không cho người lạ tự đăng ký).
4. Vào **Authentication → Users → Add user**, tạo tài khoản quản trị (email + mật khẩu).
5. Quay lại **SQL Editor**, cấp quyền quản trị cho tài khoản vừa tạo:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'email-quan-tri@cua-ban.vn';
   ```
6. Vào **Project Settings → API**, chép **Project URL** và **anon public key** vào `.env.local`.

Muốn thêm quản trị viên khác: lặp lại bước 4 và 5.

## 3. Đưa lên mạng (Vercel, miễn phí)

1. Đưa mã nguồn lên một kho GitHub riêng tư.
2. Đăng nhập https://vercel.com bằng GitHub → **Add New → Project** → chọn kho vừa tạo.
3. Ở mục **Environment Variables**, thêm:
   | Tên | Giá trị |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL từ Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
   | `NEXT_PUBLIC_SITE_URL` | tạm để `https://<tên-dự-án>.vercel.app` |
4. Bấm **Deploy**. Vài phút sau website chạy ở địa chỉ `*.vercel.app`.

## 4. Gắn tên miền (sau khi mua)

1. Trên Vercel: **Project → Settings → Domains → Add**, nhập tên miền (vd. `nongthonviet.vn` và `www.nongthonviet.vn`).
2. Vercel hiển thị bản ghi DNS cần tạo. Vào trang quản lý tên miền (Mắt Bão, PA Việt Nam, iNET…), thêm đúng các bản ghi đó
   (thường là bản ghi `A` cho tên miền gốc và `CNAME` cho `www`).
3. Đổi biến `NEXT_PUBLIC_SITE_URL` thành tên miền mới → **Redeploy**.
4. Trong Supabase: **Authentication → URL Configuration → Site URL** đặt thành tên miền mới.

HTTPS được Vercel cấp tự động.

## 5. Sử dụng trang quản trị

- Vào `https://<tên-miền>/admin` và đăng nhập.
- **Sản phẩm:** thêm, sửa, ẩn/hiện (biểu tượng con mắt), xoá. Ảnh nên tỉ lệ 4:5, tối đa 5 MB.
  Khi chưa có ảnh, website hiển thị hình minh hoạ theo loại sản phẩm.
- **Thông tin hợp tác xã:** địa chỉ, số điện thoại, email, phần giới thiệu và phân phối.
- Mọi thay đổi hiển thị trên website ngay sau khi lưu.

## Cấu trúc thư mục

```
app/(site)/            Website công khai (trang chủ, chi tiết sản phẩm)
app/admin/             Trang quản trị + Server Actions (actions.ts)
components/site/       Giao diện website (Hero, cành cà phê, vòng mùa vụ, minh hoạ sản phẩm…)
components/admin/      Biểu mẫu quản trị
lib/                   Truy vấn dữ liệu, kiểu dữ liệu, dữ liệu mẫu, kết nối Supabase
supabase/schema.sql    Tạo bảng, phân quyền, kho ảnh, dữ liệu ban đầu
proxy.ts               Bảo vệ /admin, làm mới phiên đăng nhập
```

Nội dung lịch mùa vụ nằm trong `components/site/SeasonWheel.tsx`.

## Cập nhật v2 (thiết kế mới + ảnh sản phẩm)

- Nếu bạn **chưa** chạy `supabase/schema.sql`: chỉ cần chạy file đó (đã gồm 6 sản phẩm và ảnh).
- Nếu bạn **đã** chạy `schema.sql` bản cũ: chạy thêm `supabase/update-v2.sql` để thêm ảnh,
  đổi tên "Tiêu đen hạt"/"Tiêu sọ hạt" và thêm "Tiêu đen xay", "Tiêu sọ xay".
- Ảnh có sẵn cho cả 6 sản phẩm nằm trong `public/images/`. Ảnh tải lên từ trang quản trị sẽ thay thế ảnh này.
- Phần "Nguyên hạt hay xay sẵn?" dùng 4 ảnh cố định trong `public/images/` và chỉ hiện khi đủ 4 sản phẩm tiêu.
