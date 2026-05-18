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
      .select({ isSoldOut: products.isSoldOut })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (current.length === 0) {
      return NextResponse.json(
        { message: "Khong tim thay mau hoa." },
        { status: 404 }
      );
    }

    const newValue = !current[0].isSoldOut;

    await db
      .update(products)
      .set({ isSoldOut: newValue })
      .where(eq(products.id, id));

    await logActivity(session.user.id, newValue ? 'product_sold_out' : 'product_back_in_stock',
      { productId: id }, id,
      req.headers.get('x-forwarded-for') ?? undefined)

    return NextResponse.json({ isSoldOut: newValue });
  } catch {
    return NextResponse.json(
      { message: "Co loi xay ra. Vui long thu lai." },
      { status: 500 }
    );
  }
}
