import { Phone, MapPin, Clock } from "lucide-react";

interface Props {
  shopName: string;
  description?: string;
  address?: string;
  phone?: string;
  zaloUrl?: string;
  googleMapsEmbedUrl?: string;
  openHours?: string;
}

export default function AboutSection({
  shopName,
  description,
  address,
  phone,
  zaloUrl,
  googleMapsEmbedUrl,
  openHours = "7:00 - 20:00 moi ngay",
}: Props) {
  return (
    <section className="py-20 px-4 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">
            Ve chung toi
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary font-semibold">
            {shopName}
          </h2>
          {description && (
            <p className="text-text-muted mt-4 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div
          className={`grid gap-10 items-start ${googleMapsEmbedUrl ? "md:grid-cols-2" : "md:grid-cols-1 max-w-lg mx-auto"}`}
        >
          <div className="space-y-5">
            {address && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-cta" />
                </div>
                <div>
                  <p className="text-text-primary font-medium text-sm mb-1">
                    Dia chi
                  </p>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>
            )}

            {phone && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-cta" />
                </div>
                <div>
                  <p className="text-text-primary font-medium text-sm mb-1">
                    Dien thoai / Zalo
                  </p>
                  <a
                    href={`tel:${phone}`}
                    className="text-text-muted text-sm hover:text-cta transition"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-cta" />
              </div>
              <div>
                <p className="text-text-primary font-medium text-sm mb-1">
                  Gio mo cua
                </p>
                <p className="text-text-muted text-sm">{openHours}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {zaloUrl && (
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-cta text-cta-text px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition"
                >
                  <Phone size={15} />
                  Nhan Zalo dat hoa
                </a>
              )}
            </div>
          </div>

          {googleMapsEmbedUrl && (
            <div className="rounded-2xl overflow-hidden border border-border-color shadow-sm">
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Ban do ${shopName}`}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
