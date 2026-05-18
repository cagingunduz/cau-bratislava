'use client'
import { useEffect, useRef, useState } from 'react'
import type { Listing } from '@/types'
import { useMediaQuery } from '@/lib/useMediaQuery'

interface Props {
  listings: Listing[]
  onClose: () => void
  onContact: (l: Listing) => void
}

// Bratislava centre
const DEFAULT_LAT = 48.1486
const DEFAULT_LNG = 17.1077

export default function MapModal({ listings, onClose, onContact }: Props) {
  const mapRef   = useRef<HTMLDivElement>(null)
  const mapInst  = useRef<unknown>(null)
  const [selected, setSelected] = useState<Listing | null>(null)
  const isMobile = useMediaQuery('(max-width: 640px)')

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return

    // Leaflet must be loaded client-side only
    import('leaflet').then(L => {
      if (!mapRef.current || mapInst.current) return

      // Fix default icon URLs broken by bundlers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!).setView([DEFAULT_LAT, DEFAULT_LNG], 12)
      mapInst.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      const withCoords = listings.filter(l => l.pickup_lat && l.pickup_lng)
      withCoords.forEach(listing => {
        const marker = L.marker([listing.pickup_lat!, listing.pickup_lng!]).addTo(map)
        marker.bindPopup(`
          <div style="font-family:sans-serif;min-width:180px">
            <p style="font-weight:700;margin:0 0 4px;font-size:14px">${listing.title}</p>
            <p style="color:#707070;margin:0 0 8px;font-size:12px">€${listing.price} · ${listing.seller_name}</p>
            ${listing.pickup_address ? `<p style="color:#a0a0a0;margin:0 0 8px;font-size:11px">📍 ${listing.pickup_address}</p>` : ''}
          </div>
        `, { maxWidth: 240 })
        marker.on('click', () => setSelected(listing))
      })
    })

    return () => {
      if (mapInst.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInst.current as any).remove()
        mapInst.current = null
      }
    }
  }, [listings])

  const withCoords = listings.filter(l => l.pickup_lat && l.pickup_lng)

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 500, display: 'flex', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'center', padding: isMobile ? 10 : 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 900, height: isMobile ? 'calc(100vh - 20px)' : '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: isMobile ? '14px 16px' : '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Map view</h3>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#a0a0a0' }}>
              {withCoords.length} of {listings.length} listings have a pickup location
            </p>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', background: '#f0f0f0', border: 'none', cursor: 'pointer', fontSize: 14, color: '#707070' }}>✕</button>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

          {/* Selected listing card */}
          {selected && (
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: '#fff', borderRadius: 10, padding: isMobile ? 12 : '14px 18px', boxShadow: '0 4px 24px rgba(0,0,0,.15)', display: 'flex', alignItems: isMobile ? 'stretch' : 'center', gap: 12, zIndex: 1000, flexDirection: isMobile ? 'column' : 'row' }}>
              {selected.image_url && (
                <img src={selected.image_url} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 14 }}>{selected.title}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#a0a0a0' }}>€{selected.price} · {selected.seller_name} {selected.seller_country}</p>
                {selected.pickup_address && <p style={{ margin: '2px 0 0', fontSize: 11, color: '#a0a0a0' }}>📍 {selected.pickup_address}</p>}
              </div>
              <button
                onClick={() => { onContact(selected); onClose() }}
                style={{ flexShrink: 0, padding: '8px 16px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', width: isMobile ? '100%' : 'auto' }}
              >Contact</button>
              <button onClick={() => setSelected(null)} style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: '#f0f0f0', border: 'none', cursor: 'pointer', fontSize: 12 }}>✕</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
