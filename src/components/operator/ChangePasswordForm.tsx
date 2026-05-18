"use client";
import { useState } from "react";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      setMessage({
        type: "error",
        text: "Mat khau moi va xac nhan khong khop.",
      });
      return;
    }
    if (form.newPass.length < 8) {
      setMessage({
        type: "error",
        text: "Mat khau moi phai co it nhat 8 ky tu.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/operator/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: form.current,
        newPassword: form.newPass,
      }),
    });

    const data = await res.json();
    setMessage({
      type: res.ok ? "success" : "error",
      text: res.ok
        ? "Doi mat khau thanh cong!"
        : (data.message ?? "Co loi xay ra."),
    });
    if (res.ok) setForm({ current: "", newPass: "", confirm: "" });
    setLoading(false);
  };

  const inputClass =
    "w-full bg-bg-secondary border border-border-color rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-accent transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
      <input
        type="password"
        required
        placeholder="Mat khau hien tai"
        value={form.current}
        onChange={(e) =>
          setForm((f) => ({ ...f, current: e.target.value }))
        }
        className={inputClass}
      />
      <input
        type="password"
        required
        placeholder="Mat khau moi (toi thieu 8 ky tu)"
        value={form.newPass}
        onChange={(e) => setForm((f) => ({ ...f, newPass: e.target.value }))}
        className={inputClass}
      />
      <input
        type="password"
        required
        placeholder="Xac nhan mat khau moi"
        value={form.confirm}
        onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-cta text-cta-text px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
      >
        {loading ? "Dang xu ly..." : "Doi mat khau"}
      </button>
    </form>
  );
}
