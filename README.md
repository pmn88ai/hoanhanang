# Hoa Nhà Nắng

Web bán hoa tươi — tích hợp AI tư vấn, cho phép chủ shop tự quản lý sản phẩm, theo dõi khách hàng tiềm năng và cấu hình cửa hàng không cần lập trình.

Triển khai bởi **RongLeo** · 0906 899 985

---

## Tech Stack

| Lớp | Công nghệ |
|-----|-----------|
| Framework | Next.js 16.2.6 (App Router + Turbopack) |
| UI | React 19.2.4 + Tailwind CSS v4 |
| Database | PostgreSQL (Supabase) |
| ORM | Drizzle ORM 0.45 |
| Auth | NextAuth v5 (Auth.js) — Credentials + JWT |
| Storage | Supabase Storage (signed URL upload) |
| AI | Groq SDK — llama-3.3-70b-versatile |
| Icons | lucide-react |
| Theming | next-themes (light / dark / luxury) |

---

## Cấu trúc thư mục chính

```
flower-store/
├── database/                     # Schema + seed scripts
│   ├── schema.ts                 # 8 tables: users, products, leads, ai_conversations,...
│   ├── seed-operator.ts          # Tạo tài khoản operator mặc định
│   └── seed-settings.ts          # Seed cấu hình mặc định (hero, shop name, AI prompt)
├── src/
│   ├── app/
│   │   ├── (public)/             # Giao diện khách: trang chủ, gallery, chi tiết sản phẩm
│   │   ├── (operator)/quan-ly/   # Dashboard quản lý: sản phẩm, cài đặt, lead
│   │   ├── (shadow)/[shadowSlug]/# Quản trị hệ thống: AI logs, prompt, kill switch
│   │   ├── dang-nhap/            # Trang đăng nhập
│   │   └── api/                  # 17 API routes (REST)
│   ├── components/
│   │   ├── public/               # Header, Footer, Hero, ChatWidget, Gallery...
│   │   ├── operator/             # Sidebar, ProductForm, ImageUploader...
│   │   ├── shadow/               # ShadowNav, KillSwitch, OperatorManager...
│   │   └── shared/               # ThemeToggle
│   ├── config/
│   │   ├── ai-prompts.ts         # System prompt mặc định cho AI
│   │   └── categories.ts         # 8 danh mục: sinh nhật, khai trương, cưới hỏi...
│   └── lib/
│       ├── auth/                 # NextAuth v5 config — credentials + JWT
│       ├── db/                   # Drizzle client + Supabase client (lazy Proxy)
│       ├── ai/                   # Groq client + lead extractor
│       ├── activity-logger.ts    # Audit log fire-and-forget
│       ├── slug.ts               # URL slug generator
│       └── utils.ts              # cn(), fmtPrice()
├── .env.example                  # Template biến môi trường
├── next.config.ts                # Config Next.js (image remotePatterns)
├── drizzle.config.ts             # Config Drizzle Kit
└── package.json
```

---

## Routes chính

| Route | Vai trò | Mô tả |
|-------|---------|-------|
| `/` | Khách | Trang chủ: Hero, sản phẩm nổi bật, đánh giá, liên hệ |
| `/mau-hoa` | Khách | Gallery — lọc theo danh mục |
| `/mau-hoa/[slug]` | Khách | Chi tiết sản phẩm — ảnh, giá, SEO, nút đặt qua Zalo |
| `/dang-nhap` | Khách | Trang đăng nhập |
| `/quan-ly` | Operator | Dashboard: thống kê, lead gần đây |
| `/quan-ly/mau-hoa` | Operator | Danh sách sản phẩm — thêm, sửa, xóa, ẩn/hiện, hết hàng |
| `/quan-ly/mau-hoa/them-moi` | Operator | Form tạo mẫu hoa mới |
| `/quan-ly/mau-hoa/[id]/sua` | Operator | Form chỉnh sửa mẫu hoa |
| `/quan-ly/mau-hoa/thung-rac` | Operator | Thùng rác — khôi phục hoặc xóa vĩnh viễn |
| `/quan-ly/cai-dat` | Operator | Cấu hình shop + đổi mật khẩu |
| `/quan-ly/khach-hang` | Operator | Danh sách khách hàng tiềm năng |
| `/[shadowSlug]` | Shadow Admin | Dashboard hệ thống + env health |
| `/[shadowSlug]/ai-logs` | Shadow Admin | Lịch sử hội thoại AI |
| `/[shadowSlug]/leads` | Shadow Admin | Phân tích lead + biểu đồ |
| `/[shadowSlug]/prompt-config` | Shadow Admin | Chỉnh sửa system prompt AI |
| `/[shadowSlug]/operator-log` | Shadow Admin | Nhật ký thao tác operator |
| `/[shadowSlug]/control` | Shadow Admin | Kill switch + quản lý tài khoản operator |

---

## Setup & Chạy local

Yêu cầu: **Node.js 18+**

