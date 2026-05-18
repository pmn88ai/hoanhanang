# PROJECT MAP — Flower Store (Hoa Nhà Nắng)

> Tạo: 2026-05-18 | Dựa trên code thực tế tại commit `5bf01bd`

---

## 1. Cấu trúc thư mục

```
flower-store/
├── database/                          # Schema Drizzle + seed scripts
│   ├── schema.ts                      # 8 tables + 2 enums
│   ├── seed-operator.ts               # Tạo tài khoản operator mặc định
│   └── seed-settings.ts               # Seed site_settings mặc định
├── public/
│   └── images/                        # Static images (logo, og-image)
├── src/
│   ├── app/                           # Next.js App Router (Turbopack)
│   │   ├── layout.tsx                 # Root layout: fonts, ThemeProvider, SEO, Analytics
│   │   ├── globals.css                # Tailwind v4 + 3 themes (light/dark/luxury)
│   │   ├── robots.ts                  # robots.txt — chặn quan-ly, dang-nhap, shadow, api
│   │   ├── sitemap.ts                 # Sitemap XML — static + product URLs
│   │   ├── (public)/                  # Route group — public pages
│   │   │   ├── layout.tsx             # Header + Footer + ChatWidget + kill switch
│   │   │   ├── page.tsx               # Trang chủ (/)
│   │   │   └── mau-hoa/
│   │   │       ├── page.tsx           # Gallery (/mau-hoa) — filter danh mục
│   │   │       └── [slug]/page.tsx    # Product detail (/mau-hoa/[slug]) — SSG+ISR
│   │   ├── (operator)/                # Route group — operator dashboard
│   │   │   ├── layout.tsx             # Auth guard + Sidebar
│   │   │   └── quan-ly/
│   │   │       ├── page.tsx           # Dashboard stats
│   │   │       ├── cai-dat/           # Shop settings + change password
│   │   │       ├── khach-hang/        # Lead tracking
│   │   │       └── mau-hoa/           # Product CRUD
│   │   │           ├── page.tsx       # Product list
│   │   │           ├── them-moi/      # New product form
│   │   │           ├── [id]/sua/      # Edit product form
│   │   │           └── thung-rac/     # Soft-deleted products
│   │   ├── (shadow)/                  # Route group — shadow admin
│   │   │   ├── layout.tsx             # Pass-through (empty)
│   │   │   └── [shadowSlug]/
│   │   │       ├── layout.tsx         # Slug guard + login form + ShadowNav
│   │   │       ├── page.tsx           # Dashboard + env health
│   │   │       ├── ai-logs/           # AI conversation list
│   │   │       ├── ai-logs/[id]/      # Full chat history
│   │   │       ├── control/           # Kill switch + operator management
│   │   │       ├── leads/             # Lead analytics + charts
│   │   │       ├── operator-log/      # Operator activity audit
│   │   │       └── prompt-config/     # AI system prompt editor
│   │   ├── dang-nhap/                 # Login page
│   │   └── api/                       # API routes (REST)
│   │       ├── auth/[...nextauth]/    # NextAuth v5 handler
│   │       ├── ai/
│   │       │   ├── chat/              # Groq AI chat (POST)
│   │       │   └── track-zalo/        # Zalo CTA tracking (POST)
│   │       ├── operator/
│   │       │   ├── change-password/   # POST
│   │       │   ├── leads/             # GET
│   │       │   ├── products/          # POST (create)
│   │       │   ├── products/[id]/     # PUT (update), DELETE (soft delete)
│   │       │   │   ├── toggle/        # PATCH (publish/unpublish)
│   │       │   │   ├── restore/       # PATCH (khôi phục từ thùng rác)
│   │       │   │   ├── permanent/     # DELETE (xóa vĩnh viễn)
│   │       │   │   └── sold-out/      # PATCH (toggle hết hàng)
│   │       │   ├── settings/          # PUT
│   │       │   ├── upload/            # POST (legacy — upload qua server)
│   │       │   └── upload-url/        # POST (signed URL — bypass Vercel)
│   │       └── shadow/
│   │           ├── kill-switch/       # PUT
│   │           ├── operator-management/ # PUT + PATCH
│   │           └── prompt-config/     # PUT + DELETE
│   ├── components/
│   │   ├── public/                    # 11 components cho giao diện khách
│   │   ├── operator/                  # 8 components cho dashboard operator
│   │   ├── shadow/                    # 5 components cho dashboard shadow
│   │   └── shared/                    # 1 component dùng chung (ThemeToggle)
│   ├── config/
│   │   ├── ai-prompts.ts              # DEFAULT_SYSTEM_PROMPT cho AI
│   │   └── categories.ts              # 8 danh mục sản phẩm
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── groq.ts                # Lazy Groq client (getGroq())
│   │   │   └── lead-extractor.ts      # Regex extract lead info từ chat
│   │   ├── auth/
│   │   │   └── index.ts               # NextAuth v5 config + credentials provider
│   │   ├── db/
│   │   │   ├── index.ts               # Lazy Drizzle client (Proxy)
│   │   │   ├── queries.ts             # getDashboardStats, getRecentLeads
│   │   │   └── supabase.ts            # Lazy Supabase clients (Proxy)
│   │   ├── activity-logger.ts         # logActivity() — fire-and-forget
│   │   ├── slug.ts                    # slugify() — chuyển title thành slug
│   │   └── utils.ts                   # cn(), fmtPrice()
│   └── types/                          # (dự phòng — hiện trống)
├── .env.example                        # Template biến môi trường (69 dòng)
├── next.config.ts                      # Next.js 16 config (images remotePatterns)
├── package.json                        # Dependencies + scripts
├── postcss.config.mjs                  # PostCSS (Tailwind v4)
├── drizzle.config.ts                   # Drizzle Kit config
└── tsconfig.json                       # TypeScript config
```

