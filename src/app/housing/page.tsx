'use client'
import { useState } from 'react'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

const BASE = 'https://images.unsplash.com'

const FLATS = [
  {
    id: '1', title: 'Cozy studio · Old Town', area: '25 m²  ·  all bills included',
    price: 450, type: 'studio', location: 'Old Town', photos: 3, rating: 5, students: 12,
    img: `${BASE}/photo-1522708323590-d24dbb6b0267?w=600&q=80&auto=format&fit=crop`,
  },
  {
    id: '2', title: 'Shared flat · Petržalka', area: 'Private room  ·  4 ppl',
    price: 290, type: 'shared', location: 'Petržalka', photos: 5, rating: 5, students: 8,
    img: `${BASE}/photo-1560448204-e02f11c3d0e2?w=600&q=80&auto=format&fit=crop`,
  },
  {
    id: '3', title: 'Studio + balcony · Ružinov', area: '32 m²  ·  close to EUBA',
    price: 520, type: 'studio', location: 'Ružinov', photos: 8, rating: 5, students: 9,
    img: `${BASE}/photo-1502672260266-1c1ef2d93688?w=600&q=80&auto=format&fit=crop`,
  },
  {
    id: '4', title: 'Double room · Staré Mesto', area: 'Shared flat  ·  2 ppl',
    price: 360, type: 'shared', location: 'Old Town', photos: 4, rating: 4, students: 6,
    img: `${BASE}/photo-1493809842364-78817add7ffb?w=600&q=80&auto=format&fit=crop`,
  },
  {
    id: '5', title: 'Modern studio · Nové Mesto', area: '28 m²  ·  furnished',
    price: 480, type: 'studio', location: 'Nové Mesto', photos: 6, rating: 5, students: 14,
    img: `${BASE}/photo-1505693416388-ac5ce068fe85?w=600&q=80&auto=format&fit=crop`,
  },
  {
    id: '6', title: 'Flat share · EUBA campus', area: '3 rooms  ·  near university',
    price: 260, type: 'shared', location: 'Petržalka', photos: 3, rating: 4, students: 20,
    img: `${BASE}/photo-1540518614846-7eded433c457?w=600&q=80&auto=format&fit=crop`,
  },
]

const FILTERS = [
  { key: 'all',      label: 'All' },
  { key: 'studio',   label: 'Studio' },
  { key: 'shared',   label: 'Shared' },
  { key: 'Old Town', label: 'Old Town' },
  { key: 'budget',   label: '€400 and under' },
]

export default function HousingPage() {
  const [active, setActive] = useState('all')

  const filtered = FLATS.filter(f => {
    if (active === 'all')    return true
    if (active === 'budget') return f.price <= 400
    if (active === 'studio' || active === 'shared') return f.type === active
    return f.location === active
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f2', fontFamily: 'inherit' }}>
      <SiteHeader />

      <div style={{ background: '#f8f6f2', padding: '48px 0 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px 32px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a0a0a0' }}>Bratislava · Verified</p>
          <h1 style={{ margin: '0 0 12px', fontFamily: "'Lora',Georgia,serif", fontStyle: 'italic', fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 400 }}>
            Verified flats in Bratislava
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: '#707070' }}>{FLATS.length} listings · all personally checked by our team</p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                style={{
                  padding: '8px 18px', fontSize: 13, fontWeight: 500,
                  borderRadius: 100, border: '1.5px solid',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
                  background:  active === f.key ? '#0a0a0a' : '#fff',
                  color:       active === f.key ? '#fff'    : '#555',
                  borderColor: active === f.key ? '#0a0a0a' : '#ddd',
                }}
              >{f.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
          {filtered.map(flat => <FlatCard key={flat.id} flat={flat} />)}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#a0a0a0' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🏠</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a' }}>No flats match this filter</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

function FlatCard({ flat }: { flat: typeof FLATS[0] }) {
  return (
    <div
      style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #ececec', cursor: 'pointer', transition: 'box-shadow .2s, transform .2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = '' }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: '#f0ece4' }}>
        <img
          src={flat.img}
          alt={flat.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={e => (e.currentTarget.style.transform = '')}
        />
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,.93)', backdropFilter: 'blur(6px)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#0a0a0a', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#16a34a' }}>✓</span> Verified
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', borderRadius: 5, padding: '3px 9px', fontSize: 11, fontWeight: 600, color: '#fff' }}>
          {flat.photos} photos
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px 18px' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#0a0a0a' }}>{flat.title}</h3>
        <p style={{ margin: '0 0 14px', fontSize: 12, color: '#999' }}>{flat.area}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>€{flat.price}</span>
            <span style={{ fontSize: 13, color: '#aaa', marginLeft: 3 }}>/mo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: '#f59e0b', fontSize: 13, letterSpacing: 1 }}>{'★'.repeat(flat.rating)}</span>
            <span style={{ fontSize: 12, color: '#aaa' }}>{flat.students} students</span>
          </div>
        </div>
      </div>
    </div>
  )
}
