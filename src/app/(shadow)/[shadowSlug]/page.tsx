import { db } from '@/lib/db'
import { leads, aiConversations, products } from '../../../../database/schema'
import { count, gte } from 'drizzle-orm'

export default async function ShadowDashboard() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  let totalLeads = 0
  let leadsWeek = 0
  let totalConvs = 0
  let totalProducts = 0

  try {
    const [leadsRes, leadsWeekRes, convsRes, productsRes] = await Promise.all([
      db.select({ count: count() }).from(leads),
      db.select({ count: count() }).from(leads).where(gte(leads.createdAt, sevenDaysAgo)),
      db.select({ count: count() }).from(aiConversations),
      db.select({ count: count() }).from(products),
    ])
    totalLeads = leadsRes[0].count
    leadsWeek = leadsWeekRes[0].count
    totalConvs = convsRes[0].count
    totalProducts = productsRes[0].count
  } catch {
    // DB unavailable
  }

  const stats = [
    { label: 'Total Leads', value: totalLeads },
    { label: 'Leads (7 days)', value: leadsWeek },
    { label: 'AI Conversations', value: totalConvs },
    { label: 'Products', value: totalProducts },
  ]

  return (
    <div>
      <h1 className="text-sm font-mono text-gray-400 mb-6">{'// overview'}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-gray-500 text-xs font-mono mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <p className="text-xs font-mono text-gray-500 mb-2">{'// env check'}</p>
        <div className="space-y-1 text-xs font-mono">
          <p className={process.env.GROQ_API_KEY ? 'text-green-400' : 'text-red-400'}>
            GROQ_API_KEY: {process.env.GROQ_API_KEY ? '✓ set' : '✗ missing'}
          </p>
          <p className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-400' : 'text-red-400'}>
            SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ set' : '✗ missing'}
          </p>
          <p className={process.env.NEXTAUTH_SECRET ? 'text-green-400' : 'text-red-400'}>
            NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? '✓ set' : '✗ missing'}
          </p>
        </div>
      </div>
    </div>
  )
}