---

## 2. Route Map

### 2a. Public Routes (không cần auth)

| Route | Loại | Mô tả |
|-------|------|-------|
| `/` | Server Component | Trang chủ: Hero + Featured Products + Testimonials + About |
| `/mau-hoa` | Server Component (Dynamic) | Gallery — filter theo `?danh-muc=sinh-nhat` |
| `/mau-hoa/[slug]` | SSG + ISR (60s) | Product detail — ảnh, giá, SEO, JSON-LD |
| `/dang-nhap` | Server Component (Static) | Trang đăng nhập chung (operator + shadow) |

### 2b. Operator Routes (`/quan-ly`) — cần auth operator/shadow

| Route | Loại | Mô tả |
|-------|------|-------|
| `/quan-ly` | Server Component (Dynamic) | Dashboard: 4 stat cards + recent leads |
| `/quan-ly/mau-hoa` | Server Component (Dynamic) | Product list — filter, sort, CRUD actions |
| `/quan-ly/mau-hoa/them-moi` | Server Component (Dynamic) | Form tạo mẫu hoa mới |
| `/quan-ly/mau-hoa/[id]/sua` | Server Component (Dynamic) | Form chỉnh sửa mẫu hoa |
| `/quan-ly/mau-hoa/thung-rac` | Server Component (Dynamic) | Soft-deleted products — khôi phục / xóa vĩnh viễn |
| `/quan-ly/cai-dat` | Server Component (Dynamic) | Shop settings + đổi mật khẩu |
| `/quan-ly/khach-hang` | Server Component (Dynamic) | Lead list with badges |

### 2c. Shadow Admin Routes (`/[shadowSlug]`) — cần auth shadow_admin

