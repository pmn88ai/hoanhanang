'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function KillSwitchControl({ isEnabled }: { isEnabled: boolean }) {
  const [enabled, setEnabled] = useState(isEnabled)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggle = async () => {
    const newState = !enabled
    if (!newState && !confirm('Xác nhận TẮT public site? Khách sẽ thấy thông báo tạm nghỉ.')) return

    setLoading(true)
    await fetch('/api/shadow/kill-switch', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: newState }),
    })
    setEnabled(newState)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs font-mono text-gray-500 mb-4">{'// kill_switch'}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-200">Public site</p>
          <p className={`text-xs font-mono mt-0.5 ${enabled ? 'text-green-400' : 'text-red-400'}`}>
            {enabled ? '● ONLINE' : '● OFFLINE — khách thấy thông báo tạm nghỉ'}
          </p>
        </div>
        <button onClick={toggle} disabled={loading}
          className={`px-5 py-2 rounded-lg text-xs font-mono transition ${
            enabled
              ? 'bg-red-900 text-red-300 border border-red-700 hover:bg-red-800'
              : 'bg-green-900 text-green-300 border border-green-700 hover:bg-green-800'
          }`}>
          {loading ? '...' : enabled ? 'TẮT site' : 'BẬT site'}
        </button>
      </div>
    </div>
  )
}
