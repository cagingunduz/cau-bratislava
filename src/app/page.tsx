'use client'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

const PHOTOS = {
  hero:        'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200&q=85&auto=format&fit=crop',
  housing:     'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80&auto=format&fit=crop',
  storage:     '/storage.jpg',
  marketplace: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=900&q=80&auto=format&fit=crop',
  help:        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=900&q=80&auto=format&fit=crop',
  students:    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80&auto=format&fit=crop',
}

const STEPS = [
  { n: '01', title: 'Find a flat', desc: 'Browse verified listings or contact us for a personal match. All flats are checked by our team before going live.' },
  { n: '02', title: 'Complete paperwork', desc: 'Petra walks you through bank account, police registration and health insurance step by step.' },
  { n: '03', title: 'Buy what you need', desc: 'Pick up furniture, kitchen gear and bedding from students who just finished their semester.' },
  { n: '04', title: 'Store before leaving', desc: 'Book storage for summer. Drop your stuff off, go home, pick it all up when you return.' },
]

const TESTIMONIALS = [
  { quote: 'I found my flat two days after landing in Bratislava. The verified badge meant I didn\'t have to guess — I just moved in.', name: 'María', origin: 'Valencia, Spain', initial: 'M' },
  { quote: 'Petra reminded me about police registration before the deadline. I had no idea that was even a thing. Saved me a huge fine.', name: 'Lucas', origin: 'Berlin, Germany', initial: 'L' },
  { quote: 'Sold my IKEA desk, bed frame and kitchen set before leaving. Made €220 from stuff I would have had to throw away.', name: 'Emma', origin: 'Lyon, France', initial: 'E' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f2', fontFamily: 'inherit' }}>
      <SiteHeader />

      {/* ── HERO ── */}
      <section style={{ background: '#f8f6f2', padding: '72px 0 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ paddingBottom: 72 }}>
            <p style={{ margin: '0 0 20px', fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#a0a0a0' }}>
              Bratislava · Erasmus Platform
            </p>
            <h1 style={{ margin: '0 0 22px', fontFamily: "'Lora',Georgia,serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(38px,5vw,68px)', lineHeight: 1.08, letterSpacing: '-.02em', color: '#0a0a0a' }}>
              Everything you need for Erasmus life in Bratislava
            </h1>
            <p style={{ margin: '0 0 36px', fontSize: 16, color: '#666', lineHeight: 1.7, maxWidth: 440 }}>
              Verified housing, summer storage, a second-hand marketplace and a step-by-step paperwork guide — built for Erasmus students who just arrived and have no idea where to start.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="/housing" style={{ padding: '13px 26px', background: '#0a0a0a', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Find a flat →
              </a>
              <a href="/marketplace" style={{ padding: '13px 26px', background: 'transparent', color: '#0a0a0a', border: '1.5px solid #ccc', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                Browse marketplace
              </a>
            </div>
          </div>

          {/* Photo */}
          <div style={{ position: 'relative', height: 480, borderRadius: '18px 18px 0 0', overflow: 'hidden' }}>
            <img
              src={PHOTOS.hero}
              alt="Bratislava"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 18, left: 18, background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600, color: '#0a0a0a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>📍</span> Bratislava, Slovakia
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: '#0a0a0a', padding: '28px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
          {[['500+', 'students helped'], ['12', 'verified flats'], ['1 000+', 'items sold'], ['Free', 'to join & list']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 3px', fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-.02em' }}>{n}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.4)', fontWeight: 500 }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOUSING ── */}
      <FeatureRow
        photo={PHOTOS.housing}
        photoAlt="Verified flat in Bratislava"
        label="Housing"
        headline="Verified flats in Bratislava"
        body="Every listing is personally checked by our team before going live. We visit the flat, meet the landlord and confirm it matches the description — so you can book with confidence from abroad."
        bullets={['Studios, doubles and shared flats', 'Petržalka, Old Town, Ružinov, Nové Mesto', 'All bills included options available', 'Student-verified reviews']}
        cta="Browse verified flats →"
        href="/housing"
        bg="#f8f6f2"
        reverse={false}
      />

      {/* ── STORAGE ── */}
      <FeatureRow
        photo={PHOTOS.storage}
        photoAlt="Safe student storage"
        label="Storage"
        headline="Safe summer storage — from €0.52 / day"
        body="Going home for summer or winter break? Leave your boxes, bike, furniture and anything else with us. We store it securely in one of our three Bratislava warehouses and have it ready for when you return."
        bullets={['Drop-off and pick-up included', 'All sizes — boxes to bicycles', 'Three warehouse locations', 'All-inclusive flat-rate pricing']}
        cta="Book storage →"
        href="/storage"
        bg="#1a1a1a"
        dark
        reverse
      />

      {/* ── MARKETPLACE ── */}
      <FeatureRow
        photo={PHOTOS.marketplace}
        photoAlt="Erasmus marketplace"
        label="Marketplace"
        headline="Buy & sell between Erasmus students"
        body="Students leaving Bratislava sell their furniture, kitchen gear and bedding to students just arriving. No shipping, no commission, no middleman — arrange pickup in person. Most items go in hours."
        bullets={['Furniture, bedding, electronics, books', 'No listing fee, no commission', 'Chat directly with sellers', 'Bundle listings for moving-out sales']}
        cta="Open marketplace →"
        href="/marketplace"
        bg="#f0ece4"
        reverse={false}
      />

      {/* ── HELP ── */}
      <FeatureRow
        photo={PHOTOS.help}
        photoAlt="Erasmus paperwork guide"
        label="Help"
        headline="Your step-by-step Bratislava setup guide"
        body="The first weeks in Bratislava involve more admin than anyone tells you. Police registration, bank account, health insurance, residence permit — Petra guides you through each one so you don't miss a deadline or pay a fine."
        bullets={['Checklist: bank, police, insurance, residence', 'Ask Petra anything, get instant answers', 'Deadlines and document lists included', 'Built for EU and non-EU students']}
        cta="Open setup guide →"
        href="/help"
        bg="#7c3aed"
        dark
        reverse
      />

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#fff', padding: '88px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#a0a0a0', textAlign: 'center' }}>The process</p>
          <h2 style={{ margin: '0 0 60px', fontFamily: "'Lora',Georgia,serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(28px,3.5vw,42px)', textAlign: 'center', color: '#0a0a0a' }}>
            From landing to settled — in four steps
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 32 }}>
            {STEPS.map((step, i) => (
              <div key={step.n} style={{ position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 22, left: 'calc(100% - 16px)', width: 32, height: 1, background: '#e0e0e0', display: 'none' }} />
                )}
                <p style={{ margin: '0 0 14px', fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: '.04em', color: '#ece9e3', lineHeight: 1 }}>{step.n}</p>
                <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#0a0a0a' }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: '#777', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: '#f8f6f2', padding: '88px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#a0a0a0', textAlign: 'center' }}>Students say</p>
          <h2 style={{ margin: '0 0 52px', fontFamily: "'Lora',Georgia,serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(26px,3vw,38px)', textAlign: 'center', color: '#0a0a0a' }}>
            Real Erasmus experiences
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: '28px 28px 24px' }}>
                <p style={{ margin: '0 0 24px', fontSize: 32, color: '#e0dbd4', fontFamily: 'Georgia,serif', lineHeight: 1 }}>"</p>
                <p style={{ margin: '0 0 24px', fontSize: 15, color: '#333', lineHeight: 1.7, fontStyle: 'italic' }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0a0a0a', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{t.initial}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{t.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#a0a0a0' }}>{t.origin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#0a0a0a', padding: '88px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: '0 0 10px', fontFamily: "'Lora',Georgia,serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', lineHeight: 1.2 }}>
              Your Erasmus in Bratislava<br />starts here.
            </h2>
            <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>
              Housing, storage, marketplace and paperwork — all free to use.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
            <a href="/housing" style={{ padding: '14px 28px', background: '#fff', color: '#0a0a0a', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', textAlign: 'center', whiteSpace: 'nowrap' }}>
              Find a flat →
            </a>
            <a href="/help" style={{ padding: '14px 28px', background: 'transparent', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', textAlign: 'center', whiteSpace: 'nowrap' }}>
              Start setup guide
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/* ── Reusable feature row ── */
function FeatureRow({ photo, photoAlt, label, headline, body, bullets, cta, href, bg, dark = false, reverse = false }: {
  photo: string; photoAlt: string; label: string; headline: string; body: string
  bullets: string[]; cta: string; href: string; bg: string; dark?: boolean; reverse?: boolean
}) {
  const txt = dark ? '#fff' : '#0a0a0a'
  const sub = dark ? 'rgba(255,255,255,.6)' : '#555'
  const cap = dark ? 'rgba(255,255,255,.4)' : '#a0a0a0'
  const bul = dark ? 'rgba(255,255,255,.15)' : '#e0e0e0'

  return (
    <section style={{ background: bg, padding: '80px 0' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 28px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center',
        direction: reverse ? 'rtl' : 'ltr',
      }}>
        {/* Photo */}
        <div style={{ borderRadius: 14, overflow: 'hidden', height: 420, direction: 'ltr' }}>
          <img src={photo} alt={photoAlt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>

        {/* Text */}
        <div style={{ direction: 'ltr' }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: cap }}>{label}</p>
          <h2 style={{ margin: '0 0 16px', fontFamily: "'Lora',Georgia,serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(22px,2.8vw,34px)', lineHeight: 1.2, color: txt }}>
            {headline}
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 15, color: sub, lineHeight: 1.7 }}>{body}</p>
          <ul style={{ margin: '0 0 32px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bullets.map(b => (
              <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: sub }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${bul}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, color: cap }}>✓</span>
                {b}
              </li>
            ))}
          </ul>
          <a href={href} style={{
            display: 'inline-block', padding: '12px 24px',
            background: dark ? '#fff' : '#0a0a0a',
            color: dark ? '#0a0a0a' : '#fff',
            borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}>{cta}</a>
        </div>
      </div>
    </section>
  )
}
