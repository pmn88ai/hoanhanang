import { db } from "../src/lib/db";
import { siteSettings } from "./schema";

const defaults = [
  { key: "hero_tagline", value: "Hoa tuoi - Cam xuc that" },
  {
    key: "hero_sub_tagline",
    value:
      "Moi bo hoa la mot cau chuyen. Chung toi giup ban ke cau chuyen do.",
  },
  { key: "hero_image_url", value: "" },
  { key: "hero_video_url", value: "" },
  {
    key: "shop_description",
    value:
      "Chung toi mang den nhung bo hoa tuoi dep nhat voi tinh yeu va su cham chut tung bong.",
  },
];

for (const s of defaults) {
  await db
    .insert(siteSettings)
    .values({ ...s, updatedBy: "seed" })
    .onConflictDoNothing();
}
console.log("Site settings seeded");
process.exit(0);
