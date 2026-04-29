export default function CtaBanner({ onSell }: { onSell: () => void }) {
  return (
    <section style={{ background:'#0a0a0a' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'80px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:48, flexWrap:'wrap' }}>
        <div>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(40px,5vw,72px)', color:'#fff', lineHeight:.95, marginBottom:16 }}>
            Leaving Bratislava?<br/>Sell before you go.
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.5)', maxWidth:420, lineHeight:1.6 }}>
            Don&apos;t leave your stuff at the dorm door. List it here and earn some cash for your journey home — or your next Erasmus.
          </p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:12, flexShrink:0 }}>
          <button onClick={onSell} style={{ background:'#fff', color:'#0a0a0a', border:'2px solid #fff', padding:'14px 28px', fontSize:14, fontWeight:700, letterSpacing:'.04em', borderRadius:6, cursor:'pointer', fontFamily:'inherit', transition:'all .22s' }}>
            List an item — free
          </button>
          <p style={{ fontSize:12, color:'rgba(255,255,255,.3)' }}>No account needed to browse. Sign up to list.</p>
        </div>
      </div>
    </section>
  )
}
