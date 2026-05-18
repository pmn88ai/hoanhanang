import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '../../../../../database/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

async function requireShadowAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'shadow_admin') return null
  return session
}

export async function PUT(req: NextRequest) {
  const session = await requireShadowAdmin()
  if (!session) return NextResponse.json({}, { status: 403 })

  try {
    const { userId, newPassword } = await req.json()
    if (!userId || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ message: 'Mật khẩu tối thiểu 8 ký tự' }, { status: 400 })
    }

    const hash = await bcrypt.hash(newPassword, 12)
    await db.update(users).set({ passwordHash: hash }).where(eq(users.id, userId))

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await requireShadowAdmin()
  if (!session) return NextResponse.json({}, { status: 403 })

  try {
    const { userId, isActive } = await req.json()
    await db.update(users).set({ isActive }).where(eq(users.id, userId))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
