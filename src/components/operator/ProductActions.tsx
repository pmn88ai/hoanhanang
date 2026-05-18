"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";

interface Props {
  productId: string;
  status: string;
}

export default function ProductActions({ productId, status }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    await fetch(`/api/operator/products/${productId}/toggle`, { method: "PATCH" });
    router.refresh();
    setLoading(false);
    setOpen(false);
  };

  const deleteProduct = async () => {
    setLoading(true);
    await fetch(`/api/operator/products/${productId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
    setConfirmDelete(false);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-bg-secondary transition text-text-muted"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 bg-bg-card border border-border-color rounded-xl shadow-lg py-1 min-w-[160px]">
          <Link
            href={`/quan-ly/mau-hoa/${productId}/sua`}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-bg-secondary transition"
          >
            <Pencil size={14} />
            Chinh sua
          </Link>
          <button
            onClick={toggleStatus}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-bg-secondary transition w-full"
          >
            {status === "published" ? (
              <EyeOff size={14} />
            ) : (
              <Eye size={14} />
            )}
            {status === "published" ? "An bai" : "Hien bai"}
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-bg-secondary transition w-full"
          >
            <Trash2 size={14} />
            Xoa
          </button>
        </div>
      )}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-text-primary mb-2">
              Xac nhan xoa
            </h3>
            <p className="text-text-muted text-sm mb-6">
              Ban co chac muon xoa mau hoa nay khong? Hanh dong nay khong the
              hoan tac.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 border border-border-color text-text-primary py-2.5 rounded-xl text-sm hover:bg-bg-secondary transition"
              >
                Huy
              </button>
              <button
                onClick={deleteProduct}
                disabled={loading}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm hover:opacity-90 transition"
              >
                {loading ? "Dang xoa..." : "Xoa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
