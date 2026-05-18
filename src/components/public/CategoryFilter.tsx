"use client";

import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/config/categories";
import { cn } from "@/lib/utils";

export default function CategoryFilter({ activeCategory }: { activeCategory: string }) {
  const router = useRouter();

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => {
            if (cat.value === "tat-ca") {
              router.push("/mau-hoa");
            } else {
              router.push(`/mau-hoa?danh-muc=${cat.value}`);
            }
          }}
          className={cn(
            "px-4 py-2 rounded-xl text-sm transition-all",
            activeCategory === cat.value
              ? "bg-cta text-cta-text font-medium"
              : "bg-bg-card text-text-muted hover:text-text-primary border border-border-color"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
