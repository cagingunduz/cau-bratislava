import Image from 'next/image'

const HERO_CARDS = [
  { img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80&fit=crop', tag:'Furniture',        name:'IKEA KALLAX Shelf', price:'€25', cls:'hc-back'  },
  { img:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80&fit=crop', tag:'Kitchen',          name:'Pots & Pans Set',   price:'€12', cls:'hc-mid'   },
  { img:'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=300&q=80&fit=crop',tag:'Leaving Friday!', name:'IKEA FLINTAN Chair', price:'€40', cls:'hc-front', urgent:true },
]

export default function Hero({ onSell }: { onSell: () => void }) {
  return (
    <section style={{
      display:'grid', gridTemplateColumns:'1fr 1fr',
      minHeight:'calc(100vh - 104px)', maxHeight:820, overflow:'hidden',
    }}>
      {/* Left */}
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'80px 64px 80px 80px' }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.2em', textTransform:'uppercase', color:'#a0a0a0', marginBottom:20 }}>
          For Erasmus Students · Bratislava, SK
        </p>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(64px,7vw,108px)', lineHeight:.95, marginBottom:24 }}>
          Leaving{' '}
          <span style={{ WebkitTextStroke:'2px #0a0a0a', color:'transparent' }}>Bratislava?</span>
          <br/>Don&apos;t throw<br/>it away.
        </h1>
        <p style={{ fontSize:16, color:'#707070', lineHeight:1.6, maxWidth:400, marginBottom:36 }}>
          Sell your IKEA furniture, kitchen stuff, and everything else to the next wave of Erasmus students. Fast, free, and local.
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:48, flexWrap:'wrap' }}>
          <button onClick={onSell} style={{ background:'#0a0a0a', color:'#fff', border:'2px solid #0a0a0a', padding:'14px 28px', fontSize:14, fontWeight:700, letterSpacing:'.04em', borderRadius:6, cursor:'pointer', fontFamily:'inherit', transition:'all .22s' }}>
            List an item — it&apos;s free
          </button>
          <a href="#listings" style={{ fontSize:14, fontWeight:700, color:'#0a0a0a', letterSpacing:'.04em' }}>Browse listings →</a>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:24, paddingTop:32, borderTop:'1px solid #e0e0e0' }}>
          {[['1,200+','items sold'],['800+','students helped'],['€0','commission']].map(([num,label]) => (
            <div key={label} style={{ display:'flex', flexDirection:'column', gap:3 }}>
              <strong style={{ fontSize:22, fontWeight:900, letterSpacing:'-.02em' }}>{num}</strong>
              <span style={{ fontSize:12, color:'#a0a0a0', fontWeight:500 }}>{label}</span>
            </div>
          ))}
          <div style={{ width:1, height:32, background:'#e0e0e0' }}/>
        </div>
      </div>

      {/* Right — card stack */}
      <div style={{ background:'#f7f7f7', display:'flex', alignItems:'center', justifyContent:'center', padding:60, position:'relative', overflow:'hidden' }}>
        {/* Grid pattern */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(#e0e0e0 1px,transparent 1px),linear-gradient(90deg,#e0e0e0 1px,transparent 1px)', backgroundSize:'40px 40px', opacity:.5 }}/>
        <div style={{ position:'relative', width:280, height:380 }}>
          {HERO_CARDS.map((c, i) => (
            <div key={i} className={c.cls} style={{
              position:'absolute',
              width:240,
              background:'#fff',
              borderRadius:12,
              boxShadow:'0 8px 40px rgba(0,0,0,.12)',
              overflow:'hidden',
              border:'1px solid #e0e0e0',
              top: i === 0 ? 0 : i === 1 ? 20 : 40,
              left: i === 0 ? 40 : i === 1 ? 20 : 0,
              transform: i === 0 ? 'rotate(6deg)' : i === 1 ? 'rotate(-3deg)' : 'none',
              zIndex: i + 1,
            }}>
              <div style={{ height:160, overflow:'hidden' }}>
                <img src={c.img} alt={c.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
              </div>
              <div style={{ padding:'14px 16px' }}>
                <span style={{
                  display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase',
                  background: c.urgent ? '#fff0f1' : '#f0f0f0',
                  color: c.urgent ? '#e63946' : '#707070',
                  padding:'3px 8px', borderRadius:100, marginBottom:6,
                }}>{c.tag}</span>
                <p style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{c.name}</p>
                <p style={{ fontSize:20, fontWeight:900, letterSpacing:'-.02em' }}>{c.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
