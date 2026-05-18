import {
  pgTable, text, varchar, boolean, integer, serial,
  timestamp, jsonb, uuid, pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ===== ENUMS =====

export const userRoleEnum = pgEnum("user_role", ["operator", "shadow_admin"]);
export const postStatusEnum = pgEnum("post_status", ["draft", "published", "archived"]);

// ===== USERS (operator accounts) =====
// shadow_admin KHÔNG có trong bảng này — chỉ trong .env
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  plainPasswordHint: text("plain_password_hint"),
  role: userRoleEnum("role").notNull().default("operator"),
  name: varchar("name", { length: 100 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ===== PRODUCTS (mẫu hoa) =====
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priceRange: varchar("price_range", { length: 100 }),
  category: varchar("category", { length: 100 }),
  images: jsonb("images").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  videoUrl: varchar("video_url", { length: 500 }),
  status: postStatusEnum("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  seoTitle: varchar("seo_title", { length: 70 }),
  seoDescription: varchar("seo_description", { length: 160 }),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ===== LEADS (khách hàng tiềm năng) =====
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: varchar("session_id", { length: 100 }),
  customerName: varchar("customer_name", { length: 100 }),
  customerPhone: varchar("customer_phone", { length: 20 }),
  occasion: varchar("occasion", { length: 100 }),
  budget: varchar("budget", { length: 100 }),
  colorPreference: varchar("color_preference", { length: 100 }),
  aiConversationId: uuid("ai_conversation_id"),
  zaloRedirected: boolean("zalo_redirected").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ===== AI CONVERSATIONS =====
export const aiConversations = pgTable("ai_conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: varchar("session_id", { length: 100 }),
  messages: jsonb("messages")
    .$type<Array<{
      role: "user" | "assistant";
      content: string;
      timestamp: string;
    }>>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  leadId: uuid("lead_id").references(() => leads.id),
  turnCount: integer("turn_count").notNull().default(0),
  zaloCTAShown: boolean("zalo_cta_shown").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ===== SITE SETTINGS =====
export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value"),
  updatedBy: varchar("updated_by", { length: 50 }).notNull().default("system"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ===== OPERATOR EVENTS (cảnh báo cho shadow) =====
export const operatorEvents = pgTable("operator_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== OPERATOR ACTIVITY LOG =====
export const operatorActivity = pgTable("operator_activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  targetId: varchar("target_id", { length: 100 }),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
