import HeroSection from "@/components/public/HeroSection";
import { db } from "@/lib/db";
import { siteSettings } from "../../../database/schema";

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(siteSettings);
    return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <HeroSection
      shopName={process.env.NEXT_PUBLIC_SHOP_NAME ?? "Cua hang hoa"}
      tagline={
        settings["hero_tagline"] ?? "Hoa tuoi - Cam xuc that"
      }
      subTagline={
        settings["hero_sub_tagline"] ??
        "Moi bo hoa la mot cau chuyen"
      }
      heroImageUrl={settings["hero_image_url"]}
      heroVideoUrl={settings["hero_video_url"]}
      zaloUrl={process.env.NEXT_PUBLIC_ZALO_URL ?? "#"}
      facebookUrl={process.env.NEXT_PUBLIC_FACEBOOK_URL}
    />
  );
}
