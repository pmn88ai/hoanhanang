"use client";
import { useState } from "react";

export default function PublicFooter({
  logoWidth,
  logoHeight,
}: {
  logoWidth?: number
  logoHeight?: number
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Hoa Nhà Nắng";
  const phone = process.env.NEXT_PUBLIC_SHOP_PHONE ?? "";
  const logoPath = process.env.NEXT_PUBLIC_LOGO_PATH || "/logo.png";
  const lw = logoWidth ?? 84;
  const lh = logoHeight ?? 28;

  return (
    <footer className="bg-charcoal text-white/70 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            {logoPath && !logoFailed ? (
              <img src={logoPath} alt={shopName} width={lw} height={lh}
                className="object-contain mb-2"
                style={{ width: lw, height: lh }}
                onError={() => setLogoFailed(true)} />
            ) : (
              <p className="font-serif text-white text-lg mb-2">{shopName}</p>
            )}
            <p className="text-sm">Hoa tươi — Quà tặng ý nghĩa</p>
          </div>
          <div>
            <p className="text-white text-sm font-medium mb-2">Liên hệ</p>
            <p className="text-sm">{phone}</p>
          </div>
          <div>
            <p className="text-white text-sm font-medium mb-2">Giờ làm việc</p>
            <p className="text-sm">7:00 - 20:00 mỗi ngày</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-xs text-center">
          &copy; {new Date().getFullYear()} {shopName}. All rights reserved.
          <p className="text-xs text-center mt-2 text-white/50">
            Thiết kế &amp; triển khai bởi{' '}
            <span className="font-medium">RongLeo</span>
            {' · '}
            <a href="tel:0906899985" className="hover:underline">0906 899 985</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
