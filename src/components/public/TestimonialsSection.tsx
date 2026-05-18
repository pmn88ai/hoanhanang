interface Testimonial {
  name: string;
  content: string;
  occasion: string;
  rating: number;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Chi Lan",
    content:
      "Shop lam hoa rat dep va giao nhanh. Minh dat hoa sinh nhat cho ban than, ban rat thich. Se ung ho thuong xuyen!",
    occasion: "Hoa sinh nhat",
    rating: 5,
  },
  {
    name: "Anh Minh",
    content:
      "Dat hoa khai truong cho van phong moi, shop tu van nhiet tinh lam. Hoa tuoi dep, gia hop ly, rat hai long.",
    occasion: "Hoa khai truong",
    rating: 5,
  },
  {
    name: "Chi Huong",
    content:
      "Hoa cuoi lam dung tone mau nhu minh yeu cau. Team rat chuyen nghiep va chu dao. Cam on shop nhieu!",
    occasion: "Hoa cuoi",
    rating: 5,
  },
];

export default function TestimonialsSection({
  testimonials = DEFAULT_TESTIMONIALS,
}: {
  testimonials?: Testimonial[];
}) {
  return (
    <section className="py-20 px-4 bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">
            Phan hoi
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary font-semibold">
            Khach hang noi gi?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-bg-card rounded-2xl p-6 border border-border-color"
            >
              <p className="text-accent text-lg mb-3">
                {"★".repeat(t.rating)}
              </p>
              <p className="text-text-primary text-sm leading-relaxed mb-4 italic">
                &quot;{t.content}&quot;
              </p>
              <div>
                <p className="text-text-primary font-medium text-sm">
                  {t.name}
                </p>
                <p className="text-text-muted text-xs">{t.occasion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
