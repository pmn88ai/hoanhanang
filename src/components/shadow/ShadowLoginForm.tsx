'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ShadowLoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Sai tài khoản hoặc mật khẩu')
      setLoading(false)
      return
    }

    // Kiểm tra role — chỉ shadow_admin mới được vào
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    if (session?.user?.role !== 'shadow_admin') {
      await fetch('/api/auth/signout', { method: 'POST' })
      setError('Tài khoản operator không thể đăng nhập tại đây.')
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <div className="w-full max-w-sm mx-4">
      <form onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5">
        <div>
          <p className="text-xs font-mono text-gray-500 mb-1">{'// shadow auth'}</p>
          <h1 className="text-lg text-gray-200">Đăng nhập quản trị</h1>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <input
          type="text" placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
          required
        />
        <input
          type="password" placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500"
          required
        />
        <button type="submit" disabled={loading}
          className="w-full bg-gray-700 text-gray-200 rounded-lg py-3 text-sm font-mono hover:bg-gray-600 transition disabled:opacity-60">
          {loading ? '...' : 'login'}
        </button>
      </form>
    </div>
  )
}
