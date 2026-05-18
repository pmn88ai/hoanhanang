import { db } from '@/lib/db'
import { leads } from '../../../database/schema'
import { eq } from 'drizzle-orm'

interface ExtractedLead {
  occasion?: string
  budget?: string
  colorPreference?: string
}

const OCCASION_KEYWORDS: Record<string, string> = {
  'sinh nhật': 'Sinh nhật',
  'khai trương': 'Khai trương',
  'cưới': 'Cưới hỏi',
  'đám cưới': 'Cưới hỏi',
  'tang': 'Tang lễ',
  'chia buồn': 'Chia buồn',
  'valentine': 'Valentine',
  'tình yêu': 'Tình yêu',
  'yêu': 'Tình yêu',
  'quà tặng': 'Quà tặng',
}

const BUDGET_PATTERN = /(\d[\d.,]+)\s*(k|nghìn|ngàn|triệu|đồng|dong|vnd)?/gi

function extractOccasion(text: string): string | undefined {
  const lower = text.toLowerCase()
  for (const [keyword, label] of Object.entries(OCCASION_KEYWORDS)) {
    if (lower.includes(keyword)) return label
  }
  return undefined
}

function extractBudget(text: string): string | undefined {
  const matches = [...text.matchAll(BUDGET_PATTERN)]
  if (matches.length === 0) return undefined
  return matches[0][0].trim()
}

function extractColorPref(text: string): string | undefined {
  const colors = ['hồng', 'trắng', 'đỏ', 'vàng', 'tím', 'xanh', 'cam', 'be', 'nude', 'pastel', 'vintage']
  const lower = text.toLowerCase()
  const found = colors.filter(c => lower.includes(c))
  return found.length > 0 ? found.join(', ') : undefined
}

export async function extractAndSaveLead(
  sessionId: string,
  conversationId: string,
  messages: Array<{ role: string; content: string }>
) {
  const userMessages = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ')

  const extracted: ExtractedLead = {
    occasion: extractOccasion(userMessages),
    budget: extractBudget(userMessages),
    colorPreference: extractColorPref(userMessages),
  }

  if (!extracted.occasion && !extracted.budget && !extracted.colorPreference) return

  const existing = await db.query.leads.findFirst({
    where: eq(leads.sessionId, sessionId),
  })

  if (existing) {
    await db.update(leads).set({
      occasion: extracted.occasion ?? existing.occasion,
      budget: extracted.budget ?? existing.budget,
      colorPreference: extracted.colorPreference ?? existing.colorPreference,
      aiConversationId: conversationId,
    }).where(eq(leads.id, existing.id))
  } else {
    await db.insert(leads).values({
      sessionId,
      aiConversationId: conversationId,
      occasion: extracted.occasion,
      budget: extracted.budget,
      colorPreference: extracted.colorPreference,
    })
  }
}
