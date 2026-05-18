import { db } from '@/lib/db'
import { leads } from '../../../../../database/schema'
import { desc } from 'drizzle-orm'

export default async function LeadsPage() {
  let allLeads: typeof leads.$inferSelect[] = []

  try {
    allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(100)
  } catch {
    // DB unavailable
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Khách hàng</h1>
        <p className="text-text-muted text-sm mt-1">{allLeads.length} khách đã hỏi thăm</p>
      </div>

      {allLeads.length === 0 ? (
        <div className="bg-bg-card rounded-2xl border border-border-color p-12 text-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-text-muted">Chưa có khách nào chat qua AI</p>
        </div>
      ) : (
        <div className="bg-bg-card rounded-2xl border border-border-color overflow-hidden">
          {allLeads.map((lead, i) => (
            <div key={lead.id}
              className={`p-4 ${i < allLeads.length - 1 ? 'border-b border-border-color' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-text-primary text-sm font-medium">
                    {lead.customerName ?? 'Khách ẩn danh'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lead.occasion && (
                      <span className="text-xs bg-accent/20 text-cta px-2 py-0.5 rounded-full">
                        {lead.occasion}
                      </span>
                    )}
                    {lead.budget && (
                      <span className="text-xs bg-bg-secondary text-text-muted px-2 py-0.5 rounded-full">
                        {lead.budget}
                      </span>
                    )}
                    {lead.colorPreference && (
                      <span className="text-xs bg-bg-secondary text-text-muted px-2 py-0.5 rounded-full">
                        Tone {lead.colorPreference}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {lead.zaloRedirected && (
                    <span className="text-xs text-green-600 font-medium block mb-1">✓ Đã qua Zalo</span>
                  )}
                  <p className="text-text-muted text-xs">
                    {new Date(lead.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
