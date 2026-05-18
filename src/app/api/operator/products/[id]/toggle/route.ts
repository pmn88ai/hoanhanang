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
    const current = await db
      .select({ status: products.status })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (current.length === 0) {
      return NextResponse.json(
        { message: "Khong tim thay mau hoa." },
        { status: 404 }
      );
    }

    const newStatus =
      current[0].status === "published" ? "draft" : "published";

    await db
      .update(products)
      .set({ status: newStatus })
      .where(eq(products.id, id));

    await logActivity(session.user.id, newStatus === 'published' ? 'product_publish' : 'product_unpublish',
      { productId: id }, id, req.headers.get('x-forwarded-for') ?? undefined)

    return NextResponse.json({ status: newStatus });
  } catch {
    return NextResponse.json(
      { message: "Co loi xay ra. Vui long thu lai." },
      { status: 500 }
    );
  }
}
