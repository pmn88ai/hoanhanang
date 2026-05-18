import type { Metadata } from "next";
import { db } from "@/lib/db";
import { products, siteSettings } from "../../../database/schema";
import { eq, and } from "drizzle-orm";
import HeroSection from "@/components/public/HeroSection";
import FeaturedProducts from "@/components/public/FeaturedProducts";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import AboutSection from "@/components/public/AboutSection";

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Hoa Nhà Nắng";

export const metadata: Metadata = {
  title: "Trang chu",
  description:
    "Hoa tươi đẹp, giao tận nơi. Đặt hoa sinh nhật, khai trương, cưới hỏi. Liên hệ Zalo ngay.",
  openGraph: {
    title: `${shopName} — Hoa tươi đẹp`,
    description: "Hoa tươi, giao tận nơi, giá hợp lý.",
    images: ["/og-image.jpg"],
  },
};

export default async function HomePage() {
  let settings: Record<string, string> = {};
  let featuredProducts: Array<{
    id: string;
    slug: string;
    title: string;
    priceRange: string | null;
    images: string[];
    category: string | null;
  }> = [];

  try {
    const [settingsRows, productsRows] = await Promise.all([
      db.select().from(siteSettings).then((rows) =>
        Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]))
      ),
      db
        .select({
          id: products.id,
          slug: products.slug,
          title: products.title,
          priceRange: products.priceRange,
          images: products.images,
          category: products.category,
        })
        .from(products)
        .where(
          and(eq(products.isFeatured, true), eq(products.status, "published"), eq(products.isSoldOut, false))
        )
        .limit(8),
    ]);
    settings = settingsRows;
    featuredProducts = productsRows;
  } catch {
    // DB unavailable during build — use defaults
  }

  return (
    <>
      <HeroSection
        shopName={process.env.NEXT_PUBLIC_SHOP_NAME ?? "Hoa Nhà Nắng"}
        tagline={settings["hero_tagline"] ?? "Hoa tươi - Cảm xúc thật"}
        subTagline={
          settings["hero_sub_tagline"] ??
          "Mỗi bó hoa là một câu chuyện"
        }
        heroImageUrl={settings["hero_image_url"]}
        heroVideoUrl={settings["hero_video_url"]}
        zaloUrl={process.env.NEXT_PUBLIC_ZALO_URL ?? "#"}
        facebookUrl={process.env.NEXT_PUBLIC_FACEBOOK_URL}
      />
      <FeaturedProducts products={featuredProducts} />
      <TestimonialsSection />
      <AboutSection
        shopName={process.env.NEXT_PUBLIC_SHOP_NAME ?? "Hoa Nhà Nắng"}
        description={settings["shop_description"]}
        address={process.env.NEXT_PUBLIC_SHOP_ADDRESS}
        phone={process.env.NEXT_PUBLIC_SHOP_PHONE}
        zaloUrl={process.env.NEXT_PUBLIC_ZALO_URL}
        googleMapsEmbedUrl={process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL}
      />
    </>
  );
}
