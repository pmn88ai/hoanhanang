interface Testimonial {
  name: string;
  content: string;
  occasion: string;
  rating: number;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Chị Lan",
    content:
      "Shop làm hoa rất đẹp và giao nhanh. Mình đặt hoa sinh nhật cho bạn thân, bạn rất thích. Sẽ ủng hộ thường xuyên!",
    occasion: "Hoa sinh nhật",
    rating: 5,
  },
  {
    name: "Anh Minh",
    content:
      "Đặt hoa khai trương cho văn phòng mới, shop tư vấn nhiệt tình lắm. Hoa tươi đẹp, giá hợp lý, rất hài lòng.",
    occasion: "Hoa khai trương",
    rating: 5,
  },
  {
    name: "Chị Hương",
    content:
      "Hoa cưới làm đúng tone màu như mình yêu cầu. Team rất chuyên nghiệp và chu đáo. Cảm ơn shop nhiều!",
    occasion: "Hoa cưới",
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
            Phản hồi
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary font-semibold">
            Khách hàng nói gì?
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