| Route | Loại | Mô tả |
|-------|------|-------|
| `/[shadowSlug]` | Server Component (Dynamic) | Dashboard: stats + env health check |
| `/[shadowSlug]/ai-logs` | Server Component (Dynamic) | AI conversation logs — filter by date |
| `/[shadowSlug]/ai-logs/[id]` | Server Component (Dynamic) | Full chat history (user/assistant bubbles) |
| `/[shadowSlug]/leads` | Server Component (Dynamic) | Lead analytics: summary cards + occasion bar chart |
| `/[shadowSlug]/prompt-config` | Server Component (Dynamic) | AI prompt editor (default + custom) |
| `/[shadowSlug]/operator-log` | Server Component (Dynamic) | Operator activity audit (200 records) |
| `/[shadowSlug]/control` | Server Component (Dynamic) | Kill switch + operator management |

---

## 3. Database Schema

### Enums

| Enum | Values |
|------|--------|
| `user_role` | `operator`, `shadow_admin` |
| `post_status` | `draft`, `published`, `archived` |

### Tables

| Table | Columns chính | Mục đích |
|-------|---------------|----------|
| `users` | id (UUID PK), email, passwordHash, role, isActive, name, createdAt | Tài khoản operator (shadow_admin chỉ trong .env) |
| `products` | id (UUID PK), slug (unique), title, description, priceRange, category (varchar), images (jsonb), videoUrl, status (enum), isFeatured, isSoldOut, seoTitle, seoDescription, createdBy (FK → users), deletedAt, createdAt, updatedAt | Mẫu hoa — hỗ trợ soft delete + hết hàng |
| `leads` | id (UUID PK), sessionId, customerName, customerPhone, occasion, budget, colorPreference, aiConversationId, zaloRedirected, notes, createdAt | Khách hàng tiềm năng từ AI chat |
| `ai_conversations` | id (UUID PK), sessionId, messages (jsonb[]), leadId (FK → leads), turnCount, zaloCTAShown, createdAt, updatedAt | Lịch sử hội thoại AI |
| `site_settings` | key (varchar PK), value (text), updatedBy, updatedAt | Cấu hình động: hero, shop info, AI prompt, kill switch, logo size |
| `operator_events` | id (serial PK), eventType, message, createdAt | Cảnh báo cho shadow admin (dự phòng) |
| `operator_activity` | id (UUID PK), userId (FK → users), action (varchar), targetId, details (jsonb), ipAddress, createdAt | Audit log — mọi thao tác của operator |

---

## 4. Component Map

### 4a. public/ — Giao diện khách hàng (11 components)

| Component | Dùng ở |
|-----------|--------|
| `PublicHeader.tsx` | `(public)/layout.tsx` — Header với logo, nav, mobile drawer |
| `PublicFooter.tsx` | `(public)/layout.tsx` — Footer với logo, credit RongLeo |
| `HeroSection.tsx` | `(public)/page.tsx` — Hero với 3 chế độ nền, CTA |
| `FeaturedProducts.tsx` | `(public)/page.tsx` — Grid sản phẩm nổi bật |
| `TestimonialsSection.tsx` | `(public)/page.tsx` — Testimonial cards (hardcoded) |
| `AboutSection.tsx` | `(public)/page.tsx` — Thông tin liên hệ + Google Maps |
| `CategoryFilter.tsx` | `/mau-hoa/page.tsx` — Filter danh mục sản phẩm |
| `ImageGallery.tsx` | `/mau-hoa/[slug]/page.tsx` — Gallery ảnh sản phẩm |
| `VideoEmbed.tsx` | `/mau-hoa/[slug]/page.tsx` — Nhúng YouTube/TikTok |
| `ChatWidget.tsx` | `(public)/layout.tsx` — Floating AI chat với Zalo CTA |
| `StructuredData.tsx` | Root `layout.tsx` — JSON-LD schema |
| `Analytics.tsx` | Root `layout.tsx` — GA4 + Clarity + Meta Pixel |

### 4b. operator/ — Dashboard quản lý (8 components)

