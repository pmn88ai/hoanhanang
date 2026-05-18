'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Props {
  shadowSlug: string
}

const NAV = [
  { label: 'Tổng quan', path: '' },
  { label: 'AI Logs', path: '/ai-logs' },
  { label: 'Leads', path: '/leads' },
  { label: 'Prompt Config', path: '/prompt-config' },
  { label: 'Operator Log', path: '/operator-log' },
  { label: 'Kiểm soát', path: '/control' },
]

export default function ShadowNav({ shadowSlug }: Props) {
  const pathname = usePathname()
  const base = `/${shadowSlug}`

  return (
    <nav className="flex gap-1 flex-wrap mb-8 border-b border-gray-800 pb-4">
      {NAV.map(item => {
        const href = `${base}${item.path}`
        const active = item.path === '' ? pathname === base : pathname.startsWith(href)
        return (
          <Link key={href} href={href}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-mono transition',
              active ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
            )}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
