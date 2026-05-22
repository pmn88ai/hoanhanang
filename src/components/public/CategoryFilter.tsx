"use client";

import { useRouter } from "next/navigation";
import { CATEGORY_GROUPS } from "@/config/categories";
import { cn } from "@/lib/utils";

export default function CategoryFilter({ activeCategory }: { activeCategory: string }) {
  const router = useRouter();

  const go = (value: string) => {
    if (value === "tat-ca") router.push("/mau-hoa");
    else router.push(`/mau-hoa?danh-muc=${value}`);
  };

  const btnClass = (value: string) =>
    cn(
      "px-4 py-2 rounded-xl text-sm transition-all",
      activeCategory === value
        ? "bg-cta text-cta-text font-medium"
        : "bg-bg-card text-text-muted hover:text-text-primary border border-border-color"
    );

  return (
    <div className="space-y-4">
      {/* Tất cả */}
      <div className="flex justify-center">
        <button onClick={() => go("tat-ca")} className={btnClass("tat-ca")}>
          Tất cả
        </button>
      </div>

      {/* Grouped categories */}
      {CATEGORY_GROUPS.map((g) => (
        <div key={g.group}>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider text-center mb-2">
            {g.group}
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {g.items.map((cat) => (
              <button key={cat.value} onClick={() => go(cat.value)} className={btnClass(cat.value)}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
