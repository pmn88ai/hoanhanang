interface Props {
  shopName: string;
  address?: string;
  phone?: string;
  url?: string;
}

export default function StructuredData({ shopName, address, phone, url }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: shopName,
    url: url,
    telephone: phone,
    address: address
      ? {
          "@type": "PostalAddress",
          streetAddress: address,
          addressCountry: "VN",
        }
      : undefined,
    openingHours: "Mo-Su 07:00-20:00",
    priceRange: "\u20AB\u20AB",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
