'use client'
import { useState } from 'react'
import type { Listing } from '@/types'

const CONDITION_LABEL: Record<string, string> = { like_new:'Like new', good:'Good', fair:'Fair' }
const CATEGORY_LABEL:  Record<string, string> = {
  furniture:'Furniture', kitchen:'Kitchen', electronics:'Electronics',
  bedding:'Bedding', books:'Books', clothes:'Clothes', other:'Other',
}

export default function ListingCard({ listing, onContact }: { listing: Listing; onContact: () => void }) {
  const [saved, setSaved]     = useState(false)
  const [imgError, setImgError] = useState(false)

  const isUrgent = listing.is_urgent || (listing.leaving_date && new Date(listing.leaving_date) <= new Date(Date.now() + 7 * 86400000))

  return (
    <div
      style={{ background:'#fff', border:'1.5px solid #e0e0e0', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column', transition:'transform .22s, box-shadow .22s, border-color .22s', cursor:'default' }}
      onMouseEnter={e => { const el = e.currentTarget; el.style.transform='translateY(-3px)'; el.style.boxShadow='0 8px 40px rgba(0,0,0,.12)'; el.style.borderColor='#cacaca' }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.transform=''; el.style.boxShadow=''; el.style.borderColor='#e0e0e0' }}
    >
      {/* Image */}
      <div style={{ position:'relative', overflow:'hidden' }}>
        {listing.image_url && !imgError ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            onError={() => setImgError(true)}
            style={{ width:'100%', height:220, objectFit:'cover', display:'block', transition:'transform .55s', filter:'grayscale(10%)' }}
          />
        ) : (
          <div style={{ width:'100%', height:220, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:56, opacity:.4 }}>📦</div>
        )}
        {isUrgent && (
          <span style={{ position:'absolute', top:12, left:12, background:'#0a0a0a', color:'#fff', fontSize:10, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', padding:'4px 10px', borderRadius:100 }}>
            {listing.leaving_date ? `Leaving ${new Date(listing.leaving_date).toLocaleDateString('en', {weekday:'short'})}` : 'Urgent'}
          </span>
        )}
        <button
          onClick={() => setSaved(s => !s)}
          aria-label="Save"
          style={{
            position:'absolute', top:10, right:10, width:34, height:34, borderRadius:'50%',
            background:'#fff', border:`1.5px solid ${saved ? '#e63946' : '#e0e0e0'}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color: saved ? '#e63946' : '#a0a0a0', cursor:'pointer',
            transition:'all .22s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ padding:'16px 18px 18px', display:'flex', flexDirection:'column', gap:8, flex:1 }}>
        <div style={{ display:'flex', gap:6 }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', padding:'3px 9px', borderRadius:100, background:'#f0f0f0', color:'#707070' }}>
            {CATEGORY_LABEL[listing.category] ?? listing.category}
          </span>
          <span style={{ fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:100, background: listing.condition === 'like_new' ? '#f0fdf4' : '#f0f0f0', color: listing.condition === 'like_new' ? '#16a34a' : '#a0a0a0' }}>
            {CONDITION_LABEL[listing.condition] ?? listing.condition}
          </span>
        </div>

        <h3 style={{ fontSize:15, fontWeight:700, lineHeight:1.3 }}>{listing.title}</h3>
        <p style={{ fontSize:12.5, color:'#707070', lineHeight:1.55, flex:1 }}>{listing.description}</p>

        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', paddingTop:10, borderTop:'1px solid #f0f0f0', gap:8 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
            <span style={{ fontSize:22, fontWeight:900, letterSpacing:'-.03em' }}>€{listing.price}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'#0a0a0a', color:'#fff', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {listing.seller_name[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize:12, fontWeight:600 }}>{listing.seller_name} {listing.seller_country}</p>
              <p style={{ fontSize:10, color:'#a0a0a0' }}>{listing.university}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onContact}
          style={{ width:'100%', padding:'10px', background:'#fff', color:'#0a0a0a', fontSize:12, fontWeight:700, letterSpacing:'.05em', border:'1.5px solid #e0e0e0', borderRadius:6, cursor:'pointer', fontFamily:'inherit', transition:'all .22s', marginTop:4 }}
          onMouseEnter={e => { const el = e.currentTarget; el.style.background='#0a0a0a'; el.style.color='#fff'; el.style.borderColor='#0a0a0a' }}
          onMouseLeave={e => { const el = e.currentTarget; el.style.background='#fff'; el.style.color='#0a0a0a'; el.style.borderColor='#e0e0e0' }}
        >
          Contact seller
        </button>
      </div>
    </div>
  )
}
