"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Download, ZoomIn } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(
    () => setActive((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setActive((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next]);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-bg-secondary rounded-2xl flex items-center justify-center text-6xl">
        🌸
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const res = await fetch(images[active]);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}-${active + 1}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(images[active], "_blank");
    }
  };

  return (
    <>
      {/* Main gallery */}
      <div>
        <div
          className="aspect-square relative rounded-2xl overflow-hidden bg-white mb-3 cursor-zoom-in group"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={images[active]}
            alt={`${title} — anh ${active + 1}`}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
            <div className="bg-black/40 rounded-full p-3">
              <ZoomIn size={24} className="text-white" />
            </div>
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex-shrink-0 w-16 h-16 relative rounded-xl overflow-hidden border-2 transition ${
                  active === i ? "border-cta" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={`${title} — thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          onClick={() => setLightbox(false)}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-white/70 text-sm">
              {active + 1} / {images.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
              >
                <Download size={15} />
                Tải ảnh
              </button>
              <button
                onClick={() => setLightbox(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Image */}
          <div
            className="flex-1 relative flex items-center justify-center px-12"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={`${title} — anh ${active + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Nav buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div
              className="flex gap-2 overflow-x-auto px-4 pb-4 pt-2 justify-center flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`flex-shrink-0 w-14 h-14 relative rounded-lg overflow-hidden border-2 transition ${
                    active === i ? "border-white" : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
