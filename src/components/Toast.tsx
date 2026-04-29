'use client'

export default function Toast({ message }: { message: string | null }) {
  return (
    <div style={{
      position:'fixed', bottom:28, left:'50%',
      transform:`translateX(-50%) translateY(${message ? 0 : 12}px)`,
      background:'#0a0a0a', color:'#fff', padding:'12px 22px',
      borderRadius:100, fontSize:13, fontWeight:600,
      display:'flex', alignItems:'center', gap:9,
      zIndex:999, opacity: message ? 1 : 0,
      transition:'opacity .25s, transform .25s',
      pointerEvents:'none', whiteSpace:'nowrap',
    }}>
      {message && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
      {message}
    </div>
  )
}
