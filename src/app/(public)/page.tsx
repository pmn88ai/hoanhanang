import type { Metadata } from "next";
import { db } from "@/lib/db";
import { products, siteSettings } from "../../../database/schema";
import { eq, and } from "drizzle-orm";
import HeroSection from "@/components/public/HeroSection";
import FeaturedProducts from "@/components/public/FeaturedProducts";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import AboutSection from "@/components/public/AboutSection";

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Cua hang hoa";

export const metadata: Metadata = {
  title: "Trang chu",
  description:
    "Hoa tuoi dep, giao tan noi. Dat hoa sinh nhat, khai truong, cuoi hoi. Lien he Zalo ngay.",
  openGraph: {
    title: `${shopName} — Hoa tuoi dep`,
    description: "Hoa tuoi, giao tan noi, gia hop ly.",
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
          and(eq(products.isFeatured, true), eq(products.status, "published"))
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
        shopName={process.env.NEXT_PUBLIC_SHOP_NAME ?? "Cua hang hoa"}
        tagline={settings["hero_tagline"] ?? "Hoa tuoi - Cam xuc that"}
        subTagline={
          settings["hero_sub_tagline"] ??
          "Moi bo hoa la mot cau chuyen"
        }
        heroImageUrl={settings["hero_image_url"]}
        heroVideoUrl={settings["hero_video_url"]}
        zaloUrl={process.env.NEXT_PUBLIC_ZALO_URL ?? "#"}
        facebookUrl={process.env.NEXT_PUBLIC_FACEBOOK_URL}
      />
      <FeaturedProducts products={featuredProducts} />
      <TestimonialsSection />
      <AboutSection
        shopName={process.env.NEXT_PUBLIC_SHOP_NAME ?? "Cua hang hoa"}
        description={settings["shop_description"]}
        address={process.env.NEXT_PUBLIC_SHOP_ADDRESS}
        phone={process.env.NEXT_PUBLIC_SHOP_PHONE}
        zaloUrl={process.env.NEXT_PUBLIC_ZALO_URL}
        googleMapsEmbedUrl={process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL}
      />
    </>
  );
}
