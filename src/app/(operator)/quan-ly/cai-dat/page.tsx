import { db } from "@/lib/db";
import { siteSettings } from "../../../../../database/schema";
import ShopSettingsForm from "@/components/operator/ShopSettingsForm";
import ChangePasswordForm from "@/components/operator/ChangePasswordForm";

export default async function SettingsPage() {
  let settings: Record<string, string> = {};

  try {
    const rows = await db.select().from(siteSettings);
    settings = Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
  } catch {
    // DB unavailable
  }

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          Cai dat cua hang
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Thong tin hien thi tren website va lien he
        </p>
      </div>

      <ShopSettingsForm initialSettings={settings} />

      <hr className="border-border-color" />

      <div>
        <h2 className="text-base font-semibold text-text-primary mb-6">
          Doi mat khau
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
