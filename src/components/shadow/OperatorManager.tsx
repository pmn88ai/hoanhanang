'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Operator {
  id: string
  email: string
  name: string | null
  isActive: boolean
  createdAt: Date
}

export default function OperatorManager({ operators }: { operators: Operator[] }) {
  const [resetForm, setResetForm] = useState<{ id: string; newPass: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const resetPassword = async () => {
    if (!resetForm || resetForm.newPass.length < 8) {
      setMessage('Mật khẩu tối thiểu 8 ký tự')
      return
    }
    setLoading(true)
    const res = await fetch('/api/shadow/operator-management', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: resetForm.id, newPassword: resetForm.newPass }),
    })
    setMessage(res.ok ? '✓ password reset' : '✗ error')
    setResetForm(null)
    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const toggleActive = async (userId: string, currentState: boolean) => {
    await fetch('/api/shadow/operator-management', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isActive: !currentState }),
    })
    router.refresh()
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs font-mono text-gray-500 mb-4">{'// operators'} ({operators.length})</p>
      {message && <p className="text-xs font-mono text-green-400 mb-3">{message}</p>}

      <div className="space-y-4">
        {operators.map(op => (
          <div key={op.id} className="border border-gray-800 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-300">{op.email}</p>
                <p className={`text-xs font-mono mt-0.5 ${op.isActive ? 'text-green-500' : 'text-red-400'}`}>
                  {op.isActive ? '● active' : '● disabled'}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(op.id, op.isActive)}
                  className="text-xs font-mono text-gray-500 hover:text-gray-300 border border-gray-700 px-3 py-1 rounded-lg transition">
                  {op.isActive ? 'disable' : 'enable'}
                </button>
                <button onClick={() => setResetForm({ id: op.id, newPass: '' })}
                  className="text-xs font-mono text-orange-400 border border-orange-900 px-3 py-1 rounded-lg hover:bg-orange-900/20 transition">
                  reset pass
                </button>
              </div>
            </div>

            {resetForm?.id === op.id && (
              <div className="flex gap-2 mt-3">
                <input
                  type="password" placeholder="new password (min 8 chars)"
                  value={resetForm.newPass}
                  onChange={e => setResetForm(f => f ? { ...f, newPass: e.target.value } : null)}
                  className="flex-1 bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-mono outline-none"
                />
                <button onClick={resetPassword} disabled={loading}
                  className="bg-orange-900 text-orange-300 px-4 py-1.5 rounded-lg text-xs font-mono hover:bg-orange-800 transition">
                  {loading ? '...' : 'confirm'}
                </button>
                <button onClick={() => setResetForm(null)}
                  className="text-gray-600 px-3 py-1.5 rounded-lg text-xs font-mono hover:text-gray-400 transition">
                  cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
