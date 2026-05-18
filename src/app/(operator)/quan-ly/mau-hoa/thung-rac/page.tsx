import Image from "next/image";
import { db } from "@/lib/db";
import { products } from "../../../../../../database/schema";
import { isNotNull, desc } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import TrashActions from "@/components/operator/TrashActions";

export default async function ThungRacPage() {
  let deletedProducts: Array<{
    id: string;
    slug: string;
    title: string;
    images: string[];
    category: string | null;
    deletedAt: Date | null;
  }> = [];

  try {
    deletedProducts = await db
      .select({
        id: products.id,
        slug: products.slug,
        title: products.title,
        images: products.images,
        category: products.category,
        deletedAt: products.deletedAt,
      })
      .from(products)
      .where(isNotNull(products.deletedAt))
      .orderBy(desc(products.deletedAt));
  } catch {
    // DB unavailable
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/quan-ly/mau-hoa" className="text-text-muted hover:text-text-primary transition">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold text-text-primary">Thung rac</h1>
        {deletedProducts.length > 0 && (
          <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
            {deletedProducts.length}
          </span>
        )}
      </div>

      {deletedProducts.length === 0 ? (
        <div className="bg-bg-card rounded-2xl border border-border-color p-12 text-center">
          <p className="text-4xl mb-3">🗑️</p>
          <p className="text-text-muted">Thung rac trong</p>
        </div>
      ) : (
        <div className="bg-bg-card rounded-2xl border border-border-color overflow-hidden">
          {deletedProducts.map((product, i) => (
            <div
              key={product.id}
              className={`flex items-center gap-4 p-4 ${i < deletedProducts.length - 1 ? "border-b border-border-color" : ""}`}
            >
              <div className="w-12 h-12 rounded-xl bg-bg-secondary flex-shrink-0 overflow-hidden relative">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-xl">
                    🌸
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm font-medium truncate">
                  {product.title}
                </p>
                <p className="text-text-muted text-xs">
                  {product.category ?? "Chua phan loai"}
                </p>
              </div>
              <TrashActions productId={product.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
