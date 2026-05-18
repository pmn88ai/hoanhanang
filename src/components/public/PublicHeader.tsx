"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/mau-hoa", label: "Mẫu hoa" },
  { href: "/lien-he", label: "Liện hệ" },
];

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const zaloUrl = process.env.NEXT_PUBLIC_ZALO_URL ?? "#";
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Flower Store";

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-dusty-pink/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl text-deep-wine font-semibold"
        >
          {shopName}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-charcoal hover:text-deep-wine transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-deep-wine text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          <Phone size={14} />
          Nhăn Zalo
        </a>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-cream border-t border-dusty-pink/20 px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-charcoal py-2"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-deep-wine text-white text-sm px-4 py-3 rounded-xl justify-center"
          >
            <Phone size={14} />
            Nhăn Zalo
          </a>
        </div>
      )}
    </header>
  );
}