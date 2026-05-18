import { db } from '@/lib/db'
import { aiConversations } from '../../../../../database/schema'
import { desc, gte, and } from 'drizzle-orm'
import Link from 'next/link'

interface Props {
  params: Promise<{ shadowSlug: string }>
  searchParams: Promise<{ from?: string }>
}

export default async function AILogsPage({ params, searchParams }: Props) {
  const { shadowSlug } = await params
  const sp = await searchParams

  const where = []
  if (sp.from) {
    where.push(gte(aiConversations.createdAt, new Date(sp.from)))
  }

  let convs: typeof aiConversations.$inferSelect[] = []
  try {
    convs = await db.select().from(aiConversations)
      .where(where.length > 0 ? and(...where) : undefined)
      .orderBy(desc(aiConversations.createdAt))
      .limit(100)
  } catch {
    // DB unavailable
  }

  return (
    <div>
      <h1 className="text-sm font-mono text-gray-400 mb-4">{'// ai_conversations'} ({convs.length})</h1>

      <form className="flex gap-3 mb-6">
        <input name="from" type="date" defaultValue={sp.from}
          className="bg-gray-900 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-mono" />
        <button type="submit"
          className="bg-gray-700 text-gray-200 px-4 py-1.5 rounded-lg text-xs font-mono hover:bg-gray-600 transition">
          Lọc
        </button>
      </form>

      <div className="space-y-2">
        {convs.map(conv => {
          const msgs = conv.messages as Array<{ role: string; content: string }>
          const lastMsg = msgs[msgs.length - 1]
          return (
            <Link key={conv.id}
              href={`/${shadowSlug}/ai-logs/${conv.id}`}
              className="block bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-gray-500 mb-1">{conv.sessionId}</p>
                  <p className="text-gray-300 text-sm truncate">
                    {lastMsg?.content ?? '(empty)'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-mono text-gray-600">
                    {conv.turnCount} turns
                  </p>
                  {conv.zaloCTAShown && (
                    <p className="text-xs text-green-500 mt-0.5">{'-> Zalo CTA shown'}</p>
                  )}
                  <p className="text-xs text-gray-700 mt-1">
                    {new Date(conv.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
