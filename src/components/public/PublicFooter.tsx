export default function PublicFooter() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Flower Store";
  const phone = process.env.NEXT_PUBLIC_SHOP_PHONE ?? "";

  return (
    <footer className="bg-charcoal text-white/70 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-serif text-white text-lg mb-2">{shopName}</p>
            <p className="text-sm">Hoa tăi — Quà tăng ý nghăa</p>
          </div>
          <div>
            <p className="text-white text-sm font-medium mb-2">Liện hệ</p>
            <p className="text-sm">{phone}</p>
          </div>
          <div>
            <p className="text-white text-sm font-medium mb-2">Giổ làm việc</p>
            <p className="text-sm">7:00 - 20:00 mđi ngày</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-xs text-center">
          &copy; {new Date().getFullYear()} {shopName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}