| Component | Dùng ở |
|-----------|--------|
| `OperatorSidebar.tsx` | `(operator)/layout.tsx` — Desktop sidebar + mobile bottom nav |
| `ProductForm.tsx` | `them-moi/page.tsx`, `[id]/sua/page.tsx` — Form tạo/sửa sản phẩm |
| `ProductActions.tsx` | `mau-hoa/page.tsx` — Dropdown: sửa, toggle status, toggle hết hàng, xóa |
| `ProductThumb.tsx` | (hiện tại chưa sử dụng — dự phòng) |
| `ImageUploader.tsx` | `ProductForm.tsx` — Drag-drop upload ảnh (signed URL) |
| `TrashActions.tsx` | `thung-rac/page.tsx` — Nút khôi phục + xóa vĩnh viễn |
| `ShopSettingsForm.tsx` | `cai-dat/page.tsx` — Form cấu hình shop |
| `ChangePasswordForm.tsx` | `cai-dat/page.tsx` — Form đổi mật khẩu |

### 4c. shadow/ — Quản trị hệ thống (5 components)

| Component | Dùng ở |
|-----------|--------|
| `ShadowNav.tsx` | `[shadowSlug]/layout.tsx` — 6 tab điều hướng |
| `ShadowLoginForm.tsx` | `[shadowSlug]/layout.tsx` — Form đăng nhập shadow |
| `PromptConfigEditor.tsx` | `prompt-config/page.tsx` — Textarea prompt + save/reset |
| `KillSwitchControl.tsx` | `control/page.tsx` — Toggle site_enabled |
| `OperatorManager.tsx` | `control/page.tsx` — Reset password, enable/disable operator |

### 4d. shared/ — Dùng chung (1 component)

| Component | Dùng ở |
|-----------|--------|
| `ThemeToggle.tsx` | `PublicHeader.tsx` — Nút đổi theme (light/dark/luxury) |

---

## 5. API Map

### 5a. Auth

| Endpoint | Method | Auth | Chức năng |
|----------|--------|------|-----------|
| `/api/auth/[...nextauth]` | GET/POST | Không | NextAuth handler (login, session, logout) |

### 5b. Operator APIs

| Endpoint | Method | Auth | Chức năng |
|----------|--------|------|-----------|
| `/api/operator/products` | POST | operator+ | Tạo mẫu hoa mới |
| `/api/operator/products/[id]` | PUT | operator+ | Cập nhật mẫu hoa |
| `/api/operator/products/[id]` | DELETE | operator+ | Soft delete (set deletedAt) |
| `/api/operator/products/[id]/toggle` | PATCH | operator+ | Toggle published/draft |
| `/api/operator/products/[id]/restore` | PATCH | operator+ | Khôi phục từ thùng rác |
| `/api/operator/products/[id]/permanent` | DELETE | operator+ | Xóa vĩnh viễn khỏi DB |
| `/api/operator/products/[id]/sold-out` | PATCH | operator+ | Toggle isSoldOut |
| `/api/operator/settings` | PUT | operator+ | Cập nhật shop settings |
| `/api/operator/change-password` | POST | operator+ | Đổi mật khẩu operator |
| `/api/operator/upload` | POST | operator+ | Upload ảnh (legacy — qua server) |
| `/api/operator/upload-url` | POST | operator+ | Lấy signed URL upload lên Supabase Storage |
| `/api/operator/leads` | GET | operator+ | Danh sách lead |

### 5c. Shadow Admin APIs

| Endpoint | Method | Auth | Chức năng |
|----------|--------|------|-----------|
| `/api/shadow/prompt-config` | PUT | shadow_admin | Lưu custom AI prompt |
| `/api/shadow/prompt-config` | DELETE | shadow_admin | Reset prompt về default |
| `/api/shadow/kill-switch` | PUT | shadow_admin | Toggle site_enabled |
| `/api/shadow/operator-management` | PUT | shadow_admin | Reset operator password |
| `/api/shadow/operator-management` | PATCH | shadow_admin | Enable/disable operator |

