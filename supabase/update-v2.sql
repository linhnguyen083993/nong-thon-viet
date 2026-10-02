-- =====================================================================
--  Cập nhật v2 — CHỈ chạy file này nếu bạn ĐÃ chạy schema.sql bản cũ.
--  Thêm ảnh, đổi tên tiêu đen/tiêu sọ thành "… hạt", thêm tiêu đen xay & tiêu sọ xay.
-- =====================================================================
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
on conflict (slug) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  description = excluded.description,
  specs = excluded.specs,
  image_url = coalesce(public.products.image_url, excluded.image_url),
  sort_order = excluded.sort_order;

-- Số điện thoại mới
update public.site_settings set phone = '0936318438' where id = 1;
