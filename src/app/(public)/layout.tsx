import { db } from '@/lib/db'
import { siteSettings } from '../../../database/schema'
import { eq } from 'drizzle-orm'
import PublicHeader from '@/components/public/PublicHeader'
import PublicFooter from '@/components/public/PublicFooter'
import ChatWidget from '@/components/public/ChatWidget'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let isEnabled = true

  try {
    const killSwitch = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.key, 'site_enabled'),
    })
    isEnabled = killSwitch?.value !== 'false'
  } catch {
    // DB unavailable — show normal site with defaults
  }

  if (!isEnabled) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-6xl mb-6">🌸</p>
          <h1 className="font-serif text-2xl text-deep-wine mb-3">
            {process.env.NEXT_PUBLIC_SHOP_NAME ?? 'Hoa Nhà Nắng'}
          </h1>
          <p className="text-charcoal/60">
            Cửa hàng đang tạm nghỉ. Vui lòng quay lại sau.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
      <ChatWidget />
    </>
  )
}
