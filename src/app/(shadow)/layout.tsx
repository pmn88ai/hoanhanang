import { auth, signOut } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function ShadowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "shadow_admin") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-mono text-gray-400">shadow_admin</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="text-xs text-gray-500 hover:text-gray-300 transition"
          >
            logout
          </button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
