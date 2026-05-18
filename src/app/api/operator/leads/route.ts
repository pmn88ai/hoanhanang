import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { leads } from '../../../../../database/schema'
import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 })

  try {
    const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(100)
    return NextResponse.json(allLeads)
  } catch {
    return NextResponse.json([])
  }
}
