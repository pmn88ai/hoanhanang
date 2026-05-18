import { db } from '@/lib/db'
import { leads } from '../../../../../database/schema'
import { count, eq, sql } from 'drizzle-orm'

export default async function LeadAnalyticsPage() {
  let allLeads: typeof leads.$inferSelect[] = []
  let zaloCount = 0
  let byOccasion: Array<{ occasion: string | null; count: number }> = []

  try {
    const [leadsData, zaloLeads, occasionData] = await Promise.all([
      db.select().from(leads).orderBy(sql`${leads.createdAt} desc`).limit(50),
      db.select({ count: count() }).from(leads).where(eq(leads.zaloRedirected, true)),
      db.select({
        occasion: leads.occasion,
        count: count(),
      }).from(leads).groupBy(leads.occasion),
    ])
    allLeads = leadsData
    zaloCount = zaloLeads[0].count
    byOccasion = occasionData
  } catch {
    // DB unavailable
  }

  const total = allLeads.length
  const zaloRate = total > 0 ? Math.round((zaloCount / total) * 100) : 0

  return (
    <div>
      <h1 className="text-sm font-mono text-gray-400 mb-6">{'// lead_analytics'}</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: total },
          { label: 'Zalo Redirected', value: zaloCount },
          { label: 'Conversion Rate', value: `${zaloRate}%` },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs font-mono text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* By Occasion */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
        <p className="text-xs font-mono text-gray-500 mb-4">{'// by_occasion'}</p>
        <div className="space-y-3">
          {byOccasion
            .filter(r => r.occasion)
            .sort((a, b) => b.count - a.count)
            .map(row => (
              <div key={row.occasion}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{row.occasion}</span>
                  <span className="text-xs font-mono text-gray-500">{row.count}</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${Math.round((row.count / Math.max(total, 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recent leads table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <p className="text-xs font-mono text-gray-500 px-4 pt-4 pb-2">{'// recent_leads'}</p>
        {allLeads.map((lead, i) => (
          <div key={lead.id}
            className={`px-4 py-3 text-xs font-mono ${i < allLeads.length - 1 ? 'border-b border-gray-800' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-gray-300">{lead.occasion ?? '—'}</span>
                <span className="text-gray-600 mx-2">&middot;</span>
                <span className="text-gray-500">{lead.budget ?? '—'}</span>
                {lead.colorPreference && (
                  <><span className="text-gray-600 mx-2">&middot;</span>
                  <span className="text-gray-600">{lead.colorPreference}</span></>
                )}
              </div>
              <div className="text-right">
                {lead.zaloRedirected && <span className="text-green-500">{'->zalo'}</span>}
                <p className="text-gray-700">
                  {new Date(lead.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
