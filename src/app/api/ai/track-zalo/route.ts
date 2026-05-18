import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leads, aiConversations } from '../../../../../database/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json()
  if (!sessionId) return NextResponse.json({}, { status: 200 })

  try {
    await db.update(leads)
      .set({ zaloRedirected: true })
      .where(eq(leads.sessionId, sessionId))

    await db.update(aiConversations)
      .set({ zaloCTAShown: true })
      .where(eq(aiConversations.sessionId, sessionId))
  } catch {
    // Track failure is non-blocking
  }

  return NextResponse.json({ ok: true })
}
