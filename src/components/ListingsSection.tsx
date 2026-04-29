'use client'
import type { Listing } from '@/types'
import ListingCard from './ListingCard'

const CATEGORIES = [
  { key:'all',         label:'All items',   icon:'⊞' },
  { key:'furniture',   label:'Furniture',   icon:'🏠' },
  { key:'kitchen',     label:'Kitchen',     icon:'🍳' },
  { key:'electronics', label:'Electronics', icon:'💻' },
  { key:'bedding',     label:'Bedding',     icon:'🛏' },
  { key:'books',       label:'Books',       icon:'📚' },
  { key:'clothes',     label:'Clothes',     icon:'👕' },
  { key:'other',       label:'Other',       icon:'•••' },
]

interface Props {
  listings: Listing[]
  loading: boolean
  category: string
  maxPrice: string
  onCategoryChange: (c: string) => void
  onMaxPriceChange: (p: string) => void
  onContact: (l: Listing) => void
}

export default function ListingsSection({ listings, loading, category, maxPrice, onCategoryChange, onMaxPriceChange, onContact }: Props) {
  return (
    <section id="listings" style={{ padding:'64px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 28px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(32px,4vw,44px)', letterSpacing:'.04em' }}>Browse listings</h2>
        </div>

        {/* Category tabs */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24, paddingBottom:24, borderBottom:'1px solid #efefef' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => onCategoryChange(cat.key)} style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'9px 18px', fontSize:13, fontWeight:600,
              color: category === cat.key ? '#fff' : '#707070',
              background: category === cat.key ? '#0a0a0a' : '#fff',
              border: `1.5px solid ${category === cat.key ? '#0a0a0a' : '#e0e0e0'}`,
              borderRadius:100, cursor:'pointer', fontFamily:'inherit', transition:'all .22s',
            }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28, flexWrap:'wrap' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#a0a0a0' }}>Max price</label>
            <select value={maxPrice} onChange={e => onMaxPriceChange(e.target.value)} style={{ padding:'8px 28px 8px 12px', fontSize:13, fontWeight:500, border:'1.5px solid #e0e0e0', borderRadius:6, background:'#fff', color:'#0a0a0a', outline:'none', cursor:'pointer', fontFamily:'inherit', appearance:'none', backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23aaa' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center' }}>
              <option value="all">Any price</option>
              <option value="10">Under €10</option>
              <option value="25">Under €25</option>
              <option value="50">Under €50</option>
              <option value="100">Under €100</option>
            </select>
          </div>
          <div style={{ marginLeft:'auto', fontSize:13, color:'#a0a0a0', fontWeight:500 }}>
            {loading ? 'Loading...' : `${listings.length} item${listings.length !== 1 ? 's' : ''} found`}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
            {Array.from({length:8}).map((_,i) => (
              <div key={i} style={{ height:400, background:'#f7f7f7', borderRadius:12, animation:'pulse 1.5s infinite' }}/>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#a0a0a0' }}>
            <p style={{ fontSize:48, marginBottom:16 }}>📭</p>
            <p style={{ fontSize:18, fontWeight:600 }}>No listings found</p>
            <p style={{ fontSize:14, marginTop:8 }}>Try a different category or price range.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
            {listings.map(l => <ListingCard key={l.id} listing={l} onContact={() => onContact(l)} />)}
          </div>
        )}

      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </section>
  )
}
