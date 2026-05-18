import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import ChatWidget from "@/components/public/ChatWidget";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
      <ChatWidget />
    </>
  );
}
