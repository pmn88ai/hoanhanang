import { db } from "@/lib/db";
import { products } from "../../../../../../../database/schema";
import { eq, isNull, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import ProductForm from "@/components/operator/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function SuaMauHoaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: typeof products.$inferSelect | null = null;

  try {
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .limit(1);
    product = rows[0] ?? null;
  } catch {
    // DB unavailable
  }

  if (!product) redirect("/quan-ly/mau-hoa");

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/quan-ly/mau-hoa" className="text-text-muted hover:text-text-primary transition">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold text-text-primary">Chinh sua mau hoa</h1>
      </div>
      <div className="bg-bg-card rounded-2xl border border-border-color p-6">
        <ProductForm
          productId={product.id}
          initialData={{
            title: product.title,
            category: product.category ?? "",
            priceRange: product.priceRange ?? "",
            salePrice: product.salePrice ?? "",
            description: product.description ?? "",
            videoUrl: product.videoUrl ?? "",
            isFeatured: product.isFeatured,
            status: product.status as "draft" | "published",
            seoTitle: product.seoTitle ?? "",
            seoDescription: product.seoDescription ?? "",
            images: product.images as string[],
          }}
        />
      </div>
    </div>
  );
}
