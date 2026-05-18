'use client'
import { useState, useRef, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMediaQuery } from '@/lib/useMediaQuery'

interface Props {
  user?: User | null
  onSignIn?: () => void
  onSignOut?: () => void
}

const NAV = [
  { label: 'Housing',     href: '/housing' },
  { label: 'Storage',     href: '/storage' },
  { label: 'Marketplace', href: '/' },
  { label: 'Help',        href: '/help' },
]

export default function SiteHeader({ user, onSignIn, onSignOut }: Props) {
  const pathname  = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef   = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 680px)')

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
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
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 24,
          letterSpacing: '.1em',
          color: '#0a0a0a',
          textDecoration: 'none',
          flexShrink: 0,
        }}>ČAU</Link>

        {/* Nav */}
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

        {/* Right: avatar */}
        <div style={{ marginLeft: 'auto', padding: isMobile ? '12px 0' : 0 }}>
          {user ? (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                title={user.email}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#7c3aed', color: '#fff',
                  border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >{user.email?.[0].toUpperCase()}</button>
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
                    onClick={() => { setMenuOpen(false); onSignOut?.() }}
                    style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: '#888', borderRadius: 4, fontFamily: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f7f7f7')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              title="Sign in"
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#7c3aed', color: '#fff',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
