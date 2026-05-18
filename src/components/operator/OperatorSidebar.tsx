"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Flower2,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/quan-ly", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/quan-ly/mau-hoa", label: "Mẫu hoa", icon: Flower2 },
  { href: "/quan-ly/khach-hang", label: "Khấch hàng", icon: Users },
  { href: "/quan-ly/cai-dat", label: "Cài đăt", icon: Settings },
];

export default function OperatorSidebar({
  userEmail,
}: {
  userEmail: string;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-100 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <p className="font-serif text-deep-wine font-semibold">
            Quản lý shop
          </p>
          <p className="text-xs text-gray-400 mt-1 truncate">{userEmail}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition",
                  active
                    ? "bg-dusty-pink/20 text-deep-wine font-medium"
                    : "text-charcoal hover:bg-light-gray",
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-light-gray w-full transition"
          >
            <LogOut size={16} />
            đng xuất
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 md:hidden flex items-center justify-around py-2 z-50">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition",
                active
                  ? "text-deep-wine"
                  : "text-gray-400 hover:text-charcoal",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}