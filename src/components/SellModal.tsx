'use client'
import { useState, useRef } from 'react'
import type { BundleItem } from '@/types'
import { useMediaQuery } from '@/lib/useMediaQuery'

interface Props { onClose: () => void; onSubmit: (data: Record<string, unknown>) => void }

export default function SellModal({ onClose, onSubmit }: Props) {
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: '', condition: '',
    seller_name: '', seller_email: '', seller_country: '', university: '',
    leaving_date: '', pickup_address: '',
  })
  const [imageFile, setImageFile]   = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isBundle, setIsBundle]     = useState(false)
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([{ name: '', price: 0 }])
  const fileRef = useRef<HTMLInputElement>(null)
  const isMobile = useMediaQuery('(max-width: 640px)')

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setImageFile(f)
    setImagePreview(URL.createObjectURL(f))
  }

  function addBundleItem() { setBundleItems(p => [...p, { name: '', price: 0 }]) }
  function removeBundleItem(i: number) { setBundleItems(p => p.filter((_, idx) => idx !== i)) }
  function setBundleItem(i: number, field: keyof BundleItem, value: string) {
    setBundleItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: field === 'price' ? Number(value) : value } : item))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    let image_url: string | null = null

    if (imageFile) {
      setUploading(true)
      const fd = new FormData()
      fd.append('file', imageFile)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      setUploading(false)
      if (json.url) image_url = json.url
    }

    const isUrgent = !!form.leaving_date && new Date(form.leaving_date) <= new Date(Date.now() + 7 * 86400000)

    const bundlePrice = isBundle
      ? bundleItems.reduce((s, it) => s + it.price, 0)
      : Number(form.price)

    await onSubmit({
      ...form,
      price: bundlePrice,
      is_urgent: isUrgent,
      image_url,
      is_bundle: isBundle,
      bundle_items: isBundle ? bundleItems.filter(it => it.name) : [],
    })
    setSubmitting(false)
  }

  const inputStyle: React.CSSProperties = {
    padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: 6,
    fontSize: 14, color: '#0a0a0a', background: '#fff', outline: 'none',
    width: '100%', fontFamily: 'inherit', transition: 'border-color .22s',
    boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, letterSpacing: '.06em',
    textTransform: 'uppercase', color: '#707070', display: 'block', marginBottom: 6,
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 500, display: 'flex', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'center', padding: isMobile ? 10 : 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 600, maxHeight: isMobile ? 'calc(100vh - 20px)' : '92vh', overflowY: 'auto', padding: isMobile ? '24px 18px' : 40, position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', color: '#707070', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}>✕</button>

        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4, letterSpacing: '-.02em' }}>List your item</h2>
        <p style={{ fontSize: 13, color: '#a0a0a0', marginBottom: 28 }}>Free to list · Takes 2 minutes</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Bundle toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#f7f7f7', borderRadius: 8 }}>
            <input
              type="checkbox"
              id="bundle"
              checked={isBundle}
              onChange={e => setIsBundle(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer', flexShrink: 0 }}
            />
            <label htmlFor="bundle" style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: 14, fontWeight: 600, display: 'block' }}>Bundle listing</span>
              <span style={{ fontSize: 12, color: '#a0a0a0' }}>Selling multiple items together? List them as a bundle.</span>
            </label>
          </div>

          {/* Bundle items */}
          {isBundle && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: isMobile ? 12 : 16, background: '#fafafa', borderRadius: 8, border: '1.5px solid #e0e0e0' }}>
              <label style={labelStyle}>Bundle items</label>
              {bundleItems.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 82px 34px' : '1fr 100px 36px', gap: 8 }}>
                  <input
                    placeholder="Item name"
                    value={item.name}
                    onChange={e => setBundleItem(i, 'name', e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="€"
                    value={item.price || ''}
                    onChange={e => setBundleItem(i, 'price', e.target.value)}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => removeBundleItem(i)}
                    style={{ background: '#f0f0f0', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 16, color: '#a0a0a0' }}
                  >×</button>
                </div>
              ))}
              <button
                type="button"
                onClick={addBundleItem}
                style={{ alignSelf: 'flex-start', padding: '7px 14px', background: 'none', border: '1.5px dashed #ccc', borderRadius: 6, fontSize: 13, color: '#707070', cursor: 'pointer', fontFamily: 'inherit' }}
              >+ Add item</button>
              <p style={{ fontSize: 12, color: '#a0a0a0', margin: 0 }}>
                Bundle total: <strong>€{bundleItems.reduce((s, it) => s + (it.price || 0), 0)}</strong>
              </p>
            </div>
          )}

          {/* Title + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Item title *</label>
              <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder={isBundle ? 'e.g. Full room package' : 'e.g. IKEA KALLAX shelf'} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category *</label>
              <select required value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">Select</option>
                {['furniture', 'kitchen', 'electronics', 'bedding', 'books', 'clothes', 'other'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description *</label>
            <textarea required value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe condition, brand, dimensions..." rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} />
          </div>

          {/* Price + Condition */}
          {!isBundle && (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Price (€) *</label>
                <input required type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Condition *</label>
                <select required value={form.condition} onChange={e => set('condition', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="">Select</option>
                  <option value="like_new">Like new</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
            </div>
          )}
          {isBundle && (
            <div>
              <label style={labelStyle}>Condition *</label>
              <select required value={form.condition} onChange={e => set('condition', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">Select</option>
                <option value="like_new">Like new</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          )}

          {/* Seller info */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Your name *</label>
              <input required value={form.seller_name} onChange={e => set('seller_name', e.target.value)} placeholder="First name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input required type="email" value={form.seller_email} onChange={e => set('seller_email', e.target.value)} placeholder="your@email.com" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>University</label>
              <input value={form.university} onChange={e => set('university', e.target.value)} placeholder="e.g. Comenius University" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Leaving date</label>
              <input type="date" value={form.leaving_date} onChange={e => set('leaving_date', e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Pickup location */}
          <div>
            <label style={labelStyle}>Pickup address (optional)</label>
            <input
              value={form.pickup_address}
              onChange={e => set('pickup_address', e.target.value)}
              placeholder="e.g. Ružinov, Bratislava"
              style={inputStyle}
            />
          </div>

          {/* Photo upload */}
          <div>
            <label style={labelStyle}>Photo</label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{ border: '1.5px dashed #e0e0e0', borderRadius: 8, padding: '20px', textAlign: 'center', cursor: 'pointer', background: imagePreview ? 'none' : '#fafafa', transition: 'border-color .22s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <>
                  <p style={{ fontSize: 28, margin: '0 0 8px' }}>📷</p>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>Click to upload a photo</p>
                  <p style={{ fontSize: 12, color: '#a0a0a0', margin: 0 }}>JPG, PNG or WEBP · max 5MB</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            </div>
            {imagePreview && (
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }} style={{ marginTop: 8, fontSize: 12, color: '#a0a0a0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Remove photo
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            style={{ width: '100%', padding: '14px 28px', background: '#0a0a0a', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '.04em', border: '2px solid #0a0a0a', borderRadius: 6, cursor: (submitting || uploading) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: (submitting || uploading) ? .7 : 1, transition: 'all .22s' }}
          >
            {uploading ? 'Uploading photo...' : submitting ? 'Publishing...' : 'Publish listing'}
          </button>
        </form>
      </div>
    </div>
  )
}
