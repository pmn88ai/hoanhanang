import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { products } from "../../../../database/schema";
import { eq, and } from "drizzle-orm";
import CategoryFilter from "@/components/public/CategoryFilter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mau hoa",
  description:
    "Kham pha cac mau hoa tuoi dep — sinh nhat, khai truong, cuoi hoi, qua tang. Dat hoa qua Zalo, giao tan noi.",
};

interface Props {
  searchParams: Promise<{ "danh-muc"?: string }>;
}

export default async function GalleryPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params["danh-muc"];

  const where =
    category && category !== "tat-ca"
      ? and(eq(products.status, "published"), eq(products.category, category))
      : eq(products.status, "published");

  let allProducts: Array<{
    id: string;
    slug: string;
    title: string;
    priceRange: string | null;
    images: string[];
    category: string | null;
    isFeatured: boolean;
  }> = [];

  try {
    allProducts = await db
      .select({
        id: products.id,
        slug: products.slug,
        title: products.title,
        priceRange: products.priceRange,
        images: products.images,
        category: products.category,
        isFeatured: products.isFeatured,
      })
      .from(products)
      .where(where)
      .orderBy(products.createdAt);
  } catch {
    // DB unavailable
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">
            Bo suu tap
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-text-primary font-semibold">
            Tat ca mau hoa
          </h1>
          <p className="text-text-muted mt-3">
            {allProducts.length} mau hoa dang co san
          </p>
        </div>

        {/* Filter tabs */}
        <CategoryFilter activeCategory={category ?? "tat-ca"} />

        {/* Grid */}
        {allProducts.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <p className="text-4xl mb-4">🌸</p>
            <p>Chua co mau hoa nao trong danh muc nay</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {allProducts.map((product) => (
              <Link
                key={product.id}
                href={`/mau-hoa/${product.slug}`}
                className="group bg-bg-card rounded-2xl overflow-hidden border border-border-color hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden bg-bg-secondary">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🌸
                    </div>
                  )}
                  {product.isFeatured && (
                    <span className="absolute top-2 left-2 bg-cta text-cta-text text-xs px-2 py-0.5 rounded-full font-medium">
                      Noi bat
                    </span>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <p className="text-xs text-accent mb-1">
                    {product.category ?? "Hoa tuoi"}
                  </p>
                  <h2 className="text-text-primary text-sm font-medium line-clamp-2 leading-snug">
                    {product.title}
                  </h2>
                  {product.priceRange && (
                    <p className="text-cta text-sm font-semibold mt-1">
                      {product.priceRange}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
