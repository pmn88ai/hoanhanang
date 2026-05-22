"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/mau-hoa", label: "Mẫu hoa" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const zaloUrl = process.env.NEXT_PUBLIC_ZALO_URL ?? "#";
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Hoa Nhà Nắng";
  const logoPath = process.env.NEXT_PUBLIC_LOGO_PATH || "/logo.png";

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-dusty-pink/20">
      {/* Desktop: [logo 1/3] [nav ml-auto] [zalo]  |  Mobile: [logo centered abs] [hamburger ml-auto] */}
      <div className="max-w-6xl mx-auto px-4 h-[110px] relative flex items-center">

        {/* Logo: centered on mobile (absolute), left 1/3 on desktop (static) */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center
                     md:static md:translate-x-0 md:w-1/3 md:flex-none"
        >
          {logoPath && !logoFailed ? (
            <img
              src={logoPath}
              alt={shopName}
              className="h-[102px] w-auto object-contain
                         md:w-full md:h-auto md:max-h-[102px]"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="font-serif text-xl text-deep-wine font-semibold">{shopName}</span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 ml-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base text-charcoal hover:text-deep-wine transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Zalo button */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-deep-wine text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition ml-8"
        >
          <Phone size={14} />
          Nhắn Zalo
        </a>

        {/* Mobile hamburger — ml-auto pushes it to the right */}
        <button className="md:hidden ml-auto relative z-10" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
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
            Nhắn Zalo
          </a>
        </div>
      )}
    </header>
  );
}
