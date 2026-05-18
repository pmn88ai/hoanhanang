'use client'
import { useState } from 'react'
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
  heroVideoUrl,
  zaloUrl,
  facebookUrl,
}: HeroSectionProps) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <section className="relative min-h-[85vh] flex overflow-hidden">
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
      ) : (
        <>
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-dusty-pink/20 via-cream/90 to-champagne/40" />
          {!imgFailed && (
            <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -9 }}>
              <picture>
                <source media="(max-width: 767px)" srcSet="/images/hero-mobile.png" />
                <img
                  src="/images/hero-desktop.png"
                  alt=""
                  className="w-full h-full object-cover object-left"
                  onError={() => setImgFailed(true)}
                />
              </picture>
            </div>
          )}
        </>
      )}

      {/* Desktop: text right | Mobile: text top */}
      <div className="relative z-10 w-full flex items-start md:items-center">
        <div className="w-full md:w-[46%] md:ml-auto px-6 md:pr-16 pt-10 pb-8 md:py-0 text-center md:text-left">
          <div className="bg-cream border border-dusty-pink/20 rounded-2xl px-6 py-6 md:px-8 md:py-8">
            <p className="text-accent text-xl md:text-3xl font-semibold tracking-wide mb-3">
              {shopName}
            </p>
            <h1 className="font-serif text-xl md:text-5xl font-semibold text-deep-wine mb-4 leading-tight">
              {tagline}
            </h1>
            <p className="text-charcoal/80 text-base md:text-lg mb-8 leading-relaxed">
              {subTagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-cta text-cta-text px-7 py-3.5 rounded-2xl text-sm font-semibold hover:opacity-90 transition shadow-md"
              >
                <Phone size={16} />
                Nhắn Zalo ngay
              </a>
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur text-charcoal border border-dusty-pink/30 px-7 py-3.5 rounded-2xl text-sm hover:bg-white/80 transition"
                >
                  <MessageCircle size={16} />
                  Nhắn Facebook
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-9 border-2 border-deep-wine/30 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2.5 bg-deep-wine/40 rounded-full" />
        </div>
      </div>
    </section>
  )
}
