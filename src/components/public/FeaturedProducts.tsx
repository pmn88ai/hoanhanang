import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  slug: string;
  title: string;
  priceRange: string | null;
  images: string[];
  category: string | null;
}

interface Props {
  products: Product[];
}

export default function FeaturedProducts({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">
            Bo suu tap
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary font-semibold">
            Mau hoa noi bat
          </h2>
          <p className="text-text-muted mt-3 text-base">
            Duoc khach hang yeu thich nhat thang nay
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/mau-hoa/${product.slug}`}
              className="group bg-bg-card rounded-2xl overflow-hidden border border-border-color hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-square relative overflow-hidden bg-bg-secondary">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted text-4xl">
                    🌸
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-accent font-medium mb-1">
                  {product.category ?? "Hoa tuoi"}
                </p>
                <h3 className="text-text-primary font-medium text-sm leading-snug mb-2 line-clamp-2">
                  {product.title}
                </h3>
                {product.priceRange && (
                  <p className="text-cta text-sm font-semibold">
                    {product.priceRange}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/mau-hoa"
            className="inline-flex items-center gap-2 text-cta font-medium hover:gap-3 transition-all text-sm"
          >
            Xem tat ca mau hoa
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
