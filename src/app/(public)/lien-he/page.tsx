import type { Metadata } from "next";
import { db } from "@/lib/db";
import { siteSettings } from "../../../../database/schema";
import AboutSection from "@/components/public/AboutSection";
import Link from "next/link";

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Hoa Nhà Nắng";

export const metadata: Metadata = {
  title: `Liên hệ | ${shopName}`,
  description: `Liên hệ ${shopName} để đặt hoa, tư vấn miễn phí. Giao hoa tận nơi, nhắn Zalo ngay.`,
};

export default async function LienHePage() {
  let settings: Record<string, string> = {};

  try {
    const rows = await db.select().from(siteSettings);
    settings = Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
  } catch {
    // DB unavailable
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-text-primary transition">
            Trang chu
          </Link>
          <span>/</span>
          <span className="text-text-primary">Lien he</span>
        </nav>
      </div>

      <AboutSection
        shopName={shopName}
        description={settings["shop_description"]}
        address={process.env.NEXT_PUBLIC_SHOP_ADDRESS}
        phone={process.env.NEXT_PUBLIC_SHOP_PHONE}
        zaloUrl={process.env.NEXT_PUBLIC_ZALO_URL}
        googleMapsEmbedUrl={process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL}
      />
    </div>
  );
}
