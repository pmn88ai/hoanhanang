import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "../../../../../database/schema";
import { slugify } from "@/lib/slug";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Chua dang nhap" }, { status: 401 });

  const body = await req.json();
  const slug = slugify(body.title);

  try {
    const [product] = await db
      .insert(products)
      .values({
        slug,
        title: body.title,
        category: body.category || null,
        priceRange: body.priceRange || null,
        description: body.description || null,
        videoUrl: body.videoUrl || null,
        isFeatured: body.isFeatured ?? false,
        status: body.status ?? "draft",
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json(product);
  } catch (err: unknown) {
    if ((err as { code?: string })?.code === "23505") {
      return NextResponse.json(
        {
          message:
            "Ten mau hoa nay da ton tai. Vui long chon ten khac.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Co loi xay ra. Vui long thu lai." },
      { status: 500 }
    );
  }
}
