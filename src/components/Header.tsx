'use client'
import { useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import type { User } from '@supabase/supabase-js'

interface Props {
  onSell: () => void
  onSearch: (q: string) => void
  onSignIn: () => void
  user: User | null
  onSignOut: () => void
}

export default function Header({ onSell, onSearch, onSignIn, user, onSignOut }: Props) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => onSearch(e.target.value), 350)
  }

  return (
    <>
      {/* Top bar */}
      <div style={{ background: '#0a0a0a', color: 'rgba(255,255,255,.65)', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 11.5, fontWeight: 500, letterSpacing: '.03em' }}>
        <span>🎓 Built for Erasmus students in Bratislava</span>
        <span style={{ color: 'rgba(255,255,255,.2)' }}>·</span>
        <span>Free to list · No commission</span>
        <span style={{ color: 'rgba(255,255,255,.2)' }}>·</span>
        <span>Pickup in person · Safe &amp; easy</span>
      </div>

      <header style={{
        position: 'sticky', top: 0, zIndex: 100, background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,.07)' : 'none',
        transition: 'box-shadow .22s',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', height: 68, display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 40, height: 40 }}><Logo /></div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: '.05em' }}>Čau Bratislava</span>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#a0a0a0', marginTop: 2 }}>Erasmus Marketplace</span>
            </div>
          </a>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 540 }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f7f7f7', border: '1.5px solid #e0e0e0', borderRadius: 100, padding: '10px 8px 10px 18px', transition: 'border-color .22s' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0a0a0" strokeWidth="2.2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <input
                onChange={handleSearch}
                placeholder="Search items — IKEA lamp, desk, mattress..."
                style={{ flex: 1, border: 'none', background: 'none', fontSize: 14, color: '#0a0a0a', outline: 'none', fontFamily: 'inherit' }}
              />
              <button style={{ background: '#0a0a0a', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '.05em', padding: '8px 18px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                Search
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
            <a href="#listings" style={{ fontSize: 14, fontWeight: 500, color: '#707070', padding: '6px 12px', borderRadius: 6, transition: 'color .22s', textDecoration: 'none' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#0a0a0a')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = '#707070')}>Browse</a>
            <a href="#how" style={{ fontSize: 14, fontWeight: 500, color: '#707070', padding: '6px 12px', borderRadius: 6, transition: 'color .22s', textDecoration: 'none' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#0a0a0a')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = '#707070')}>How it works</a>

            {user ? (
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: '1.5px solid #e0e0e0', borderRadius: 6, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color .22s' }}
                >
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#0a0a0a', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{user.email?.split('@')[0]}</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
                {menuOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '6px', minWidth: 160, boxShadow: '0 4px 24px rgba(0,0,0,.1)', zIndex: 200 }}>
                    <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid #f0f0f0', marginBottom: 4 }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); onSignOut() }}
                      style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#707070', borderRadius: 4, fontFamily: 'inherit' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f7f7f7')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onSignIn}
                style={{ background: 'transparent', color: '#0a0a0a', border: '2px solid #cacaca', padding: '8px 16px', fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color .22s' }}
              >Sign in</button>
            )}

            <button
              onClick={onSell}
              style={{ background: '#0a0a0a', color: '#fff', border: '2px solid #0a0a0a', padding: '8px 16px', fontSize: 12, fontWeight: 700, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}
            >+ List item</button>
          </nav>
        </div>
      </header>
    </>
  )
}
