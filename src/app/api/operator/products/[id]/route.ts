import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "../../../../../../database/schema";
import { slugify } from "@/lib/slug";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-logger";
import { NextRequest, NextResponse } from "next/server";

function isValidUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Chua dang nhap" }, { status: 401 });

  const body = await req.json();
  const slug = slugify(body.title);

  try {
    const [product] = await db
      .update(products)
      .set({
        slug,
        title: body.title,
        category: body.category || null,
        priceRange: body.priceRange || null,
        salePrice: body.salePrice || null,
        description: body.description || null,
        videoUrl: body.videoUrl || null,
        isFeatured: body.isFeatured ?? false,
        status: body.status ?? "draft",
        images: body.images ?? [],
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
      })
      .where(eq(products.id, id))
      .returning();

    if (!product) {
      return NextResponse.json(
        { message: "Khong tim thay mau hoa." },
        { status: 404 }
      );
    }

    await logActivity(session.user.id, 'product_update', { title: body.title, slug }, id,
      req.headers.get('x-forwarded-for') ?? undefined)

    return NextResponse.json(product);
  } catch (err: unknown) {
    const pgCode = (err as { code?: string })?.code
      ?? (err as { cause?: { code?: string } })?.cause?.code;
    if (pgCode === "23505") {
      return NextResponse.json(
        { message: "Ten mau hoa nay da ton tai. Vui long chon ten khac." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Co loi xay ra. Vui long thu lai." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Chua dang nhap" }, { status: 401 });

  try {
    await db
      .update(products)
      .set({ deletedAt: new Date() })
      .where(eq(products.id, id));
    await logActivity(session.user.id, 'product_soft_delete', {}, id,
      req.headers.get('x-forwarded-for') ?? undefined)
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Co loi xay ra. Vui long thu lai." },
      { status: 500 }
    );
  }
}
