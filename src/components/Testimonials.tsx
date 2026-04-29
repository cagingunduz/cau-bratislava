const TESTIMONIALS = [
  { initial:'C', name:'Carlos', flag:'🇪🇸', country:'Spain',   uni:'Comenius University, 2024', quote:"Sold my entire IKEA setup in 3 days before flying back to Madrid. Got €120 back. Incredible." },
  { initial:'P', name:'Priya',  flag:'🇮🇳', country:'India',   uni:'STU Bratislava, 2025',      quote:"Found a fully furnished room setup for €80 when I arrived. Saved me hours at IKEA and way more money." },
  { initial:'F', name:'Felix',  flag:'🇩🇪', country:'Germany', uni:'EUBA Bratislava, 2025',     quote:"Listed my monitor on Monday, sold it Tuesday. Wish this existed at every Erasmus destination." },
]

export default function Testimonials() {
  return (
    <section style={{ padding:'80px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 28px' }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.2em', textTransform:'uppercase', color:'#a0a0a0', marginBottom:8 }}>What students say</p>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(32px,4vw,44px)', letterSpacing:'.04em', marginBottom:48 }}>Real Erasmus experiences</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background:'#f7f7f7', border:'1.5px solid #e0e0e0', borderRadius:12, padding:32, display:'flex', flexDirection:'column', gap:16 }}>
              <p style={{ fontSize:48, fontWeight:900, color:'#e0e0e0', lineHeight:1, fontFamily:'Georgia,serif' }}>"</p>
              <p style={{ fontSize:15, lineHeight:1.6, color:'#3a3a3a', fontStyle:'italic', flex:1 }}>{t.quote}</p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'#0a0a0a', color:'#fff', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{t.initial}</div>
                <div>
                  <strong style={{ fontSize:14, display:'block' }}>{t.name} · {t.flag} {t.country}</strong>
                  <p style={{ fontSize:12, color:'#a0a0a0', marginTop:2 }}>{t.uni}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