### 5d. AI APIs

| Endpoint | Method | Auth | Chức năng |
|----------|--------|------|-----------|
| `/api/ai/chat` | POST | Không* | Groq AI chat — rate limit 30 req/min/IP |
| `/api/ai/track-zalo` | POST | Không | Log Zalo CTA click (fire-and-forget) |

---

## 6. Data Flow

### Upload ảnh
```
Client (ImageUploader) 
  → POST /api/operator/upload-url (auth, contentType) 
  → Supabase Admin creates signed URL
  → Client PUT file trực tiếp lên Supabase Storage (bypass Vercel 4.5MB)
  → Trả về publicUrl lưu vào form
```

### Tạo/sửa mẫu hoa
```
ProductForm (client) 
  → POST/PUT /api/operator/products (auth, body) 
  → slugify(title) → insert/update PostgreSQL
  → logActivity() ghi vào operator_activity
  → Redirect về /quan-ly/mau-hoa
```

### Public gallery
```
Server Component (mau-hoa/page.tsx) 
  → db.select().from(products).where(published + not soldOut)
  → Render grid với CategoryFilter
  → Không có JS bundle lớn — pure server render
```

### Product detail (SSG + ISR)
```
generateStaticParams() → lấy tất cả slug từ DB (build time)
generateMetadata() → SEO dynamic per product
Page → db.findFirst by slug → render gallery + info + Zalo CTA
ISR revalidate = 60s
```

### AI Chat
```
ChatWidget (client) 
  → POST /api/ai/chat (messages history) 
  → getGroq() → chat.completions.create (system prompt từ DB hoặc default)
  → Lưu conversation vào ai_conversations
  → extractAndSaveLead() (regex occasion/budget/color) → upsert leads
  → Rate limit: 30 req/min/IP (in-memory Map)
  → Zalo CTA sau 3+ turns
```

### Kill Switch
```
Public layout 
  → db.query.siteSettings.findFirst(site_enabled) 
  → Nếu value === 'false' → hiện trang "Tạm nghỉ"
  → Kill switch được toggle qua /api/shadow/kill-switch (shadow_admin)
```

### Auth Flow
```
Login → Credentials provider → 
  1. Check env SHADOW_ADMIN_USERNAME/PASSWORD → trả role shadow_admin
  2. Query DB users table → bcrypt compare → trả role operator
JWT strategy → session.user.id, session.user.role
Auth check: await auth() trong server component / API route
```

---

## 7. Lib Map

| File | Export | Mục đích |
|------|--------|----------|
| `src/lib/db/index.ts` | `db` (Proxy) | Lazy Drizzle ORM client — chỉ init khi gọi lần đầu |
| `src/lib/db/supabase.ts` | `supabaseAdmin`, `supabase` (Proxy) | Lazy Supabase client — admin (service key) + anon |
| `src/lib/db/queries.ts` | `getDashboardStats()`, `getRecentLeads()` | Query helpers cho dashboard |
| `src/lib/auth/index.ts` | `auth`, `signIn`, `signOut`, `handlers` | NextAuth v5 config — credentials + role JWT |
| `src/lib/ai/groq.ts` | `getGroq()`, `GROQ_MODEL` | Lazy Groq client — chỉ init khi có GROQ_API_KEY |
| `src/lib/ai/lead-extractor.ts` | `extractAndSaveLead()` | Regex extract dịp/ngân sách/màu từ chat → upsert lead |
| `src/lib/activity-logger.ts` | `logActivity()` | Ghi operator action vào operator_activity (fire-and-forget) |
| `src/lib/slug.ts` | `slugify()` | Chuyển title tiếng Việt → URL slug |
| `src/lib/utils.ts` | `cn()`, `fmtPrice()` | classNames merge (Tailwind) + format giá VND |
