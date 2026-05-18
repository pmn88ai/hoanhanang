import type { Metadata } from "next";
import { db } from "@/lib/db";
import { products } from "../../../../../database/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone, ChevronLeft } from "lucide-react";
import ImageGallery from "@/components/public/ImageGallery";
import VideoEmbed from "@/components/public/VideoEmbed";
import { fmtPrice } from "@/lib/utils";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const publishedProducts = await db
      .select({ slug: products.slug })
      .from(products)
      .where(and(eq(products.status, "published"), eq(products.isSoldOut, false)));

    return publishedProducts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let product: { title: string; seoTitle: string | null; seoDescription: string | null; priceRange: string | null; images: string[]; slug: string } | null | undefined = null;

  try {
    product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      columns: { title: true, seoTitle: true, seoDescription: true, priceRange: true, images: true, slug: true },
    });
  } catch {
    // DB unavailable
  }

  if (!product) {
    return { title: "Khong tim thay" };
  }

  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Hoa Nhà Nắng";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return {
    title: product.seoTitle ?? product.title,
    description:
      product.seoDescription ??
      `${product.title} tai ${shopName}. ${product.priceRange ? `Gia: ${product.priceRange}.` : ""} Dat hoa qua Zalo, giao tan noi.`,
    openGraph: {
      title: `${product.title} | ${shopName}`,
      description: product.seoDescription ?? `${product.title} — hoa tuoi dep, giao tan noi.`,
      images: product.images[0]
        ? [{ url: product.images[0], width: 800, height: 800, alt: product.title }]
        : [],
      url: `${siteUrl}/mau-hoa/${product.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `${siteUrl}/mau-hoa/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product: Awaited<ReturnType<typeof db.query.products.findFirst>> | null = null;

  try {
    product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
    });
  } catch {
    // DB unavailable during build
  }

  if (!product || product.status !== "published" || product.isSoldOut) {
    notFound();
  }

  const zaloUrl = process.env.NEXT_PUBLIC_ZALO_URL ?? "#";
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Hoa Nhà Nắng";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    offers: product.priceRange
      ? {
          "@type": "Offer",
          priceCurrency: "VND",
          price: product.priceRange,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: shopName,
          },
        }
      : undefined,
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-text-primary transition">
            Trang chu
          </Link>
          <span>/</span>
          <Link href="/mau-hoa" className="hover:text-text-primary transition">
            Mau hoa
          </Link>
          <span>/</span>
          <span className="text-text-primary line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* LEFT: Image gallery */}
          <div>
            <ImageGallery images={product.images} title={product.title} />
            {product.videoUrl && (
              <div className="mt-4">
                <VideoEmbed url={product.videoUrl} title={product.title} />
              </div>
            )}
          </div>

          {/* RIGHT: Info + CTAs */}
          <div className="sticky top-20">
            {product.category && (
              <p className="text-accent text-sm font-medium uppercase tracking-wider mb-2">
                {product.category}
              </p>
            )}
            <h1 className="font-serif text-2xl md:text-3xl text-text-primary font-semibold mb-4 leading-tight">
              {product.title}
            </h1>
            {product.priceRange && (
              <p className="text-2xl text-cta font-bold mb-6">{fmtPrice(product.priceRange)}</p>
            )}
            {product.description && (
              <div className="text-text-muted text-sm leading-relaxed mb-8 whitespace-pre-line">
                {product.description}
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-3">
              <a
                href={`${zaloUrl}?text=${encodeURIComponent(`Xin chao ${shopName}! Minh muon hoi ve mau hoa: ${product.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-cta text-cta-text py-4 rounded-2xl font-semibold hover:opacity-90 transition text-base"
              >
                <Phone size={18} />
                Dat hoa nay qua Zalo
              </a>
              <Link
                href="/mau-hoa"
                className="flex items-center justify-center gap-2 w-full border border-border-color text-text-muted py-3 rounded-2xl text-sm hover:text-text-primary transition"
              >
                <ChevronLeft size={16} />
                Xem mau khac
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: "\u{1F338}", text: "Hoa tuoi moi ngay" },
                { icon: "\u{1F697}", text: "Giao tan noi" },
                { icon: "\u{2B50}", text: "Tu van mien phi" },
              ].map((item) => (
                <div key={item.text} className="bg-bg-secondary rounded-xl p-3">
                  <p className="text-xl mb-1">{item.icon}</p>
                  <p className="text-text-muted text-xs leading-snug">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
