'use client'
import { useState } from 'react'

interface Props {
  currentPrompt: string
  defaultPrompt: string
}

export default function PromptConfigEditor({ currentPrompt, defaultPrompt }: Props) {
  const [prompt, setPrompt] = useState(currentPrompt)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const save = async () => {
    setLoading(true)
    const res = await fetch('/api/shadow/prompt-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    setMessage(res.ok ? '✓ saved' : '✗ error')
    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const reset = async () => {
    setLoading(true)
    await fetch('/api/shadow/prompt-config', {
      method: 'DELETE',
    })
    setPrompt('')
    setMessage('✓ reset to default')
    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-mono text-gray-500 mb-2">{'// custom_prompt (ghi de default)'}</p>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={16}
          placeholder="De trong = dung default prompt..."
          className="w-full bg-gray-900 border border-gray-700 text-gray-300 px-4 py-3 rounded-xl text-xs font-mono resize-y outline-none focus:border-gray-500 transition"
        />
        <p className="text-xs text-gray-700 mt-1 font-mono">
          {prompt.length} chars &middot; De trong = fallback ve default
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={loading}
          className="bg-green-900 text-green-300 border border-green-700 px-5 py-2 rounded-lg text-xs font-mono hover:bg-green-800 transition disabled:opacity-50">
          {loading ? 'saving...' : 'save'}
        </button>
        <button onClick={reset} disabled={loading}
          className="bg-gray-800 text-gray-400 border border-gray-700 px-5 py-2 rounded-lg text-xs font-mono hover:bg-gray-700 transition">
          reset to default
        </button>
        {message && <span className="text-xs font-mono text-green-400">{message}</span>}
      </div>
    </div>
  )
}
