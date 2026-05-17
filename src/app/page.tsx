'use client'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

const SECTIONS = [
  {
    href: '/housing',
    label: 'Housing',
    headline: 'Verified flats in Bratislava',
    body: 'Every listing is personally checked by our team. Studios, shared flats, rooms near EUBA and Comenius — all pre-screened so you can move in with confidence.',
    stat: '12 verified listings',
    bg: '#c9b490',
    dark: false,
  },
  {
    href: '/storage',
    label: 'Storage',
    headline: 'Safe summer storage',
    body: "Going home after semester? Leave your boxes, bike and furniture with us. Pick them up when you're back. Simple, secure, all-inclusive pricing.",
    stat: 'From €0.52 / day',
    bg: '#1a1a1a',
    dark: true,
  },
  {
    href: '/marketplace',
    label: 'Marketplace',
    headline: 'Buy & sell between Erasmus students',
    body: 'IKEA furniture, kitchen sets, bedding, electronics — sold by students leaving the city to students just arriving. No commission, no middleman.',
    stat: 'Free to list',
    bg: '#f0ece4',
    dark: false,
  },
  {
    href: '/help',
    label: 'Help',
    headline: 'Your Bratislava setup guide',
    body: "Bank account, police registration, health insurance, residence permit. Petra walks you through every step so you don't miss a deadline.",
    stat: '5-step checklist',
    bg: '#7c3aed',
    dark: true,
  },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f2', fontFamily: 'inherit' }}>
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: '#f8f6f2', padding: '72px 0 64px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <p style={{ margin: '0 0 18px', fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a0a0a0' }}>
            Bratislava · Erasmus Platform
          </p>
          <h1 style={{
            margin: '0 0 24px',
            fontFamily: "'Lora',Georgia,serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(40px,6vw,76px)',
            lineHeight: 1.08,
            letterSpacing: '-.02em',
            color: '#0a0a0a',
            maxWidth: 820,
          }}>
            Everything you need<br />for Erasmus life<br />in Bratislava
          </h1>
          <p style={{ margin: '0 0 40px', fontSize: 17, color: '#666', maxWidth: 520, lineHeight: 1.65 }}>
            Housing, storage, a second-hand marketplace and a paperwork guide — built for Erasmus students, by people who've been there.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              href="/housing"
              style={{ padding: '13px 26px', background: '#0a0a0a', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'opacity .18s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '.85')}
              onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}
            >Find a flat →</a>
            <a
              href="/marketplace"
              style={{ padding: '13px 26px', background: 'transparent', color: '#0a0a0a', border: '1.5px solid #ccc', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.borderColor = '#0a0a0a')}
              onMouseLeave={e => ((e.target as HTMLElement).style.borderColor = '#ccc')}
            >Browse marketplace</a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ height: 1, background: '#e8e4dc' }} />
      </div>

      {/* Sections */}
      <section style={{ padding: '64px 0 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(480px,1fr))', gap: 16 }}>
          {SECTIONS.map(s => (
            <a
              key={s.href}
              href={s.href}
              style={{ textDecoration: 'none', display: 'block', borderRadius: 14, overflow: 'hidden', transition: 'transform .2s, box-shadow .2s' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 12px 40px rgba(0,0,0,.13)' }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.transform = ''; el.style.boxShadow = '' }}
            >
              <div style={{ background: s.bg, padding: '40px 36px 36px', minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: s.dark ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.4)' }}>
                    {s.label}
                  </p>
                  <h2 style={{ margin: '0 0 14px', fontFamily: "'Lora',Georgia,serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(22px,2.5vw,30px)', lineHeight: 1.2, color: s.dark ? '#fff' : '#0a0a0a' }}>
                    {s.headline}
                  </h2>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: s.dark ? 'rgba(255,255,255,.65)' : '#555', maxWidth: 400 }}>
                    {s.body}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.dark ? 'rgba(255,255,255,.45)' : 'rgba(0,0,0,.35)', letterSpacing: '.06em' }}>
                    {s.stat}
                  </span>
                  <span style={{ fontSize: 22, color: s.dark ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.3)', lineHeight: 1 }}>→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* About strip */}
      <section style={{ background: '#0a0a0a', padding: '64px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'flex', gap: 64, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 auto' }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: '.1em', color: '#fff' }}>ČAU</span>
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ margin: '0 0 8px', fontFamily: "'Lora',Georgia,serif", fontStyle: 'italic', fontSize: 22, fontWeight: 400, color: '#fff', lineHeight: 1.4 }}>
              Built by people who did Erasmus in Bratislava.
            </p>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, maxWidth: 480 }}>
              We know how hard the first weeks can be — finding a flat over WhatsApp, hauling boxes to the train station, googling &quot;Slovakia bank account for foreigners&quot; at midnight. Čau Bratislava exists so you don&apos;t have to.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 48, flexShrink: 0, flexWrap: 'wrap' }}>
            {[['500+', 'students helped'], ['12', 'verified flats'], ['1k+', 'items sold'], ['Free', 'to use']].map(([n, l]) => (
              <div key={l}>
                <p style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{n}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.4)', fontWeight: 500 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
