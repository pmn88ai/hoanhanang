import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { siteSettings } from '../../../../../database/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

async function requireShadowAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'shadow_admin') {
    return null
  }
  return session
}

export async function PUT(req: NextRequest) {
  const session = await requireShadowAdmin()
  if (!session) return NextResponse.json({}, { status: 403 })

  try {
    const { prompt } = await req.json()

    await db.insert(siteSettings)
      .values({ key: 'ai_system_prompt', value: prompt, updatedBy: 'shadow_admin' })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: prompt, updatedBy: 'shadow_admin' },
      })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}

export async function DELETE() {
  const session = await requireShadowAdmin()
  if (!session) return NextResponse.json({}, { status: 403 })

  try {
    await db.update(siteSettings)
      .set({ value: '', updatedBy: 'shadow_admin' })
      .where(eq(siteSettings.key, 'ai_system_prompt'))

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
