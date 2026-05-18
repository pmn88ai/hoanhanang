import { getDashboardStats, getRecentLeads } from "@/lib/db/queries";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Plus, Flower2, Users, TrendingUp } from "lucide-react";

export default async function OperatorDashboard() {
  const [session, stats, recentLeads] = await Promise.all([
    auth(),
    getDashboardStats(),
    getRecentLeads(5),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Xin chao, {session?.user.name?.split(" ").pop() ?? "ban"} 👋
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Day la tong quan hoat dong hom nay
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Mau dang hien thi",
            value: stats.totalPublished,
            icon: Flower2,
            color: "text-accent",
          },
          {
            label: "Bai dang nhap",
            value: stats.totalDraft,
            icon: Flower2,
            color: "text-text-muted",
          },
          {
            label: "Khach hoi hom nay",
            value: stats.leadsToday,
            icon: Users,
            color: "text-cta",
          },
          {
            label: "Khach hoi 7 ngay",
            value: stats.leadsWeek,
            icon: TrendingUp,
            color: "text-cta",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-bg-card rounded-2xl p-5 border border-border-color"
            >
              <Icon size={20} className={`${stat.color} mb-3`} />
              <p className="text-3xl font-bold text-text-primary">
                {stat.value}
              </p>
              <p className="text-text-muted text-xs mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-4">
          Thao tac nhanh
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/quan-ly/mau-hoa/them-moi"
            className="flex items-center gap-2 bg-cta text-cta-text px-5 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition"
          >
            <Plus size={16} />
            Them mau hoa moi
          </Link>
          <Link
            href="/quan-ly/khach-hang"
            className="flex items-center gap-2 bg-bg-card border border-border-color text-text-primary px-5 py-3 rounded-xl text-sm hover:bg-bg-secondary transition"
          >
            <Users size={16} />
            Xem khach hang
          </Link>
        </div>
      </div>

      {/* Recent leads */}
      {recentLeads.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-4">
            Khach hoi gan day
          </h2>
          <div className="bg-bg-card rounded-2xl border border-border-color overflow-hidden">
            {recentLeads.map((lead, i) => (
              <div
                key={lead.id}
                className={`flex items-center justify-between p-4 ${i < recentLeads.length - 1 ? "border-b border-border-color" : ""}`}
              >
                <div>
                  <p className="text-text-primary text-sm font-medium">
                    {lead.customerName ?? "Khach an danh"}
                  </p>
                  <p className="text-text-muted text-xs">
                    {lead.occasion ?? "Chua ro dip"} &middot;{" "}
                    {lead.budget ?? "Chua ro ngan sach"}
                  </p>
                </div>
                <div className="text-right">
                  {lead.zaloRedirected && (
                    <span className="text-xs bg-accent/20 text-cta px-2 py-0.5 rounded-full">
                      Da qua Zalo
                    </span>
                  )}
                  <p className="text-text-muted text-xs mt-1">
                    {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
