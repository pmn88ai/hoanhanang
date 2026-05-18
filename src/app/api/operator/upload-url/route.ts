import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db/supabase";
import { NextRequest, NextResponse } from "next/server";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "product-images";
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Chua dang nhap" }, { status: 401 });

  const { contentType } = await req.json();

  if (!ALLOWED.includes(contentType))
    return NextResponse.json(
      { message: "Chi ho tro anh JPG, PNG, WebP." },
      { status: 400 }
    );

  const ext = contentType.split("/")[1];
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data)
    return NextResponse.json(
      { message: "Khong tao duoc URL upload." },
      { status: 500 }
    );

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path,
    publicUrl,
  });
}
