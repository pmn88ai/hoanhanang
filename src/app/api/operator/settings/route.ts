import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteSettings } from "../../../../../database/schema";
import { logActivity } from "@/lib/activity-logger";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Chua dang nhap" }, { status: 401 });

  const body = await req.json();

  try {
    for (const [key, value] of Object.entries(body)) {
      if (typeof key !== "string" || typeof value !== "string") continue;
      await db
        .insert(siteSettings)
        .values({ key, value, updatedBy: session.user.email ?? "operator" })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value, updatedBy: session.user.email ?? "operator" },
        });
    }

    await logActivity(session.user.id, 'settings_update', { updatedKeys: Object.keys(body) }, undefined,
      req.headers.get('x-forwarded-for') ?? undefined)

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Khong luu duoc. Vui long thu lai." },
      { status: 500 }
    );
  }
}
