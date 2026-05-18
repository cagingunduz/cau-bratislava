'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { Listing, Conversation } from '@/types'
import { createClient } from '@/lib/auth'
import Logo from '@/components/Logo'

type Tab = 'listings' | 'favorites' | 'messages'

export default function AccountPage() {
  const router   = useRouter()
  const [user, setUser]           = useState<User | null>(null)
  const [tab, setTab]             = useState<Tab>('listings')
  const [myListings, setMyListings]     = useState<Listing[]>([])
  const [favorites, setFavorites]       = useState<Listing[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading]     = useState(true)

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
    const supabase = createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    Promise.all([
      fetch(`/api/listings?user_id=${user.id}&all=true`).then(r => r.json()),
      Promise.resolve(db.from('favorites').select('listing_id').eq('user_id', user.id))
        .then(async ({ data: favData }: { data: { listing_id: string }[] | null }) => {
          const ids = favData?.map(f => f.listing_id) ?? []
          if (!ids.length) return []
          return fetch(`/api/listings?ids=${ids.join(',')}&all=true`).then(r => r.json())
        }),
      Promise.resolve(
        db.from('conversations')
          .select('*, listings!inner(seller_email)')
          .eq('listings.seller_email', user.email!)
          .order('created_at', { ascending: false })
      ).then(({ data }: { data: Conversation[] | null }) => data ?? []),
    ]).then(([listings, favs, convs]) => {
      setMyListings(Array.isArray(listings) ? listings : [])
      setFavorites(Array.isArray(favs) ? favs : [])
      setConversations(Array.isArray(convs) ? convs : [])
    }).finally(() => setLoading(false))
  }, [user])

  async function handleSignOut() {
    await createClient().auth.signOut()
    window.location.href = '/'
  }

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

  const s = styles

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'inherit' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32 }}><Logo /></div>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: '.05em', color: '#0a0a0a' }}>Čau Bratislava</span>
          </Link>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ fontSize: 13, fontWeight: 500, color: '#707070', textDecoration: 'none' }}>← Back to listings</Link>
            <button onClick={handleSignOut} style={{ padding: '7px 14px', background: 'none', border: '1.5px solid #e0e0e0', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#707070' }}>Sign out</button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        {/* Profile card */}
        <div style={{ background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: 12, padding: '28px 32px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#0a0a0a', color: '#fff', fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {user.email?.[0].toUpperCase()}
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 800 }}>{user.email?.split('@')[0]}</p>
            <p style={{ margin: 0, fontSize: 13, color: '#a0a0a0' }}>{user.email}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 24 }}>
            {[
              { label: 'Listings', value: myListings.length },
              { label: 'Favorites', value: favorites.length },
              { label: 'Messages', value: conversations.length },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 900 }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#a0a0a0', fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#f0f0f0', borderRadius: 8, padding: 4 }}>
          {([
            { key: 'listings', label: 'My Listings' },
            { key: 'favorites', label: 'Saved' },
            { key: 'messages', label: 'Messages' },
          ] as { key: Tab; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '9px', background: tab === t.key ? '#fff' : 'none',
              border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit', color: tab === t.key ? '#0a0a0a' : '#707070',
              boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
              transition: 'all .2s',
            }}>{t.label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#a0a0a0' }}>Loading...</div>
        ) : (
          <>
            {/* My Listings */}
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

            {/* Favorites */}
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
                        <Link href="/" style={{ fontSize: 12, fontWeight: 700, color: '#0a0a0a', textDecoration: 'none' }}>View listing →</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Messages */}
            {tab === 'messages' && (
              conversations.length === 0 ? (
                <EmptyState icon="💬" title="No messages yet" sub="When buyers contact you about your listings, they'll appear here." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {conversations.map((conv: Conversation & { listing?: Listing; last_message?: string }) => (
                    <div key={conv.id} style={{ background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: 10, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {conv.buyer_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 14 }}>{conv.buyer_name}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#a0a0a0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.buyer_email}</p>
                      </div>
                      <p style={{ fontSize: 11, color: '#c0c0c0', flexShrink: 0 }}>{new Date(conv.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 } as React.CSSProperties,
  card: { background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' } as React.CSSProperties,
  img: { width: '100%', height: 160, objectFit: 'cover' as const, display: 'block' },
  imgFallback: { width: '100%', height: 160, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, opacity: .4 } as React.CSSProperties,
  btnGreen: { flex: 1, padding: '7px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
  btnRed: { padding: '7px 12px', background: 'none', color: '#e63946', border: '1.5px solid #e63946', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
}
