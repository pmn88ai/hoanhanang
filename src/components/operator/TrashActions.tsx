"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Undo2, Trash2 } from "lucide-react";

interface Props {
  productId: string;
}

export default function TrashActions({ productId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const restore = async () => {
    setLoading(true);
    const res = await fetch(`/api/operator/products/${productId}/restore`, { method: "PATCH" });
    if (res.ok) {
      router.refresh();
    }
    setLoading(false);
  };

  const permanentDelete = async () => {
    setLoading(true);
    const res = await fetch(`/api/operator/products/${productId}/permanent`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
    setLoading(false);
    setConfirmDelete(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={restore}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition font-medium"
      >
        <Undo2 size={12} />
        Khoi phuc
      </button>
      <button
        onClick={() => setConfirmDelete(true)}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition font-medium"
      >
        <Trash2 size={12} />
        Xoa vinh vien
      </button>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-text-primary mb-2">
              Xoa vinh vien?
            </h3>
            <p className="text-text-muted text-sm mb-6">
              Hanh dong nay khong the hoan tac. Mau hoa se bi xoa hoan toan khoi he thong.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 border border-border-color text-text-primary py-2.5 rounded-xl text-sm hover:bg-bg-secondary transition"
              >
                Huy
              </button>
              <button
                onClick={permanentDelete}
                disabled={loading}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm hover:opacity-90 transition"
              >
                {loading ? "Dang xoa..." : "Xoa vinh vien"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
