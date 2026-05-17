'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/auth'
import type { Listing, ChatMessage } from '@/types'

interface Props {
  listing: Listing
  currentEmail: string
  currentName: string
  onClose: () => void
}

export default function ChatModal({ listing, currentEmail, currentName, onClose }: Props) {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages]             = useState<ChatMessage[]>([])
  const [input, setInput]                   = useState('')
  const [loading, setLoading]               = useState(true)
  const [sending, setSending]               = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load or create conversation
  useEffect(() => {
    async function init() {
      setLoading(true)
      const res = await fetch(`/api/conversations?listing_id=${listing.id}&buyer_email=${encodeURIComponent(currentEmail)}`)
      const data = await res.json()
      if (data) {
        setConversationId(data.id)
        setMessages(data.chat_messages ?? [])
      }
      setLoading(false)
    }
    init()
  }, [listing.id, currentEmail])

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages(prev => {
            if (prev.find(m => m.id === payload.new.id)) return prev
            return [...prev, payload.new as ChatMessage]
          })
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setSending(true)

    if (!conversationId) {
      // Create conversation + first message
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listing.id, buyer_email: currentEmail, buyer_name: currentName, content: input }),
      })
      const data = await res.json()
      if (data.conversation) {
        setConversationId(data.conversation.id)
        setMessages([data.message])
      }
    } else {
      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_email: currentEmail, sender_name: currentName, content: input }),
      })
    }

    setInput('')
    setSending(false)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 500, maxHeight: '85vh', display: 'flex', flexDirection: 'column', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          {listing.image_url && (
            <img src={listing.image_url} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</p>
            <p style={{ fontSize: 12, color: '#a0a0a0', margin: 0 }}>with {listing.seller_name}</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0f0f0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#707070', flexShrink: 0 }}>✕</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#a0a0a0', fontSize: 13 }}>Loading...</p>
          ) : messages.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#a0a0a0', fontSize: 13, marginTop: 40 }}>No messages yet. Say hi!</p>
          ) : (
            messages.map(msg => {
              const isMe = msg.sender_email === currentEmail
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 8 }}>
                  <div style={{
                    maxWidth: '72%', padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isMe ? '#0a0a0a' : '#f0f0f0', color: isMe ? '#fff' : '#0a0a0a',
                    fontSize: 14, lineHeight: 1.5,
                  }}>
                    {!isMe && <p style={{ fontSize: 11, fontWeight: 700, margin: '0 0 4px', opacity: .7 }}>{msg.sender_name}</p>}
                    <p style={{ margin: 0 }}>{msg.content}</p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={send} style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 100, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            style={{ padding: '10px 20px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', opacity: (!input.trim() || sending) ? .5 : 1 }}
          >Send</button>
        </form>
      </div>
    </div>
  )
}
