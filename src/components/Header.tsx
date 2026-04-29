'use client'
import { useState, useEffect, useRef } from 'react'
import Logo from './Logo'

interface Props { onSell: () => void; onSearch: (q: string) => void }

export default function Header({ onSell, onSearch }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => onSearch(e.target.value), 350)
  }

  return (
    <>
      {/* Top bar */}
      <div style={{ background:'#0a0a0a', color:'rgba(255,255,255,.65)', height:36, display:'flex', alignItems:'center', justifyContent:'center', gap:14, fontSize:11.5, fontWeight:500, letterSpacing:'.03em' }}>
        <span>🎓 Built for Erasmus students in Bratislava</span>
        <span style={{color:'rgba(255,255,255,.2)'}}>·</span>
        <span>Free to list · No commission</span>
        <span style={{color:'rgba(255,255,255,.2)'}}>·</span>
        <span>Pickup in person · Safe &amp; easy</span>
      </div>

      <header style={{
        position:'sticky', top:0, zIndex:100, background:'#fff',
        borderBottom:'1px solid #e0e0e0',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,.07)' : 'none',
        transition:'box-shadow .22s',
      }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 28px', height:68, display:'flex', alignItems:'center', gap:20 }}>
          {/* Logo */}
          <a href="#" style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <div style={{ width:40, height:40 }}><Logo /></div>
            <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:'.05em' }}>Čau Bratislava</span>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', color:'#a0a0a0', marginTop:2 }}>Erasmus Marketplace</span>
            </div>
          </a>

          {/* Search */}
          <div style={{ flex:1, maxWidth:540 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'#f7f7f7', border:'1.5px solid #e0e0e0', borderRadius:100, padding:'10px 8px 10px 18px', transition:'border-color .22s' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
              onBlur={e  => (e.currentTarget.style.borderColor = '#e0e0e0')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0a0a0" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input onChange={handleSearch} placeholder="Search items — IKEA lamp, desk, mattress..."
                style={{ flex:1, border:'none', background:'none', fontSize:14, color:'#0a0a0a', outline:'none', fontFamily:'inherit' }} />
              <button style={{ background:'#0a0a0a', color:'#fff', fontSize:12, fontWeight:700, letterSpacing:'.05em', padding:'8px 18px', borderRadius:100, border:'none', cursor:'pointer', fontFamily:'inherit', flexShrink:0 }}>
                Search
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display:'flex', alignItems:'center', gap:8, marginLeft:'auto', flexShrink:0 }}>
            <a href="#listings" style={{ fontSize:14, fontWeight:500, color:'#707070', padding:'6px 12px', borderRadius:6, transition:'color .22s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color='#0a0a0a')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color='#707070')}>Browse</a>
            <a href="#how" style={{ fontSize:14, fontWeight:500, color:'#707070', padding:'6px 12px', borderRadius:6, transition:'color .22s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color='#0a0a0a')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color='#707070')}>How it works</a>
            <button style={{ background:'transparent', color:'#0a0a0a', border:'2px solid #cacaca', padding:'8px 16px', fontSize:12, fontWeight:600, borderRadius:6, cursor:'pointer', fontFamily:'inherit', transition:'border-color .22s' }}>Sign in</button>
            <button onClick={onSell} style={{ background:'#0a0a0a', color:'#fff', border:'2px solid #0a0a0a', padding:'8px 16px', fontSize:12, fontWeight:700, borderRadius:6, cursor:'pointer', fontFamily:'inherit' }}>+ List item</button>
          </nav>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:200 }}/>}
    </>
  )
}
