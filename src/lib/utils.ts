import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtPrice(raw: string | null | undefined): string {
  if (!raw) return "";
  const cleaned = raw.trim();
  if (/^\d+$/.test(cleaned))
    return Number(cleaned).toLocaleString("vi-VN") + "đ";
  return cleaned;
}
