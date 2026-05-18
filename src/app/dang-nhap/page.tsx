"use client";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Sai tài khoản hoặc mật khẩu");
      return;
    }

    // Reject shadow_admin — họ phải login tại slug riêng
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    if (session?.user?.role === "shadow_admin") {
      await signOut({ redirect: false });
      setError("Tài khoản này không thể đăng nhập tại đây.");
      return;
    }

    router.push("/quan-ly");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-soft-beige">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-semibold text-charcoal">Đăng nhập</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Email hoặc tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-dusty-pink"
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-dusty-pink"
          required
        />
        <button
          type="submit"
          className="w-full bg-deep-wine text-white rounded-xl py-3 text-sm font-medium hover:opacity-90 transition"
        >
          Đăng nhập
        </button>
      </form>
    </main>
  );
}
