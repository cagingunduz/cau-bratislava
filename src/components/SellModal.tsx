'use client'
import { useState } from 'react'

interface Props { onClose: () => void; onSubmit: (data: Record<string, unknown>) => void }

export default function SellModal({ onClose, onSubmit }: Props) {
  const [form, setForm] = useState({
    title:'', description:'', price:'', category:'', condition:'',
    seller_name:'', seller_email:'', seller_country:'', university:'',
    leaving_date:'', image_url:'',
  })
  const [submitting, setSubmitting] = useState(false)

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const isUrgent = !!form.leaving_date && new Date(form.leaving_date) <= new Date(Date.now() + 7 * 86400000)
    await onSubmit({ ...form, price: Number(form.price), is_urgent: isUrgent })
    setSubmitting(false)
  }

  const inputStyle = { padding:'11px 14px', border:'1.5px solid #e0e0e0', borderRadius:6, fontSize:14, color:'#0a0a0a', background:'#fff', outline:'none', width:'100%', fontFamily:'inherit', transition:'border-color .22s' }
  const labelStyle = { fontSize:12, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase' as const, color:'#707070', display:'block', marginBottom:6 }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:'#fff', borderRadius:12, width:'100%', maxWidth:580, maxHeight:'90vh', overflowY:'auto', padding:40, position:'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute', top:20, right:20, width:36, height:36, borderRadius:'50%', background:'#f0f0f0', color:'#707070', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none' }}>✕</button>

        <h2 style={{ fontSize:26, fontWeight:800, marginBottom:4, letterSpacing:'-.02em' }}>List your item</h2>
        <p style={{ fontSize:13, color:'#a0a0a0', marginBottom:28 }}>Free to list · Takes 2 minutes</p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div><label style={labelStyle}>Item title *</label><input required value={form.title} onChange={e => set('title',e.target.value)} placeholder="e.g. IKEA KALLAX shelf" style={inputStyle}/></div>
            <div><label style={labelStyle}>Category *</label>
              <select required value={form.category} onChange={e => set('category',e.target.value)} style={{...inputStyle, appearance:'none'}}>
                <option value="">Select</option>
                {['furniture','kitchen','electronics','bedding','books','clothes','other'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div><label style={labelStyle}>Description *</label><textarea required value={form.description} onChange={e => set('description',e.target.value)} placeholder="Describe condition, brand, dimensions..." rows={3} style={{...inputStyle, resize:'vertical', minHeight:90}}/></div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div><label style={labelStyle}>Price (€) *</label><input required type="number" min="0" value={form.price} onChange={e => set('price',e.target.value)} placeholder="0" style={inputStyle}/></div>
            <div><label style={labelStyle}>Condition *</label>
              <select required value={form.condition} onChange={e => set('condition',e.target.value)} style={{...inputStyle, appearance:'none'}}>
                <option value="">Select</option>
                <option value="like_new">Like new</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div><label style={labelStyle}>Your name *</label><input required value={form.seller_name} onChange={e => set('seller_name',e.target.value)} placeholder="First name" style={inputStyle}/></div>
            <div><label style={labelStyle}>Email *</label><input required type="email" value={form.seller_email} onChange={e => set('seller_email',e.target.value)} placeholder="your@email.com" style={inputStyle}/></div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div><label style={labelStyle}>University</label><input value={form.university} onChange={e => set('university',e.target.value)} placeholder="e.g. Comenius University" style={inputStyle}/></div>
            <div><label style={labelStyle}>Leaving date</label><input type="date" value={form.leaving_date} onChange={e => set('leaving_date',e.target.value)} style={inputStyle}/></div>
          </div>

          <div><label style={labelStyle}>Photo URL (optional)</label><input value={form.image_url} onChange={e => set('image_url',e.target.value)} placeholder="https://..." style={inputStyle}/></div>

          <button type="submit" disabled={submitting} style={{ width:'100%', padding:'14px 28px', background:'#0a0a0a', color:'#fff', fontSize:14, fontWeight:700, letterSpacing:'.04em', border:'2px solid #0a0a0a', borderRadius:6, cursor:submitting?'not-allowed':'pointer', fontFamily:'inherit', opacity:submitting?.7:1, transition:'all .22s' }}>
            {submitting ? 'Publishing...' : 'Publish listing'}
          </button>
        </form>
      </div>
    </div>
  )
}