```bash
# 1. Clone repo
git clone <đường-dẫn-repo>
cd flower-store

# 2. Cài dependencies
npm install

# 3. Tạo file .env.local từ mẫu
copy .env.example .env.local

# 4. Điền biến môi trường vào .env.local (xem bảng bên dưới)

# 5. Đồng bộ schema lên database
npm run db:push

# 6. Seed dữ liệu mặc định (tùy chọn)
npm run db:seed-settings
npm run db:seed-operator

# 7. Chạy dev server
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

## Biến môi trường bắt buộc

| Tên biến | Mô tả | Ví dụ |
|----------|-------|-------|
| `DATABASE_URL` | Đường dẫn kết nối Supabase PostgreSQL | `postgresql://postgres:...@db.xxx.supabase.co:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL dự án Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key công khai Supabase (anon) | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_KEY` | Key service role Supabase (bí mật — dùng cho Storage) | `eyJhbGciOi...` |
| `NEXTAUTH_SECRET` | Khóa mã hóa JWT session | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL gốc (local: `http://localhost:3000`) | `http://localhost:3000` |
| `SHADOW_ADMIN_USERNAME` | Tên đăng nhập shadow admin | `admin` |
| `SHADOW_ADMIN_PASSWORD` | Mật khẩu shadow admin | `strong-password-here` |
| `SHADOW_SLUG` | Slug bí mật cho shadow dashboard | `shadow-abc123` |
| `NEXT_PUBLIC_SITE_URL` | Địa chỉ web public | `https://yourdomain.com` |
| `NEXT_PUBLIC_SHOP_NAME` | Tên cửa hàng hiển thị | `Hoa Nhà Nắng` |
| `GROQ_API_KEY` | Key API Groq cho AI chat | `gsk_...` |

### Biến môi trường tùy chọn

| Tên biến | Mô tả |
|----------|-------|
| `NEXT_PUBLIC_SHOP_PHONE` | Số điện thoại cửa hàng |
| `NEXT_PUBLIC_ZALO_URL` | Link Zalo (dạng `https://zalo.me/0900000000`) |
| `NEXT_PUBLIC_FACEBOOK_URL` | Link Facebook page |
| `NEXT_PUBLIC_SHOP_ADDRESS` | Địa chỉ cửa hàng |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | URL nhúng Google Maps |
| `NEXT_PUBLIC_LOGO_PATH` | Đường dẫn logo (mặc định `/logo.png`, để trống → hiện text tên shop) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID |
| `SUPABASE_STORAGE_BUCKET` | Tên bucket Supabase Storage (mặc định `product-images`) |
| `GROQ_MODEL` | Model Groq (mặc định `llama-3.3-70b-versatile`) |
| `OPERATOR_DEFAULT_EMAIL` | Email operator mặc định (cho `db:seed-operator`) |
| `OPERATOR_DEFAULT_PASSWORD` | Mật khẩu operator mặc định |

---

## Deploy lên Vercel

1. Push code lên GitHub
2. Vào [Vercel](https://vercel.com), import repo
3. Vào **Settings → Environment Variables**, thêm tất cả biến từ `.env.example`
4. Deploy — Vercel tự động build và chạy
5. Sau mỗi lần push, Vercel tự deploy lại

**Sau deploy, chạy thêm:**
```bash
# Sync env vars lên Vercel (nếu có push-env.ps1)
.\push-env.ps1

# Đồng bộ schema lên Supabase (từ local hoặc Vercel CLI)
npm run db:push
```

---

## Tài khoản & Quyền

| Loại | Đăng nhập tại | Quyền |
|------|--------------|-------|
| **Operator** (chủ shop) | `/dang-nhap` | Quản lý sản phẩm, cài đặt shop, xem lead, đổi mật khẩu. Tạo bằng `npm run db:seed-operator` |
| **Shadow Admin** (kỹ thuật) | `/dang-nhap` hoặc trực tiếp `/[shadowSlug]` | Toàn quyền: xem AI logs, phân tích lead, sửa prompt AI, kill switch, quản lý tài khoản operator. Đọc từ env `SHADOW_ADMIN_USERNAME` / `SHADOW_ADMIN_PASSWORD` |

**Lưu ý:** 
- Operator lưu trong bảng `users` (PostgreSQL), có thể tạo/xóa/disable qua shadow dashboard
- Shadow admin chỉ tồn tại trong `.env.local`, không có trong database
- Cả hai loại tài khoản đều đăng nhập qua cùng một trang `/dang-nhap`

---

## Database scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run db:push` | Đồng bộ schema từ code lên Supabase |
| `npm run db:generate` | Tạo migration file từ schema |
| `npm run db:studio` | Mở Drizzle Studio (web UI quản lý DB) |
| `npm run db:seed-operator` | Tạo tài khoản operator từ env `OPERATOR_DEFAULT_*` |
| `npm run db:seed-settings` | Seed site_settings mặc định (hero text, AI prompt, site_enabled) |

---

## Liên hệ hỗ trợ kỹ thuật

**RongLeo** — 0906 899 985
