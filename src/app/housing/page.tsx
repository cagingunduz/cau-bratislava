'use client'
import { useState } from 'react'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

const FLATS = [
  { id: '1', title: 'Cozy studio · Old Town', area: '25 m²  ·  all bills included', price: 450, type: 'studio', location: 'Old Town', photos: 3, rating: 5, students: 12, color: '#c9b99a' },
  { id: '2', title: 'Shared flat · Petržalka', area: 'Private room  ·  4 ppl', price: 290, type: 'shared', location: 'Petržalka', photos: 5, rating: 5, students: 8, color: '#8899bb' },
  { id: '3', title: 'Studio + balcony · Ružinov', area: '32 m²  ·  close to EUBA', price: 520, type: 'studio', location: 'Ružinov', photos: 8, rating: 5, students: 9, color: '#b8a888' },
  { id: '4', title: 'Double room · Staré Mesto', area: 'Shared flat  ·  2 ppl', price: 360, type: 'shared', location: 'Old Town', photos: 4, rating: 4, students: 6, color: '#a8b8a0' },
  { id: '5', title: 'Modern studio · Nové Mesto', area: '28 m²  ·  furnished', price: 480, type: 'studio', location: 'Nové Mesto', photos: 6, rating: 5, students: 14, color: '#c0a8a0' },
  { id: '6', title: 'Flat share · EUBA campus', area: '3 rooms  ·  near university', price: 260, type: 'shared', location: 'Petržalka', photos: 3, rating: 4, students: 20, color: '#a0b0c0' },
]

const FILTERS = [
  { key: 'all',        label: 'All' },
  { key: 'studio',     label: 'Studio' },
  { key: 'shared',     label: 'Shared' },
  { key: 'Old Town',   label: 'Old Town' },
  { key: 'budget',     label: '€400 and under' },
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

      {/* Page header */}
      <div style={{ background: '#f8f6f2', padding: '48px 0 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px 32px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a0a0a0' }}>Bratislava · Verified</p>
          <h1 style={{ margin: '0 0 24px', fontFamily: "'Lora',Georgia,serif", fontStyle: 'italic', fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 400 }}>
            Verified flats in Bratislava
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: '#707070' }}>{FLATS.length} listings · all personally checked by our team</p>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                style={{
                  padding: '8px 18px', fontSize: 13, fontWeight: 500,
                  borderRadius: 100, border: '1.5px solid',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
                  background: active === f.key ? '#0a0a0a' : '#fff',
                  color:      active === f.key ? '#fff'    : '#555',
                  borderColor: active === f.key ? '#0a0a0a' : '#ddd',
                }}
              >{f.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
          {filtered.map(flat => (
            <FlatCard key={flat.id} flat={flat} />
          ))}
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
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #ececec', cursor: 'pointer', transition: 'box-shadow .2s' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.1)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Image area */}
      <div style={{ position: 'relative', height: 200, background: flat.color }}>
        {/* Verified badge */}
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,.92)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#0a0a0a', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#16a34a' }}>✓</span> Verified
        </div>
        {/* Photo count */}
        <div style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(0,0,0,.55)', borderRadius: 5, padding: '3px 9px', fontSize: 11, fontWeight: 600, color: '#fff' }}>
          {flat.photos} photos
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#0a0a0a' }}>{flat.title}</h3>
        <p style={{ margin: '0 0 12px', fontSize: 12, color: '#888' }}>{flat.area}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>€{flat.price}</span>
            <span style={{ fontSize: 13, color: '#888', marginLeft: 2 }}>/mo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: '#f59e0b', fontSize: 12 }}>{'★'.repeat(flat.rating)}</span>
            <span style={{ fontSize: 12, color: '#888' }}>{flat.students} students</span>
          </div>
        </div>
      </div>
    </div>
  )
}
