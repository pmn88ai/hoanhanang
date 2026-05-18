import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db/supabase";
import { NextRequest, NextResponse } from "next/server";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "product-images";
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Chua dang nhap" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file)
    return NextResponse.json({ message: "Khong tim thay file" }, { status: 400 });
  if (file.size > MAX_SIZE)
    return NextResponse.json(
      { message: "Anh qua lon. Vui long chon anh duoi 5MB." },
      { status: 400 }
    );
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json(
      { message: "Chi ho tro anh JPG, PNG, WebP." },
      { status: 400 }
    );

  const ext = file.name.split(".").pop();
  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error)
    return NextResponse.json(
      { message: "Khong upload duoc anh. Thu lai nhe." },
      { status: 500 }
    );

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: publicUrl });
}
