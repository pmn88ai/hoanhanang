import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { signOut } from '@/lib/auth'
import ShadowNav from '@/components/shadow/ShadowNav'
import ShadowLoginForm from '@/components/shadow/ShadowLoginForm'

export default async function ShadowLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ shadowSlug: string }>
}) {
  const { shadowSlug } = await params
  const session = await auth()

  const expectedSlug = process.env.SHADOW_SLUG
  if (shadowSlug !== expectedSlug) {
    notFound()
  }

  // Chưa auth — hiển thị form login ngay tại slug
  if (!session || session.user.role !== 'shadow_admin') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <ShadowLoginForm />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <span className="text-xs font-mono text-gray-500">
          shadow_admin &middot; {new Date().toLocaleDateString('vi-VN')}
        </span>
        <form
          action={async () => {
            'use server'
            await signOut()
          }}
        >
          <button type="submit" className="text-xs text-gray-600 hover:text-gray-400 font-mono transition">
            logout
          </button>
        </form>
      </header>
      <main className="p-6">
        <ShadowNav shadowSlug={shadowSlug} />
        {children}
      </main>
    </div>
  )
}
