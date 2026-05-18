import { db } from "./index";
import { products, leads } from "../../../database/schema";
import { eq, gte, count } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function getDashboardStats() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  try {
    const [totalPublished, totalDraft, leadsToday, leadsWeek] = await Promise.all([
      db.select({ count: count() }).from(products).where(eq(products.status, "published")),
      db.select({ count: count() }).from(products).where(eq(products.status, "draft")),
      db.select({ count: count() }).from(leads).where(gte(leads.createdAt, today)),
      db.select({ count: count() }).from(leads).where(gte(leads.createdAt, sevenDaysAgo)),
    ]);

    return {
      totalPublished: totalPublished[0].count,
      totalDraft: totalDraft[0].count,
      leadsToday: leadsToday[0].count,
      leadsWeek: leadsWeek[0].count,
    };
  } catch {
    return { totalPublished: 0, totalDraft: 0, leadsToday: 0, leadsWeek: 0 };
  }
}

export async function getRecentLeads(limit = 5) {
  try {
    return db
      .select()
      .from(leads)
      .orderBy(sql`${leads.createdAt} desc`)
      .limit(limit);
  } catch {
    return [];
  }
}
