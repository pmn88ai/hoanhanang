import { db } from './db'
import { operatorActivity } from '../../database/schema'

type Action =
  | 'product_create' | 'product_update' | 'product_delete'
  | 'product_publish' | 'product_unpublish'
  | 'product_soft_delete' | 'product_permanent_delete' | 'product_restore'
  | 'product_sold_out' | 'product_back_in_stock'
  | 'settings_update' | 'password_change'
  | 'login'

export async function logActivity(
  userId: string | null,
  action: Action,
  details?: Record<string, unknown>,
  targetId?: string,
  ipAddress?: string
) {
  try {
    await db.insert(operatorActivity).values({
      userId: userId ?? undefined,
      action,
      targetId,
      details,
      ipAddress,
    })
  } catch {
    // Log failure không được crash main operation
  }
}
