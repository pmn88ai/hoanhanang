<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- Anchored Summary (curated record — exceeds ephemeral context window) -->

### Project Summary

## Goal
- Build a flower store e-commerce application with Next.js, featuring public homepage sections, AI chat widget, operator dashboards with product CRUD/image upload/settings/lead tracking, and shadow admin with full system control.

## Constraints & Preferences
- Tailwind v4 (CSS-based config with `@theme inline`, no tailwind.config.ts)
- Next.js 16.2.6 + React 19.2.4 — `searchParams` and `params` are Promises that must be awaited
- Drizzle ORM + Supabase (Postgres)
- NextAuth v5 (Auth.js) with credentials provider for two roles: operator (DB-backed) and shadow_admin (env-only)
- Next.js middleware must avoid Node.js modules (Edge Runtime) — use `getToken` from `next-auth/jwt` instead of `auth` wrapper
- DB client (`src/lib/db/index.ts`) lazily initialized via Proxy to avoid build failures when `DATABASE_URL` is not set
- Supabase client (`src/lib/db/supabase.ts`) also lazy-initialized via Proxy + function binding
- Groq AI client (`src/lib/ai/groq.ts`) lazily initialized via `getGroq()` getter function to avoid build failures when `GROQ_API_KEY` not set
- Vietnamese text in `edit` tool works when oldString matches file content exactly
- All pages/routes must build and render gracefully without DB connection (try/catch queries)
- `/quan-ly` operator routes render authenticated via layout; `/api/operator/*` routes check auth server-side; `/api/shadow/*` requires `role === 'shadow_admin'` (403)
- ISR: product pages use `revalidate = 60`; SSR product pages use `generateStaticParams` (SSG) + `revalidate` for ISR

