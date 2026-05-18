'use client'
import { Phone, MessageCircle } from 'lucide-react'

interface HeroSectionProps {
  shopName: string
  tagline?: string
  subTagline?: string
  heroImageUrl?: string
  heroVideoUrl?: string
  zaloUrl: string
  facebookUrl?: string
}

export default function HeroSection({
  shopName,
  tagline = 'Hoa tươi - Cảm xúc thật',
  subTagline = 'Mỗi bó hoa là một câu chuyện. Chúng tôi giúp bạn kể câu chuyện đó.',
  heroImageUrl,
  heroVideoUrl,
  zaloUrl,
  facebookUrl,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {heroVideoUrl ? (
        <div className="absolute inset-0 -z-10">
          <iframe
            src={heroVideoUrl}
            className="w-full h-full object-cover scale-110"
            allow="autoplay; muted"
            frameBorder="0"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ) : heroImageUrl ? (
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-dusty-pink/20 via-cream/90 to-champagne/40" />
      )}

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
          {shopName}
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white drop-shadow-lg mb-6 leading-tight">
          {tagline}
        </h1>
        <p className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed drop-shadow">
          {subTagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-cta text-cta-text px-8 py-4 rounded-2xl text-base font-semibold hover:opacity-90 transition shadow-lg"
          >
            <Phone size={18} />
            Nhắn Zalo ngay
          </a>
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur text-white border border-white/30 px-8 py-4 rounded-2xl text-base hover:bg-white/30 transition"
            >
              <MessageCircle size={18} />
              Nhắn Facebook
            </a>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  )
}