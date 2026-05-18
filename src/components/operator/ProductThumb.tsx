"use client";
import { useState } from "react";

export default function ProductThumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <span className="w-full h-full flex items-center justify-center text-xl">🌸</span>
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
