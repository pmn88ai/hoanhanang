import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { siteSettings } from '../../../../../database/schema'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'shadow_admin') {
    return NextResponse.json({}, { status: 403 })
  }

  try {
    const { enabled } = await req.json()
    const value = enabled ? 'true' : 'false'

    await db.insert(siteSettings)
      .values({ key: 'site_enabled', value, updatedBy: 'shadow_admin' })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedBy: 'shadow_admin' },
      })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
