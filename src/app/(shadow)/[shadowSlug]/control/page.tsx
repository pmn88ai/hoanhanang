import { db } from '@/lib/db'
import { siteSettings, users } from '../../../../../database/schema'
import { eq } from 'drizzle-orm'
import KillSwitchControl from '@/components/shadow/KillSwitchControl'
import OperatorManager from '@/components/shadow/OperatorManager'

export default async function ControlPage() {
  let isEnabled = true
  let operators: Array<{
    id: string
    email: string
    name: string | null
    isActive: boolean
    createdAt: Date
  }> = []

  try {
    const [killSwitchSetting, ops] = await Promise.all([
      db.query.siteSettings.findFirst({ where: eq(siteSettings.key, 'site_enabled') }),
      db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        isActive: users.isActive,
        createdAt: users.createdAt,
      }).from(users).where(eq(users.role, 'operator')),
    ])
    isEnabled = killSwitchSetting?.value !== 'false'
    operators = ops
  } catch {
    // DB unavailable
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-sm font-mono text-gray-400">{'// control_panel'}</h1>
      <KillSwitchControl isEnabled={isEnabled} />
      <OperatorManager operators={operators} />
    </div>
  )
}
