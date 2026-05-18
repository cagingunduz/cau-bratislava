'use client'
import { useState } from 'react'
import type { Listing } from '@/types'
import { useMediaQuery } from '@/lib/useMediaQuery'

interface Props { listing: Listing; onClose: () => void; onSubmit: (s:{name:string;email:string;message:string}) => void }

export default function ContactModal({ listing, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const [submitting, setSubmitting] = useState(false)
  const isMobile = useMediaQuery('(max-width: 520px)')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit(form)
    setSubmitting(false)
  }

  const inputStyle = { padding:'11px 14px', border:'1.5px solid #e0e0e0', borderRadius:6, fontSize:14, color:'#0a0a0a', background:'#fff', outline:'none', width:'100%', fontFamily:'inherit' }
  const labelStyle = { fontSize:12, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase' as const, color:'#707070', display:'block', marginBottom:6 }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:isMobile ? 12 : 20 }} onClick={onClose}>
      <div style={{ background:'#fff', borderRadius:12, width:'100%', maxWidth:480, padding:isMobile ? '28px 18px 22px' : 40, position:'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute', top:20, right:20, width:36, height:36, borderRadius:'50%', background:'#f0f0f0', color:'#707070', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none' }}>✕</button>

        <h2 style={{ fontSize:24, fontWeight:800, marginBottom:4, letterSpacing:'-.02em' }}>Contact {listing.seller_name}</h2>
        <p style={{ fontSize:13, color:'#a0a0a0', marginBottom:28 }}>Re: {listing.title}</p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div><label style={labelStyle}>Your name *</label><input required value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="First name" style={inputStyle}/></div>
          <div><label style={labelStyle}>Your email *</label><input required type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="your@email.com" style={inputStyle}/></div>
          <div><label style={labelStyle}>Message *</label>
            <textarea required value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))}
              placeholder="Hi! Is this still available? When can we meet?" rows={4}
              style={{...inputStyle, resize:'vertical', minHeight:100}}/>
          </div>
          <button type="submit" disabled={submitting} style={{ width:'100%', padding:'14px', background:'#0a0a0a', color:'#fff', fontSize:14, fontWeight:700, border:'2px solid #0a0a0a', borderRadius:6, cursor:submitting?'not-allowed':'pointer', fontFamily:'inherit', opacity:submitting?.7:1 }}>
            {submitting ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  )
}
