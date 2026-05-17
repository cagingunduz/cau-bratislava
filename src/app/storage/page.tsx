'use client'
import { useState } from 'react'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

type Step = 'form' | 'confirmed'

const WAREHOUSES = ['Petržalka', 'Ružinov', 'Staré Mesto']

export default function StoragePage() {
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState<FormState>({
    items: '',
    dropoff: '',
    pickup: '',
    warehouse: WAREHOUSES[0],
    name: '',
    email: '',
  })
  const [bookingNum] = useState(() => `2026-${Math.floor(100 + Math.random() * 900)}`)

  function set(k: FormKey) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #e0e0e0', borderRadius: 8,
    fontSize: 14, fontFamily: 'inherit', outline: 'none',
    background: '#fff', boxSizing: 'border-box',
  }

  const days = form.dropoff && form.pickup
    ? Math.round((new Date(form.pickup).getTime() - new Date(form.dropoff).getTime()) / 86400000)
    : null
  const price = days ? Math.max(0, Math.round(days * 0.52)) : null

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'inherit' }}>
      <SiteHeader />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 28px 80px' }}>
        <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a0a0a0' }}>Going home?</p>
        <h1 style={{ margin: '0 0 8px', fontFamily: "'Lora',Georgia,serif", fontStyle: 'italic', fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 400 }}>
          Your storage booking
        </h1>
        <p style={{ margin: '0 0 40px', fontSize: 14, color: '#707070' }}>Going home for summer? We keep your stuff safe.</p>

        {step === 'form' ? (
          <BookingForm
            form={form} set={set} days={days} price={price}
            inputStyle={inputStyle} warehouses={WAREHOUSES}
            onSubmit={() => setStep('confirmed')}
          />
        ) : (
          <BookingConfirmed
            form={form} bookingNum={bookingNum} days={days!} price={price!}
            onNew={() => setStep('form')}
          />
        )}
      </div>

      <Footer />
    </div>
  )
}

type FormKey = 'name' | 'email' | 'items' | 'dropoff' | 'pickup' | 'warehouse'
type FormState = Record<FormKey, string>

function BookingForm({ form, set, days, price, inputStyle, warehouses, onSubmit }: {
  form: FormState
  set: (k: FormKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  days: number | null
  price: number | null
  inputStyle: React.CSSProperties
  warehouses: string[]
  onSubmit: () => void
}) {
  function handle(e: React.FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handle} style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>Your name</label>
          <input required style={inputStyle} placeholder="Alex Müller" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input required type="email" style={inputStyle} placeholder="alex@uni.de" value={form.email} onChange={set('email')} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle}>Drop-off date</label>
            <input required type="date" style={inputStyle} value={form.dropoff} onChange={set('dropoff')} />
          </div>
          <div>
            <label style={labelStyle}>Pick-up date</label>
            <input required type="date" style={inputStyle} value={form.pickup} onChange={set('pickup')} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>What are you storing?</label>
          <input required style={inputStyle} placeholder="e.g. 2 boxes + 1 bike" value={form.items} onChange={set('items')} />
        </div>
        <div>
          <label style={labelStyle}>Preferred warehouse</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.warehouse} onChange={set('warehouse')}>
            {warehouses.map(w => <option key={w}>{w}</option>)}
          </select>
        </div>
        <button type="submit" style={{ padding: '14px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Confirm booking →
        </button>
      </div>

      {/* Price card */}
      <div style={{ background: '#0a0a0a', color: '#fff', borderRadius: 12, padding: '28px 24px', position: 'sticky', top: 80 }}>
        <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>Total</p>
        <p style={{ margin: '0 0 4px', fontSize: 48, fontWeight: 800, lineHeight: 1 }}>
          {price != null ? `€${price}` : '—'}
        </p>
        <p style={{ margin: '0 0 24px', fontSize: 12, color: 'rgba(255,255,255,.5)' }}>
          {days ? `${days} days · all-inclusive` : 'select dates'}
        </p>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['Rate', '~€0.52/day'],
            ['Warehouse', form.warehouse || '—'],
            ['Items', form.items || '—'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'rgba(255,255,255,.5)' }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </form>
  )
}

function BookingConfirmed({ form, bookingNum, days, price, onNew }: {
  form: FormState
  bookingNum: string
  days: number
  price: number
  onNew: () => void
}) {
  const dropDate = new Date(form.dropoff).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const pickDate = new Date(form.pickup).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, alignItems: 'start' }}>
      <div style={{ background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: 14, padding: '32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Booking header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a0a0a0' }}>BOOKING #{bookingNum}</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Summer 2026</p>
          </div>
          <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 100 }}>● Confirmed</span>
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          {[
            { label: 'Drop-off', date: dropDate, active: true },
            { label: 'Stored', date: `${new Date(form.dropoff).toLocaleDateString('en-GB', { month: 'short' })} – ${new Date(form.pickup).toLocaleDateString('en-GB', { month: 'short' })}`, active: false },
            { label: 'Pick-up', date: pickDate, active: false },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.active ? '#0a0a0a' : '#e0e0e0', border: item.active ? '3px solid #0a0a0a' : '2px solid #c0c0c0', flexShrink: 0 }} />
                <p style={{ margin: '6px 0 2px', fontSize: 11, fontWeight: 700, color: '#0a0a0a', textAlign: 'center' }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#888', textAlign: 'center' }}>{item.date}</p>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: '#e0e0e0', margin: '0 0 20px' }} />}
            </div>
          ))}
        </div>

        {/* Details */}
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['Items', form.items],
            ['Warehouse', form.warehouse],
            ['Duration', `${days} days`],
            ['Contact', form.email],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#888' }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        <button style={{ padding: '12px', background: '#f0f0f0', color: '#0a0a0a', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Track my stuff →
        </button>
      </div>

      {/* Price card */}
      <div style={{ background: '#0a0a0a', color: '#fff', borderRadius: 12, padding: '28px 24px' }}>
        <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>Total</p>
        <p style={{ margin: '0 0 4px', fontSize: 48, fontWeight: 800, lineHeight: 1 }}>€{price}</p>
        <p style={{ margin: '0 0 24px', fontSize: 12, color: 'rgba(255,255,255,.5)' }}>paid · all-inclusive</p>
        <button onClick={onNew} style={{ width: '100%', padding: '11px', background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          New booking
        </button>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 6,
  fontSize: 12, fontWeight: 600,
  letterSpacing: '.06em', textTransform: 'uppercase', color: '#888',
}
