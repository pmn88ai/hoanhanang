"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/config/categories";
import { slugify } from "@/lib/slug";
import ImageUploader from "@/components/operator/ImageUploader";

interface FormData {
  title: string;
  category: string;
  priceRange: string;
  description: string;
  videoUrl: string;
  isFeatured: boolean;
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
}

const EMPTY_FORM: FormData = {
  title: "",
  category: "",
  priceRange: "",
  description: "",
  videoUrl: "",
  isFeatured: false,
  status: "draft",
  seoTitle: "",
  seoDescription: "",
};

export default function ProductForm({
  initialData,
  productId,
}: {
  initialData?: Partial<FormData> & { images?: string[] };
  productId?: string;
}) {
  const [form, setForm] = useState<FormData>({
    ...EMPTY_FORM,
    ...initialData,
  });
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const set =
    (key: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setForm((f) => ({ ...f, status }));

    const url = productId
      ? `/api/operator/products/${productId}`
      : "/api/operator/products";
    const method = productId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status, images }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message ?? "Co loi xay ra. Vui long thu lai.");
      setLoading(false);
      return;
    }

    router.push("/quan-ly/mau-hoa");
    router.refresh();
  };

  const inputClass =
    "w-full bg-bg-secondary border border-border-color rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-accent transition";
  const labelClass = "block text-sm font-medium text-text-primary mb-1.5";

  return (
    <form onSubmit={(e) => handleSubmit(e, form.status)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Ten mau hoa *</label>
        <input
          required
          value={form.title}
          onChange={set("title")}
          className={inputClass}
          placeholder="Vd: Hoa sinh nhat tone hong pastel"
        />
        {form.title && (
          <p className="text-text-muted text-xs mt-1">
            Duong dan: /mau-hoa/{slugify(form.title)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Danh muc</label>
          <select
            value={form.category}
            onChange={set("category")}
            className={inputClass}
          >
            <option value="">Chon danh muc</option>
            {CATEGORIES.filter((c) => c.value !== "tat-ca").map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Khoang gia</label>
          <input
            value={form.priceRange}
            onChange={set("priceRange")}
            className={inputClass}
            placeholder="Vd: 200.000 - 500.000d"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Mo ta</label>
        <textarea
          value={form.description}
          onChange={set("description")}
          className={inputClass}
          rows={4}
          placeholder="Mo ta chi tiet mau hoa, dip su dung, mau sac..."
        />
      </div>

      <div>
        <label className={labelClass}>Anh san pham</label>
        <ImageUploader images={images} onChange={setImages} />
        <p className="text-text-muted text-xs mt-1">
          Anh dau tien se lam anh chinh
        </p>
      </div>

      <div>
        <label className={labelClass}>Link video (YouTube/TikTok)</label>
        <input
          value={form.videoUrl}
          onChange={set("videoUrl")}
          className={inputClass}
          placeholder="https://youtube.com/watch?v=..."
          type="url"
        />
        <p className="text-text-muted text-xs mt-1">
          Paste link YouTube hoac TikTok
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={form.isFeatured}
          onChange={(e) =>
            setForm((f) => ({ ...f, isFeatured: e.target.checked }))
          }
          className="w-4 h-4 accent-[var(--cta)]"
        />
        <label htmlFor="featured" className="text-sm text-text-primary">
          Hien thi trong muc &quot;Noi bat&quot; o trang chu
        </label>
      </div>

      <details className="border border-border-color rounded-xl p-4">
        <summary className="text-sm font-medium text-text-muted cursor-pointer">
          Tuy chinh SEO (khong bat buoc)
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className={labelClass}>
              Tieu de SEO (toi da 70 ky tu)
            </label>
            <input
              value={form.seoTitle}
              onChange={set("seoTitle")}
              className={inputClass}
              maxLength={70}
              placeholder="De trong -> dung ten mau hoa"
            />
          </div>
          <div>
            <label className={labelClass}>
              Mo ta SEO (toi da 160 ky tu)
            </label>
            <textarea
              value={form.seoDescription}
              onChange={set("seoDescription")}
              className={inputClass}
              rows={2}
              maxLength={160}
            />
          </div>
        </div>
      </details>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          onClick={(e) => handleSubmit(e, "published")}
          className="flex-1 bg-cta text-cta-text py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Dang luu..." : "Luu va hien thi"}
        </button>
        <button
          type="submit"
          disabled={loading}
          onClick={(e) => handleSubmit(e, "draft")}
          className="px-6 border border-border-color text-text-muted py-3 rounded-xl text-sm hover:bg-bg-secondary transition disabled:opacity-60"
        >
          Luu nhap
        </button>
      </div>
    </form>
  );
}
