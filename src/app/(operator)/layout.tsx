import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OperatorSidebar from "@/components/operator/OperatorSidebar";

export default async function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/dang-nhap");
  }

  return (
    <div className="flex min-h-screen bg-light-gray">
      <OperatorSidebar userEmail={session.user.email ?? ""} />
      <main className="flex-1 md:ml-60 p-4 md:p-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}
