import { db } from '@/lib/db'
import { aiConversations } from '../../../../../../database/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: Promise<{ shadowSlug: string; id: string }>
}

export default async function ConversationDetailPage({ params }: Props) {
  const { shadowSlug, id } = await params

  let conv: typeof aiConversations.$inferSelect | undefined
  try {
    conv = await db.query.aiConversations.findFirst({
      where: eq(aiConversations.id, id),
    })
  } catch {
    // DB unavailable
  }

  if (!conv) notFound()

  const messages = conv.messages as Array<{ role: string; content: string; timestamp?: string }>

  return (
    <div className="max-w-2xl">
      <Link href={`/${shadowSlug}/ai-logs`}
        className="text-xs font-mono text-gray-500 hover:text-gray-300 transition mb-6 block">
        {'<- back to logs'}
      </Link>

      <div className="mb-4 text-xs font-mono text-gray-600 space-y-1">
        <p>session: {conv.sessionId}</p>
        <p>turns: {conv.turnCount}</p>
        <p>created: {new Date(conv.createdAt).toLocaleString('vi-VN')}</p>
        <p>zalo_cta: {conv.zaloCTAShown ? 'yes' : 'no'}</p>
      </div>

      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-xl text-sm ${
              msg.role === 'user'
                ? 'bg-blue-900 text-blue-100'
                : 'bg-gray-800 text-gray-200'
            }`}>
              <p className="text-xs font-mono opacity-50 mb-1">{msg.role}</p>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
