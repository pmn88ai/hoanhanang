import { db } from '@/lib/db'
import { operatorActivity, users } from '../../../../../database/schema'
import { desc, eq } from 'drizzle-orm'

const ACTION_LABELS: Record<string, string> = {
  product_create:    '+ Tạo mẫu hoa',
  product_update:    '~ Sửa mẫu hoa',
  product_delete:    '- Xóa mẫu hoa',
  product_publish:   '↑ Publish bài',
  product_unpublish: '↓ Ẩn bài',
  settings_update:   '⚙ Sửa cài đặt',
  password_change:   '🔑 Đổi mật khẩu',
  login:             '→ Đăng nhập',
}

export default async function OperatorLogPage() {
  let activities: Array<{
    id: string
    action: string
    targetId: string | null
    details: unknown
    ipAddress: string | null
    createdAt: Date
    userEmail: string | null
  }> = []

  try {
    activities = await db
      .select({
        id: operatorActivity.id,
        action: operatorActivity.action,
        targetId: operatorActivity.targetId,
        details: operatorActivity.details,
        ipAddress: operatorActivity.ipAddress,
        createdAt: operatorActivity.createdAt,
        userEmail: users.email,
      })
      .from(operatorActivity)
      .leftJoin(users, eq(operatorActivity.userId, users.id))
      .orderBy(desc(operatorActivity.createdAt))
      .limit(200)
  } catch {
    // DB unavailable
  }

  return (
    <div>
      <h1 className="text-sm font-mono text-gray-400 mb-6">
        {'// operator_activity'} ({activities.length})
      </h1>

      <div className="space-y-1">
        {activities.map(act => {
          const actionColor = act.action === 'product_delete' ? 'text-red-400'
            : act.action.startsWith('product_create') ? 'text-green-400'
            : 'text-gray-300'
          return (
            <div key={act.id}
              className="flex items-start gap-4 py-2 px-3 rounded-lg hover:bg-gray-900 transition font-mono text-xs">
              <span className="text-gray-600 flex-shrink-0 w-36">
                {new Date(act.createdAt).toLocaleString('vi-VN')}
              </span>
              <span className="text-gray-500 flex-shrink-0 w-20">
                {act.userEmail?.split('@')[0] ?? 'unknown'}
              </span>
              <span className={`flex-shrink-0 w-36 ${actionColor}`}>
                {ACTION_LABELS[act.action] ?? act.action}
              </span>
              <span className="text-gray-600 truncate">
                {act.targetId && <span className="text-gray-700 mr-2">{act.targetId.slice(0, 8)}</span>}
                {act.details ? JSON.stringify(act.details).slice(0, 80) : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
