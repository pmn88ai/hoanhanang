'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Operator {
  id: string
  email: string
  name: string | null
  isActive: boolean
  plainPasswordHint: string | null
  createdAt: Date
}

export default function OperatorManager({ operators }: { operators: Operator[] }) {
  const [modal, setModal] = useState<Operator | null>(null)
  const [newPass, setNewPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const router = useRouter()

  const setPassword = async () => {
    if (!modal || newPass.length < 8) {
      setMessage('Mật khẩu tối thiểu 8 ký tự')
      return
    }
    setLoading(true)
    const res = await fetch('/api/shadow/operator-management', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: modal.id, newPassword: newPass }),
    })
    if (res.ok) {
      setMessage('✓ Đã đặt mật khẩu mới')
      setModal(null)
      setNewPass('')
      router.refresh()
    } else {
      setMessage('✗ Lỗi khi đặt mật khẩu')
    }
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

  const toggleReveal = (id: string) => {
    setRevealed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
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
                {op.plainPasswordHint ? (
                  <p className="text-xs font-mono mt-1.5 text-gray-600">
                    hint:{' '}
                    <button onClick={() => toggleReveal(op.id)}
                      className="hover:text-gray-400 transition">
                      {revealed.has(op.id) ? (
                        <span className="text-gray-400">{op.plainPasswordHint}</span>
                      ) : (
                        <span className="text-gray-600">**** (reveal)</span>
                      )}
                    </button>
                  </p>
                ) : (
                  <p className="text-xs font-mono mt-1.5 text-gray-700">chưa có hint</p>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(op.id, op.isActive)}
                  className="text-xs font-mono text-gray-500 hover:text-gray-300 border border-gray-700 px-3 py-1 rounded-lg transition">
                  {op.isActive ? 'disable' : 'enable'}
                </button>
                <button onClick={() => { setModal(op); setNewPass('') }}
                  className="text-xs font-mono text-orange-400 border border-orange-900 px-3 py-1 rounded-lg hover:bg-orange-900/20 transition">
                  set pass
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal đặt mật khẩu */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm mx-4 space-y-4">
            <p className="text-sm text-gray-300 font-mono">Đặt mật khẩu cho <span className="text-orange-400">{modal.email}</span></p>
            <input
              type="password"
              placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg text-sm font-mono outline-none focus:border-orange-700"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={setPassword} disabled={loading}
                className="flex-1 bg-orange-900 text-orange-300 px-4 py-2.5 rounded-lg text-xs font-mono hover:bg-orange-800 transition disabled:opacity-60">
                {loading ? '...' : 'Lưu mật khẩu'}
              </button>
              <button onClick={() => { setModal(null); setNewPass('') }}
                className="bg-gray-800 text-gray-500 px-4 py-2.5 rounded-lg text-xs font-mono hover:text-gray-400 transition">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
