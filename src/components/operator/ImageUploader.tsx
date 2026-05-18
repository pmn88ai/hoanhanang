"use client";
import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file: File) => {
    setError("");
    setUploading(true);

    if (file.size > MAX_FILE_SIZE) {
      setError("Anh qua lon. Vui long chon anh duoi 10MB.");
      setUploading(false);
      return;
    }

    // Step 1: Get signed upload URL from our API
    let signedUrl: string, publicUrl: string;
    try {
      const res = await fetch("/api/operator/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message ?? "Khong tao duoc URL upload.");
        setUploading(false);
        return;
      }
      signedUrl = data.signedUrl;
      publicUrl = data.publicUrl;
    } catch {
      setError("Loi ket noi. Vui long thu lai.");
      setUploading(false);
      return;
    }

    // Step 2: Upload directly to Supabase Storage (bypass Vercel)
    try {
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) {
        setError("Upload that bai. Vui long thu lai.");
        setUploading(false);
        return;
      }
    } catch {
      setError("Loi ket noi khi upload. Vui long thu lai.");
      setUploading(false);
      return;
    }

    onChange([...images, publicUrl]);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    files.forEach(uploadFile);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative group aspect-square">
              <Image
                src={url}
                alt={`Anh ${i + 1}`}
                fill
                className="object-cover rounded-xl border border-border-color"
                sizes="100px"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center hidden group-hover:flex text-xs"
                type="button"
              >
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Anh chinh
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border-color rounded-2xl p-8 text-center hover:border-accent transition cursor-pointer"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) =>
              Array.from(e.target.files ?? []).forEach(uploadFile)
            }
          />
          <Upload size={24} className="mx-auto text-text-muted mb-2" />
          {uploading ? (
            <p className="text-text-muted text-sm">Dang tai anh len...</p>
          ) : (
            <>
              <p className="text-text-muted text-sm">
                Keo tha anh vao day hoac{" "}
                <span className="text-cta font-medium">chon anh</span>
              </p>
              <p className="text-text-muted text-xs mt-1">
                JPG, PNG, WebP — toi da 10MB moi anh
              </p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
