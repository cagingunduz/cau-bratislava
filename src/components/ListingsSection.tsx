'use client'
import type { Listing } from '@/types'
import { useMediaQuery } from '@/lib/useMediaQuery'
import ListingCard from './ListingCard'

const CATEGORIES = [
  { key: 'all',         label: 'All items',   icon: '⊞' },
  { key: 'furniture',   label: 'Furniture',   icon: '🏠' },
  { key: 'kitchen',     label: 'Kitchen',     icon: '🍳' },
  { key: 'electronics', label: 'Electronics', icon: '💻' },
  { key: 'bedding',     label: 'Bedding',     icon: '🛏' },
  { key: 'books',       label: 'Books',       icon: '📚' },
  { key: 'clothes',     label: 'Clothes',     icon: '👕' },
  { key: 'other',       label: 'Other',       icon: '•••' },
]

interface Props {
  listings: Listing[]
  loading: boolean
  category: string
  maxPrice: string
  showSold: boolean
  favoriteIds: Set<string>
  currentUserId?: string | null
  onCategoryChange: (c: string) => void
  onMaxPriceChange: (p: string) => void
  onShowSoldChange: (v: boolean) => void
  onContact: (l: Listing) => void
  onChat: (l: Listing) => void
  onToggleFavorite: (l: Listing) => void
  onMarkSold: (l: Listing) => void
  onDelete: (l: Listing) => void
  onMapOpen: () => void
}

export default function ListingsSection({
  listings, loading, category, maxPrice, showSold,
  favoriteIds, currentUserId,
  onCategoryChange, onMaxPriceChange, onShowSoldChange,
  onContact, onChat, onToggleFavorite, onMarkSold, onDelete, onMapOpen,
}: Props) {
  const isMobile = useMediaQuery('(max-width: 720px)')

  return (
    <section id="listings" style={{ padding: isMobile ? '36px 0 48px' : '64px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? 0 : '0 28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(32px,4vw,44px)', letterSpacing: '.04em' }}>Browse listings</h2>
          <button
            onClick={onMapOpen}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .22s', color: '#0a0a0a' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = '#0a0a0a'; el.style.color = '#fff'; el.style.borderColor = '#0a0a0a' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = '#fff'; el.style.color = '#0a0a0a'; el.style.borderColor = '#e0e0e0' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Map view
          </button>
        </div>

        {/* Category tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          overflowX: isMobile ? 'auto' : 'visible',
          marginBottom: 24,
          paddingBottom: 24,
          borderBottom: '1px solid #efefef',
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => onCategoryChange(cat.key)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', fontSize: 13, fontWeight: 600,
              color: category === cat.key ? '#fff' : '#707070',
              background: category === cat.key ? '#0a0a0a' : '#fff',
              border: `1.5px solid ${category === cat.key ? '#0a0a0a' : '#e0e0e0'}`,
              borderRadius: 100, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .22s', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: isMobile ? '100%' : 'auto' }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#a0a0a0' }}>Max price</label>
            <select
              value={maxPrice}
              onChange={e => onMaxPriceChange(e.target.value)}
              style={{ padding: '8px 28px 8px 12px', fontSize: 13, fontWeight: 500, border: '1.5px solid #e0e0e0', borderRadius: 6, background: '#fff', color: '#0a0a0a', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23aaa' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', width: isMobile ? '100%' : 'auto' }}
            >
              <option value="all">Any price</option>
              <option value="10">Under €10</option>
              <option value="25">Under €25</option>
              <option value="50">Under €50</option>
              <option value="100">Under €100</option>
            </select>
          </div>

          {/* Show sold toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
            <div
              onClick={() => onShowSoldChange(!showSold)}
              style={{
                width: 38, height: 22, borderRadius: 100, background: showSold ? '#0a0a0a' : '#e0e0e0',
                position: 'relative', cursor: 'pointer', transition: 'background .22s', flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: 3, left: showSold ? 19 : 3, width: 16, height: 16,
                borderRadius: '50%', background: '#fff', transition: 'left .22s',
                boxShadow: '0 1px 4px rgba(0,0,0,.2)',
              }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#707070' }}>Show sold</span>
          </label>

          <div style={{ marginLeft: isMobile ? 0 : 'auto', fontSize: 13, color: '#a0a0a0', fontWeight: 500 }}>
            {loading ? 'Loading...' : `${listings.length} item${listings.length !== 1 ? 's' : ''} found`}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ height: 400, background: '#f7f7f7', borderRadius: 12, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#a0a0a0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📭</p>
            <p style={{ fontSize: 18, fontWeight: 600 }}>No listings found</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Try a different category or price range.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {listings.map(l => (
              <ListingCard
                key={l.id}
                listing={l}
                isFavorited={favoriteIds.has(l.id)}
                currentUserId={currentUserId}
                onContact={() => onContact(l)}
                onChat={() => onChat(l)}
                onToggleFavorite={() => onToggleFavorite(l)}
                onMarkSold={() => onMarkSold(l)}
                onDelete={() => onDelete(l)}
              />
            ))}
          </div>
        )}

      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </section>
  )
}
