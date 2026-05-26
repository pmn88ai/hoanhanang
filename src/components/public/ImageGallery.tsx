"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-bg-secondary rounded-2xl flex items-center justify-center text-6xl">
        🌸
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square relative rounded-2xl overflow-hidden bg-white mb-3">
        <Image
          src={images[active]}
          alt={`${title} — anh ${active + 1}`}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setActive((i) => (i + 1) % images.length)}
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
  );
}
