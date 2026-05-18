import Image from "next/image";
import { db } from "@/lib/db";
import { products } from "../../../../../database/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import ProductActions from "@/components/operator/ProductActions";
import { Plus } from "lucide-react";

export default async function ManageProductsPage() {
  let allProducts: Array<{
    id: string;
    slug: string;
    title: string;
    priceRange: string | null;
    images: string[];
    category: string | null;
    status: string;
    createdAt: Date;
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
        status: products.status,
        createdAt: products.createdAt,
      })
      .from(products)
      .orderBy(desc(products.createdAt));
  } catch {
    // DB unavailable
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Mau hoa</h1>
        <Link
          href="/quan-ly/mau-hoa/them-moi"
          className="flex items-center gap-2 bg-cta text-cta-text px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Them mau moi
        </Link>
      </div>

      {allProducts.length === 0 ? (
        <div className="bg-bg-card rounded-2xl border border-border-color p-12 text-center">
          <p className="text-4xl mb-3">🌸</p>
          <p className="text-text-muted mb-4">Chua co mau hoa nao</p>
          <Link
            href="/quan-ly/mau-hoa/them-moi"
            className="bg-cta text-cta-text px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition inline-block"
          >
            Them mau dau tien
          </Link>
        </div>
      ) : (
        <div className="bg-bg-card rounded-2xl border border-border-color overflow-hidden">
          {allProducts.map((product, i) => (
            <div
              key={product.id}
              className={`flex items-center gap-4 p-4 ${i < allProducts.length - 1 ? "border-b border-border-color" : ""}`}
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
                  {product.category ?? "Chua phan loai"} &middot;{" "}
                  {product.priceRange ?? "Chua co gia"}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    product.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-secondary text-text-muted"
                  }`}
                >
                  {product.status === "published" ? "Dang hien thi" : "Nhap"}
                </span>
                <ProductActions
                  productId={product.id}
                  status={product.status}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
