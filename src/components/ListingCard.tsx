'use client'
import { useState } from 'react'
import type { Listing } from '@/types'

const CONDITION_LABEL: Record<string, string> = { like_new: 'Like new', good: 'Good', fair: 'Fair' }
const CATEGORY_LABEL: Record<string, string>  = {
  furniture: 'Furniture', kitchen: 'Kitchen', electronics: 'Electronics',
  bedding: 'Bedding', books: 'Books', clothes: 'Clothes', other: 'Other',
}

interface Props {
  listing: Listing
  isFavorited: boolean
  currentUserId?: string | null
  onContact: () => void
  onChat?: () => void
  onToggleFavorite: () => void
  onMarkSold?: () => void
  onDelete?: () => void
}

export default function ListingCard({
  listing, isFavorited, currentUserId, onContact, onChat,
  onToggleFavorite, onMarkSold, onDelete,
}: Props) {
  const [imgError, setImgError] = useState(false)

  const isUrgent  = listing.is_urgent || (listing.leaving_date && new Date(listing.leaving_date) <= new Date(Date.now() + 7 * 86400000))
  const isOwner   = currentUserId && listing.user_id && currentUserId === listing.user_id

  return (
    <div
      style={{
        background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: 12,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'transform .22s, box-shadow .22s, border-color .22s',
        cursor: 'default', opacity: listing.is_sold ? .7 : 1, position: 'relative',
      }}
      onMouseEnter={e => { const el = e.currentTarget; if (!listing.is_sold) { el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 40px rgba(0,0,0,.12)'; el.style.borderColor = '#cacaca' } }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.transform = ''; el.style.boxShadow = ''; el.style.borderColor = '#e0e0e0' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {listing.image_url && !imgError ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', transition: 'transform .55s', filter: 'grayscale(10%)' }}
          />
        ) : (
          <div style={{ width: '100%', height: 220, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, opacity: .4 }}>📦</div>
        )}

        {/* SOLD overlay */}
        {listing.is_sold && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: '#fff', color: '#0a0a0a', fontSize: 13, fontWeight: 900, letterSpacing: '.12em', padding: '8px 20px', borderRadius: 100, textTransform: 'uppercase' }}>Sold</span>
          </div>
        )}

        {/* Urgent badge */}
        {isUrgent && !listing.is_sold && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: '#0a0a0a', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100 }}>
            {listing.leaving_date ? `Leaving ${new Date(listing.leaving_date).toLocaleDateString('en', { weekday: 'short' })}` : 'Urgent'}
          </span>
        )}

        {/* Bundle badge */}
        {listing.is_bundle && (
          <span style={{ position: 'absolute', top: isUrgent ? 42 : 12, left: 12, background: '#6366f1', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100 }}>
            Bundle
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={onToggleFavorite}
          aria-label="Save"
          style={{
            position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%',
            background: '#fff', border: `1.5px solid ${isFavorited ? '#e63946' : '#e0e0e0'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isFavorited ? '#e63946' : '#a0a0a0', cursor: 'pointer', transition: 'all .22s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 100, background: '#f0f0f0', color: '#707070' }}>
            {CATEGORY_LABEL[listing.category] ?? listing.category}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 100, background: listing.condition === 'like_new' ? '#f0fdf4' : '#f0f0f0', color: listing.condition === 'like_new' ? '#16a34a' : '#a0a0a0' }}>
            {CONDITION_LABEL[listing.condition] ?? listing.condition}
          </span>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{listing.title}</h3>

        {/* Bundle items preview */}
        {listing.is_bundle && listing.bundle_items?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '8px 12px', background: '#f7f7f7', borderRadius: 6 }}>
            {listing.bundle_items.slice(0, 3).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#707070' }}>
                <span>{item.name}</span>
                <span style={{ fontWeight: 600 }}>€{item.price}</span>
              </div>
            ))}
            {listing.bundle_items.length > 3 && (
              <span style={{ fontSize: 11, color: '#a0a0a0' }}>+{listing.bundle_items.length - 3} more items</span>
            )}
          </div>
        )}

        <p style={{ fontSize: 12.5, color: '#707070', lineHeight: 1.55, flex: 1 }}>{listing.description}</p>

        {listing.pickup_address && (
          <p style={{ fontSize: 11, color: '#a0a0a0', margin: 0 }}>📍 {listing.pickup_address}</p>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f0f0f0', gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-.03em' }}>€{listing.price}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#0a0a0a', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {listing.seller_name[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600 }}>{listing.seller_name} {listing.seller_country}</p>
              <p style={{ fontSize: 10, color: '#a0a0a0' }}>{listing.university}</p>
            </div>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && !listing.is_sold && (
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button
              onClick={onMarkSold}
              style={{ flex: 1, padding: '8px', background: '#16a34a', color: '#fff', fontSize: 12, fontWeight: 700, border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}
            >Mark sold</button>
            <button
              onClick={onDelete}
              style={{ padding: '8px 14px', background: 'none', color: '#e63946', fontSize: 12, fontWeight: 700, border: '1.5px solid #e63946', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}
            >Delete</button>
          </div>
        )}

        {/* Contact / Chat */}
        {!listing.is_sold && !isOwner && (
          <div style={{ display: 'flex', gap: 8 }}>
            {onChat ? (
              <button
                onClick={onChat}
                style={{ flex: 1, padding: '10px', background: '#0a0a0a', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '.05em', border: '1.5px solid #0a0a0a', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .22s' }}
              >Chat</button>
            ) : (
              <button
                onClick={onContact}
                style={{ flex: 1, padding: '10px', background: '#fff', color: '#0a0a0a', fontSize: 12, fontWeight: 700, letterSpacing: '.05em', border: '1.5px solid #e0e0e0', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .22s' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.background = '#0a0a0a'; el.style.color = '#fff'; el.style.borderColor = '#0a0a0a' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.background = '#fff'; el.style.color = '#0a0a0a'; el.style.borderColor = '#e0e0e0' }}
              >Contact seller</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
