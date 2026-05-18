'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Flower } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const WELCOME: Message = {
  role: 'assistant',
  content: 'Xin chào anh/chị! 🌸 Em là trợ lý tư vấn hoa của shop. Anh/chị đang tìm hoa cho dịp gì ạ?'
}

const ZALO_PREFILL = encodeURIComponent('Xin chào shop! Mình muốn tư vấn thêm về hoa 🌸')

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `s-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  const [turnCount, setTurnCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  const trackZaloClick = async () => {
    fetch('/api/ai/track-zalo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    }).catch(() => {})
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          sessionId,
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      setTurnCount(prev => prev + 1)
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Xin lỗi anh/chị, em đang gặp chút trục trặc. Anh/chị có thể nhắn thẳng qua Zalo giúp em nhé! 🌸'
      }])
      setTurnCount(prev => prev + 1)
    }
    setLoading(false)
  }

  const zaloUrl = process.env.NEXT_PUBLIC_ZALO_URL ?? '#'
  const showSoftCTA = turnCount >= 3
  const showStrongCTA = turnCount >= 5

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-cta text-cta-text shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200',
          open && 'hidden'
        )}
        aria-label="Mở tư vấn"
      >
        <MessageCircle size={24} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
      </button>

      {/* Chat panel */}
      <div className={cn(
        'fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full md:w-[380px] h-[80vh] md:h-[520px] bg-bg-card border border-border-color md:rounded-2xl shadow-2xl flex flex-col transition-all duration-300',
        open ? 'translate-y-0 opacity-100' : 'translate-y-full md:translate-y-8 opacity-0 pointer-events-none'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-color bg-cta md:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cta-text/20 flex items-center justify-center">
              <Flower size={16} className="text-cta-text" />
            </div>
            <div>
              <p className="text-cta-text text-sm font-semibold">Tư vấn hoa</p>
              <p className="text-cta-text/70 text-xs">Trả lời trong vài giây</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-cta-text/70 hover:text-cta-text transition">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-cta text-cta-text rounded-br-sm'
                  : 'bg-bg-secondary text-text-primary rounded-bl-sm'
              )}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-bg-secondary rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-accent rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Soft Zalo CTA (after 3 turns) */}
          {showSoftCTA && !showStrongCTA && (
            <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4 text-center">
              <p className="text-text-primary text-sm mb-3 font-medium">
                Để tư vấn chi tiết hơn, anh/chị nhắn thẳng Zalo nhé! 🌸
              </p>
              <a
                href={`${zaloUrl}?text=${ZALO_PREFILL}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackZaloClick}
                className="inline-flex items-center justify-center gap-2 bg-cta text-cta-text px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition w-full"
              >
                Nhắn Zalo ngay
              </a>
            </div>
          )}

          {/* Strong Zalo CTA (after 5 turns) */}
          {showStrongCTA && (
            <div className="bg-cta/10 border-2 border-cta/30 rounded-2xl p-4 text-center">
              <p className="text-text-primary text-sm mb-3 font-semibold">
                🌸 Anh/chị muốn đặt hoa ngay không?
              </p>
              <a
                href={`${zaloUrl}?text=${ZALO_PREFILL}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackZaloClick}
                className="inline-flex items-center justify-center gap-2 bg-cta text-cta-text px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition w-full animate-bounce-gentle"
              >
                Nhắn Zalo — Tư vấn miễn phí
              </a>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border-color">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-bg-secondary border border-border-color rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent transition"
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading}
              className="w-10 h-10 flex-shrink-0 bg-cta text-cta-text rounded-xl flex items-center justify-center hover:opacity-90 transition disabled:opacity-40">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  )
}
