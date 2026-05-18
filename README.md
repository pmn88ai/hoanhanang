# Hoa Nhà Nắng

Web bán hoa tươi — tích hợp AI tư vấn, cho phép chủ shop tự quản lý sản phẩm, đơn hàng và nội dung.

Triển khai bởi **RongLeo** · 0906 899 985

---

## Tài khoản

Hệ thống có hai loại tài khoản:

| Loại | Mô tả |
|------|-------|
| **Operator** | Chủ shop, đăng nhập tại `/quan-ly`. Quản lý sản phẩm, bài viết, cài đặt cửa hàng, xem khách hàng tiềm năng. |
| **Shadow Admin** | Tài khoản ẩn, toàn quyền kiểm soát hệ thống. Dành cho quản trị viên kỹ thuật. |

---

## Hướng dẫn cài đặt local (dành cho developer)

Yêu cầu: Node.js 18 trở lên.

```bash
# 1. Clone repo về máy
git clone <đường-dẫn-repo>
cd flower-store

# 2. Tạo file biến môi trường
cp .env.example .env.local

# 3. Điền các key cần thiết vào .env.local
# (xem bảng bên dưới)

# 4. Cài đặt dependencies
npm install

# 5. Chạy local
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

## Biến môi trường quan trọng

| Biến | Giải thích |
|------|-----------|
| `DATABASE_URL` | Đường dẫn kết nối đến Supabase PostgreSQL |
| `SUPABASE_URL` | URL dự án Supabase |
| `SUPABASE_ANON_KEY` | Key công khai Supabase (anonymus) |
| `SUPABASE_SERVICE_ROLE_KEY` | Key riêng Supabase (toàn quyền — giữ bí mật) |
| `AUTH_SECRET` | Khóa bảo mật cho phiên đăng nhập |
| `GROQ_API_KEY` | Key API Groq để chạy AI tư vấn hoa |
| `NEXT_PUBLIC_SITE_URL` | Địa chỉ web chính thức |
| `NEXT_PUBLIC_SHOP_NAME` | Tên cửa hàng hiển thị trên web |
| `NEXT_PUBLIC_LOGO_PATH` | Đường dẫn file logo (mặc định `/logo.png`) |
| `NEXT_PUBLIC_GA_ID` | ID Google Analytics (bỏ trống nếu không dùng) |
| `NEXT_PUBLIC_CLARITY_ID` | ID Microsoft Clarity (bỏ trống nếu không dùng) |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID Meta Pixel (bỏ trống nếu không dùng) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Token xác minh Google Search Console (bỏ trống nếu không dùng) |
| `SHADOW_ADMIN_USERNAME` | Tên đăng nhập shadow admin |
| `SHADOW_ADMIN_PASSWORD` | Mật khẩu shadow admin |

---

## Hướng dẫn deploy

1. Push code lên GitHub (hoặc GitLab, Bitbucket).
2. Vào [Vercel](https://vercel.com), import repo.
3. Trong Vercel dashboard, điền tất cả biến môi trường ở trên vào mục **Environment Variables**.
4. Deploy — Vercel tự động build và chạy web.
5. Sau mỗi lần push code mới, Vercel tự động deploy lại.

---

## Analytics

- **Google Analytics 4**: Điền `NEXT_PUBLIC_GA_ID` trong `.env.local`
- **Microsoft Clarity**: Điền `NEXT_PUBLIC_CLARITY_ID`
- **Meta Pixel**: Điền `NEXT_PUBLIC_META_PIXEL_ID`
- **Google Search Console**: Điền `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (có thể lấy từ Google Search Console, dạng `abc123...`)

Chỉ cần điền ID là hệ thống tự động kích hoạt.

---

## Liên hệ hỗ trợ kỹ thuật

**RongLeo** — 0906 899 985
