const STEPS = [
  { num:'01', icon:'📸', title:'List your items', desc:'Take a photo, write a quick description, set your price. Takes 2 minutes. Completely free.' },
  { num:'02', icon:'💬', title:'Get contacted',   desc:'Buyers message you directly. No middleman, no fees, no waiting for approval.' },
  { num:'03', icon:'🤝', title:'Meet & exchange', desc:'Arrange a pickup in Bratislava. Cash, Revolut, or however you prefer. Done.' },
]

export default function HowItWorks() {
  return (
    <section id="how" style={{ background:'#f7f7f7', padding:'80px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.2em', textTransform:'uppercase', color:'#a0a0a0', marginBottom:10 }}>Simple & free</p>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(32px,4vw,44px)', letterSpacing:'.04em' }}>How it works</h2>
        </div>
        <div style={{ display:'flex', alignItems:'flex-start', maxWidth:900, margin:'0 auto' }}>
          {STEPS.map((step, i) => (
            <>
              <div key={step.num} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:14, padding:'0 24px' }}>
                <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:'.2em', color:'#cacaca' }}>{step.num}</p>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'#fff', border:'2px solid #e0e0e0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, boxShadow:'0 2px 16px rgba(0,0,0,.07)' }}>{step.icon}</div>
                <h3 style={{ fontSize:17, fontWeight:700 }}>{step.title}</h3>
                <p style={{ fontSize:14, color:'#707070', lineHeight:1.6 }}>{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div key={`arrow-${i}`} style={{ fontSize:24, color:'#cacaca', marginTop:50, flexShrink:0 }}>→</div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  )
}
