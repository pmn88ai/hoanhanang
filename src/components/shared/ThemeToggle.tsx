"use client";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", icon: Sun, label: "Sáng" },
  { value: "dark", icon: Moon, label: "Tối" },
  { value: "luxury", icon: Sparkles, label: "Sang trọng" },
] as const;

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useHydrated();
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1 bg-bg-secondary rounded-xl p-1">
      {THEMES.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={cn(
            "p-1.5 rounded-lg transition",
            theme === value
              ? "bg-accent text-cta-text"
              : "text-text-muted hover:text-text-primary"
          )}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
