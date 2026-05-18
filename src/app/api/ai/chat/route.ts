import { NextRequest, NextResponse } from 'next/server'
import { getGroq, GROQ_MODEL } from '@/lib/ai/groq'
import { db } from '@/lib/db'
import { siteSettings, aiConversations } from '../../../../../database/schema'
import { DEFAULT_SYSTEM_PROMPT } from '@/config/ai-prompts'
import { eq } from 'drizzle-orm'
import { extractAndSaveLead } from '@/lib/ai/lead-extractor'

const MAX_TOKENS = 300
const MAX_MESSAGES = 20

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 30) return true
  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ message: 'Quá nhiều tin nhắn. Vui lòng đợi 1 phút.' }, { status: 429 })
    }

    const { messages, sessionId } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ message: 'Tin nhắn không hợp lệ' }, { status: 400 })
    }

    let systemPrompt = DEFAULT_SYSTEM_PROMPT
    try {
      const promptSetting = await db.query.siteSettings.findFirst({
        where: eq(siteSettings.key, 'ai_system_prompt'),
      })
      if (promptSetting?.value) {
        systemPrompt = promptSetting.value
      }
    } catch {
      // DB unavailable — use default
    }

    const recentMessages = messages.slice(-MAX_MESSAGES)

    const completion = await getGroq().chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentMessages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
    })

    const aiMessage = completion.choices[0]?.message?.content ?? 'Em xin lỗi, có lỗi xảy ra. Anh/chị thử lại nhé!'

    // Save/update conversation
    try {
      const existingConv = await db.query.aiConversations.findFirst({
        where: eq(aiConversations.sessionId, sessionId),
      })

      const updatedMessages = [
        ...recentMessages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date().toISOString(),
        })),
        { role: 'assistant' as const, content: aiMessage, timestamp: new Date().toISOString() },
      ]

      let conversationId: string
      let turnCount: number

      if (existingConv) {
        turnCount = existingConv.turnCount + 1
        await db.update(aiConversations)
          .set({
            messages: updatedMessages,
            turnCount,
            updatedAt: new Date(),
          })
          .where(eq(aiConversations.id, existingConv.id))
        conversationId = existingConv.id
      } else {
        turnCount = 1
        const [newConv] = await db.insert(aiConversations).values({
          sessionId,
          messages: updatedMessages,
          turnCount,
        }).returning()
        conversationId = newConv.id
      }

      // Extract lead info after 2+ turns
      if (turnCount >= 2) {
        await extractAndSaveLead(sessionId, conversationId, recentMessages)
      }
    } catch {
      // DB save failure — response still works
    }

    return NextResponse.json({
      message: aiMessage,
      sessionId,
    })

  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { message: 'Em đang gặp chút trục trặc. Anh/chị nhắn Zalo để được hỗ trợ ngay nhé! 🌸' },
      { status: 500 }
    )
  }
}
