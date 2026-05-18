import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "../../../../../../../database/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-logger";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Chua dang nhap" }, { status: 401 });

  try {
    await db.delete(products).where(eq(products.id, id));
    await logActivity(session.user.id, 'product_permanent_delete', {}, id,
      req.headers.get('x-forwarded-for') ?? undefined)
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Co loi xay ra. Vui long thu lai." },
      { status: 500 }
    );
  }
}