## Progress
### Done
- **A1:** Next.js project init, Tailwind v4 with 3 themes + fonts, ThemeProvider, `.env.example`, `cn()` utility, boilerplate cleanup
- **A2:** Drizzle schema with 6 tables + 2 pgEnum, Drizzle client + Supabase client, lazy Proxy patterns
- **A3:** NextAuth v5 config with Credentials provider + 2 roles, middleware (using `getToken`), login page, seed-operator script
- **A4:** 3 route groups — Public layout, Operator layout (sidebar + bottom nav), Shadow layout (dark minimal, shadow_admin only)
- **B1:** HeroSection with 3 background modes, homepage wired with DB site_settings
- **B2:** FeaturedProducts grid + TestimonialsSection (hardcoded)
- **B3:** AboutSection with Google Maps embed, seed-settings updated
- **B4:** SEO — metadata, sitemap.ts, robots.ts, StructuredData.tsx (JSON-LD), Analytics.tsx, `.env.example` with `NEXT_PUBLIC_SITE_URL`
- **C1:** Gallery page `/mau-hoa` with `?danh-muc=` filter, 8 categories, CategoryFilter, responsive grid
- **C1.1:** Color softening (text-muted, hero gradient), full Vietnamese diacritic fix
- **C2:** Product detail page with ImageGallery, VideoEmbed, breadcrumb, sticky info panel, Zalo CTA, trust signals
- **C3:** Per-product dynamic SEO — generateMetadata, generateStaticParams (SSG), revalidate=60 (ISR), Product JSON-LD, slugify helper
- **D1:** Operator dashboard `/quan-ly` — 4 stat cards, recent leads, query helpers with try/catch
- **D2:** Product CRUD — list page with thumbnail/status/actions, ProductForm (create/edit mode), NewProductPage, API routes (POST/PUT/DELETE/PATCH toggle)
- **D3:** Image upload — POST /api/operator/upload (Supabase Storage, 5MB, JPG/PNG/WebP), ImageUploader (drag-drop, multi-image, thumbnails, badges, errors), integrated into ProductForm + API routes
- **D4:** Shop settings + change password — `/quan-ly/cai-dat` page, ShopSettingsForm, ChangePasswordForm, PUT /api/operator/settings, POST /api/operator/change-password
- **D4.1:** Hero text color changed to `#722F37` (deep-wine), shop renamed to "Hoa Nhà Nắng", credit "RongLeo · 0906 899 985" added to footer
- **E1:** Floating chat widget (ChatWidget.tsx) — bottom-right button with pulse dot, slide-up panel (80vh mobile / 520px desktop), welcome message, user/assistant bubbles, 3-dot loading, Zalo CTA after 3+ turns, integrated into public layout
- **E2:** AI API route + Groq integration — POST /api/ai/chat (Groq API, system prompt from DB or default, rate limit 30 req/min/IP, error fallback Vietnamese), lazy Groq client (getGroq()), DEFAULT_SYSTEM_PROMPT in src/config/ai-prompts.ts
- **E3:** Lead capture — save conversations to `ai_conversations` table, extract lead info (occasion/budget/color) via regex in `lead-extractor.ts`, upsert leads table, GET /api/operator/leads, operator leads page `/quan-ly/khach-hang` with badges
- **E4:** Zalo CTA tracking — POST /api/ai/track-zalo (fire-and-forget), leads.zaloRedirected flag, pre-filled Zalo message, soft CTA (turn 3-4) / strong CTA (turn 5+, bounce-gentle animation), globals.css animation keyframes
- **F1:** Shadow route protection — layout with notFound() for non-shadow_admin, ShadowNav (6 tabs: overview, AI Logs, Leads, Prompt Config, Operator Log, Control), dashboard page with stats + env health check
- **F2:** AI conversation logs — `/ai-logs` list page (session ID, last message, turn count, Zalo CTA status, date filter) + `/ai-logs/[id]` detail page (full chat history with user/assistant bubbles)
- **F3:** Lead analytics — `/leads` page with 3 summary cards (total, zalo redirected, conversion rate), occasion bar chart (CSS), recent 50 leads table
- **F4:** Prompt config editor — `/prompt-config` page (default prompt readonly + custom prompt textarea), PromptConfigEditor client component (save/reset), API PUT/DELETE /api/shadow/prompt-config (shadow_admin guard)
- **F5:** Operator activity logging — `activity-logger.ts` helper, `logActivity` calls in 5 API routes (product_create/update/delete/publish/unpublish, settings_update, password_change), `/operator-log` page with 200 records, user email, action labels, color coding
- **F5.1:** Logo slot in header/footer — `NEXT_PUBLIC_LOGO_PATH` env var (default `/logo.png`), `<img>` tag with onError fallback to text shop name, `.env.example` updated
- **F6:** Kill switch + operator management — `/control` page with KillSwitchControl (toggle `site_enabled` in site_settings), OperatorManager (reset password, enable/disable operators), API routes `/api/shadow/kill-switch` (PUT) + `/api/shadow/operator-management` (PUT/PATCH), public layout checks `site_enabled` and shows "Tạm nghỉ" page when disabled

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- **Lazy clients:** Node.js-based clients (db, supabase, groq) are all lazily initialized via Proxy/getter to prevent build failures during module evaluation when env vars are unset
- **Middleware uses `getToken`:** Edge Runtime restriction — reads JWT directly via `next-auth/jwt` instead of importing `auth` (which would chain-import Node.js modules)
- **Route groups for layouts:** `(public)`, `(operator)`, `(shadow)` groups allow dedicated layouts without URL structure impact
- **Shadow route via dynamic slug:** `/[shadowSlug]` — middleware checks pathname at runtime, layout checks slug matches env
- **Activity logging fire-and-forget:** try/catch wraps all DB inserts so log failures never crash main operations
- **Chat widget AI integration:** Client sends full message history, server passes to Groq (with system prompt from DB or default), saves conversation to DB, extracts lead info after 2+ turns
- **Kill switch in public layout:** Reads `site_enabled` setting from DB at layout level rather than middleware (middleware is Edge Runtime, can't query DB)
- **`??` vs `||`:** `??` only checks null/undefined, not empty string — layout.tsx uses `||` for `NEXT_PUBLIC_SITE_URL` fallback

## Next Steps
- Move TASK-036 (EPIC) from active/ to done/
- Git tag `v0.1.0-flower-store`
- Phase G: AI workspace, local search, performance polish

## Critical Context
- Commits: starting from `8aaaf04` (D4), last at `dcbd580` (F6)
- Build currently passes with 29 routes: public (home, gallery, product), operator (dashboard, products CRUD, settings, leads), shadow (overview, ai-logs, leads, operator-log, prompt-config, control), API routes (auth, products, settings, upload, AI chat, track-zalo, shadow, operator leads)
- Vietnamese Unicode cannot be reliably passed through tool write commands — must use `edit` tool (matches file content exactly) or PowerShell codepoint construction
- Three env files needed: `.env.local` (secrets), `.env` (shared config, may have empty `NEXT_PUBLIC_SITE_URL` — use `||` not `??` for fallback), `.env.example` (template)
- Shadow layout uses server component signOut via `'use server'` inline action importing `signOut` from `@/lib/auth`
- AI rate limit in-memory (Map) — resets on server restart; 30 req/min/IP

## Relevant Files
- `database/schema.ts`: 6 Drizzle tables + 2 pgEnum
- `database/seed-settings.ts`: Default site settings (hero, shop, ai_system_prompt, site_enabled)
- `src/lib/db/index.ts`: Lazy Drizzle client via Proxy
- `src/lib/db/supabase.ts`: Lazy Supabase clients via Proxy + function binding
- `src/lib/db/queries.ts`: getDashboardStats() + getRecentLeads()
- `src/lib/auth/index.ts`: NextAuth v5 config + signOut export
- `src/lib/ai/groq.ts`: Lazy Groq client via getGroq() getter
- `src/lib/ai/lead-extractor.ts`: Regex-based lead info extraction (occasion, budget, color)
- `src/lib/activity-logger.ts`: logActivity() helper for 8 action types
- `src/lib/slug.ts`: slugify() helper
- `src/config/ai-prompts.ts`: DEFAULT_SYSTEM_PROMPT for AI chat
- `src/config/categories.ts`: 8 product categories
- `middleware.ts`: Edge Runtime auth + shadow route guard
- `src/app/layout.tsx`: Root layout with metadata + metadataBase (use `||` for SITE_URL fallback)
- `src/app/globals.css`: 3 themes + static colors + animation keyframes (bounce-gentle)
- `src/app/robots.ts`: Blocks `/quan-ly/`, `/dang-nhap/`, shadow slug, `/api/`
- `src/app/sitemap.ts`: Static pages + published product URLs
- `src/app/(public)/layout.tsx`: Public layout with header/footer/chat + kill switch check
- `src/app/(public)/page.tsx`: Homepage (HeroSection, FeaturedProducts, TestimonialsSection, AboutSection)
- `src/components/public/HeroSection.tsx`: Hero with 3 background modes, CTAs (deep-wine text)
- `src/components/public/FeaturedProducts.tsx`: Featured grid from DB
- `src/components/public/TestimonialsSection.tsx`: Hardcoded testimonial cards
- `src/components/public/AboutSection.tsx`: Contact info + Google Maps embed
- `src/components/public/StructuredData.tsx`: JSON-LD schema
- `src/components/public/Analytics.tsx`: GA + Clarity env-gated
- `src/components/public/CategoryFilter.tsx`: URL-based gallery filter
- `src/components/public/ImageGallery.tsx`: Product image gallery
- `src/components/public/VideoEmbed.tsx`: YouTube/TikTok embed
- `src/components/public/PublicHeader.tsx`: Sticky header with logo slot + mobile drawer
- `src/components/public/PublicFooter.tsx`: Footer with logo slot + RongLeo credit
- `src/components/public/ChatWidget.tsx`: Floating chat with AI integration, Zalo CTA (soft/strong), bounce animation
- `src/components/operator/OperatorSidebar.tsx`: Desktop sidebar + mobile bottom nav
- `src/components/operator/ProductActions.tsx`: Action dropdown (edit/toggle/delete)
- `src/components/operator/ProductForm.tsx`: Create/edit form with ImageUploader
- `src/components/operator/ImageUploader.tsx`: Drag-drop multi-image upload
- `src/components/operator/ShopSettingsForm.tsx`: Editable hero settings
- `src/components/operator/ChangePasswordForm.tsx`: Password change form
- `src/components/shadow/ShadowNav.tsx`: Shadow admin navigation (6 tabs)
- `src/components/shadow/PromptConfigEditor.tsx`: AI prompt textarea with save/reset
- `src/components/shadow/KillSwitchControl.tsx`: Toggle public site on/off
- `src/components/shadow/OperatorManager.tsx`: Operator list with reset password + enable/disable
- `src/app/(operator)/quan-ly/page.tsx`: Dashboard stats
- `src/app/(operator)/quan-ly/mau-hoa/page.tsx`: Product list
- `src/app/(operator)/quan-ly/mau-hoa/them-moi/page.tsx`: New product
- `src/app/(operator)/quan-ly/cai-dat/page.tsx`: Settings + change password
- `src/app/(operator)/quan-ly/khach-hang/page.tsx`: Leads list with badges
- `src/app/(shadow)/[shadowSlug]/layout.tsx`: Shadow layout with auth guard
- `src/app/(shadow)/[shadowSlug]/page.tsx`: Dashboard with stats + env health
- `src/app/(shadow)/[shadowSlug]/ai-logs/page.tsx`: Conversation list with date filter
- `src/app/(shadow)/[shadowSlug]/ai-logs/[id]/page.tsx`: Full chat history
- `src/app/(shadow)/[shadowSlug]/leads/page.tsx`: Lead analytics with bar chart
- `src/app/(shadow)/[shadowSlug]/prompt-config/page.tsx`: Default + custom prompt editor
- `src/app/(shadow)/[shadowSlug]/operator-log/page.tsx`: Operator activity (200 records)
- `src/app/(shadow)/[shadowSlug]/control/page.tsx`: Kill switch + operator management
- `src/app/api/ai/chat/route.ts`: POST Groq AI chat + DB save + lead extraction
- `src/app/api/ai/track-zalo/route.ts`: POST Zalo click tracking
- `src/app/api/operator/products/route.ts`: POST create + logActivity
- `src/app/api/operator/products/[id]/route.ts`: PUT update + DELETE + logActivity
- `src/app/api/operator/products/[id]/toggle/route.ts`: PATCH publish/unpublish + logActivity
- `src/app/api/operator/settings/route.ts`: PUT shop settings + logActivity
- `src/app/api/operator/change-password/route.ts`: POST password change + logActivity
- `src/app/api/operator/upload/route.ts`: POST image upload to Supabase Storage
- `src/app/api/operator/leads/route.ts`: GET leads list
- `src/app/api/shadow/prompt-config/route.ts`: PUT/DELETE custom AI prompt
- `src/app/api/shadow/kill-switch/route.ts`: PUT site_enabled toggle
- `src/app/api/shadow/operator-management/route.ts`: PUT reset password + PATCH toggle active
- `src/app/(public)/mau-hoa/page.tsx`: Gallery with category filter
- `src/app/(public)/mau-hoa/[slug]/page.tsx`: Product detail (SSG + ISR + SEO + JSON-LD)
- `database/seed-operator.ts`: Create operator account
- `src/lib/utils.ts`: `cn()` helper
- `.env.example`: All env keys incl. LOGO vars
- `package.json`: Build/lint/db scripts
