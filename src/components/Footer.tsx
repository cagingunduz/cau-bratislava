import Logo from './Logo'

export default function Footer() {
  return (
    <footer style={{ background:'#141414', padding:'64px 0 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ display:'flex', gap:64, marginBottom:48, flexWrap:'wrap' }}>
          <div style={{ flex:'1.2 1 280px' }}>
            <a href="#" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:40, height:40 }}><Logo inverted /></div>
              <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:'.05em', color:'#fff' }}>Čau Bratislava</span>
                <span style={{ fontSize:9, fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', color:'rgba(255,255,255,.3)', marginTop:2 }}>Erasmus Marketplace</span>
              </div>
            </a>
            <p style={{ fontSize:13.5, color:'rgba(255,255,255,.4)', lineHeight:1.6, maxWidth:280 }}>
              The free marketplace for Erasmus students in Bratislava. Buy, sell, and move on to your next adventure.
            </p>
          </div>
          {[
            { title:'Marketplace', links:['Browse all','Furniture','Electronics','Kitchen','Books'] },
            { title:'Account',     links:['Sign in','Register','My listings','Saved items'] },
            { title:'Info',        links:['About','Safety tips','Contact','Privacy'] },
          ].map(col => (
            <div key={col.title} style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <h4 style={{ fontSize:11, fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase', color:'rgba(255,255,255,.3)', marginBottom:4 }}>{col.title}</h4>
              {col.links.map(l => (
                <a key={l} href="#" style={{ fontSize:14, color:'rgba(255,255,255,.55)', transition:'color .22s' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color='#fff')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color='rgba(255,255,255,.55)')}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', padding:'20px 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <p style={{ fontSize:12, color:'rgba(255,255,255,.25)' }}>© 2025 Čau Bratislava. Free for all Erasmus students. No fees, ever.</p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,.25)' }}>Made with ♥ for students in Bratislava, Slovakia 🇸🇰</p>
        </div>
      </div>
    </footer>
  )
}
