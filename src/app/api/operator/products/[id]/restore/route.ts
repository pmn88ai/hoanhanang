import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "../../../../../../../database/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-logger";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Chua dang nhap" }, { status: 401 });

  try {
    const [product] = await db
      .update(products)
      .set({ deletedAt: null })
      .where(eq(products.id, id))
      .returning();

    if (!product) {
      return NextResponse.json(
        { message: "Khong tim thay mau hoa." },
        { status: 404 }
      );
    }

    await logActivity(session.user.id, 'product_restore', {}, id,
      req.headers.get('x-forwarded-for') ?? undefined)

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Co loi xay ra. Vui long thu lai." },
      { status: 500 }
    );
  }
}
