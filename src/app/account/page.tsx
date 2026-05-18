'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { Listing, Conversation, ChatMessage } from '@/types'
import { createClient } from '@/lib/auth'
import { useMediaQuery } from '@/lib/useMediaQuery'
import SiteHeader from '@/components/SiteHeader'

type Tab    = 'listings' | 'favorites' | 'messages'
type MsgTab = 'received' | 'sent'

interface ConvWithMessages extends Conversation {
  chat_messages?: ChatMessage[]
  seller_name?: string
  seller_email?: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser]             = useState<User | null>(null)
  const [tab, setTab]               = useState<Tab>('listings')
  const [msgTab, setMsgTab]         = useState<MsgTab>('received')
  const [myListings, setMyListings] = useState<Listing[]>([])
  const [favorites, setFavorites]   = useState<Listing[]>([])
  const [received, setReceived]     = useState<ConvWithMessages[]>([])
  const [sent, setSent]             = useState<ConvWithMessages[]>([])
  const [loading, setLoading]       = useState(true)
  const [openConv, setOpenConv]     = useState<{ conv: ConvWithMessages; mode: MsgTab } | null>(null)
  const isMobile = useMediaQuery('(max-width: 720px)')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.replace('/'); return }
      setUser(data.session.user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') { router.replace('/'); return }
      if (session) setUser(session.user)
    })
    return () => subscription.unsubscribe()
  }, [router])

  useEffect(() => {
    if (!user) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createClient() as any

    Promise.all([
      fetch(`/api/listings?user_id=${user.id}&all=true`).then(r => r.json()),
      Promise.resolve(db.from('favorites').select('listing_id').eq('user_id', user.id))
        .then(async ({ data: favData }: { data: { listing_id: string }[] | null }) => {
          const ids = favData?.map((f: { listing_id: string }) => f.listing_id) ?? []
          if (!ids.length) return []
          return fetch(`/api/listings?ids=${ids.join(',')}&all=true`).then(r => r.json())
        }),
      Promise.resolve(
        db.from('conversations')
          .select('*, listings!inner(seller_email), chat_messages(id,content,created_at,sender_email,sender_name)')
          .eq('listings.seller_email', user.email!)
          .order('created_at', { ascending: false })
      ).then(({ data }: { data: ConvWithMessages[] | null }) => data ?? []),
      Promise.resolve(
        db.from('conversations')
          .select('*, listings(seller_name, seller_email), chat_messages(id,content,created_at,sender_email,sender_name)')
          .eq('buyer_email', user.email!)
          .order('created_at', { ascending: false })
      ).then(({ data }: { data: (ConvWithMessages & { listings?: { seller_name: string; seller_email: string } })[] | null }) =>
        (data ?? []).map(c => ({
          ...c,
          seller_name: c.listings?.seller_name,
          seller_email: c.listings?.seller_email,
        }))
      ),
    ]).then(([listings, favs, recvd, snt]) => {
      setMyListings(Array.isArray(listings) ? listings : [])
      setFavorites(Array.isArray(favs) ? favs : [])
      setReceived(Array.isArray(recvd) ? recvd : [])
      setSent(Array.isArray(snt) ? snt : [])
    }).finally(() => setLoading(false))
  }, [user])

  async function handleMarkSold(id: string) {
    await fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user!.id },
      body: JSON.stringify({ is_sold: true }),
    })
    setMyListings(p => p.map(l => l.id === id ? { ...l, is_sold: true } : l))
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this listing? Cannot be undone.')) return
    await fetch(`/api/listings/${id}`, { method: 'DELETE', headers: { 'x-user-id': user!.id } })
    setMyListings(p => p.filter(l => l.id !== id))
  }

  function updateConvMessages(convId: string, msg: ChatMessage) {
    const update = (list: ConvWithMessages[]) =>
      list.map(c => c.id === convId ? { ...c, chat_messages: [...(c.chat_messages ?? []), msg] } : c)
    setReceived(update)
    setSent(update)
    if (openConv?.conv.id === convId) {
      setOpenConv(prev => prev ? { ...prev, conv: { ...prev.conv, chat_messages: [...(prev.conv.chat_messages ?? []), msg] } } : null)
    }
  }

  if (!user) return null

  const fullName    = user.user_metadata?.full_name || user.user_metadata?.name || ''
  const displayName = fullName || user.email?.split('@')[0] || 'User'
  const initial     = displayName[0].toUpperCase()
  const totalMessages = received.length + sent.length
  const s = styles

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'inherit' }}>
      <SiteHeader />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '28px 16px 56px' : '40px 24px' }}>
        {/* Profile card */}
        <div style={{
          background: '#fff',
          border: '1.5px solid #e0e0e0',
          borderRadius: 14,
          padding: isMobile ? 20 : 32,
          marginBottom: isMobile ? 22 : 32,
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 16 : 20,
          flexDirection: isMobile ? 'column' : 'row',
        }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0a0a0a', color: '#fff', fontSize: 26, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {initial}
          </div>
          <div style={{ minWidth: 0, width: isMobile ? '100%' : 'auto' }}>
            <p style={{ margin: '0 0 3px', fontSize: 20, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-.02em', overflowWrap: 'anywhere' }}>{displayName}</p>
            <p style={{ margin: 0, fontSize: 13, color: '#a0a0a0', overflowWrap: 'anywhere' }}>{user.email}</p>
          </div>
          <div style={{
            marginLeft: isMobile ? 0 : 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: isMobile ? 10 : 32,
            width: isMobile ? '100%' : 'auto',
          }}>
            {[
              { label: 'Listings', value: myListings.length },
              { label: 'Saved',    value: favorites.length },
              { label: 'Messages', value: totalMessages },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 2px', fontSize: 24, fontWeight: 900, color: '#0a0a0a' }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#a0a0a0', fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: isMobile ? 20 : 28, background: '#f0f0f0', borderRadius: 10, padding: 4, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {([
            { key: 'listings',  label: 'My Listings' },
            { key: 'favorites', label: 'Saved' },
            { key: 'messages',  label: 'Messages' },
          ] as { key: Tab; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: isMobile ? '0 0 auto' : 1, padding: '10px 14px',
              background: tab === t.key ? '#fff' : 'none',
              border: 'none', borderRadius: 7,
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              color: tab === t.key ? '#0a0a0a' : '#707070',
              boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
              transition: 'all .2s',
            }}>{t.label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#a0a0a0' }}>Loading...</div>
        ) : (
          <>
            {tab === 'listings' && (
              myListings.length === 0 ? (
                <EmptyState icon="🏷️" title="No listings yet" sub="Post your first item and reach hundreds of Erasmus students." />
              ) : (
                <div style={s.grid}>
                  {myListings.map(l => (
                    <div key={l.id} style={s.card}>
                      <div style={{ position: 'relative' }}>
                        {l.image_url
                          ? <img src={l.image_url} alt={l.title} style={s.img} />
                          : <div style={s.imgFallback}>📦</div>
                        }
                        {l.is_sold && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ background: '#fff', color: '#0a0a0a', fontSize: 11, fontWeight: 900, padding: '5px 14px', borderRadius: 100, letterSpacing: '.1em' }}>SOLD</span>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14 }}>{l.title}</p>
                        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#a0a0a0' }}>€{l.price}</p>
                        {!l.is_sold && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => handleMarkSold(l.id)} style={s.btnGreen}>Mark sold</button>
                            <button onClick={() => handleDelete(l.id)} style={s.btnRed}>Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === 'favorites' && (
              favorites.length === 0 ? (
                <EmptyState icon="♡" title="No saved items" sub="Tap the heart on any listing to save it here." />
              ) : (
                <div style={s.grid}>
                  {favorites.map(l => (
                    <div key={l.id} style={s.card}>
                      {l.image_url
                        ? <img src={l.image_url} alt={l.title} style={s.img} />
                        : <div style={s.imgFallback}>📦</div>
                      }
                      <div style={{ padding: '14px 16px' }}>
                        <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 14 }}>{l.title}</p>
                        <p style={{ margin: '0 0 8px', fontSize: 13, color: '#a0a0a0' }}>€{l.price} · {l.seller_name}</p>
                        <a href="/marketplace" style={{ fontSize: 12, fontWeight: 700, color: '#0a0a0a', textDecoration: 'none' }}>View listing →</a>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === 'messages' && (
              <div>
                <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1.5px solid #e8e8e8', overflowX: 'auto', scrollbarWidth: 'none' }}>
                  {([
                    { key: 'received', label: 'Received', count: received.length },
                    { key: 'sent',     label: 'Sent',     count: sent.length },
                  ] as { key: MsgTab; label: string; count: number }[]).map(t => (
                    <button key={t.key} onClick={() => setMsgTab(t.key)} style={{
                      padding: '10px 20px', background: 'none', border: 'none',
                      borderBottom: msgTab === t.key ? '2px solid #0a0a0a' : '2px solid transparent',
                      marginBottom: -1.5,
                      fontSize: 13, fontWeight: msgTab === t.key ? 700 : 500,
                      cursor: 'pointer', fontFamily: 'inherit',
                      color: msgTab === t.key ? '#0a0a0a' : '#a0a0a0',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      {t.label}
                      {t.count > 0 && (
                        <span style={{ background: msgTab === t.key ? '#0a0a0a' : '#e0e0e0', color: msgTab === t.key ? '#fff' : '#707070', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 100 }}>
                          {t.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {msgTab === 'received' && (
                  received.length === 0
                    ? <EmptyState icon="📨" title="No messages received" sub="When buyers contact you about your listings, they'll appear here." />
                    : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {received.map(conv => (
                          <ConvRow
                            key={conv.id} conv={conv} mode="received"
                            active={openConv?.conv.id === conv.id}
                            onClick={() => setOpenConv(c => c?.conv.id === conv.id ? null : { conv, mode: 'received' })}
                          />
                        ))}
                      </div>
                )}

                {msgTab === 'sent' && (
                  sent.length === 0
                    ? <EmptyState icon="📤" title="No messages sent" sub="When you contact sellers about listings, your messages will appear here." />
                    : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {sent.map(conv => (
                          <ConvRow
                            key={conv.id} conv={conv} mode="sent"
                            active={openConv?.conv.id === conv.id}
                            onClick={() => setOpenConv(c => c?.conv.id === conv.id ? null : { conv, mode: 'sent' })}
                          />
                        ))}
                      </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating chat panel */}
      {openConv && user && (
        <ChatPanel
          conv={openConv.conv}
          mode={openConv.mode}
          currentUser={user}
          onClose={() => setOpenConv(null)}
          onNewMessage={msg => updateConvMessages(openConv.conv.id, msg)}
          isMobile={isMobile}
        />
      )}
    </div>
  )
}

/* ─── Conversation row ─── */
function ConvRow({ conv, mode, active, onClick }: {
  conv: ConvWithMessages
  mode: MsgTab
  active: boolean
  onClick: () => void
}) {
  const isMobile = useMediaQuery('(max-width: 720px)')
  const name  = mode === 'received' ? conv.buyer_name  : (conv.seller_name ?? 'Seller')
  const email = mode === 'received' ? conv.buyer_email : (conv.seller_email ?? '')
  const label = mode === 'received' ? 'from' : 'to'

  const msgs   = conv.chat_messages ?? []
  const last   = msgs.length ? msgs.reduce((a, b) => a.created_at > b.created_at ? a : b) : null
  const preview = last?.content ?? ''

  return (
    <div
      onClick={onClick}
      style={{
        background: active ? '#f7f7f7' : '#fff',
        border: `1.5px solid ${active ? '#0a0a0a' : '#e0e0e0'}`,
        borderRadius: 10, padding: isMobile ? 14 : '16px 20px',
        display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: 12,
        flexDirection: isMobile ? 'column' : 'row',
        cursor: 'pointer', transition: 'border-color .15s, background .15s',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = '#c0c0c0' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = '#e0e0e0' }}
    >
      <div style={{ width: 42, height: 42, borderRadius: '50%', background: active ? '#0a0a0a' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, flexShrink: 0, color: active ? '#fff' : '#0a0a0a', transition: 'background .15s, color .15s' }}>
        {(name?.[0] ?? '?').toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0, width: isMobile ? '100%' : 'auto' }}>
        <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#c0c0c0', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#0a0a0a', overflowWrap: 'anywhere' }}>{name}</span>
          <span style={{ fontSize: 12, color: '#b0b0b0', overflowWrap: 'anywhere' }}>{email}</span>
        </div>
        {preview && (
          <p style={{ margin: 0, fontSize: 13, color: '#707070', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {preview}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'center' : 'flex-end', gap: 8, flexShrink: 0, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
        <p style={{ margin: 0, fontSize: 11, color: '#c0c0c0' }}>
          {new Date(last?.created_at ?? conv.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </p>
        {msgs.length > 0 && (
          <span style={{ fontSize: 11, color: '#a0a0a0' }}>{msgs.length} msg{msgs.length !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  )
}

/* ─── Floating chat panel ─── */
function ChatPanel({ conv, mode, currentUser, onClose, onNewMessage, isMobile }: {
  conv: ConvWithMessages
  mode: MsgTab
  currentUser: User
  onClose: () => void
  onNewMessage: (msg: ChatMessage) => void
  isMobile: boolean
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    [...(conv.chat_messages ?? [])].sort((a, b) => a.created_at.localeCompare(b.created_at))
  )
  const [input, setInput]   = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const partnerName  = mode === 'received' ? conv.buyer_name        : (conv.seller_name  ?? 'Seller')
  const partnerEmail = mode === 'received' ? conv.buyer_email       : (conv.seller_email ?? '')
  const myName       = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Me'
  const myEmail      = currentUser.email ?? ''

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const content = input.trim()
    if (!content || sending) return
    setSending(true)
    setInput('')

    const res = await fetch(`/api/conversations/${conv.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_email: myEmail, sender_name: myName, content }),
    })
    setSending(false)
    if (!res.ok) return
    const msg: ChatMessage = await res.json()
    setMessages(p => [...p, msg])
    onNewMessage(msg)
  }

  return (
    <div style={{
      position: 'fixed', bottom: isMobile ? 10 : 24, right: isMobile ? 10 : 24, left: isMobile ? 10 : 'auto', zIndex: 400,
      width: isMobile ? 'auto' : 360, maxHeight: isMobile ? 'calc(100vh - 20px)' : 480,
      background: '#fff', borderRadius: 14,
      border: '1.5px solid #e0e0e0',
      boxShadow: '0 8px 40px rgba(0,0,0,.18)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ background: '#0a0a0a', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {(partnerName[0] ?? '?').toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{partnerName}</p>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{partnerEmail}</p>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: 'rgba(255,255,255,.7)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', color: '#c0c0c0', fontSize: 13, margin: 'auto' }}>No messages yet</p>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_email === myEmail
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 6 }}>
              <div style={{
                maxWidth: '78%', padding: '9px 13px',
                background: isMe ? '#0a0a0a' : '#f2f2f2',
                color: isMe ? '#fff' : '#0a0a0a',
                borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                fontSize: 13, lineHeight: 1.4,
              }}>
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} style={{ padding: '10px 12px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #e0e0e0', borderRadius: 20, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fafafa' }}
          onFocus={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
          onBlur={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          style={{ padding: '9px 14px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: input.trim() ? 'pointer' : 'default', fontFamily: 'inherit', opacity: input.trim() ? 1 : .4, transition: 'opacity .15s' }}
        >→</button>
      </form>
    </div>
  )
}

function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: '#a0a0a0' }}>
      <p style={{ fontSize: 48, marginBottom: 12 }}>{icon}</p>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#0a0a0a', marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 14, margin: 0 }}>{sub}</p>
    </div>
  )
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(220px,100%),1fr))', gap: 16 } as React.CSSProperties,
  card: { background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' } as React.CSSProperties,
  img: { width: '100%', height: 160, objectFit: 'cover' as const, display: 'block' },
  imgFallback: { width: '100%', height: 160, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, opacity: .4 } as React.CSSProperties,
  btnGreen: { flex: 1, padding: '7px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
  btnRed: { padding: '7px 12px', background: 'none', color: '#e63946', border: '1.5px solid #e63946', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
}
