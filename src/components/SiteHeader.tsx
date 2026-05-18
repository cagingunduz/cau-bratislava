'use client'
import { useState, useRef, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/auth'
import { useMediaQuery } from '@/lib/useMediaQuery'
import AuthModal from './AuthModal'

const NAV = [
  { label: 'Housing',     href: '/housing' },
  { label: 'Storage',     href: '/storage' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Help',        href: '/help' },
]

export default function SiteHeader() {
  const pathname  = usePathname()
  const [user, setUser]           = useState<User | null>(null)
  const [authOpen, setAuthOpen]   = useState(false)
  const [signupMode, setSignupMode] = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 680px)')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  async function handleSignOut() {
    await createClient().auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  const isActive = (href: string) => pathname === href || (href !== '/marketplace' && href !== '/' && pathname.startsWith(href))

  return (
    <>
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e8e8e8',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: isMobile ? '0 16px' : '0 28px',
          minHeight: 60,
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 14 : 36,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}>
          <Link href="/" style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 24,
            letterSpacing: '.1em',
            color: '#0a0a0a',
            textDecoration: 'none',
            flexShrink: 0,
          }}>ČAU</Link>

          <nav style={{
            display: 'flex',
            alignItems: 'center',
            order: isMobile ? 3 : 0,
            width: isMobile ? '100%' : 'auto',
            overflowX: isMobile ? 'auto' : 'visible',
            paddingBottom: isMobile ? 10 : 0,
            scrollbarWidth: 'none',
          }}>
            {NAV.map(({ label, href }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    padding: '6px 14px',
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#0a0a0a' : '#888',
                    textDecoration: active ? 'underline' : 'none',
                    textUnderlineOffset: 5,
                    transition: 'color .18s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#0a0a0a' }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#888' }}
                >{label}</Link>
              )
            })}
          </nav>

          <div style={{ marginLeft: 'auto', padding: isMobile ? '12px 0' : 0 }}>
            {user ? (
              <div ref={menuRef} style={{ position: 'relative' }}>
                {(() => {
                  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
                  const initial = (fullName || user.email || 'U')[0].toUpperCase()
                  return (
                    <button
                      onClick={() => setMenuOpen(o => !o)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'none', border: '1.5px solid #e0e0e0',
                        borderRadius: 100, padding: '4px 12px 4px 4px',
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color .18s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: '#0a0a0a', color: '#fff',
                        fontSize: 12, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>{initial}</div>
                      {fullName && (
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {fullName}
                        </span>
                      )}
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  )
                })()}
                {menuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: '#fff', border: '1.5px solid #e0e0e0',
                    borderRadius: 8, padding: 6, minWidth: 168,
                    boxShadow: '0 4px 24px rgba(0,0,0,.1)', zIndex: 200,
                  }}>
                    <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid #f0f0f0', marginBottom: 4 }}>
                      <p style={{ margin: 0, fontSize: 12, color: '#707070' }}>{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      style={{ display: 'block', padding: '8px 12px', fontSize: 13, color: '#0a0a0a', borderRadius: 4, textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f7f7f7')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >My account</Link>
                    <button
                      onClick={handleSignOut}
                      style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: '#888', borderRadius: 4, fontFamily: 'inherit' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f7f7f7')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setAuthOpen(true)}
                  style={{ padding: isMobile ? '8px 12px' : '8px 16px', background: 'none', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#0a0a0a', transition: 'border-color .18s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
                >Log in</button>
                <button
                  onClick={() => { setAuthOpen(true); setSignupMode(true) }}
                  style={{ padding: isMobile ? '8px 12px' : '8px 16px', background: '#0a0a0a', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#fff', transition: 'opacity .18s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >Sign up</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {authOpen && <AuthModal initialMode={signupMode ? 'signup' : 'signin'} onClose={() => { setAuthOpen(false); setSignupMode(false) }} />}
    </>
  )
}
