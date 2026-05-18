"use client";
import { useState } from "react";

const FIELDS = [
  {
    key: "hero_tagline",
    label: "Khau hieu chinh (Hero)",
    type: "text",
    placeholder: "Hoa tuoi — Cam xuc that",
  },
  {
    key: "hero_sub_tagline",
    label: "Phu de (Hero)",
    type: "text",
    placeholder: "Moi bo hoa la mot cau chuyen...",
  },
  {
    key: "hero_image_url",
    label: "Link anh nen Hero",
    type: "url",
    placeholder: "https://...",
  },
  {
    key: "hero_video_url",
    label: "Link video Hero (YouTube embed URL)",
    type: "url",
    placeholder: "https://www.youtube.com/embed/...",
  },
  {
    key: "shop_description",
    label: "Gioi thieu ngan ve shop",
    type: "textarea",
    placeholder: "Chung toi mang den...",
  },
];

const ENV_FIELDS = [
  { key: "zalo", label: "Zalo URL", note: "Cap nhat trong file .env" },
  {
    key: "facebook",
    label: "Facebook URL",
    note: "Cap nhat trong file .env",
  },
  { key: "address", label: "Dia chi", note: "Cap nhat trong file .env" },
  {
    key: "maps",
    label: "Google Maps Embed URL",
    note: "Cap nhat trong file .env",
  },
];

export default function ShopSettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/operator/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (!res.ok) {
      setError("Khong luu duoc. Vui long thu lai.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  };

  const inputClass =
    "w-full bg-bg-secondary border border-border-color rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-accent transition";
  const labelClass = "block text-sm font-medium text-text-primary mb-1.5";

  return (
    <div className="space-y-6">
      <h2 className="text-base font-semibold text-text-primary">
        Noi dung hien thi
      </h2>

      {FIELDS.map((field) => (
        <div key={field.key}>
          <label className={labelClass}>{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              value={settings[field.key] ?? ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, [field.key]: e.target.value }))
              }
              className={inputClass}
              rows={3}
              placeholder={field.placeholder}
            />
          ) : (
            <input
              type={field.type}
              value={settings[field.key] ?? ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, [field.key]: e.target.value }))
              }
              className={inputClass}
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}

      <div className="bg-bg-secondary rounded-xl p-4 space-y-2">
        <p className="text-sm font-medium text-text-primary mb-3">
          Cau hinh ky thuat
        </p>
        {ENV_FIELDS.map((f) => (
          <div
            key={f.key}
            className="flex items-start justify-between gap-4 text-sm"
          >
            <span className="text-text-muted">{f.label}</span>
            <span className="text-text-muted text-xs text-right">
              {f.note}
            </span>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-cta text-cta-text px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
      >
        {loading
          ? "Dang luu..."
          : saved
            ? "Da luu!"
            : "Luu cai dat"}
      </button>
    </div>
  );
}
