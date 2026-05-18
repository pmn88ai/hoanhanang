import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "next-themes";
import StructuredData from "@/components/public/StructuredData";
import Analytics from "@/components/public/Analytics";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Cửa hàng hoa";
const shopPhone = process.env.NEXT_PUBLIC_SHOP_PHONE ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${shopName} | Hoa tươi đẹp`,
    template: `%s | ${shopName}`,
  },
  description: `${shopName} — Hoa tươi, hoa sinh nhật, hoa khai trương, hoa cưới. Đặt hoa qua Zalo, giao tận nơi.`,
  keywords: ["hoa tươi", "hoa sinh nhật", "hoa khai trương", "đặt hoa", shopName],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: shopName,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <StructuredData
          shopName={shopName}
          address={process.env.NEXT_PUBLIC_SHOP_ADDRESS}
          phone={shopPhone}
          url={siteUrl}
        />
        <Analytics />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          themes={["light", "dark", "luxury"]}
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
