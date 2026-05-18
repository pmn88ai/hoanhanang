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
  let logoWidth = 120
  let logoHeight = 40

  try {
    const [killSwitch, lwSetting, lhSetting] = await Promise.all([
      db.query.siteSettings.findFirst({ where: eq(siteSettings.key, 'site_enabled') }),
      db.query.siteSettings.findFirst({ where: eq(siteSettings.key, 'logo_width') }),
      db.query.siteSettings.findFirst({ where: eq(siteSettings.key, 'logo_height') }),
    ])

    isEnabled = killSwitch?.value !== 'false'

    if (lwSetting?.value) {
      const parsed = parseInt(lwSetting.value, 10)
      if (!isNaN(parsed) && parsed >= 80 && parsed <= 300) logoWidth = parsed
    }
    if (lhSetting?.value) {
      const parsed = parseInt(lhSetting.value, 10)
      if (!isNaN(parsed) && parsed >= 32 && parsed <= 120) logoHeight = parsed
    }
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
      <PublicHeader logoWidth={logoWidth} logoHeight={logoHeight} />
      <main>{children}</main>
      <PublicFooter logoWidth={logoWidth} logoHeight={logoHeight} />
      <ChatWidget />
    </>
  )
}
