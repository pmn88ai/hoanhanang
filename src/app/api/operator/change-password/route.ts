import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, operatorEvents } from "../../../../../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activity-logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Chua dang nhap" }, { status: 401 });

  if (session.user.id === "shadow_admin") {
    return NextResponse.json(
      { message: "Shadow admin khong the doi mat khau." },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { message: "Vui long nhap day du thong tin." },
      { status: 400 }
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { message: "Mat khau moi phai co it nhat 8 ky tu." },
      { status: 400 }
    );
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { message: "Khong tim thay nguoi dung." },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { message: "Mat khau hien tai khong dung." },
        { status: 401 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db
      .update(users)
      .set({ passwordHash: newHash })
      .where(eq(users.id, session.user.id));

    // Ghi event cho shadow admin
    try {
      await db.insert(operatorEvents).values({
        eventType: "password_changed",
        message: "Operator đã đổi mật khẩu",
      });
    } catch {
      // fire-and-forget
    }

    await logActivity(session.user.id, 'password_change', {}, undefined,
      req.headers.get('x-forwarded-for') ?? undefined)

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Co loi xay ra. Vui long thu lai." },
      { status: 500 }
    );
  }
}
